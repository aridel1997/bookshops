sap.ui.define(
    ['sap/ui/core/XMLComposite', 'sap/ui/model/json/JSONModel'],
    function (XMLComposite, JSONModel) {
        var HideLongTextControl = XMLComposite.extend(
            'ns.newbookshop.control.HideLongTextControl',
            {
                bIsExpanded: true,
                metadata: {
                    properties: {
                        text: 'string',
                    },
                    events: {
                        hideLongText: {},
                    },
                },
                handleHelp: function (k) {
                    this.fireHideLongText();
                    var oTextControl = this.byId('idText');
                    var oLinkControl = this.byId('idLink');
                    if (this.bIsExpanded) {
                        oTextControl.setMaxLines(2);
                        oLinkControl.setText('more');
                        this.bIsExpanded = false;
                    } else {
                        oTextControl.setMaxLines(null);
                        oLinkControl.setText('less');
                        this.bIsExpanded = true;
                    }
                },
                myFormatter: function (sText) {
                    if (sText) {
                        return sText.length > 50 ? true : false;
                    }
                },
            }
        );
        return HideLongTextControl;
    },
    true
);
