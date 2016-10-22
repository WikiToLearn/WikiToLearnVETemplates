(function () {
    InsertTemplateButton = function InsertTemplateButton( toolGroup, config ) {
        InsertTemplateButton.super.apply(this, arguments);
        this.setDisabled(false);
    };
    OO.inheritClass( InsertTemplateButton, ve.ui.Tool );
    InsertTemplateButton.static.name = 'addTemplate';
    InsertTemplateButton.static.title = "Template Name Here";
    InsertTemplateButton.static.autoAddToGroup = false;
    InsertTemplateButton.static.autoAddToCatchall = false;
    InsertTemplateButton.prototype.onUpdateState = function () {
        InsertTemplateButton.super.prototype.onUpdateState.apply( this, arguments );
    }
    InsertTemplateButton.prototype.onSelect = function () {
        this.insertTemplate(this.name);
    }
    InsertTemplateButton.prototype.insertTemplate = function(templateName){
        var beginTemplate = mw.msg('wtlvet-env-begin') + templateName;
        var endTemplate = mw.msg('wtlvet-env-end') + templateName;

        var selection = this.toolbar.getSurface().getModel().getFragment().collapseToEnd();

        var begin = selection = selection.insertContent(
            [{
                'type': 'mwTransclusion',
                'attributes': {
                    'mw': {
                        parts: [ {
                            template: {
                                target: {
                                    href: wgFormattedNamespaces[10]+ ':'+ beginTemplate,
                                    wt: beginTemplate
                                },
                                params: {}
                            }
                        }]
                    }
                }
            },
            { type: '/mwTransclusion' }]).collapseToEnd();
        var paragraph = selection = selection.insertContent([
            { type: 'paragraph' },
            { type: '/paragraph' }
            ]).collapseToEnd();
        var end = selection = selection.insertContent([{
                'type': 'mwTransclusion',
                'attributes': {
                    'mw': {
                        parts: [ {
                            template: {
                                target: {
                                    href: wgFormattedNamespaces[10]+ ':'+ endTemplate,
                                    wt: endTemplate
                                },
                                params: {}
                            }
                        }]
                    }
                }
            },
            { type: '/mwTransclusion' }]).collapseToEnd();

        //position the cursor inside the paragraph
        var doc = paragraph.getSelection().documentModel;
        var range = paragraph.getSelection().range;
        var range = new ve.Range(range.from, range.from);
        ve.init.target.getSurface().getModel().setSelection(new ve.dm.LinearSelection(doc, range));
    }
    
    var environments = [ 'definition', 'theorem', 'proof', 'example', 'proposition', 'corollary', 'axiom', 'remark', 'lemma', 'exercise'];
    for(i=0;i<environments.length;i++){
        InsertGeneric = function InsertGeneric( toolGroup, config ) {
            InsertGeneric.super.apply(this, arguments);
            this.name = mw.msg('wtlvet-env-name-' + InsertGeneric.static.name);
        };
        OO.inheritClass( InsertGeneric, InsertTemplateButton );
        InsertGeneric.static.name = environments[i];
        InsertGeneric.static.title = mw.msg('wtlvet-ui-option-' + environments[i]);
        ve.ui.toolFactory.register(InsertGeneric);
    }
    

    ve.init.mw.Target.static.toolbarGroups.push({
        type: 'list',
        indicator: 'down',
        icon: 'add',
        title: mw.msg('wtlvet-ui-menu-label'),
        label: mw.msg('wtlvet-ui-menu-label'),
        promote: [ 'definition', 'theorem', 'proof', 'example' ],
        demote: [ 'proposition', 'corollary', 'axiom', 'remark', 'lemma', 'exercise' ],
        include: environments
    });

})();