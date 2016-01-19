'use strict';

angular.module('WTFRU.map', [
    'ui.router',
    'angularMoment',

    'WTFRU.map.tuto',
    'WTFRU.map.usercard',
    'WTFRU.map.notification',
    'WTFRU.map.favorite',
    'WTFRU.map.filter',
    'WTFRU.map.place',
    'WTFRU.map.send',

    'directives.svgPanZoom',
    'directives.heticMap',
    'directives.searchBar',
    'directives.selectable',
    'directives.dragAndDrop',
    'directives.fullFrame',
    'directives.gsap',

    'services.Auth',
    'services.User',
    'services.Favorite',
    'services.Place',
    'services.WifiDevice',
    'services.Session',
    'services.Slack',

    'filters.sortedByFirstname',
    'filters.byName',
    'filters.byGhostMode',
    'filters.byLevel',
    'filters.bySkills',
    'filters.byId'
])

.config(function($stateProvider) {

    $stateProvider
        .state('map', {
            url: '/map',
            views: {
                'main': {
                    resolve: {

                        auth: function(Auth) {
                            return Auth.isAuthenticated();
                        }
                    },
                    templateUrl: 'client/app/map/map.html',
                    controller: 'mapCtrl',
                    controllerAs: 'map'
                }
            }
        });
})

.controller('mapCtrl', function($scope, $rootScope, $filter, $state, User, Session, Slack, Place, WifiDevice, auth) {

    var map = this;

    map.etage = 1;

    map.searchState = ($state.current.name === 'map') ? 'active' : 'closed';

    map.draggedUserId = false;

    map.toggleSearchState = function() {
        if (map.searchState === 'active') {
            map.searchState = 'closed'
        } else {
            $state.go('map');
            map.searchState = 'active';
        }
    };

    var startMap = function(users) {

        console.log(users);

        map.users = users;

        map.getUserFromId = function(id) {
            return $filter('byId')(users, id);
        };

        //enregistrement de mes données en session
        Session.create(Session.id, $filter('byId')(users, Session.id));
        $scope.app.me.user = Session.me;
        if (!$scope.app.me.user) $scope.app.me.disconnect();
        // recupération des mes notifications
        $scope.app.notifications.getCount();

        // WifiDevices
        WifiDevice.find().then(function(wifiDevices) {
            map.wifiDevices = wifiDevices;
        });

        var slackToken = localStorage.getItem('slackToken');

        if (slackToken) {
            Slack.me(slackToken, function(response) {
                Slack.rtm(response, function() {
                    if (!$scope.app.me.user.slack_id) {
                        $scope.app.me.user.slack_id = Slack.me.self.id;
                    }
                })
            })
        }

        var isUser = localStorage.getItem('wtfuUser');
        if (!isUser) {
            $state.go('map.tuto');
            localStorage.setItem('wtfuUser', 'true');
        }


        // FILTRES
        map.filters = {
            promo: 'all',
            staff: 'all',
            skills: ''
        };

        map.addFilter = function(filter, value) {
            //toggle le filtre
            map.filters[filter] = (map.filters[filter] === value) ? false : value;
        };

        $scope.$watchCollection('map.filters', function(newValue, oldValue) {
            var filteredUsers = $filter('bySkills')(
                $filter('byLevel')(
                    $filter('byGhostMode')(
                        users
                    ),
                    map.filters.promo,
                    map.filters.staff
                ),
                map.filters.skills
            );

            map.filteredUsers = filteredUsers;

            Place.find({

                reload: true,
                users: filteredUsers

            }).then(function(places) {
                map.places = places;

                Place.getUserNumberInFloor(1).then(function(number) {
                    map.firstFloor = number;
                });

                Place.getUserNumberInFloor(0).then(function(number) {
                    map.groundFloor = number;
                });
            });
        });

        // Groupes
        map.myGroup = {
            users: [],
            add: function(user) {
                if (!map.myGroup.isGrouped(user.id) && map.myGroup.users.length <= 8)
                    map.myGroup.users.push(user);
            },
            remove: function(id) {
                // si on à passé un objet en parammetre de la fonction, on recupère l'id de l'objet
                id = (id instanceof Object) ? id.id : id;

                angular.forEach(map.myGroup.users, function(groupedUser, index) {
                    if (id === groupedUser.id) {
                        map.myGroup.users.splice(index, 1);
                    }
                });
            },
            empty: function() {
                map.myGroup.users = [];
            },
            isGrouped: function(id) {
                // si on à passé un objet en parammetre de la fonction, on recupère l'id de l'objet
                id = (id instanceof Object) ? id.id : id;
                // test si l'id données correspond à celui d'un membre du groupe
                var flag = false;
                angular.forEach(map.myGroup.users, function(groupedUser, index) {
                    if (id === groupedUser.id) {
                        flag = true;
                    }
                });
                return flag;
            }
        };
    };

    if (!auth)
        $state.go('auth');
    else
        User.find().then(startMap);
})


// DROP CONTROLLER
.controller('dropCtrl', function($scope, $rootScope, $filter, Favorite) {

    var drop = this;

    drop.groupContent = {
        containerClass: '',
        title: '',
        iconClass: ''
    };

    drop.favoriteContent = {
        containerClass: '',
        title: '',
        iconClass: ''
    };

    drop.groupFunction = function() {};
    drop.favoriteFunction = function() {};

    $scope.$watchCollection('map.draggedUserId', function(newValue, oldValue) {

        if (!newValue) return;

        var id = newValue;
        var user = $filter('byId')($scope.map.users, id);

        if ($scope.map.myGroup.isGrouped(user)) {
            // user est dans le groupe
            drop.groupFunction = $scope.map.myGroup.remove;
            drop.groupContent.containerClass = 'remove';
            drop.groupContent.title = 'Retirer du message groupé';
            drop.groupContent.iconClass = 'icon-vider';
        } else {
            // user n\'est pas dans le groupe
            drop.groupFunction = $scope.map.myGroup.add;
            drop.groupContent.containerClass = 'add';
            drop.groupContent.title = 'Ajouter au message groupé';
            drop.groupContent.iconClass = 'icon-ajouter';
        }

        Favorite.isFavorite(id, {
            reload: true
        })
            .then(function() {
                // il est dans les favoris
                drop.favoriteFunction = $scope.app.favorites.remove;
                drop.favoriteContent.containerClass = 'remove';
                drop.favoriteContent.title = 'Retirer des favoris';
                drop.favoriteContent.iconClass = 'icon-retirer';
            }, function() {
                // il n'est pas dan les favoris
                drop.favoriteFunction = $scope.app.favorites.add;
                drop.favoriteContent.containerClass = 'add';
                drop.favoriteContent.title = 'Ajouter aux favoris';
                drop.favoriteContent.iconClass = 'icon-favoris-out';
            });
    });
});
