'use strict';

angular.module('filters.byHetic', [])

.filter('byHetic', function($filter) {

    return function(people) {

        var out = [];

        angular.forEach(people, function(person) {

            if (person.hetic) {
                out.push(person);
            }
        });

        return out;

    };
});