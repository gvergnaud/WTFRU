'use strict';

angular.module('WTFRU.map.filter', [
    'ui.router',
    'directives.selectable',
    'services.User'
])
    .config(function($stateProvider) {

        $stateProvider
            .state('map.filter', {
                resolve: {
                    skills: function(User) {
                        return User.getSkillsList();
                    }
                },
                views: {
                    'filter': {
                        templateUrl: 'client/app/map/filter/filter.html',
                        controller: 'filterCtrl',
                    }
                }
            });
    })
    .controller('filterCtrl', function($scope, $rootScope, skills) {

        $scope.skills = [];

        angular.forEach(skills, function(skill) {
            skill = skill.competence.toLowerCase();
            if ($scope.skills.indexOf(skill) === -1) {
                $scope.skills.push(skill);
            }
        });

        $('.tick').on('click', function(e) {
            e.stopPropagation();
        });

        $('[ng-click]').on('click', function(e) {
            e.stopPropagation();
        });
    });