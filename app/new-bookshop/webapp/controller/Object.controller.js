sap.ui.define(
    [
        './BaseController',
        'sap/ui/model/json/JSONModel',
        'sap/ui/core/routing/History',
        '../model/formatter',
        'sap/ui/table/Table',
    ],
    function (BaseController, JSONModel, History, formatter, Table) {
        'use strict';

        return BaseController.extend('ns.newbookshop.controller.Object', {
            /**
             *
             */
            onInit: function () {
                var oEnabled = new JSONModel({
                    enabled: false,
                });
                this.setModel(oEnabled, 'objectEnabled');

                this.getRouter()
                    .getRoute('object')
                    .attachPatternMatched(this._onObjectMatched, this);
            },

            /**
             *
             * @param {*} oEvent
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
            },

            onDeleteOrders: function (oEvent) {},
            /**
             *
             * @param {*} oEvent
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
