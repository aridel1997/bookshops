sap.ui.define(['./BaseController'], function (BaseController) {
    'use strict';

    return BaseController.extend('ns.newbookshop.controller.App', {
        /**
         * Controller's "init" lifecycle method.
         */
        onInit: function () {
            this.getView().addStyleClass(
                this.getOwnerComponent().getContentDensityClass()
            );
        },
    });
});
