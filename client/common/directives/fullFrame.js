'use strict';

angular.module('directives.fullFrame', [])
	
	.directive('fullFrame', function(){

        return {

            restrict: 'A',

            link: function(scope, element, attrs){
                
                var parent = element.parent();

                var style = function(){

                    var parentHeight = parent.height(),
                        parentWidth = parent.width(),
                        elementHeight = element.height(),
                        elementWidth = element.width();

                    element.css({
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    });

                    parent.css({
                        overflow: 'hidden'
                    });
                    if( (parentWidth / parentHeight) > (elementWidth / elementHeight) ){
                        element.css({
                            width: parentWidth,
                            height: ''
                        });
                    }else{
                        element.css({
                            height: parentHeight,
                            width: ''
                        });
                    }
                };

                style();

                element[0].addEventListener('load', style);
                window.addEventListener('resize', style);                

            }
        }
    });