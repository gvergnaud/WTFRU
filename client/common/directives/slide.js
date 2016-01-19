'use strict';

angular.module('directives.slide', [])
    .directive('slide', function() {

        return {

            restrict: 'A',

            link: function(scope, element, attrs) {




                element.on('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();

                    $('.point').removeClass('active');
                    element.addClass('active');

                    $('.slides').removeClass('active');
                    $('#slide' + attrs.slide).removeClass('after');
                    $('#slide' + attrs.slide).removeClass('before');
                    $('#slide' + attrs.slide).addClass('active');

                    if(attrs.slide == 2){
                        $('#slide1').addClass('before');
                        $('#slide3').addClass('after');
                    }else if(attrs.slide == 1){
                        $('#slide2').addClass('after');
                        $('#slide3').addClass('after');
                    }else if(attrs.slide == 3){
                        $('#slide1').addClass('before');
                        $('#slide2').addClass('before');
                    }
                });
            }
        }
    });