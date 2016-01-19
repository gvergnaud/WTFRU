'use strict';

angular.module('WTFRU.map.send', [
		'ui.router'
	])

	.config(function ($stateProvider) {

		$stateProvider
			.state('map.send', {
				url: '/send/:type',
				views: {
					'send': {
						templateUrl: 'client/app/map/send/send.html',
						controller: 'sendCtrl',
						controllerAs: 'send'
					}
				}
			})
	})

	.controller('sendCtrl', function ($scope, $stateParams) {
		var timeout;
		var interval;

		var that = this;

		that.maxMsgLength = 33;

		// Content
		//WTFRU
		if($stateParams.type === 'wtfru'){
			that.title = 'Where The F#ck Are You?!';
			that.iconClass = 'icon-wtfru';
			that.isInput = true;
		}

		//COG
		else if($stateParams.type === 'cog'){
			that.title = 'Come On Guys!';
			that.iconClass = 'icon-cog-1';
			that.isInput = true;
		}

		//HERE
		else if($stateParams.type === 'here'){
			that.title = 'I\'m Here!';
			that.iconClass = 'icon-here-1';
			that.isInput = false;
		}

		//OMW
		else if($stateParams.type === 'omw'){
			that.title = 'On My Way!';
			that.iconClass = 'icon-imomw';
			that.isInput = false;
		}

		that.sendNotif = function(){
			document.removeEventListener('keyup', onKeyup, false);
			if(interval)
				clearInterval(interval);

			$scope.app.notifications.send();
			$scope.app.go('map');
		}

		that.cancel = function(){
			document.removeEventListener('keyup', onKeyup, false);
			$scope.app.notifications.destroy();
			$scope.app.go('map');
		}

		function onKeyup(e){

			if(e.keyCode === 13){ //ENTER
				clearTimeout(timeout);
				that.sendNotif();
			}
			else if(e.keyCode === 27){ //ESCAPE
				clearTimeout(timeout);
				that.cancel();
			}
		}

		document.addEventListener('keyup', onKeyup, false);


		if($stateParams.type === 'wtfru' || $stateParams.type === 'cog'){
			var input = document.querySelector('#msgInput');

			input.addEventListener('keyup', function(e){
				e.stopPropagation();

				if(e.keyCode === 13){
					if(input.value){
						if(input.value.length <= that.maxMsgLength){
							$scope.app.notifications.addMessage(input.value);
							that.sendNotif();
						}
					}else{
						that.sendNotif();
					}
				}

				else if(e.keyCode === 27){
					that.cancel();
				}
			});

			setTimeout(function(){
				input.focus();
			}, 100);
		}

		else if($stateParams.type === 'here' || $stateParams.type === 'omw'){
			// Compte à rebours, send et redirection vers map
			that.countDown = 3;

			timeout = setTimeout(that.sendNotif, 3000);

			interval = setInterval(function(){
				that.countDown -= 1;
				$scope.$apply();
			}, 1000);
		}


	});
