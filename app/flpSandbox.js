sap.ui.define([
	"sap/base/util/ObjectPath",
	"sap/ushell/services/Container"
], function (ObjectPath) {
	"use strict";

	// define ushell config
	ObjectPath.set(["sap-ushell-config"], {
		defaultRenderer: "fiori2",
		bootstrapPlugins: {
			"RuntimeAuthoringPlugin": {
				component: "sap.ushell.plugins.rta",
				config: {
					validateAppVersion: false
				}
			},
			"PersonalizePlugin": {
				component: "sap.ushell.plugins.rta-personalize",
				config: {
					validateAppVersion: false
				}
			}
		},
		renderers: {
			fiori2: {
				componentData: {
					config: {
						enableSearch: false,
						rootIntent: "Shell-home"
					}
				}
			}
		},
		services: {
			"LaunchPage": {
				"adapter": {
					"config": {
						"groups": [{
							"tiles": [{
								"tileType": "sap.ushell.ui.tile.StaticTile",
								"properties": {
									"title": "Freestyle Bookshop",
									"targetURL": "#Newbookshop-display"
								},
							},{
								"tileType": "sap.ushell.ui.tile.StaticTile",
								"properties": {
									"title": "Bookshop FEv4",
									"targetURL": "#Bookshopfiori-display"
								},
							}, {
								"tileType": "sap.ushell.ui.tile.StaticTile",
								"properties": {
									"title": "Orders",
									"targetURL": "#Orders-display"
								}
							}]
						}]
					}
				}
			},
			"ClientSideTargetResolution": {
				"adapter": {
					"config": {
						"inbounds": {
							"Newbookshop-display": {
								"semanticObject": "Newbookshop",
								"action": "display",
								"description": "Own application",
								"title": "New bookshop",
								"signature": {
<<<<<<< HEAD
									"parameters": {}
=======
									"parameters": {},
>>>>>>> 6246ac50d658228606acf230f8d54e4bc2001d40
								},
								"resolutionResult": {
									"applicationType": "SAPUI5",
									"additionalInformation": "SAPUI5.Component=ns.newbookshop",
									"url": sap.ui.require.toUrl("ns/newbookshop")
								}
							},
							"Bookshopfiori-display": {
								"semanticObject": "Bookshopfiori",
								"action": "display",
								"description": "Own application",
								"title": "Bookshopfiori",
								"signature": {
									"parameters": {}
								},
								"resolutionResult": {
									"applicationType": "SAPUI5",
									"additionalInformation": "SAPUI5.Component=ns.bookstore",
									"url": sap.ui.require.toUrl("ns/bookstore")
								}
							},
							"Orders-display": {
								"semanticObject": "Orders",
								"action": "display",
								"description": "Own application",
								"title": "Orders",
								"signature": {
<<<<<<< HEAD
									"parameters": {}
=======
									"parameters": {},
>>>>>>> 6246ac50d658228606acf230f8d54e4bc2001d40
								},
								"resolutionResult": {
									"applicationType": "SAPUI5",
									"additionalInformation": "SAPUI5.Component=ns.orders",
									"url": sap.ui.require.toUrl("ns/orders")
								}
							}
						}
					}
				}
			},
			NavTargetResolution: {
				config: {
					"enableClientSideTargetResolution": true
				}
			}
		}
	});

	var oFlpSandbox = {
		init: function () {
			/**
			 * Initializes the FLP sandbox
			 * @returns {Promise} a promise that is resolved when the sandbox bootstrap has finished
			 */

			// sandbox is a singleton, so we can start it only once
			if (!this._oBootstrapFinished) {
				this._oBootstrapFinished = sap.ushell.bootstrap("local");
				this._oBootstrapFinished.then(function () {
					sap.ushell.Container.createRenderer().placeAt("content");
				});
			}

			return this._oBootstrapFinished;
		}
	};

	return oFlpSandbox;
});