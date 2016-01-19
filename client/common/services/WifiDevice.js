'use strict';


angular.module('services.WifiDevice', [
		'ngResource',
		'constants'
	])
	.factory('WifiDevice', function ($q, $http, $resource, SERVER) {
		// Service logic
		// ...

		var WifiDevice = $resource(SERVER.apiUrl + '/wiifidevices');

		var _data = {
			wifiDevices: false
		};

		var _checkOptions = function(options){
			if(!options){
				options = {
					reload: false,
					fakeData: false
				};
			}

			return options;
		};

		// Public API here
		var Api = {

			/**
             * @name find
			 *
             * @description
             * find all WifiDevice from the json file
             *
             * @return {object} Promise
             */

			find: function () {
				var deferred = $q.defer();
	        	$http.get(SERVER.dataUrl + '/wifidevices.json')
		            .success(function (data, status){
		        		deferred.resolve(data);
		            })
		            .error(function (data, status){
		        		deferred.reject(data);
		            });
	            return deferred.promise;
			},


			/**
             * @name get
			 *
             * @description
             * find all WifiDevice from the json file
			 *
			 * @param {object} deviceName - name of the device (like 'S13AP1')
             *
             * @return {object} Promise
             */

			get: function(deviceName){
				var deferred = $q.defer();
				Api.find().then(function(wifiDevices){
					deferred.resolve(wifiDevices[deviceName]);
				});
				return deferred.promise;
			}
		};

		return Api;
	});
