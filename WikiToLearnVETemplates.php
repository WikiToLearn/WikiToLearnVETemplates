<?php

if (!defined('MEDIAWIKI')) {
    die();
}

if (function_exists('wfLoadExtension')) {
    wfLoadExtension('WikiToLearnVETemplates');
    wfWarn( "Deprecated entry point to WikiToLearnVETemplates. Please use wfLoadExtension('WikiToLearnVETemplates').");
} else {
    die("MediaWiki version 1.25+ is required to use the SpeechToText extension");
}
?>
