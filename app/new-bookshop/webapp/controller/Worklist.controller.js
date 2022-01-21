sap.ui.define(
    [
        './BaseController',
        'sap/m/MessageToast',
        'sap/ui/core/ValueState',
        'sap/m/MessageBox',
        'sap/ui/core/Fragment',
        'sap/base/util/merge',
        'sap/ui/model/json/JSONModel',
    ],
    function (
        BaseController,
        MessageToast,
        ValueState,
        MessageBox,
        Fragment,
        fnMerge,
        JSONModel
    ) {
        'use strict';

        return BaseController.extend('ns.newbookshop.controller.Worklist', {
            onInit: function () {
                this.oViewModel = new JSONModel({
                    bHeaderExpandedVisible: true,
                });

                this.setModel(this.oViewModel, 'viewModel');
                this.oViewModel.loadData('http://localhost:3000/categories');
            },

            /**
             * Open a dialog to create a new book
             */
            onOpenDialogCreateBook: function () {
                var oView = this.getView();
                var oODataModel = oView.getModel();
                var oEntryCtx = oODataModel.createEntry('/Books');
                if (!this.pCreateBookDialog) {
                    this.pCreateBookDialog = this.loadFragment({
                        name: 'ns.newbookshop.view.fragments.CreateBook',
                    });
                }
                this.pCreateBookDialog.then(function (oDialog) {
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

            /**
             * Open a dialog to add a new author
             */
            onOpenDialogAddAuthor: function () {
                var oView = this.getView();
                var oODataModel = oView.getModel();
                var oEntryCtx = oODataModel.createEntry('/Authors', {
                    groupId: 'author',
                });
                if (!this.pCreateAuthorDialog) {
                    this.pCreateAuthorDialog = this.loadFragment({
                        name: 'ns.newbookshop.view.fragments.AddAuthor',
                    });
                }
                this.pCreateAuthorDialog.then(function (oDialog) {
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

            /**
             * add a new author
             * @param {Object} oEvent
             */
            onAddNewAuthor: function (oEvent) {
                var oModel = this.getModel();
                var oAuthorDialog = oEvent.getSource().getParent();
                var that = this;
                var aFormControls =
                    oAuthorDialog.getControlsByFieldGroupId('idFormAddAuthor');
                this._validateFields(aFormControls).then(function () {
                    MessageToast.show(
                        that.i18n('ConfirmationAddAuthorSuccess')
                    );
                    oModel.submitChanges({
                        groupId: 'author',
                    });
                    oAuthorDialog.close();
                });
            },

            /**
             *  Is used to create a book
             */
            onCreateBook: function (oEvent) {
                var that = this;
                var oBookDialog = oEvent.getSource().getParent();
                var oODataModel = this.getView().getModel();
                var aFormControls =
                    this.getView().getControlsByFieldGroupId('idFormAddBook');
                this._validateFields(aFormControls).then(function () {
                    MessageToast.show(
                        that.i18n('ConfirmationCreateBookSuccess')
                    );
                    oODataModel.submitChanges();
                    oBookDialog.close();
                });
            },

            onHideFilter: function () {
                this.oViewModel.getProperty('/bHeaderExpandedVisible')
                    ? this.oViewModel.setProperty('/bHeaderExpandedVisible', false)
                    : this.oViewModel.setProperty('/bHeaderExpandedVisible', true);
            },

            /**
             * Go to page Object
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
