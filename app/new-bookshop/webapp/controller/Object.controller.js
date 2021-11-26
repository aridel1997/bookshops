sap.ui.define(
    [
        './BaseController',
        'sap/ui/model/json/JSONModel',
        'sap/ui/core/routing/History',
        '../model/formatter',
    ],
    function (BaseController, JSONModel, History, formatter) {
        'use strict';

        return BaseController.extend('ns.newbookshop.controller.Object', {
            onInit: function () {
                var oViewModel = new JSONModel({
                    busy: true,
                    delay: 0,
                });

                this.getRouter()
                    .getRoute('object')
                    .attachPatternMatched(this._onObjectMatched, this);
                this.setModel(oViewModel, 'objectView');
            },

            _onObjectMatched: function (oEvent) {
                var that = this;
                const sObjectId = oEvent.getParameter('arguments').objectId;
                var oODataModel = this.getView().getModel();
                oODataModel.metadataLoaded().then(function () {
                    var sKey = oODataModel.createKey('/Books', {
                        ID: sObjectId,
                    });
                    that.getView().bindObject({
                        path: sKey,
                    });
                });
            },

            statusIndicatorColor: function (stock) {
                var oIndicatorColor;
                if (stock >= 10) {
                    oIndicatorColor = 'Success';
                } else if (stock < 10 && stock > 0) {
                    oIndicatorColor = 'Warning';
                } else {
                    oIndicatorColor = 'Error';
                }
                return oIndicatorColor;
            },

            /**
             * Binds the view to the object path.
             * @function
             * @param {string} sObjectPath path to the object to be bound
             * @private
             */
            _bindView: function (sObjectPath) {
                const oViewModel = this.getModel('objectView');
                this.getView().bindElement({
                    path: sObjectPath,
                    parameters: { expand: 'author' },
                    events: {
                        //change: this._onBindingChange.bind(this),
                        dataRequested: function () {
                            oViewModel.setProperty('/busy', true);
                        },
                        dataReceived: function () {
                            oViewModel.setProperty('/busy', false);
                        },
                    },
                });
            },
        });
    }
);
