'use strict';

angular.module('WTFRU.map.favorite', [
    'ui.router',
    'directives.relativeMaxHeight',
    'services.Favorite',
    'filters.sortedByFirstname'
])
    .config(function($stateProvider) {

        $stateProvider
            .state('map.favorite', {
                views: {
                    'favorite': {
                        resolve: {
                            favorites: function(Favorite) {
                                return Favorite.find({
                                    reload: true
                                });
                            }
                        },
                        templateUrl: 'client/app/map/favorite/favorite.html',
                        controller: 'favoriteCtrl'
                    }
                }
            });
    })
    .controller('favoriteCtrl', function($scope, $rootScope, favorites) {

        $scope.favorites = favorites;

        var savedFavorites = [];


        // UN favoris à été ajouté
        $scope.$on('addFavorite', function($event, newFavorite) {

            if (savedFavorites.indexOf(newFavorite.favorite_id) === -1) {
                // si le nouveau favoris n'est pas dans la sauvegarde temporaire, on l'ajoute a l'UI
                $scope.favorites.push(newFavorite);
            } else {
                // on supprime le favorie de la sauvegarde temporaire
                savedFavorites.splice(savedFavorites.indexOf(newFavorite.favorite_id), 1);
            }
        });

        // UN favoris à été supprimé
        $scope.$on('removeFavorite', function($event, removedFavoriteId) {
            // si le favoris supprimé n'est pas dans la sauvegarde temporaire, on le supprime de l'ui
            if (savedFavorites.indexOf(removedFavoriteId) === -1) {
                angular.forEach($scope.favorites, function(favorite, index) {
                    if (favorite.favorite_id === removedFavoriteId) {
                        $scope.favorites.splice(index, 1);
                    }
                });
            }
        });


        $scope.toggleFavorite = function(favorite) {
            var element = document.querySelector('div.favorite.favorite' + favorite.favorite_id);
            var icon = element.querySelector('span.icon');

            if (icon.classList.contains('icon-favoris')) {
                icon.classList.remove('icon-favoris')
                icon.classList.add('icon-favoris-out');
                // on ajoute le favorie à la sauvegarde temporaire
                savedFavorites.push(favorite.favorite_id);
                // on supprime le favoris de la base
                $scope.app.favorites.remove(favorite.favorite_id);
            } else {
                icon.classList.remove('icon-favoris-out');
                icon.classList.add('icon-favoris')
                // on ajoute le favoris à la base
                $scope.app.favorites.add(favorite);

            }
        };

    })
