'use strict';

angular.module('filters.byLevel', [
    'filters.byPromo'
])
    .filter('byLevel', function($filter) {


        return function(people, promo, level) {

            if (level === null) return;

            var authorizedLevels = [];
            var out = [];

            if (promo) {
                out = $filter('byPromo')(people, promo);
            }

            if (level === 'all') {
                authorizedLevels.push(1);
                authorizedLevels.push(2);
            } else {
                authorizedLevels.push(level);
            }

            angular.forEach(people, function(person) {
                if (person.hetic) {
                    if (authorizedLevels.indexOf(person.hetic.level) !== -1) {
                        // si la personne n'est pas déjà dans le tableau out (si il est étudiant)
                        if (out.indexOf(person) === -1) {
                            out.push(person);
                        }
                    }
                }
            });

            return out;

        };
    });