'use strict';

angular.module('filters.byName', [])
    .filter('byName', function($filter) {

        return function(people, model) {

            if (!model) return;

            model = model.toLowerCase();

            var out = [];

            angular.forEach(people, function(person) {

                if (person.nom || person.prenom) {
                    var prenom = person.prenom.toLowerCase();
                    var nom = person.nom.toLowerCase();
                    var fullname = prenom + ' ' + nom;

                    if (model && ((nom.indexOf(model) !== -1) || (prenom.indexOf(model) !== -1)) || (fullname.indexOf(model) !== -1)) {
                        out.push(person);
                    }
                }

            });

            out = out.sort(function(a, b) {
                if (a.prenom < b.prenom)
                    return -1;
                if (a.prenom > b.prenom)
                    return 1;
                return 0;
            });

            return out;

        };
    });