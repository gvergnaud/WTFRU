'use strict';


angular.module('services.Notification', [
		'ngResource',
		'constants'
	])
	.factory('Notification', function ($q, $http, $resource, SERVER) {
		// Service logic
		// ...

		var Historique = $resource(SERVER.apiUrl + '/historique');
		var Notification = $resource(SERVER.apiUrl + '/notifications');

		var _data = {
			notifications: false,
			history: false
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
			 * @description
			 * Return all current user's notifications
			 *
			 * @param {object} options - contains two boolean to know wether or not to reload data or use fakeData
			 *
			 * @return {object} Promise
			 */

			find: function (options) {

				options = _checkOptions(options);

				if(!options.reload && _data.notifications !== false){ //pas de rechargement

					var deferred = $q.defer();
			        deferred.resolve(_data.notifications);
					return deferred.promise;

				}else{ // rechargement des données

					if(options.fakeData){
						var deferred = $q.defer();
			        	$http.get(SERVER.dataUrl + '/fakedata/notifications.json')
				            .success(function (data, status){
				            	_data.notifications = data;
				        		deferred.resolve(data);
				            })
				            .error(function (data, status){
				        		deferred.reject(data);
				            });
			            return deferred.promise;
					}
					else{
						var notifications;
						return notifications = Notification.query(function(){
							_data.notifications = notifications;
						});
					}
				}
			},


			/**
			 * @name send
			 * @description
			 * Send a new notification to one or several users
			 *
			 * @param {string} type - the type of the message ('WTFRU', 'COG', 'HERE' or 'OMW')
			 * @param {string} msg - message content
			 * @param {array} receiversIds - array of users id.
			 * @param {object} senderUser - current user object
			 *
			 * @return {object} Promise
			 */

			send: function(type, msg, receiversIds, senderUser){

				if(!type || !senderUser || !receiversIds || !senderUser.nom || !senderUser.prenom ||!senderUser.hetic){
					console.log('Notification non envoyé, info manquante');
					return;
				}

				var deferred = $q.defer();

				var newNotif = {
					type: type,
					content: msg,
					user_nom: senderUser.nom,
					user_prenom: senderUser.prenom,
					user_picture: senderUser.hetic.picture,
					receiver_id: JSON.stringify(receiversIds)
				};

				if(senderUser.wifi)
					newNotif.user_wifidevice = senderUser.wifi.wifiDevice;


				Notification.save(newNotif,
				function(response){
					deferred.resolve(response);
				});

				return deferred.promise;
			},


			/**
			 * @name getNotViewedCount
			 * @description
			 * Return the number of user's unseen notifications
			 *
			 * @return {object} Promise
			 */

			getNotViewedCount: function(){
				var deferred = $q.defer();
				$http.get(SERVER.apiUrl + '/notifications/count')
		            .success(function (count, status){
		        		deferred.resolve(count);
		            });
				return deferred.promise;
			},


			/**
			 * @name allViewed
			 * @description
			 * set all not viewed notifications to viewed
			 *
			 * @return {object} Promise
			 */

			allViewed: function(){
				var deferred = $q.defer();
				$http.get(SERVER.apiUrl + '/notifications/viewed')
		            .success(function (data, status){
		        		deferred.resolve();
		            })
		            .error(function(data){
		            	deferred.reject(data);
		            });
				return deferred.promise;
			},


			/**
			 * @name getHistory
			 * @description
			 * Return current user's notification history
			 *
			 * @param {object} options - contains two boolean to know wether or not to reload data or use fakeData
			 *
			 * @return {object} Promise
			 */

			getHistory: function (options) {

				options = _checkOptions(options);

				if(!options.reload && _data.history !== false){ //pas de rechargement

					var deferred = $q.defer();
			        deferred.resolve(_data.history);
					return deferred.promise;

				}else{ // rechargement des données

					if(options.fakeData){
						var deferred = $q.defer();
			        	$http.get(SERVER.dataUrl + '/fakedata/history.json')
				            .success(function (data, status){
				            	_data.history = data;
				        		deferred.resolve(data);
				            })
				            .error(function (data, status){
				        		deferred.reject(data);
				            });
			            return deferred.promise;
					}
					else{
						var history;
						return history = Historique.query(function(){
							_data.history = history;
						});
					}
				}
			}
		};

		return Api;
	});
