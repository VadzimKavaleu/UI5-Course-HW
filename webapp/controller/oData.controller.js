sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";
	return Controller.extend("ZKAV.HW2_UI5_COURSE.controller.oData", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZKAV.HW2_UI5_COURSE.view.oData
		 */
		onInit: function () {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.getRoute("oData").attachMatched(this._onRouteMatched, this);
			var serviceurl = "https://cors-anywhere.herokuapp.com/https://services.odata.org/V2/OData/OData.svc";
			var oModel = new sap.ui.model.odata.v2.ODataModel(serviceurl, true);
			sap.ui.getCore().setModel(oModel, "Products");
		},
		_onRouteMatched: function () {
			var that = this;
			var ooModel = sap.ui.getCore().getModel("Products");
			ooModel.read("/Products", {
				method: "GET",
				success: function (data) {
					var oProducts = data.results;
					var oJsonModel = new sap.ui.model.json.JSONModel(oProducts);
					var oTable = that.byId("List");
					oTable.setModel(oJsonModel, "Products");
					console.log(data.results);
				},
				error: function () {}
			});
		},
		onClick: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oItem = oEvent.getSource();
			var oCtx = oItem.getBindingContext("Products");
			oRouter.navTo("oDataInfo", {
				oDataid: oCtx.getProperty("ID")
			});
		},
		/**
		 *@memberOf ZKAV.HW2_UI5_COURSE.controller.oData
		 */
		action: function (oEvent) {
			var that = this;
			var actionParameters = JSON.parse(oEvent.getSource().data("wiring").replace(/'/g, "\""));
			var eventType = oEvent.getId();
			var aTargets = actionParameters[eventType].targets || [];
			aTargets.forEach(function (oTarget) {
				var oControl = that.byId(oTarget.id);
				if (oControl) {
					var oParams = {};
					for (var prop in oTarget.parameters) {
						oParams[prop] = oEvent.getParameter(oTarget.parameters[prop]);
					}
					oControl[oTarget.action](oParams);
				}
			});
			var oNavigation = actionParameters[eventType].navigation;
			if (oNavigation) {
				var oParams = {};
				(oNavigation.keys || []).forEach(function (prop) {
					oParams[prop.name] = encodeURIComponent(JSON.stringify({
						value: oEvent.getSource().getBindingContext(oNavigation.model).getProperty(prop.name),
						type: prop.type
					}));
				});
				if (Object.getOwnPropertyNames(oParams).length !== 0) {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName, oParams);
				} else {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName);
				}
			}
		}
	});
});