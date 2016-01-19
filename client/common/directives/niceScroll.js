'use strict';

angular.module('directives.niceScroll', [])
	
	.directive('niceScroll', function(){

        return {

            restrict: 'A',

            link: function(scope, element, attrs){
            	//nicescroll js
                element.niceScroll({
                    cursorcolor: '#555',
                    cursorborder: 'none',
                    cursoropacitymin: 0,
                    cursoropacitymax: 1,
                    cursorwidth: '10px',
                    scrollspeed: 100,
                    mousescrollstep: 60,
                    cursorborderradius: 0,
                    horizrailenabled: true, // nicescroll can manage horizontal scroll
                    autohidemode: true,
                    bouncescroll: true
                    //touchbehavior: true // pour pouvoir drag end drop la page
                });
            }
        }
    });