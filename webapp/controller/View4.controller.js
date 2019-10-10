sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/ui/model/json/JSONModel", "sap/ui/core/Fragment"], function (
	Controller, MessageToast,
	JSONModel, Fragment) {
	"use strict";
	return Controller.extend("ZKAV.HW2_UI5_COURSE.controller.View4", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZKAV.HW2_UI5_COURSE.view.View4
		 */
		onInit: function () {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.getRoute("View4").attachMatched(this._onRouteMatched, this);
			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel, "person");

		},
		onClick: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oItem = oEvent.getSource();
			var oCtx = oItem.getBindingContext("person");
			oRouter.navTo("DeploydInfo", {
				deploydid: oCtx.getProperty("id")
			});
		},
		_onRouteMatched: function () {

			var XHR = new XMLHttpRequest();
			XHR.open("GET", "http://localhost:2403/plant");
			XHR.setRequestHeader("Content-Type", "application/json");
			XHR.send();
			XHR.onreadystatechange = function () {
				if (XHR.readyState == 4 && XHR.status == 200) {
					var data = this.response;

					this.getView().getModel("person").setData(JSON.parse(XHR.response));

				}

			}.bind(this);
		},

		onItemPress: function (oEvent) {
			var item = oEvent.getSource();
			var content = item.getBindingContext("person");
			var sPath = content.getPath();
			var oProductDetailPanel = this.getView().byId("panel1");
			oProductDetailPanel.bindElement({
				path: sPath,
				model: "person"
			});

		},
		handleSearch: function (evt) {
			// create model filter
			var filters = [];
			var query = evt.getParameter("query");

			if (query && query.length > 0) {
				var filter = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, query);
				filters.push(filter);

			}

			// update list binding
			var list = this.getView().byId("List");
			var binding = list.getBinding("items");
			binding.filter(filters);

		},

		onDelete: function (oEvent) {

			var oItem = oEvent.getSource();
			var oCtx = oItem.getBindingContext("person");
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4 && xhr.status == 200) {
					console.log("data with id" + oCtx.getProperty("id") + " deleted!");

				}
			}
			xhr.open("DELETE", "http://localhost:2403/plant/" + oCtx.getProperty("id"));
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send();

			this.onReload();
			this._onRouteMatched();
			this.getView().byId("btn0").disabled = true;
			var that = this;
			var oButton = oEvent.getSource();
			oButton.setEnabled(false);
			//that.byId("openDialog").destroy();

			//window.location.reload();
		},

		onReload: function () {
			var that = this;
			var XHR = new XMLHttpRequest();
			XHR.open("GET", "http://localhost:2403/plant");
			XHR.setRequestHeader("Content-Type", "application/json");
			XHR.send();
			XHR.onreadystatechange = function () {
				if (XHR.readyState == 4 && XHR.status == 200) {

					that.getView().getModel("person").setData(JSON.parse(XHR.response));

				}

			};
		},

		onbuttonpress: function (oEvent) {
			var oView = this.getView();
			var path = oEvent.getSource().getBindingContext("person").getPath();
			// create dialog lazily
			if (!this.byId("openDialog")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "ZKAV.HW2_UI5_COURSE.view.inputdialog",
					controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view 
					//of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.bindElement({
						path: path,
						model: "person"
					});
					oDialog.open();
				});

			}

		},

		closeDialog: function () {
			//this.byId("openDialog").destroy();
			this._onRouteMatched();
			this.byId("openDialog").destroy();
		},

		onDeletePress: function (oEvent) {
			var oView = this.getView();
			var path = oEvent.getSource().getBindingContext("person").getPath();
			//create dialog lazily
			if (!this.byId("openDialog")) {
				//	 load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "ZKAV.HW2_UI5_COURSE.view.deletedialog",
					controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view 
					//of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.bindElement({
						path: path,
						model: "person"
					});
					oDialog.open();
				});
			}

		},

		updateDialog: function (oEvent) {
			var person = {
				name: "",
				description: ""
			};
			person.name = this.getView().byId("input0").getValue();
			person.description = this.getView().byId("input1").getValue();
			var oItem = oEvent.getSource();
			var oCtx = oItem.getBindingContext("person");
			var oModel = new JSONModel();
			oModel.setData(person);
			this.getView().setModel(oModel);
			var nModel = this.getView().getModel();

			var XHR = new XMLHttpRequest();
			XHR.addEventListener("readystatechange", function () {
				if (this.readyState === 4) {
					//alert(this.responseText + "updated");

				}
			});

			XHR.open("PUT", "http://localhost:2403/plant/" + oCtx.getProperty("id"));
			XHR.setRequestHeader("Content-Type", "application/json");
			XHR.send(nModel.getJSON());
			//window.location.reload();
			this.onReload();
			this._onRouteMatched();
			var oButton = oEvent.getSource();
			oButton.setEnabled(false);
			//this.byId("openDialog").destroy();

		},

		/**
		 *@memberOf ZKAV.HW2_UI5_COURSE.controller.View4
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