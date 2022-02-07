jQuery.sap.require("sap.ui.model.json.JSONModel");

sap.ui.model.json.JSONModel.extend(
	"template-padronizado.model.RestModel",
  {
		constructor : function(oData) {
			sap.ui.model.ClientModel.apply(this, arguments);
			this._headers = this.getHeahers()
			this._request = this.getRequest();

			if(oData && typeof oData === 'object') this.setData(oData)

		},

		getRequest(){
			const request =	{
				method : "GET",
				mode : "cors",
				headers : this._headers
			}
			return request;
		},

		getHeahers(){
			const headers = new Headers();
			headers.append("Accept-Language", "pt-BR")
			headers.append("Content-Language", "pt-BR")
			return headers;
		},

		addHeader(name, value){
			this._headers.append(name, value);
		},

		_headers : {},
		_request : {},
		_url : null,
		_busy : null,
		fillData : false,

		setUrl(url){
			this._url = url;
		},

		removeCredentials() {
			delete this._request.credentials;
		},
		includeCredentials() {
			this._request.credentials = "include";
		},

		request(url) {

			const finaly = function () {
				if (this._busy && this._busy.setBusy) this._busy.setBusy(false);
			};
			const that = this;
			let promisseResolution = (resolve, reject) =>
			{
				fetch(url, this._request)
				.then((response) => {
					if(!response.ok){
						reject(response);
						return;
					}

					if(that.fillData){
						response.json().then(dataJSON =>{
							that.setData(dataJSON);
							resolve(dataJSON);
						});
						that.fillData = false;
					}else{
						resolve(response);
					}

				})
				.catch(err =>{
					that.response = response;
					err.json().then(jsonError =>{
						reject(jsonError);
					})
				})
				.finally(finaly.apply(this));
			}

			return new Promise(promisseResolution);

		},

		setBusy(control){
			this._busy = control;
			this._busy.setBusy(true);
			return this;
		},

		get(path){
			this.valid()
			this._request.method = "GET";
			let uri = this.getFullUrl(path)
			this.fillData = true;
			return this.request(uri);
		},

		getFullUrl(path){
			if(!path) return this._url;
			if(typeof path !== 'string' && typeof path !== 'number' ) return this._url;

			return this._url + `/${path}`;
		},

		put(path){
			this.valid()

			this._request.method = "PUT";
			this._request.body = JSON.stringify(this.getData());
			let uri = this.getFullUrl(path)
			return this.request(uri);
		},
		patch(path){
			this.valid()

			this._request.method = "PATCH";
			this._request.body = JSON.stringify(this.getData());
			let uri = this.getFullUrl(path)
			return this.request(uri);
		},
		post(path){
			this.valid()

			this._request.method = "POST";
			this._request.body = JSON.stringify(this.getData());
			let uri = this.getFullUrl(path)
			return this.request(uri);
		},

		delete(path){
			this.valid()
			this._request.method = "DELETE";
			this._request.body = JSON.stringify(this.getData());
			let uri = this.getFullUrl(path)
			return this.request(uri);
		},

		valid(){
			if(!this._url) {
				console.log("A URL não foi informada no RestModel");
			}
		}
	});

