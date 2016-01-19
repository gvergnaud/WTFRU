'use strict';

angular.module('filters.bySkills', [])
	
	.filter('bySkills', function () {


        return  function(people, skill){
        	
            skill = skill ? skill.toLowerCase() : '';

        	var out = [];

        	angular.forEach(people, function(person){
                if(!skill){
                    out.push(person);
                }else{
                    if(person.hetic){
                        var BreakException = {};
                        try {
                            angular.forEach(person.hetic.skills, function(personSkill){
                                if(personSkill.competence.toLowerCase().indexOf(skill) !== -1){
                                    out.push(person);
                                    throw BreakException;
                                }
                            });
                        } catch(e) {
                            if (e !== BreakException) throw e;
                        }
                    }
                }
        	});

        	return out;

        };
    });