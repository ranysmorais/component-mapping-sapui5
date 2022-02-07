

sap.ui.define(
	[
		"template-padronizado/src/app/BaseController",
		"sap/m/MessageToast",
		"template-padronizado/model/RestModel",
		"template-padronizado/model/formatter"
	],
	function (BaseController, MessageToast, RestModel, formatter) {
	"use strict";

	return BaseController.extend("template-padronizado.src.app.App", {
		fmt:formatter,
		_toolPage:{},
		onInit : function(){

			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this._toolPage = this.byId("tooApplPage");
			this
            .getRouter()
            .attachRouteMatched(this.onAfterLoginMatch, this);
			this
            .getRouter()
            .getRoute('login')
			.attachPatternMatched(this.beforeLogin, this);
			this.applySelectedTheme();
			this.initPageModels()
		},
		initPageModels(){
			this.setModel(new RestModel({menuVisible: false}), "AppMenu")
		},
		beforeLogin(oEvent){
			this.destroyNavigation();
		},
		onAfterLoginMatch(oEvent){
			let route = oEvent.getParameter("name");
			if(route != "login")
				this.createNavigation();
		},

		onLoginPopOver : function(oEvent){
			if(!this.getUserSession()){
				MessageToast.show(this.getText("Commom.NoLoggedUser"));
				this.getRouter().navTo('login');
			}
			else
				this.loggedPopOver(oEvent);
		},

		onLogOut : function (){
			this.destroyUserSession();
			this.getRouter().navTo("login");
			//location.reload()
		},

		loggedPopOver : function(oEvent){

			if (!this._oPopoverLogged) {
			    this._oPopoverLogged = sap.ui.xmlfragment("template-padronizado.src.pages.security.Logged", this);
			    this.getView().addDependent(this._oPopoverLogged);
			}
			let model = new RestModel();
			model.setData(this.getUserSession())
			this._oPopoverLogged.setModel(model);
			var oButton = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function () {
			    this._oPopoverLogged.openBy(oButton);
			});
		},

		createNavigation(){
			let toogleButton = this.byId("sideNavigationToggleButton");
			if(toogleButton.getVisible()) return;


			const sideMenu = sap.ui.xmlfragment("template-padronizado.src.app.SideMenu", this);
			this.getView().addDependent(sideMenu);

			var model = this.createRestModel("AppModel.json");
			let busy = this.getView()
			model.get({busy})
			.then(
				(data)=>{
						toogleButton.setVisible(true)
						const translateTitle = data => {
							data.title = this.getText(data.title);
						}

						data.navigation.forEach(translateTitle);
						data.fixedNavigation.forEach(translateTitle);
						data.headerItems.forEach(translateTitle);

						model.setData(data);
				}
				).catch(err =>{
					this.showExeption(err)
				})

			sideMenu.setModel(model)
			this._toolPage.setSideContent(sideMenu)
			this.setModel(new RestModel({menuVisible: true}), "AppMenu")
		},

		destroyNavigation(){
			this.byId("sideNavigationToggleButton").setVisible(false);
			this._toolPage.destroySideContent()
			this._toolPage.setModel(new RestModel());
		},

		onSideNavButtonPress : function() {
			var sideExpanded = this._toolPage.getSideExpanded();
			this._toolPage.setSideExpanded(!sideExpanded);
		},
		onNavRoute:function(oEvent){
			var item = oEvent.getParameter('item');
			let key = item.getKey();
			this._toolPage.setSideExpanded(false);
            this.getRouter().navTo(key);
		},
	});
});
