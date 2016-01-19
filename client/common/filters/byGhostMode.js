'use strict';

angular.module('filters.byGhostMode', [])
	
	.filter('byGhostMode', function ($filter) {

        return  function(people){
        	
        	var out = [];

        	angular.forEach(people, function(person){

        		if (!person.ghost_at){
        			out.push(person);
        		}
        	});

        	return out;

        };
    });