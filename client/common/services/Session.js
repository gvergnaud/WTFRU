'use strict';
/*
 * Service Session
 */
angular.module('services.Session', [
    'constants'
])
    .service('Session', function($http, SERVER) {
        // INIT
        var element = document.getElementById('userId');
        this.id = element.innerHTML;
        element.parentNode.removeChild(element);

        this.create = function(id, user) {
            this.id = id;
            this.me = user;
        };

        this.destroy = function() {
            this.id = null;
            this.me = null;
            // remove le session
            $http.get(SERVER.apiUrl + '/logout');
        };

        return this;
    });