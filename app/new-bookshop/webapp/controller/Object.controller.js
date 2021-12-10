sap.ui.define(
    [
        './BaseController',
        'sap/ui/model/json/JSONModel',
        '../model/formatter',
        'sap/m/MessageToast',
        'sap/m/MessageBox',
    ],
    function (BaseController, JSONModel, formatter, MessageToast, MessageBox) {
        'use strict';

        return BaseController.extend('ns.newbookshop.controller.Object', {
            /**
             * Controller's "init" lifecycle method.
             */
            onInit: function () {
                this.oSelectedFields = new JSONModel({
                    selectedItems: [],
                });
                this.setModel(this.oSelectedFields, 'viewModel');

                this.getRouter()
                    .getRoute('object')
                    .attachPatternMatched(this._onObjectMatched, this);
            },
            onHideLongText: function (oEvent) {
                debugger;
            },

            /**
             * onRowSelectionChange -
             * @param {Object} oEvent
             */
            onRowSelectionChange: function (oEvent) {
                var oGridTable = this.getView().byId('idOrdersGridTable');
                var aSelectedRowIdx = oGridTable.getSelectedIndices();

                this.oSelectedFields.setProperty(
                    '/selectedItems',
                    aSelectedRowIdx
                        .map(oGridTable.getContextByIndex.bind(oGridTable))
                        .map((oContext) => oContext.getPath())
                );
            },

            onDeleteBook: function (oEvent) {
                var oView = this.getView();
                var sTitle = oView.getBindingContext().getProperty('title');
                var oCtx = oEvent.getSource().getBindingContext();
                var oODataModel = oCtx.getModel();
                var sKey = oODataModel.createKey('/Books', oCtx.getObject());
                var that = this;
                var nOrders = oView
                    .byId('idOrdersGridTable')
                    .getBinding()
                    .getContexts().length;

                if (nOrders > 0) {
                    MessageToast.show(
                        this.getI18n("ConfirmationDeleteBookWithOrders")
                    );
                } else {
                    MessageBox.confirm(
                       
                        `${this.getI18n("ConfirmationDeleteBook")} ${sTitle}?`,
                        {
                            title: 'Confirmation',
                            initialFocus: sap.m.MessageBox.Action.CANCEL,
                            onClose: function (sButton) {
                                if (sButton === MessageBox.Action.OK) {
                                    oODataModel.remove(sKey, {
                                        success: function () {
                                            MessageToast.show(
                                                that.getI18n("ConfirmationDeleteBookOK")
                                            );
                                            that.onNavToWorklist();
                                        },
                                        error: function () {
                                            MessageToast.show(
                                                that.getI18n("ConfirmationDeleteBookError")
                                            );
                                        },
                                    });
                                }
                            },
                        }
                    );
                }
            },

            /**
             *
             * @param {Object} oEvent
             */
            onDeleteOrders: function (oEvent) {
                var oCtx = oEvent.getSource().getBindingContext();
                var oODataModel = oCtx.getModel();
                var that = this;

                this.oSelectedFields
                    .getProperty('/selectedItems')
                    .forEach((sRowPath) => {
                        oODataModel.remove(sRowPath, {
                            success: function () {
                                MessageToast.show(
                                    that.getI18n("ConfirmationDeleteOrderOK")
                                );
                            },
                            error: function () {
                                MessageToast.show(
                                    that.getI18n("ConfirmationDeleteOrderError")
                                );
                            },
                        });
                    });

                oODataModel.attachEventOnce('batchRequestCompleted', () => {
                    MessageToast.show(
                        that.getI18n("ConfirmationDeleteOrderOK")
                    );
                });
            },

            onOpenDialogCreateOrder: function () {
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
            },
            onCreateOrder: function () {
                var oView = this.getView();
                var oODataModel = oView.getModel();
                var oCtx = this.oDialog.getBindingContext();
                var sValidationErrorsNumber = this.getView()
                    .getModel('message')
                    .getData().length;

                if (sValidationErrorsNumber > 0) {
                    MessageToast.show('Please fill in the required fields');
                } else {
                    oODataModel.submitChanges();
                    this.oDialog.close();
                }
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

            onNavToWorklist: function () {
                this.getOwnerComponent().getRouter().navTo('worklist');
            },
        });
    }
);
