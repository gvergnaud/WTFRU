'use strict';

angular.module('filters.byId', [])
  .filter('byId', function() {

    return function(people, id) {

      var out;

      var BreakException = {};

      try {
        angular.forEach(people, function(person) {
          if (person.id === id) {
            out = person;
            throw BreakException;
          }
        });
      } catch (e) {
        if (e !== BreakException) throw e;
      }

      return out;

    };
  });
