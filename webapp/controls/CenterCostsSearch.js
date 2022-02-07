sap.ui.define([
    "sap/m/SearchField",
    "template-padronizado/model/formatter"
], function (SearchField, formatter) {
	"use strict";
	return SearchField.extend("template-padronizado.controls.CenterCostsSearch", {
		metadata : {
            properties : {
				dimension: 	{type : "int", defaultValue :-1}
			}
        },

		init : function () {

        },
        renderer : {}
	});
});
