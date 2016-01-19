//Model
'use strict';


angular.module('services.Slack', [])
	.factory('Slack', function ($rootScope, $http, $location) {

		// Private
		var helper = 'client/app/helpers/slack/SlackConnect.php',
		history = 'https://slack.com/api/im.history';



		// Public API here
		var Slack = {
			socket: null,
			token:function(callback){
				//Get le code dans l'Url avant l'arrivée de auth
				var urlLocation = location.search;
				if(urlLocation){
					var getCode = urlLocation.match(/[0-9]|\.|[a-z, A-Z]/g).join('').split('code');
					var code = getCode[1].split('state');
					//post le code au helper slack
					$http.post(helper, { 'code' : code[0]})
			            .success(function (data, status){
			            	callback.call(this, data);
			            })
			            .error(function (data, status){
			        		return false;
			            });
				}
			},

			me:function(token, callback){;
				$http.post(helper, {'token': token})
				 	.success(function (data, status){
		            	callback.call(this, data);
		            })
		            .error(function (data, status){
		        		return false;
		            });
			},

			rtm:function(response, callback){
				//adding datas to Slack.me
				Slack.me = response;
				//connection to the socket
				var socket = Slack.socket = new WebSocket(response.url);
				//socket Event
				socket.onopen = function(e){callback.call(this)};
				socket.onmessage = Slack.onmessage;
				socket.onclose = function(evt) { alert("Connection closed."); };
				socket.onerror = function(evt) { alert("WebSocket error : " + e.data) };
			},

			onmessage:function(e){
				//Event datas
				var data = JSON.parse(e.data);
				//Cases
				switch(data.type){
					case 'hello':
						//console.log(Slack.me.self);
						break;
					case 'message':
							//Envoie de l'event response
							//console.log(e);
							$rootScope.$emit('response', data);
						break;
				}
			},

			send:function(data){
				Slack.socket.send(data);
			},

			get:function(token, id, callback){
				$http.get(history+'?token='+token+'&channel='+id+'&count=50')
				 	.success(function (data, status){
		            	callback.call(this, data);
		            })
		            .error(function (data, status){
		        		return false;
		            });
			},

			getLast:function(token, id, callback){
				if(typeof id == 'string'){
				var url = history+token+'&channel='+id+'&count=1';
				$http.get(history+'?token='+token+'&channel='+id)
				 	.success(function (data, status){
		            	callback.call(this, data);
		            })
		            .error(function (data, status){
		        		return false;
		            });
				}else{
					return 'No valid channel';
				}
			},

			whoIs:function(id){
				return JSON.search(Slack.me, '//ims[user="'+id+'"]/id');
			}
		};
		//si le token n'est pas présent
		if(!localStorage.getItem('slackToken')){
			//Vérifier si le code a été envoyer à chaque démarrage de page
			Slack.token(function(data){
				switch (data){
            		case '':
            		break;
            		default:
            			localStorage.setItem('slackToken', data);
            	}
			});
		};

		return Slack;
	});
/**Créer une variable de verification de Slack.me.self.id pour la class .me*/
/**Envoyer le slack ID dans la base afin de le recuperer POSt*/
//Récupere l'id du conversant
//Verifier s'il y a un id slack
//installer defiantjs
//La fonction whois
//Les notifications
/***créer une belle fenetre de conversation avec les photos*/
//ajout de loader
//créer le scroll
