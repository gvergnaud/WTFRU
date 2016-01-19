//Controller
'use strict';

angular.module('WTFRU.map.usercard.slack', [
		'ui.router',
		'services.Slack',
		'directives.scrollOnMessage'
	])

	.config(function ($stateProvider) {
		
		$stateProvider
			.state('map.usercard.slack', {
				url: '/slack',
				views: {
					'slack': {
						templateUrl: 'client/app/map/usercard/slack/slack.html',
						controller: 'slackCtrl'
					}
				}
			});
	})

	.controller('slackCtrl', function ($rootScope, $scope, Slack) {
		var slack_id = $scope.user.slack_id;
		if(slack_id){
			var channel = Slack.whoIs(slack_id);
		}else{
			var channel = [];
		}
		//récuperation du token slack
		var noSlack = {text: 'Désolé je n\'ai pas autorisé l\'API Slack'};
		var token = localStorage.getItem('slackToken');
		var messages = [];

		if(channel){
			Slack.get(token, channel[0], function(data){
				$scope.messages = data.messages;
			});
			
		}else{
			messages.push(noSlack)
			$scope.messages = messages;
		}

		//Si absence du token
		$scope.isSlack = function(){
			return !token;
		};

		//Events
		document.querySelector('#slack').classList.toggle('open');
		document.querySelector('#slack').addEventListener('click', function(e){
			e.stopPropagation();
		});
		//Envoie de 
		$scope.send = function(){
			if(this.msg){
				var json = {
				    "type": "message",
				    "channel": channel[0], //channel, variable
				    "text": this.msg,
				    "user" : Slack.me.self.id
				}
				if(slack_id){
					Slack.send(JSON.stringify(json));
					Slack.getLast(token, channel[0], function(data){
						$scope.messages = data.messages;	
					});
				}else{
					messages.push(noSlack)
					$scope.messages = messages;
				}
				document.querySelector('#input').value = '';

			}
		}

		$scope.date = function(date){
			var array = date.split('.');
			return array[0];
		};
		//récupération de l'event reponse
		$rootScope.$on('response', function(e, data){
			Slack.getLast(token, channel[0], function(data){
				$scope.messages = data.messages;

				/*if($scope.messages.user != slack_id){
					console.log(data.messages);
					$scope.app.notifications.create('SLACK', $scope.app.me.user.id);
					$scope.app.notifications.send();
				}*/
			});
		});
	});