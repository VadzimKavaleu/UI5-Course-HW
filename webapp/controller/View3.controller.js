sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/ui/model/json/JSONModel"], function (Controller, MessageToast,
	JSONModel) {
	"use strict";
	return Controller.extend("ZKAV.HW2_UI5_COURSE.controller.View3", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZKAV.HW2_UI5_COURSE.view.View3
		 */

		onClick: function (oEvent) {
			//var item = oEvent.getSource();
			///var content = item.getBindingContext("json");
			//var sPath = content.getPath();
			//var oProductDetailPanel = this.getView().byId("panel1");
			//	oProductDetailPanel.bindElement({
			//	path: sPath,
			//	model: "json"
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oItem = oEvent.getSource();
			var oCtx = oItem.getBindingContext("person");
			oRouter.navTo("plantInfo", {
				plantid: oCtx.getProperty("Num1")
			});

		},
		handleSearch: function (evt) {
			// create model filter
			var filters = [];
			var query = evt.getParameter("query");

			if (query && query.length > 0) {
				var filter = new sap.ui.model.Filter("Description1", sap.ui.model.FilterOperator.Contains, query);
				filters.push(filter);

			}
		

			// update list binding
			var list = this.getView().byId("List");
			var binding = list.getBinding("items");
			binding.filter(filters);
		
			
		},

		onInit: function () {
			var a = new JSONModel();
			a.loadData("model/person.json");
			this.getView().setModel(a, "person");
		sap.ui.getCore().setModel(a, "person");

		},

		/**
		 *@memberOf ZKAV.HW2_UI5_COURSE.controller.View3
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