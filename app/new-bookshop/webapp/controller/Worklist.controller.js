sap.ui.define(
    [
        './BaseController',
        'sap/ui/model/json/JSONModel',
        '../model/formatter',
        'sap/ui/model/Filter',
        'sap/ui/model/FilterOperator',
        'sap/m/MessageToast',
    ],
    function (
        BaseController,
        JSONModel,
        formatter,
        Filter,
        FilterOperator,
        MessageToast
    ) {
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
                var oView = this.getView();
                var oODataModel = oView.getModel();
                var oCtx = this.oDialog.getBindingContext();
                var sPath = oCtx.sPath;
                var fl = 0;

                var k = oCtx.getObject();

                for (var key in k) {
                    if (key !== 'ID' && k[key] === undefined) {
                        fl++;
                    }
                }

                if (fl > 0) {
                    MessageToast.show('Please fill in the required fields ');
                } else {
                    oODataModel.submitChanges();
                    this.oDialog.close();
                }

                var sValidationErrorsNumber = this.getView()
                    .getModel('message')
                    .getData().length;
                console.log(sValidationErrorsNumber);
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
