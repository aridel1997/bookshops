sap.ui.define([] , function () {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit : function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
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

	};

});