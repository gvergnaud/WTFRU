'use strict';

angular.module('directives.dragAndDrop', [
		'filters.byId'
	])
	.directive('droppable', function ($filter){

		return {

		restrict: 'A',

		scope: {
			onDrop: '=onDrop'
		},

		link: function(scope, element, attrs){
				
				element
					.droppable({
						drop: function( event, ui ) {

							if(scope.onDrop){
								// applique la function passé au ondrop
								var user = $filter('byId')(scope.$parent.map.users, scope.$parent.map.draggedUserId);
								scope.onDrop(user);
							}

							scope.$apply(function(){
								// supprime le draggedUserId
								scope.$parent.map.draggedUserId = false;
							});
						}
					});
			}
    	}
    })

    .directive('draggable', function(){

        return {

            restrict: 'A',

            link: function(scope, element, attrs){

				element
					.draggable({ 
						handle: 'img.thumbnail',
						revert: true,
						revertDuration: 1,
						containment: "[ui-view=\"main\"]"
					})

					.on( "dragstart", function( event, ui ) {
						
						// ajoute le user draggé a une variable temporaire récupérée au drop
						scope.$apply(function(){
							var data = scope.user || scope.favorite || scope.notif;
							scope.map.draggedUserId = data.favorite_id || data.sender_id || data.id;
						});

						$('#dropOverlay').fadeIn(300);
						element.parent().css({overflow: 'visible'});
						element.css({
							zIndex: 1000,
							transition: 'none'
						});

					})

					.on( "dragstop", function( event, ui ) {
						
						$('#dropOverlay').fadeOut(300);
						element.parent().css({overflow: ''});
						element.css({
							zIndex: '',
							transition: ''
						});

					})

					.on('$destroy', function(){
						$('#dropOverlay').fadeOut(300);
					});

				var thumbnail = element[0].querySelector('img.thumbnail');

				thumbnail.addEventListener('click', function(e){
					e.preventDefault();
					e.stopPropagation();
				});

				thumbnail.addEventListener('mouseenter', function(){
					element[0].classList.add('mouseOver');
				});

				thumbnail.addEventListener('mouseleave', function(){
					element[0].classList.remove('mouseOver');
				});

				thumbnail.style.cursor = '-webkit-grab';

				thumbnail.addEventListener('mousedown', function(){
					thumbnail.style.cursor = '-webkit-grabbing';
				});

				thumbnail.addEventListener('mouseup', function(){
					thumbnail.style.cursor = '-webkit-grab';
				});
            }
        }
    });