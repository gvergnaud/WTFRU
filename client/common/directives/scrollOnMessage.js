'use strict';

angular.module('directives.scrollOnMessage', [])
	
	.directive('scrollOnMessage', function ($rootScope) {

        return {

            restrict: 'A',

            link: function(scope, element, attrs){

                $rootScope.$on('response', function(){
                    /*angular.element(element).parent().scrollTop;
                    console.log(angular.element(element))
                   // console.log(angular.element(element).parent()[0].scrollTop());
                    //$('#conversation').scrollTop($('#conversation-ul').height());*/
                });
               
                

            }
        }
    });