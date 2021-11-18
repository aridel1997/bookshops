sap.ui.define(
    [
        './BaseController',
        'sap/ui/model/json/JSONModel',
        '../model/formatter',
        'sap/ui/model/Filter',
        'sap/ui/model/FilterOperator',
    ],
    function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
        'use strict';

        return BaseController.extend('ns.newbookshop.controller.Worklist', {
            onInit: function () {

            },

            onOpenDialogCreateBook: function(){
                var oView = this.getView();
                var oODataModel = oView.getModel();
                console.log(oODataModel)
                var oEntryCtx = oODataModel.createEntry("/Books");

                if (!this.oDialog) {
                    this.oDialog = sap.ui.xmlfragment(oView.getId(), "ns.newbookshop.view.fragments.CreateBook", this);
                    oView.addDependent(this.oDialog);
                }

                this.oDialog.setBindingContext(oEntryCtx);
                this.oDialog.setModel(oODataModel);

                var oMessageManager = sap.ui.getCore().getMessageManager();

                oMessageManager.registerObject(this.oDialog, true);
                this.oDialog.open();
            },

            onBooksTableItemSelect: function (oEvent) {
             console.log(oEvent.getSource().getBindingContext());
            },
        });
    }
);
