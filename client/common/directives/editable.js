'use strict';

angular.module('directives.editable', [])
	
	.directive('editable', function(){


		function escapeHtml(text) {
			var map = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#039;'
			};

			return text.replace(/[&<>"']/g, function(m) { return map[m]; });
		}

		function isFunction(functionToCheck) {
			var getType = {};
			return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
		}


        return {

            restrict: 'A',

            scope: {
            	save: '=editable'
            },

            link: function(scope, element, attrs){

            	var isEditing = false;
            	var content;

            	function save(text){
            		var escapedText = text ? escapeHtml(text) : '"Rien n\'est fait tant qu\'il reste encore à faire"';
            		element.html( escapedText );

            		if(isFunction(scope.save)){
            			scope.$apply(function(){
            				scope.save(text);
            			});
            		}

	                isEditing = false;
            	}

            	function cancel(){
                   element.html(content);
                   isEditing = false;
            	}
            	
            	element.on('click', function(e){
                    e.preventDefault();
                    e.stopPropagation();

            		var input = angular.element('<input />');

                    if(!isEditing){
                    	// on savegarde ce qu'il y avait dans notre elemnt
                    	content = element.html();

	                    element.html(input.val(element.html()));
	                    input[0].focus();
	                    isEditing = true;
                    }

	           		input.on('blur', function(e){
	           			e.preventDefault();
	                    e.stopPropagation();
	           			save(input.val());
	           		});

	           		input.on('keyup', function(e){
	                    e.stopPropagation();

	                    if(e.keyCode === 13){
	           				save(input.val());
	                    }

	                    if(e.keyCode === 27){
	                    	cancel();
	                    }
	           		});
            	});

            }
        }
    });