'use strict';

angular.module('filters.byPromo', [])
    .filter('byPromo', function($filter) {


        return function(people, promo) {

            if (!promo) return;

            var out = [];

            angular.forEach(people, function(person) {
                if (promo === 'all') {
                    out.push(person);
                } else {
                    if (person.hetic) {
                        if (person.hetic.annee) {
                            if (person.hetic.annee.toLowerCase() === promo.toLowerCase()) {
                                out.push(person);
                            }
                        }
                    }
                }
            });

            return out;

        };
    });