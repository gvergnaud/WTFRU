
'use strict';

angular.module('directives.inputTooltip', [])
	
	.directive('inputTooltip', function(){

		function isFunction(functionToCheck) {
			var getType = {};
			return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
		}

        return {

            restrict: 'A',

            scope: {
            	save: '=inputTooltip'
            },

            link: function(scope, element, attrs){

            	var isEditing = false;
            	var content;

            	function save(text){

            		if(isFunction(scope.save)){
            			scope.$apply(function(){
            				scope.save(text);
            			});
            		}

            	}

            	element.on('click', function(e){
                    e.preventDefault();
                    e.stopPropagation();
	                
                    
                    if(document.getElementById('inputContainerDirectiveElement')){
                        document.getElementById('inputContainerDirectiveElement').remove();
                    }

                    var inputContainer = angular.element('<div />');
                    inputContainer.attr('id', 'inputContainerDirectiveElement');
                    inputContainer.css({
                        position: 'absolute',
                        zIndex: 1000
                    });

                    var label = angular.element('<label />');
                    label.html(element.attr('data-start-url'));

        			var input = angular.element('<input />');
                    input.attr('placeholder', '...');
        			input.attr('type', 'url');

                    inputContainer.append(label);
                    inputContainer.append(input);
        			angular.element(document.body).append(inputContainer);
                    

                    inputContainer.css({
                    	top: element.offset().top - 70,
                    	left: element.offset().left
                    });

                    input.val(element.attr('data-url'));

                    input[0].focus();

	           		input.on('blur', function(e){
	           			e.preventDefault();
	                    e.stopPropagation();

	           			save(input.val());
                        inputContainer.remove();
	           		});

	           		input.on('keyup', function(e){
	                    e.stopPropagation();

	                    if(e.keyCode === 13){
	           				save(input.val());
                            inputContainer.remove();
	                    }

	                    if(e.keyCode === 27){
                            inputContainer.remove();
	                    }
	           		});
            	});


            }
        }
    });