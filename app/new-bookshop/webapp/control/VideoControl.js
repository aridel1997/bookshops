sap.ui.define(
    ['sap/ui/core/Control', 'sap/m/TextArea', 'sap/m/Label', 'sap/m/Button'],
    function (Control, TextArea, Label, Button) {
        'use strict';
        return Control.extend('ns.newbookshop.control.VideoControl', {
            metadata: {
                properties: {
                    url: {
                        type: 'string',
                        defaultValue:
                            'https://www.youtube.com/embed/qBqVqm_DGU4',
                    },
                },
                aggregations: {
                    _textArea: {
                        type: 'sap.m.TextArea',
                        multiple: false,
                        visibility: 'hidden',
                    },
                    _label: {
                        type: 'sap.m.Label',
                        multiple: false,
                        visibility: 'hidden',
                    },
                    _button: {
                        type: 'sap.m.Button',
                        multiple: false,
                        visibility: 'hidden',
                    },
                },
                events: {
                    press: {
                        parameters: {
                            value: { type: 'int' },
                        },
                    },
                },
            },
            init: function () {
                this.setAggregation(
                    '_textArea',
                    new TextArea({
                        value: this.getUrl(),

                        // iconSize: "2rem",
                        // visualMode: "Half",
                        // liveChange: this._onRate.bind(this)
                    })
                );
                this.setAggregation(
                    '_label',
                    new Label({
                        text: 'Video',
                    }).addStyleClass('sapUiSmallMargin')
                );

                this.setAggregation(
                    '_button',
                    new Button({
                        text: 'Show video',
                        press: this._onSubmit.bind(this),
                    }).addStyleClass('sapUiTinyMarginTopBottom')
                );
            },

            setValue: function (fValue) {
                this.setProperty('value', fValue, true);
                this.getAggregation('_textArea').setValue(fValue);
            },

            // _onRate : function (oEvent) {
            // 	var oRessourceBundle = this.getModel("i18n").getResourceBundle();
            // 	var fValue = oEvent.getParameter("value");

            // 	this.setProperty("value", fValue, true);

            // 	this.getAggregation("_label").setText(oRessourceBundle.getText("productRatingLabelIndicator", [fValue, oEvent.getSource().getMaxValue()]));
            // 	this.getAggregation("_label").setDesign("Bold");
            // },

            _onSubmit: function (oEvent) {
                var sUrl = this.getAggregation('_textArea').getValue();
                this.setUrl(sUrl);
                console.log();
            },
            // <iframe width="560" height="315" src="https://www.youtube.com/embed/qBqVqm_DGU4"  frameborder="0"
            // allow="" allowfullscreen></iframe>
            renderer: function (oRm, oControl) {
                oRm.openStart('div', oControl);
				oRm.class('myAppDemoWTProductRating');
				oRm.openEnd();
					oRm.renderControl(oControl.getAggregation('_textArea'));
					oRm.renderControl(oControl.getAggregation('_label'));
					oRm.renderControl(oControl.getAggregation('_button'));
                oRm.close('div');

                oRm.openStart('iframe', "12313");
					oRm.attr('width', 560);
					oRm.attr('height', 315);
					oRm.attr('src', oControl.getUrl());
					oRm.attr('frameborder', 0);
					oRm.attr(
						'allow',
						'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
					);
               		 oRm.attr('allowfullscreen', true);

                oRm.openEnd();

                oRm.close('iframe');
            },
        });
    }
);

{
    /* <iframe width="560" height="315" src="https://www.youtube.com/embed/qBqVqm_DGU4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */
}
