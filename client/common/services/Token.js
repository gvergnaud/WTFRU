'use strict';


angular.module('services.Token', [
		'constants',
		'services.Session',
		'config.httpPostFix'
	])
	.factory('Token', function ($q, $http, Session, SERVER) {

		// Private
		var _token = false;

		(function _init(){
			var element =  document.getElementById('token');
			_token = element.innerHTML;
			element.parentNode.removeChild(element);
		})();

		// Public API here
		var Token = {

			/**
             * @name send
			 *
             * @description
             * send current user's id to the server with the token for the security
             *
			 * @param {string} id - user's hetic id
			 *
             */

			send: function(id){
				var deferred = $q.defer();
	        	$http.post(SERVER.apiUrl + '/token', {id: id, token: _token})
		            .success(function (data, status){
		            	deferred.resolve(data);
		            })
		            .error(function (data, status){
		            	deferred.reject(data);
		            });
	            return deferred.promise;
			}

		};

		return Token;
	});
