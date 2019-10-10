/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ZKAV/HW2_UI5_COURSE/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});