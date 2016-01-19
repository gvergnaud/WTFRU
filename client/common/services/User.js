'use strict';


angular.module('services.User', [
    'ngResource',
    'services.WifiDevice',
    'constants'
])
    .factory('User', function($q, $http, $resource, SERVER) {
        // Service logic
        // ...

        var HeticUser = $resource(SERVER.apiUrl + '/hetic-users');
        var WtfruUser = $resource(SERVER.apiUrl + '/users/:id');
        var Me = $resource(SERVER.apiUrl + '/me');
        var Wifi = $resource(SERVER.wifiApiUrl);
        var Skill = $resource(SERVER.apiHeticUrl + '/skills');


        var _data = {
            users: false,
            heticUsers: false,
            wtfruUsers: false,
            wifi: false,
            skills: false
        };

        var _checkOptions = function(options) {
            if (!options) {
                options = {
                    reload: false,
                    fakeData: false
                };
            }

            return options;
        };

        var _getHeticUsers = function(options) {

            var deferred = $q.defer();

            options = _checkOptions(options);


            if (!options.reload && _data.heticUsers !== false) { //pas de rechargement

                deferred.resolve(_data.heticUsers);

            } else { // rechargement des données

                if (true) { //options.fakeData

                    $http.get(SERVER.dataUrl + '/fakedata/heticUsers.json')
                        .success(function(data, status) {
                            _data.heticUsers = data;
                            deferred.resolve(data);
                        })
                        .error(function(data, status) {
                            deferred.reject(data);
                        });
                } else {
                    var users = HeticUser.query(function() {
                        _data.heticUsers = users;
                        deferred.resolve(users);
                    });
                }
            }

            return deferred.promise;


        };

        var _getWtfruUsers = function(options) {

            var deferred = $q.defer();

            options = _checkOptions(options);

            if (!options.reload && _data.wtfruUsers !== false) { //pas de rechargement

                deferred.resolve(_data.wtfruUsers);

            } else { // rechargement des données

                if (options.fakeData) {
                    $http.get(SERVER.dataUrl + '/fakedata/users.json')
                        .success(function(data, status) {
                            _data.wtfruUsers = data;
                            deferred.resolve(data);
                        })
                        .error(function(data, status) {
                            deferred.reject(data);
                        });
                } else {
                    var users = WtfruUser.query(function() {
                        _data.wtfruUsers = users;
                        deferred.resolve(users);
                    });
                }
            }

            return deferred.promise;

        };

        var _getWifiData = function(options) {

            var deferred = $q.defer();

            options = _checkOptions(options);

            if (!options.reload && _data.wifi !== false) { //pas de rechargement

                deferred.resolve(_data.wifi);


            } else { // rechargement des données

                if (true) { // options.fakeData
                    $http.get(SERVER.dataUrl + '/fakedata/kimonoData.json')
                        .success(function(data, status) {
                            _data.wifi = data;
                            deferred.resolve(data);
                        })
                        .error(function(data, status) {
                            deferred.reject(data);
                        });
                } else {
                    var wifi = Wifi.query(function() {
                        _data.wifi = wifi;
                        deferred.resolve(wifi);
                    });
                }
            }

            return deferred.promise;
        };

        // Public API here
        var Api = {


            /**
             * @name find
			 *
             * @description
             * find all users registered in the 3 sources : hetic API, WTFRU API,
             * and the wifiDevices connection API. It match the 3 sources and returns
             * an array of users
             *
             * @param {object} options - contains two boolean to know wether or not to reload data or use fakeData
			 *
             * @return {object} Promise
             */

            find: function(options) {

                var deferred = $q.defer();

                var users = {};
                var resolved = {};

                function resolve(name) {
                    resolved[name] = true;
                    if (resolved.hetic && resolved.wifi && resolved.wtfru) {
                        _data.users = users;
                        deferred.resolve(users);
                    }
                }

                options = _checkOptions(options);

                if (!options.reload && _data.users !== false) { //pas de rechargement

                    deferred.resolve(_data.users);

                } else { // rechargement des données

                    _getHeticUsers(options).then(function(data) {

                        var currentYear = new Date().getFullYear();

                        angular.forEach(data, function(user) {
                            if (user.nom && user.prenom) {
                                var login = user.prenom.toLowerCase() + '.' + user.nom.toLowerCase();
                                if (!users[login]) {
                                    users[login] = {};
                                }
                                users[login].hetic = user;
                                users[login].nom = user.nom;
                                users[login].mail = user.email;
                                users[login].prenom = user.prenom;
                                users[login].id = user.login || user.id;
                                users[login].hetic.promotion = users[login].hetic.promotion + 2004;
                                users[login].hetic.annee = (5 - (users[login].hetic.promotion - currentYear)) <= 5 ? 'H' + (5 - (users[login].hetic.promotion - currentYear)) : 'ancien étudiant';
                            }
                        });
                        resolve('hetic');
                    });

                    _getWtfruUsers(options).then(function(data) {
                        angular.forEach(data, function(user) {
                            var login = user.prenom.toLowerCase() + '.' + user.nom.toLowerCase();
                            if (!users[login]) {
                                users[login] = {};
                            }

                            users[login].ghost_at = (typeof user.ghost_at !== 'undefined') ? user.ghost_at : 0;

                            if (user.nom)
                                users[login].nom = user.nom;

                            if (user.prenom)
                                users[login].prenom = user.prenom;

                            if (user.id)
                                users[login].id = user.id;

                            if (user.mail)
                                users[login].mail = user.mail;

                            users[login].cover = (user.cover) ? user.cover : '';
                            users[login].citation = (user.citation) ? user.citation : '';
                            users[login].website = (user.website) ? user.website : '';
                            users[login].twitter = (user.twitter) ? user.twitter : '';
                            users[login].behance = (user.behance) ? user.behance : '';
                            users[login].dribbble = (user.dribbble) ? user.dribbble : '';
                            users[login].github = (user.github) ? user.github : '';
                            users[login].slack_id = (user.slack_id) ? user.slack_id : '';

                        });
                        resolve('wtfru');
                    });

                    _getWifiData(options).then(function(data) {
                        angular.forEach(data.collection1, function(user) {
                            if (!user.userName) return;
                            var login = user.userName.toLowerCase();
                            if (!users[login]) {
                                users[login] = {};
                            }
                            users[login].wifi = user;
                        });
                        resolve('wifi');
                    });

                }

                return deferred.promise;
            },


            /**
             * @name get
			 *
             * @description
             * get one user from all the users
             *
             * @param {string} id - user's hetic id
             * @param {object} options - contains two boolean to know wether or not to reload data or use fakeData
			 *
             * @return {object} Promise
             */

            get: function(id, options) {

                options = _checkOptions(options);

                var deferred = $q.defer();

                Api.find(options).then(function(users) {

                    angular.forEach(users, function(user) {
                        if (user.id == id) {
                            deferred.resolve(user);
                        }
                    });

                    deferred.reject('no user found');
                });

                return deferred.promise;

            },


            /**
             * @name save
			 *
             * @description
             * register a new user to the WTFRU API
             *
             * @param {object} data - current user's data
			 *
             * @return {object} Promise
             */

            save: function(data) {
                var deferred = $q.defer();

                Me.save(data,
                    function(response) {
                        deferred.resolve(response);
                    });

                return deferred.promise;
            },


            /**
             * @name getSkillsList
			 *
             * @description
             * get the skill list of all hetic student from hetic API
             *
             * @param {object} options - contains two boolean to know wether or not to reload data or use fakeData
			 *
             * @return {object} Promise
             */

            getSkillsList: function(options) {
                var deferred = $q.defer();

                options = _checkOptions(options);

                if (!options.reload && _data.skills !== false) { //pas de rechargement

                    deferred.resolve(_data.skills);

                } else {

                    $http.get(SERVER.dataUrl + '/fakedata/heticSkills.json')
                        .success(function(data, status) {
                            _data.skills = data;
                            deferred.resolve(data);
                        })
                        .error(function(data, status) {
                            deferred.reject(data);
                        });

                }

                return deferred.promise;
            }

        };

        return Api;
    });
