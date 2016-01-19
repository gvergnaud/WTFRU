'use strict';

angular.module('WTFRU.auth', [
    'ui.router',
    'services.Auth',
    'services.Session',
    'services.Token',
    'constants'
])
    .config(function($stateProvider) {

        $stateProvider
            .state('auth', {
                url: '/auth',
                views: {
                    'main': {
                        templateUrl: 'client/app/auth/auth.html',
                        controller: 'authCtrl',
                    }
                }
            });
    })
    .controller('authCtrl', function($scope, $rootScope, $location, Session, Token, Auth, SERVER) {

        if (Session.id)
            $location.path('/map');

        $scope.auth = function(id) {
            if (id) {
                Session.id = id;
                Token.send(id).then(function(data) {
                    if (data.msg === 'success') {
                        $location.path('/map');
                    } else {
                        console.log(data.msg);
                    }
                });
            } else {
                Auth.heticConnect({}, true)
                    .then(
                        function(me) {
                            Session.id = me.id;
                            Token.send(me.id).then(function(data) {
                                if (data.msg === 'success') {
                                    $location.path('/map');
                                } else {
                                    console.log(data.msg);
                                }
                            });
                        },
                        function(error) {
                            console.log(error);
                        }
                );
            }
        };

        var users = [
            {
                name: 'François Pumir',
                id: 'FPUMIR',
                promo: 'Intervenant'
            },
            {
                name: 'Julien Boyer',
                id: 'JBOYER09',
                promo: 'Intervenant'
            },
            {
                name: 'Gabriel Vergnaud',
                id: 'GVERGNAUD14',
                promo: 'P2017'
            },
            {
                name: 'Centis Menant',
                id: 'CMENANT13',
                promo: 'P2017'
            },
            {
                name: 'Clément Lesaicherre',
                id: 'CLESAICHERRE14',
                promo: 'P2017'
            },
            {
                name: 'Alexis Delvaque',
                id: 'ADELVAQUE14',
                promo: 'P2017'
            },
            {
                name: 'DacDavy NGuyen',
                id: 'DNGUYEN12',
                promo: 'P2017'
            },
            {
                name: 'Florian Tiar',
                id: 'FTIAR14',
                promo: 'P2017'
            }
        ];

        $scope.selectedUser = users[0];

        $scope.leftUser = function(){
            var index = users.indexOf($scope.selectedUser);
            $scope.selectedUser = false;

            if(index === 0 || index === -1){
                 $scope.selectedUser = users[users.length - 1];
             }else{
                $scope.selectedUser = users[index - 1];
             }
        };

        $scope.rightUser = function(){
            var index = users.indexOf($scope.selectedUser);
            $scope.selectedUser = false;

            if(index === -1){
                 $scope.selectedUser = users[1];
            }else if(index === (users.length - 1)){
                 $scope.selectedUser = users[0];
             }else{
                $scope.selectedUser = users[index + 1];
             }
        };

    });
