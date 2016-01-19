'use strict';

angular.module('WTFRU', [
    'ui.router',
    'ngAnimate',

    'WTFRU.map',
    'WTFRU.auth',

    'services.Favorite',
    'services.Notification',
    'services.User',
    'services.Session',
    'services.Socket',
    'services.Token',

    'directives.about'
])

.config(function($locationProvider, $urlRouterProvider) {

    moment.locale('fr', {
        relativeTime: {
            future: "dans %s",
            past: "il y a %s",
            s: "quelques secondes",
            m: "une minute",
            mm: "%d minutes",
            h: "une heure",
            hh: "%d heures",
            d: "un jour",
            dd: "%d jours",
            M: "un mois",
            MM: "%d mois",
            y: "une année",
            yy: "%d années"
        }
    });

    $locationProvider.html5Mode(false);

    $urlRouterProvider.otherwise('/auth');
})

.controller('AppCtrl', function($scope, $rootScope, $state, Favorite, Notification, Session, User, Socket, Token) {

    $rootScope.$state = $state;

    var app = this;

    /**
     * @description
     * allow access to $state go method to the view
     * @param {String} stateName, Object urlParams
     */

    app.go = function(state, params) {
        if ($state.current.name === state) {
            $state.go('map');
        } else {
            $state.go(state, params);
        }
    };

    /**
     * @description
     * create a new "Where The F#ck R' U?" notification and go to state map.send
     * @param {Object} receiverUser
     */

    app.wtfru = function(receiverUser) {
        app.notifications.create('WTFRU', receiverUser.id);
        app.go('map.send', {
            type: 'wtfru'
        });
    };


    /**
     * @description
     * create a new "Come On Guys" notification and go to state map.send
     * @param {Array} receiverUsers
     */

    app.cog = function(receiverUsers) {
        var receiversIds = [];
        angular.forEach(receiverUsers, function(receiverUser) {
            receiversIds.push(receiverUser.id);
        });
        app.notifications.create('COG', receiversIds);
        app.go('map.send', {
            type: 'cog'
        });
    };


    /**
     * @description
     * create a new "Im Here !" notification and go to state map.send
     * @param {Number} receiverId
     */

    app.here = function(receiverId) {
        app.notifications.create('HERE', receiverId);
        app.go('map.send', {
            type: 'here'
        });
    };


    /**
     * @description
     * create a new "On My Way" notification and go to state map.send
     * @param {Number} receiverId
     */

    app.omw = function(receiverId) {
        app.notifications.create('OMW', receiverId);
        app.go('map.send', {
            type: 'omw'
        });
    };

    app.notifications = {

        count: 0,

        newNotif: {
            type: false,
            msg: '',
            receiversIds: false
        },

        create: function(type, receiverId) {
            this.newNotif.type = type;
            this.newNotif.receiversIds = (receiverId.constructor === Array) ? receiverId : [receiverId];
        },

        destroy: function() {
            this.newNotif = {
                type: false,
                msg: '',
                receiversIds: false
            };
        },

        addMessage: function(msg) {
            this.newNotif.msg = msg;
        },

        send: function() {
            if (app.notifications.newNotif.type && app.notifications.newNotif.receiversIds) {

                Notification.send(app.notifications.newNotif.type, app.notifications.newNotif.msg, app.notifications.newNotif.receiversIds, Session.me)
                    .then(function(response) {
                        console.log(response);
                        $scope.$broadcast('notificationSended', app.notifications.newNotif);
                        app.notifications.destroy();
                    });
            } else {
                console.log('infos manquantes pour envoyer la notif');
            }
        },

        getCount: function() {
            Notification.getNotViewedCount().then(function(count) {
                $scope.app.notifications.count = parseInt(count);
            });
        }
    };

    app.favorites = {
        add: function(user) {

            var newFavorite = {
                favorite_id: user.favorite_id || user.id,
                nom: user.nom,
                prenom: user.prenom,
                picture: user.picture
            };

            $scope.$broadcast('addFavorite', newFavorite);

            Favorite.add(newFavorite)
                .then(function(response) {
                    //si le favoris à bien été ajouté
                    if (response.msg === 'success') {
                        //on formate les data pour etre un favorite

                    } else {
                        $scope.$broadcast('removeFavorite', newFavorite.favorite_id);
                    }
                });
        },

        remove: function(id) {
            // si on à passé un objet en parammetre de la fonction, on recupère l'id de l'objet
            id = (id instanceof Object) ? (id.favorite_id || id.id) : id;

            $scope.$broadcast('removeFavorite', id);

            Favorite.remove(id)
                .then(function(response) {
                    //si le favoris à bien été supprimé
                    if (response.msg === 'success') {} else {
                        console.log(response);
                    }
                });
        }
    };



    app.slack = {
        open: function(user) {
            $state.go('map.usercard.slack', {
                id: user.id
            });
        },
        close: function(user) {
            console.log('slack close');
        }
    };



    app.me = {

        user: false,

        toggleGhostMode: function() {
            app.me.user.ghost_at = (app.me.user.ghost_at) ? 0 : Math.round(new Date().getTime() / 1000);
        },

        disconnect: function() {
            Session.destroy();
            $state.go('auth');
        }
    };

    $scope.$watchCollection('app.me.user', function(newValue) {
        if (!newValue) return;
        User.save(newValue).then(function(response) {
            // console.log(response);
        });
    });

    // Event
    Socket.on('notification', function(notification) {
        // si la notification ous est destinée
        if (notification.receiversIds instanceof Array && notification.receiversIds.indexOf(Session.id) !== -1) {
            // on reload les notification du server
            $scope.$emit('notification');

            Notification.find({
                reload: true
            });

        }
    });

    $scope.$on('notification', function() {
        $scope.app.notifications.count += 1;
    });

    $scope.$on('notificationSended', function(event, newNotif) {
        // on reload notre historique du server

        Socket.emit('notification', newNotif);
        Notification.getHistory({
            reload: true
        });
    });

});
