sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("ZKAV.HW2_UI5_COURSE.controller.plantODataView", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZKAV.HW2_UI5_COURSE.view.plantODataView
		 */
		onInit: function () {
			//	var router = sap.ui.core.UIComponent.getRouterFor(this);
			//	router.getRoute("oData").attachMatched(this._onRouteMatched, this);
			//	var serviceurl = "https://cors-anywhere.herokuapp.com/http://localhost:3000";
			//	var oModel = new sap.ui.model.odata.v2.ODataModel(serviceurl, true);
			//	sap.ui.getCore().setModel(oModel, "Plants");
			//var that = this;
			var XHR = new XMLHttpRequest();
			

			XHR.open("GET", "http://localhost:3000/plant/?$format=json");
			
			XHR.setRequestHeader("Content-Type", "application/json");
			XHR.send();
			var oModel = new sap.ui.model.json.JSONModel();
			XHR.onreadystatechange = function () {
				if (XHR.readyState == 4 && XHR.status == 200) {
					var data = XHR.response;
					oModel.setData(JSON.parse(data))
					console.log(data);
						//var oJsonModel = new sap.ui.model.json.JSONModel();
				}
			}
			this.getView().setModel(oModel, "plant");
			
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ZKAV.HW2_UI5_COURSE.view.plantODataView
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ZKAV.HW2_UI5_COURSE.view.plantODataView
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ZKAV.HW2_UI5_COURSE.view.plantODataView
		 */
		//	onExit: function() {
		//
		//	}

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