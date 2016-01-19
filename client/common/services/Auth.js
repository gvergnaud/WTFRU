'use strict';


angular.module('services.Auth', [
        'constants',
        'services.Session'
    ])
    .factory('Auth', function ($q, $http, Session, SERVER) {
        // Service logic
        // ...
        // Public Auth here
        var Auth = {


            /**
             * @name heticConnect
             * @description
             * connect to the hetic Api via credentials
             *
             * @param {object} credentials - username and password
             * @param {boolean} fakeData - wether or not to use fakeData
             *
             * @return {object} Promise
             */

            heticConnect: function(credentials, fakeData){
                if(fakeData){
                    var deferred = $q.defer();
                    $http.get(SERVER.dataUrl + '/fakedata/heticConnect.json')
                        .success(function (data, status){
                            deferred.resolve(data);
                        })
                        .error(function (data, status){
                            deferred.reject(data);
                        });

                    return deferred.promise;
                }
                else{
                    //TODO connection hetic
                }
            },



            /**
             * @name isAuthenticated
             * @description
             * return the athentification state of the current user
             *
             * @return {boolean} isAuthenticated
             */

            isAuthenticated:  function () {
                return !!Session.id;
            },

            /**
             * @name isNotAuthenticated
             * @description
             * return the athentification state of the current user
             *
             * @return {boolean} isNotAuthenticated
             */

            isNotAuthenticated: function(){
                return !(!!Session.id);
            }
        };

        return Auth;
    });
