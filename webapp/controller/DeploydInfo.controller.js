sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
	"use strict";
	return Controller.extend("ZKAV.HW2_UI5_COURSE.controller.DeploydInfo", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZKAV.HW2_UI5_COURSE.view.DeploydInfo
		 */
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("DeploydInfo").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function (oEvent) {
			var oArgs = oEvent.getParameter("arguments");
			var oModel = new sap.ui.model.json.JSONModel();
			var XHR = new XMLHttpRequest();
			XHR.open("GET", "http://localhost:2403/plant/" + oArgs.deploydid);
			XHR.setRequestHeader("Content-Type", "application/json");
			XHR.send();
			XHR.onreadystatechange = function () {
				if (XHR.readyState == 4 && XHR.status == 200) {
					var data = this.response;
					this.getView().getModel("person").setData(JSON.parse(XHR.response));
				}
			}.bind(this);
			this.getView().setModel(oModel, "person");
		},
		/**
		 *@memberOf ZKAV.HW2_UI5_COURSE.controller.DeploydInfo
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