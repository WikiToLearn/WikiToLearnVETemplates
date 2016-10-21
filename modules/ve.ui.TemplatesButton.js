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
        beginTemplate = "begin" + templateName;
        endTemplate = "end" + templateName;

        console.log(this.toolbar.getSurface().getModel().getFragment().collapseToEnd().insertContent(
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
            { type: '/mwTransclusion' },
            { type: 'paragraph' },
            { type: '/paragraph' },
            {
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
            { type: '/mwTransclusion' }]));
    }
    

    InsertTheorem = function InsertTheorem( toolGroup, config ) {
        InsertTheorem.super.apply(this, arguments);
        this.name = 'Theorem';
    };
    OO.inheritClass( InsertTheorem, InsertTemplateButton );
    InsertTheorem.static.name = 'Theorem';
    InsertTheorem.static.title = 'Add Theorem';
    ve.ui.toolFactory.register(InsertTheorem);

    InsertExample = function InsertExample( toolGroup, config ) {
        InsertExample.super.apply(this, arguments);
        this.name = 'Example';
    };
    OO.inheritClass( InsertExample, InsertTemplateButton );
    InsertExample.static.name = 'Example';
    InsertExample.static.title = 'Add Example';
    ve.ui.toolFactory.register(InsertExample);

    ve.init.mw.Target.static.toolbarGroups.push({
        type: 'list',
        indicator: 'down',
        icon: 'add',
        title: 'Environment',
        label: 'Environment',
        include: ['Theorem', 'Example']
    });
})();