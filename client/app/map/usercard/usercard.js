'use strict';

angular.module('WTFRU.map.usercard', [
    'WTFRU.map.usercard.slack',
    'ui.router',
    'services.User',
    'services.Session',
    'directives.editable',
    'directives.fullFrame',
    'directives.inputTooltip'
])

.config(function($stateProvider) {

    $stateProvider
        .state('map.usercard', {
            url: '/usercard/:id',
            views: {
                'usercard': {
                    resolve: {
                        user: function(User, $stateParams) {
                            return User.get($stateParams.id, {
                                reload: true
                            });
                        }
                    },
                    templateUrl: 'client/app/map/usercard/usercard.html',
                    controller: 'usercardCtrl',
                }
            }
        })
        .state('map.profil', {
            url: '/profil',
            views: {
                'usercard': {
                    resolve: {
                        user: function(User, Session) {
                            return User.get(Session.id, {
                                reload: true
                            });
                        }
                    },
                    templateUrl: 'client/app/map/usercard/usercard.html',
                    controller: 'usercardCtrl',
                }
            }
        });
})

.controller('usercardCtrl', function($scope, $rootScope, Session, user) {

    $scope.isProfil = (user.id === Session.id) ? true : false;

    $scope.user = $scope.isProfil ? $scope.app.me.user : user;

    $scope.startUrl = {
        website: 'http://',
        twitter: 'https://twitter.com/',
        behance: 'https://www.behance.net/',
        dribbble: 'https://dribbble.com/',
        github: 'https://github.com/',
    };

    $scope.saveCitation = function(citation) {
        $scope.app.me.user.citation = citation;
    };

    $scope.saveWebsite = function(website) {
        $scope.app.me.user.website = website;
    };

    $scope.saveTwitter = function(twitter) {
        $scope.app.me.user.twitter = twitter;
    };

    $scope.saveBehance = function(behance) {
        $scope.app.me.user.behance = behance;
    };

    $scope.saveDribbble = function(dribbble) {
        $scope.app.me.user.dribbble = dribbble;
    };

    $scope.saveGithub = function(github) {
        $scope.app.me.user.github = github;
    };

    document.querySelector('#card').addEventListener('click', function(e) {
        e.stopPropagation();
    });

});
