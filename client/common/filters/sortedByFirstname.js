'use strict';

angular.module('filters.sortedByFirstname', [])
	
	.filter('sortedByFirstname', function ($filter) {


        return  function(people){

        	people = people.sort(function (a,b) {
        		if (a.prenom < b.prenom)
        			return -1;
        		if (a.prenom > b.prenom)
        			return 1;
        		return 0;
        	});

        	return people;

        };
    });