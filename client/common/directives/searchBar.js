angular.module('directives.searchBar', [])
    .directive('searchBar', function($rootScope) {

        var setActive = function() {
            input.focus();

        };

        var setInactive = function() {
            input.blur();
        };

        var setClosed = function() {

        };

        return {

            restrict: 'A',

            scope: {
                searchState: '='
            },

            link: function(scope, element, attrs) {

                var currentState = false,
                    input = element[0].querySelector('input.searchBar'),
                    usersContainer = element[0].querySelector('div.usersContainer');

                var setActive = function() {
                    input.focus();
                };

                var setInactive = function() {
                    input.blur();
                };

                var setClosed = function() {
                    setInactive();
                    input.value = '';
                    scope.$parent.map.Search = '';
                };


                // écouteurs de changement d'état
                input.addEventListener('focus', function() {
                    scope.searchState = 'active';
                    // si il n'y a ni digest ni apply atm
                    if (!scope.$$phase && !$rootScope.$$phase) scope.$apply();
                });


                $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                    if (toState.name !== 'map' && scope.searchState === 'active') {
                        if (element[0].querySelector('input.searchBar').value) {
                            scope.searchState = 'inactive';
                        } else {
                            scope.searchState = 'closed';
                        }
                    }
                });


                scope.$watch('searchState', function(searchState) {
                    // si la bar a déjà le bon état on arrete tout
                    if (searchState === currentState) return;

                    if (searchState === 'active') {
                        setActive();

                    } else if (searchState === 'inactive') {
                        setInactive();

                    } else if (searchState === 'closed') {
                        setClosed();
                    }

                    currentState = searchState;

                });
            }
        };
    });