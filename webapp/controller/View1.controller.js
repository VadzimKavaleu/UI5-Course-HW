sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
	"use strict";
	return Controller.extend("ZKAV.HW2_UI5_COURSE.controller.View1", {
		onSend: function () {

			var person = {
				name: "",
				description: ""
			};

			person.name = this.getView().byId("input0").getValue();
			person.description = this.getView().byId("input1").getValue();

			//console.log(JSON.stringify(person));

			var dataModel = new JSONModel();
			dataModel.setData(person);
			this.getView().setModel(dataModel);
			var oModel = this.getView().getModel();
			sendFormData(oModel);

		},

		onInit: function () {

		},
		/**
		 *@memberOf ZKAV.HW2_UI5_COURSE.controller.View1
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

	function sendFormData(oModel) {

		MessageToast.show(oModel.getJSON());

		var XHR = new XMLHttpRequest();

		// Define what happens on successful data submission

		XHR.addEventListener('load', function (event) {

			MessageToast.show('Yeah! Data sent and response loaded.');

		});

		// Define what happens in case of error

		XHR.addEventListener('error', function (event) {

			MessageToast.show('Oops! Something went wrong.');

		});

		// Set up our request

		XHR.open('POST', "http://localhost:2403/plant");

		XHR.setRequestHeader('Content-Type', 'application/json');

		XHR.send(oModel.getJSON());

	}
});