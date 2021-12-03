sap.ui.define(
    [
        './BaseController',
        'sap/ui/model/json/JSONModel',
        '../model/formatter',
        'sap/m/MessageToast',
    ],
    function (BaseController, JSONModel, formatter, MessageToast) {
        'use strict';

        return BaseController.extend('ns.newbookshop.controller.Object', {
            /**
             * Controller's "init" lifecycle method.
             */
            onInit: function () {
                var oSelectedFields = new JSONModel();
                this.oSelectedFields = oSelectedFields;

                this.getRouter()
                    .getRoute('object')
                    .attachPatternMatched(this._onObjectMatched, this);
            },

            /**
             * enableDeleteButton -
             * @param {Object} oEvent
             */
            enableDeleteButton: function (oEvent) {
                var oGridTable = this.getView().byId('idOrdersGridTable');
                var oDeleteButton = this.getView().byId('idDeleteButton');
                var aRowId = oGridTable.getSelectedIndices();

                if (aRowId.length !== 0) {
                    oDeleteButton.setEnabled(true);
                } else {
                    oDeleteButton.setEnabled(false);
                }

                var oEventParamters = oEvent.getParameters();

                if (oEventParamters.rowContext) {
                    var sPathOrder = oEventParamters.rowContext.sPath;
                    this.oSelectedFields[oEventParamters.rowIndex] = sPathOrder;
                }
            },

            /**
             *
             * @param {Object} oEvent
             */
            onDeleteOrders: function (oEvent) {
                var oGridTable = this.getView().byId('idOrdersGridTable');
                var aRowId = oGridTable.getSelectedIndices();
                var oCtx = oEvent.getSource().getBindingContext();
                var oODataModel = oCtx.getModel();
                var that = this;

                aRowId.forEach((rowId) => {
                    oODataModel.remove(this.oSelectedFields[rowId], {
                        success: function () {
                            MessageToast.show(
                                that
                                    .getView()
                                    .getModel('i18n')
                                    .getResourceBundle()
                                    .getText('ConfimationDeleteOrderOK')
                            );
                        },
                        error: function () {
                            MessageToast.show(
                                that
                                    .getView()
                                    .getModel('i18n')
                                    .getResourceBundle()
                                    .getText('ConfimationDeleteOrderError')
                            );
                        },
                    });
                });
            },

            onOpenDialogCreateOrder: function (oEvent) {
                var oView = this.getView();
                var oODataModel = oView.getModel();
                var sBookId = oView.getBindingContext().getProperty('ID');
                var oEntryCtx = oODataModel.createEntry('/Orders', {
                    properties: { book_ID: sBookId },
                });

                if (!this.oDialog) {
                    this.oDialog = sap.ui.xmlfragment(
                        oView.getId(),
                        'ns.newbookshop.view.fragments.CreateOrder',
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
                debugger;
            },
            onCreateOrder: function (oEvent) {
                var oView = this.getView();
                var oODataModel = oView.getModel();
                var oCtx = this.oDialog.getBindingContext();
                var sValidationErrorsNumber = this.getView()
                    .getModel('message')
                    .getData().length;
                    
                if (sValidationErrorsNumber > 0) {
                    MessageToast.show('Please fill in the required fields ');
                } else {
                    oODataModel.submitChanges();
                    this.oDialog.close();
                }

                debugger;
            },

            /**
             *
             * @param {Object} oEvent
             */
            _onObjectMatched: function (oEvent) {
                var that = this;
                var sObjectId = oEvent.getParameter('arguments').objectId;
                var oODataModel = this.getView().getModel();
                oODataModel.metadataLoaded().then(function () {
                    var sKey = oODataModel.createKey('/Books', {
                        ID: sObjectId,
                    });
                    that.getView().bindObject({
                        path: sKey,
                        parameters: { expand: 'author' },
                    });
                });
            },
        });
    }
);
