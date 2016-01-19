'use strict';


angular.module('services.Place', [
		'constants',
		'services.User',
		'services.WifiDevice'
	])
	.factory('Place', function ($q, $http, SERVER, User, WifiDevice) {
		// Service logic
		// ...
		var _data = {
			places: false
		};

		var _checkOptions = function(options){
			if(!options){
				options = {
					reload: false,
					fakeData: false,
					users: false
				};
			}

			return options;
		};

		var _generatePlaces = function (wifiDevices, users) {

			_data.places = {};

			// pour chaque users, on ajoute le user à la salle ou il se trouve
			angular.forEach(users, function(user){
				if(user.wifi){

					if(wifiDevices[user.wifi.wifiDevice]){

						if(!_data.places){
							_data.places = {};
						}

						if(!_data.places[wifiDevices[user.wifi.wifiDevice].salle]){
							_data.places[wifiDevices[user.wifi.wifiDevice].salle] = {};
						}

						// users
						if(!_data.places[wifiDevices[user.wifi.wifiDevice].salle].users){
							_data.places[wifiDevices[user.wifi.wifiDevice].salle].users = [];
						}

						_data.places[wifiDevices[user.wifi.wifiDevice].salle].users.push(user);

					}
				}
			});

			// pour chaque wifidevice, on ajoute le wifidevice et sn etage à la salle ou il se trouve
			angular.forEach(wifiDevices, function(wifiDevice){

				if(!_data.places[wifiDevice.salle]){
					_data.places[wifiDevice.salle] = {};
				}

				if(!_data.places[wifiDevice.salle].users){
					_data.places[wifiDevice.salle].users = [];
				}
				// etage
				if(!_data.places[wifiDevice.salle].etage){
					_data.places[wifiDevice.salle].etage = wifiDevice.etage;
				}

				// wifidevices
				if(!_data.places[wifiDevice.salle].wifiDevices){
					_data.places[wifiDevice.salle].wifiDevices = [];
				}

				// si l'e wifidevice de l'utilisateur n'est pas enregistré pour la salle du user
				if(_data.places[wifiDevice.salle].wifiDevices.indexOf(wifiDevice) === -1){
					_data.places[wifiDevice.salle].wifiDevices.push(wifiDevice);
				}
			});
		}

		// Public API here
		var Api = {


			/**
             * @name find
			 *
             * @description
             * return all places
             *
			 * @param {object} options - contains two boolean to know wether or not to reload data or use fakeData
			 *
             * @return {object} Promise
             */

			find: function (options) {
				options = _checkOptions(options);

				if(!options.reload && _data.places !== false){ //pas de rechargement

					var deferred = $q.defer();
			        deferred.resolve(_data.places);
					return deferred.promise;

				}else{ // rechargement des données

					var deferred = $q.defer();

					WifiDevice.find().then(function(wifiDevices){

						if(options.users){

							_generatePlaces(wifiDevices, options.users);
							deferred.resolve(_data.places);

						}else{

							User.find(options).then(function(users){

								_generatePlaces(wifiDevices, users);
								deferred.resolve(_data.places);

							});
						}


					});

					return deferred.promise;
				}
			},


			/**
             * @name getUserNumberInFloor
			 *
             * @description
             * return the number of users in a floor
             *
			 * @param {number} floor - can be 0 or 1
			 *
             * @return {object} Promise
             */

			getUserNumberInFloor: function(floor){
				var deferred = $q.defer();
				Api.find().then(function(places){
					var number = 0;
		        	angular.forEach(places, function(place){
		        		if(place.etage === floor){
		        			number += place.users.length;
		        		}
		        	});
		        	deferred.resolve(number);
				});
	            return deferred.promise;
			},


			/**
             * @name get
			 *
             * @description
             * return one place object from all hetic's places
             *
			 * @param {string} placeName - name of a room
			 * @param {object} options - contains two boolean to know wether or not to reload data or use fakeData
			 *
             * @return {object} Promise
             */

			get: function(placeName, options){

				var deferred = $q.defer();
				Api.find(options).then(function(places){
		        	deferred.resolve(places[placeName]);
				});
	            return deferred.promise;
			}

		};

		return Api;
	});
