'use strict';

angular.module('WTFRU.map.notification', [
        'ui.router',
        'services.Notification',
        'directives.onClickToggleClass',
        'filters.byId'
    ])
    .config(function($stateProvider) {

        $stateProvider
            .state('map.notification', {
                views: {
                    'notification': {
                        resolve: {
                            notifications: function(Notification) {
                                return Notification.find({
                                    reload: true
                                });
                            }
                        },
                        templateUrl: 'client/app/map/notification/notification.html',
                        controller: 'notificationCtrl'
                    }
                }
            })

        .state('map.allNotifications', {
            views: {
                'seeAll': {
                    resolve: {
                        notifications: function(Notification) {
                            return Notification.find({
                                reload: true
                            });
                        },
                        history: function(Notification) {
                            return Notification.getHistory();
                        }
                    },
                    templateUrl: 'client/app/map/notification/allNotifications.html',
                    controller: 'allNotificationsCtrl'
                }
            }
        });
    })
    .controller('notificationCtrl', function($scope, $rootScope, Notification, notifications) {

        $scope.notifications = notifications;

        Notification.allViewed().then(function() {
            $scope.app.notifications.getCount();
        });

        $scope.$on('notification', function() {
            $scope.notifications = Notification.find({
                reload: true
            });
        });

    })
    .controller('allNotificationsCtrl', function($scope, $rootScope, $filter, Notification, notifications, history) {

        $scope.notifications = notifications;
        $scope.history = history;

        $scope.switchTab = function() {
            document.querySelector('section.notifications').classList.toggle('hidden');
            document.querySelector('section.history').classList.toggle('hidden');
        };

        $scope.$on('notification', function() {
            $scope.notifications = Notification.find({
                reload: true
            });
        });
    });
