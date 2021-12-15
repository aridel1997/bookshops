sap.ui.define(
    [
        './BaseController',
        'sap/ui/model/json/JSONModel',
        'sap/m/MessageToast',
        'sap/m/MessageBox',
    ],
    function (BaseController, JSONModel, MessageToast, MessageBox) {
        'use strict';

        return BaseController.extend('ns.newbookshop.controller.Object', {
            /**
             * Controller's "init" lifecycle method.
             */
            onInit: function () {
                this.oViewModel = new JSONModel({
                    selectedItems: [],
                    bObjectBookEditable: false,
                });
                this.setModel(this.oViewModel, 'viewModel');

                this.getRouter()
                    .getRoute('object')
                    .attachPatternMatched(this._onObjectMatched, this);
            },
            onHideLongText: function (oEvent) {
                console.log('Have a nice day');
            },

            /**
             * onRowSelectionChange -
             * @param {Object} oEvent
             */
            onRowSelectionChange: function (oEvent) {
                var oGridTable = this.getView().byId('idOrdersGridTable');
                var aSelectedRowIdx = oGridTable.getSelectedIndices();

                this.oViewModel.setProperty(
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
                        this.i18n('ConfirmationDeleteBookWithOrders')
                    );
                } else {
                    MessageBox.confirm(
                        `${this.i18n('ConfirmationDeleteBook')} ${sTitle}?`,
                        {
                            title: 'Confirmation',
                            initialFocus: sap.m.MessageBox.Action.CANCEL,
                            onClose: function (sButton) {
                                if (sButton === MessageBox.Action.OK) {
                                    oODataModel.remove(sKey, {
                                        success: function () {
                                            MessageToast.show(
                                                that.i18n(
                                                    'ConfirmationDeleteBookOK'
                                                )
                                            );
                                            that.onNavToWorklist();
                                        },
                                        error: function () {
                                            MessageToast.show(
                                                that.i18n(
                                                    'ConfirmationDeleteBookError'
                                                )
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

                this.oViewModel
                    .getProperty('/selectedItems')
                    .forEach((sRowPath) => {
                        oODataModel.remove(sRowPath, {
                            success: function () {
                                MessageToast.show(
                                    that.i18n('ConfirmationDeleteOrderOK')
                                );
                            },
                            error: function () {
                                MessageToast.show(
                                    that.i18n('ConfirmationDeleteOrderError')
                                );
                            },
                        });
                    });

                oODataModel.attachEventOnce('batchRequestCompleted', () => {
                    MessageToast.show(that.i18n('ConfirmationDeleteOrderOK'));
                });
            },

            onOpenDialogCreateOrder: function () {
                var oView = this.getView();
                var oODataModel = oView.getModel();
                var oEntryCtx = oODataModel.createEntry('/Orders');
                if (!this.pCreateOrderDialog) {
                    this.pCreateOrderDialog = this.loadFragment({
                        name: 'ns.newbookshop.view.fragments.CreateOrder',
                    });
                }
                this.pCreateOrderDialog.then(function (oDialog) {
                    oDialog.setBindingContext(oEntryCtx);
                    var oMessageManager = sap.ui.getCore().getMessageManager();

                    oMessageManager.registerObject(oDialog, true);
                    oView.setModel(
                        oMessageManager.getMessageModel(),
                        'message'
                    );
                    oDialog.open();
                });
            },

            onCreateOrder: function () {
                // idFormAddOrder
                var oView = this.getView();
                var oODataModel = oView.getModel();
                var aFormControls =
                    this.getView().getControlsByFieldGroupId('idFormAddOrder');
                this._validateFields(aFormControls).then(function () {
                    MessageToast.show(
                        that.i18n('ConfirmationCreateBookSuccess')
                    );
                    oODataModel.submitChanges();
                    oBookDialog.close();
                });
            },

            onEditBook: function () {
                this.oViewModel.setProperty('/bObjectBookEditable', true);
            },

            onSaveBook: function (oEvent) {
                var oDataEdit = this.getView().getModel();
                var that = this;
                var oView = this.getView();

                var aFormControls =
                    oView.getControlsByFieldGroupId('idFieldEditBook');
                this._validateFields(aFormControls).then(function () {
                    MessageToast.show(that.i18n('fvfdvg'));
                    oDataEdit.submitChanges();
                    that.oViewModel.setProperty('/bObjectBookEditable', false);
                });
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

            onNavToOrders: function () {
                if (
                    sap.ushell &&
                    sap.ushell.Container &&
                    sap.ushell.Container.getService
                ) {
                    var service = sap.ushell.Container.getService(
                        'CrossApplicationNavigation'
                    );
                    var sHref =
                        service.hrefForExternal({
                            target: {
                                semanticObject: 'Orders',
                                action: 'display',
                            },
                        }) || '';
                    service.toExternal({
                        target: {
                            shelHash: sHref,
                        },
                    });
                } else {
                    console.log('xertebe');
                }
                //                     sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then( function (oService) {
                // console.log("xertebe");
                //                                     var sHref = oService.hrefForExternal({
                //                                         target : {
                //                                             semanticObject : "Orders",
                //                                             action : "display" },

                //                                     }) || "";
                //                                oService.toExternal(sHref);

                //                                  });
            },

            onNavToWorklist: function () {
                this.getOwnerComponent().getRouter().navTo('worklist');
            },
        });
    }
);
