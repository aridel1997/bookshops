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
                console.log(oView.getModel("device"))
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

            onCreateBook: function () {
                var oView = this.getView();
                var oODataModel = oView.getModel();
                var oCtx = this.oDialog.getBindingContext();
                var flag = null;
                var sPath = oCtx.sPath; 

                // oODataModel.setProperty(`${sPath}/IsActiveEntity`, true);
            

                // var aInputsValue = [
                //     oView.byId("idTitle-SF").getValue(),
                //     oView.byId("idAuthor-SF").getValue(),
                //     oView.byId("idDescription-SF").getValue(),
                //     oView.byId("idPicture-SF").getValue(),
                //     oView.byId("idGenre-SF").getValue(),
                //     oView.byId("idStock-SF").getValue(),
                //     oView.byId("idPrice-SF").getValue(),
                //     oView.byId("idRating-SF").getValue(),
                //     oView.byId("idCurrency-SF").getValue()
                // ];

           
                    oODataModel.submitChanges();
                    this.oDialog.close();

            },

            onBooksTableItemSelect: function (oEvent) {
             console.log(oEvent.getSource().getBindingContext());
            }
            
        });
    }
);
