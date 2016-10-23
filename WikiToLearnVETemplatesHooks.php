<?php

if (!defined('MEDIAWIKI')) {
    die();
}
class WikiToLearnVETemplatesHooks{

    const MATCH_NO_ERROR = 0;
    const MATCH_ERROR_CLOSED_BUT_OTHER_OPENED = 1;
    const MATCH_ERROR_CLOSED_BUT_NEVER_OPENED = 2;
    const MATCH_ERROR_OPENED_BUT_NEVER_CLOSED = 3;

    public static function checkOpenClose(&$wikiPage, &$user, &$content, &$summary, $isMinor, $isWatch, $section, &$flags, &$status){
        $text = $content->getContentHandler()->serializeContent($content);
        
        $checkResult = self::checkOpenCloseParity($text);
        $error = $checkResult[0];
        if($error != self::MATCH_NO_ERROR){
            $status->setResult(false);
            $errorMessage = "";
            if($error == self::MATCH_ERROR_CLOSED_BUT_OTHER_OPENED){
                $errorMessage = wfMessage("wtlvet-ui-error-closedButOtherOpened", $checkResult[1], $checkResult[2]) ;
            } else if ($error == self::MATCH_ERROR_CLOSED_BUT_NEVER_OPENED) {
                $errorMessage = wfMessage("wtlvet-ui-error-closedButNeverOpened", $checkResult[1]) ;
            } else if ($error == self::MATCH_ERROR_OPENED_BUT_NEVER_CLOSED) {
                $errorMessage = wfMessage("wtlvet-ui-error-openedButNeverClosed", $checkResult[1]) ;
            }
            $errorMessage = $errorMessage . "\n" . wfMessage("wtlvet-ui-error-pleaseCheck");
            $status->fatal($errorMessage);
            return false;
        }

        $newText = self::cleanupEnvTags($text);
        if ( $newText != $text ) {
            $content = $content->getContentHandler()->unserializeContent( $newText );
        }
        return true;
    }

    //checks if every open is matched up by a close
    private static function checkOpenCloseParity($text){
        $envBegin = wfMessage('wtlvet-env-begin');
        $envEnd = wfMessage('wtlvet-env-end');

        preg_match_all('/\{\{(?:(' . $envBegin .'\w+)|(' . $envEnd . '\w+))(?:\|.+)?\}\}/', $text, $matches);
        $tags = $matches[0];
    
        $stack = new SplStack();
        //we are using a simple matching parentheses algorithm with stack
        for ($i = 0; $i < count($tags); $i++) {
            $tag = $tags[$i];

            $tag = str_replace("{{", "", $tag); //remove {{BeginEnvName}}
            $tag = preg_replace('/(\|.+)?\}\}/', "", $tag);
            if(substr($tag, 0, strlen($envBegin)) == $envBegin){ //Begin
                $stack->push($tag);
            } else { //EndSomething
                try{
                    $poppedTag = $stack->pop(); //get latest open tag
                    $poppedTag = str_replace($envBegin, "", $poppedTag); //only get EnvName from BeginEnvName
                    $tag = str_replace($envEnd, "", $tag); //only get EnvName from EndEnvName
                    if($poppedTag != $tag) //hopefully the latest open and current closed are equal
                        return [self::MATCH_ERROR_CLOSED_BUT_OTHER_OPENED, $tag, $poppedTag];

                } catch (RuntimeException $e) { //empty stack, more close than open
                    return [self::MATCH_ERROR_CLOSED_BUT_NEVER_OPENED, $tag];
                }
            }
        }
        if($stack->isEmpty()){
            return [self::MATCH_NO_ERROR];
        } else {
            return [self::MATCH_ERROR_OPENED_BUT_NEVER_CLOSED, $stack->pop()];
        }
    }

    //This will remove newlines added after and before the Begin/End templates by visual editor, which breaks some bits of rendering here and there
    private static function cleanupEnvTags($text){
        $envBegin = wfMessage('wtlvet-env-begin');
        $envEnd = wfMessage('wtlvet-env-end');

        $re = '/\{\{(' . $envBegin. '\w+)(\|.+)?\}\}\n\n+/mi';
        $reEnd = '/\n\n+\{\{(' . $envEnd . '\w+)(\|.+)?\}\}/mi';

        $text = preg_replace($re, '{{$1$2}}' . "\n", $text);
        $text = preg_replace($reEnd, "\n" . '{{$1$2}}', $text);
        
        return $text;
    }
}