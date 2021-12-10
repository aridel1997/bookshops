sap.ui.define(
    [
        './BaseController',
        'sap/m/MessageToast',
        'sap/ui/core/ValueState',
        'sap/m/MessageBox',
    ],
    function (BaseController, MessageToast, ValueState, MessageBox) {
        'use strict';

        return BaseController.extend('ns.newbookshop.controller.Worklist', {
            /**
             *onOpenDialogCreateBook - opens a dialog to create a new book
             */
            onOpenDialogCreateBook: function () {
                var oView = this.getView();
                var oODataModel = oView.getModel();
                var oEntryCtx = oODataModel.createEntry('/Books');

                if (!this.oDialog) {
                    this.oDialog = sap.ui.xmlfragment(
                        oView.getId(),
                        'ns.newbookshop.view.fragments.CreateBook',
                        this
                    );
                    oView.addDependent(this.oDialog);
                }

                this.oDialog.setBindingContext(oEntryCtx);
                this.oDialog.setModel(oODataModel);

                var oMessageManager = sap.ui.getCore().getMessageManager();

                oMessageManager.registerObject(this.oDialog, true);
                oView.setModel(oMessageManager.getMessageModel(), 'message');
                this.oDialog.open();
            },

            /**
             *  onCreateBook - is used to create a book
             */
            onCreateBook: function () {
                var that = this;
                var oView = this.getView();
                var oODataModel = oView.getModel();
                var aFormControls =
                    this.oDialog.getControlsByFieldGroupId('idFormAddBook');
                this._validateFields(aFormControls).then(function () {
                    MessageToast.show(that.getI18n("ConfirmationCreateBookSuccess"));
                    oODataModel.submitChanges();
                    that.oDialog.close();
                });
            },

            _validateFields: function (aControls) {
                var that = this;

                var bValidationSuccess = true;
                aControls.forEach((oControl) => {
                    if (oControl.isA('sap.ui.comp.smartfield.SmartField')) {
                        if (!this.lala(oControl)) {
                            bValidationSuccess = false;
                        }
                    }
                });
                return new Promise(function (resolve, reject) {
                    try {
                        if (!bValidationSuccess) {
                            throw new Error(that.getI18n("ConfirmationCreateBookError"));
                        } else {
                            resolve();
                        }
                    } catch (error) {
                        MessageBox.show(error.message,{title:that.getI18n("ConfirmationTitle")});
                        reject(error);
                    }
                });
            },

            lala: function (oControl) {
                var bValidationSuccess = true;
                try {
                    oControl
                        .getBinding('value')
                        .getType()
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
             * onNavToObjectPage - go to page Object
             * @param {Object} oEvent
             */
            onNavToObjectPage: function (oEvent) {
                var oCtx = oEvent.getSource().getBindingContext();
                this.getRouter().navTo('object', {
                    objectId: oCtx.getObject('ID'),
                });
            },
        });
    }
);
