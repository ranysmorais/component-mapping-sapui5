sap.ui.define(
	[
	"template-padronizado/src/app/BaseController",		
	"template-padronizado/model/RestModel",
	'sap/ui/model/json/JSONModel',
	], 
	function (BaseController, RestModel) {
		"use strict";

		return BaseController.extend("template-padronizado.src.pages.definicao-de-padroes.Definicao-de-padroes", {
			onInit : function(){
				console.log("controller [Definicao-de-padroes] Iniciado");
			},		

			onAfterRendering :  function(){
				console.log("controller [Definicao-de-padroes] Renderizado");
			},	

			onBeforeRendering :  function(){
				console.log("controller [Definicao-de-padroes] Método chamado antes da Renderização");
			},	

			onExit :  function(){
				console.log("controller [Definicao-de-padroes] Este método é chamado após a destruição do View associada");
			},	

		});
	}
);
