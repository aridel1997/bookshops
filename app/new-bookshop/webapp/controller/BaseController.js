sap.ui.define(
    [
        'sap/ui/core/mvc/Controller',
        'sap/ui/core/UIComponent',
        '../model/formatter',
        'sap/ui/core/ValueState',
        'sap/m/MessageBox',
    ],
    function (Controller, UIComponent, formatter, ValueState, MessageBox) {
        'use strict';

        return Controller.extend('ns.newbookshop.controller.BaseController', {
            formatter: formatter,

            /**
             * Convenience method for accessing the router.
             * @public
             * @returns {sap.ui.core.routing.Router} the router for this component
             */
            getRouter: function () {
                return UIComponent.getRouterFor(this);
            },
            /**
             * Specifies the field in which the validation error occurs
             * @param {string} sId - id fields, which has error
             * @param {Object} oControl - control data
             * @param {string} sMessage - error text
             */
            createMessage: function (sId, oControl, sMessage) {
                var oMessageProcessor =
                    new sap.ui.core.message.ControlMessageProcessor();
                var oMessageManager = sap.ui.getCore().getMessageManager();
                var that = this;
                oMessageManager.addMessages(
                    new sap.ui.core.message.Message({
                        message: sMessage,
                        type: sap.ui.core.MessageType.Error,
                        target: `${sId}/value`,
                        processor: oMessageProcessor,
                    })
                );
                oControl.setValueState(ValueState.Error);
            },
            /**
             * Removes errors from the field
             * @param {string} sId
             * @param {Object} oControl
             */
            deleteMessage: function (sId, oControl) {
                var oMessageManager = sap.ui.getCore().getMessageManager();
                var aMessages = oMessageManager.getMessageModel().getData();
                var sMessage = aMessages.filter(function (mItem) {
                    return mItem.target == `${sId}/value`;
                });
                sap.ui.getCore().getMessageManager().removeMessages(sMessage);
                oControl.setValueState(ValueState.None);
            },

            /**
             *
             * @param {Array} - array of controls, which have fieldGroupIds
             * @returns promise with resolve - if validation success or reject - if validation error
             */
            _validateFields: function (aControls) {
                var that = this;
                var bValidationSuccess = true;
                debugger

                aControls.forEach((oControl) => {
                    if (
                        oControl.isA([
                            'sap.ui.comp.smartfield.SmartField',
                            'sap.m.InputBase',
                        ])
                    ) {
                      
                        // if (
                        //     oControl.isA('sap.m.DatePicker')
                        // ) {
                        //     console.log(oControl)
                        //     var sProperty = oControl.getId();
                        //     that.deleteMessage(sProperty, oControl);
                        //     if (!oControl.getDateValue()) {
                        //         bValidationSuccess = false;
                        //         var sMessage = that.i18n(
                        //             'ConfirmationEnterDate'
                        //         );
                        //         that.createMessage(
                        //             sProperty,
                        //             oControl,
                        //             sMessage
                        //         );
                        //     }
                        // } else 
                        if (!this.validateControlValue(oControl)) {
                            bValidationSuccess = false;
                        }
                    }
                });

                return new Promise(function (resolve, reject) {
                    try {
                        if (!bValidationSuccess) {
                            throw new Error(
                                that.i18n('ConfirmationCreateBookError')
                            );
                        } else {
                            resolve();
                        }
                    } catch (error) {
                        MessageBox.show(error.message, {
                            title: that.i18n('ConfirmationTitle'),
                        });
                        reject(error);
                    }
                });
            },

            /**
             *
             * @param {Object} oControl
             * @returns true/false - field validation result
             */
            validateControlValue: function (oControl) {
                var bValidationSuccess = true;
                try {
                    oControl
                        .getBinding('value')
                        ?.getType()
                        ?.validateValue(oControl.getValue());
                    oControl
                        .setValueState(ValueState.Success)
                        .setValueStateText('');
                } catch (error) {
                    bValidationSuccess = false;
                    oControl
                        .setValueState(ValueState.Error)
                        .setValueStateText(error.message);
                }
                return bValidationSuccess;
            },

            /**
             * method for closing the dialog
             * @param {Object} oEvent
             */
            onCloseDialog: function (oEvent) {
                oEvent.getSource().getParent().close();
            },

            /**
             * Convenience method for getting the view model by name.
             * @public
             * @param {string} [sName] the model name
             * @returns {sap.ui.model.Model} the model instance
             */
            getModel: function (sName) {
                return this.getView().getModel(sName);
            },

            /**
             * Convenience method for setting the view model.
             * @public
             * @param {sap.ui.model.Model} oModel the model instance
             * @param {string} sName the model name
             * @returns {sap.ui.mvc.View} the view instance
             */
            setModel: function (oModel, sName) {
                return this.getView().setModel(oModel, sName);
            },

            /**
             * get text from the i18n model
             * @param {String} sI18nKey
             * @returns text
             */
            i18n: function (sI18nKey) {
                return this.getOwnerComponent()
                    .getModel('i18n')
                    .getResourceBundle()
                    .getText(sI18nKey);
            },
        });
    }
);
