'use strict';


angular.module('services.Socket', [
		'constants'
	])
	.factory('Socket', function (SERVER) {

		// Private
		var _socket = false;

		var _init = function(){
            _socket = io.connect(SERVER.socketsUrl);  //
        };

		// Public API here
		var Socket = {

			/**
             * @name on
			 *
             * @description
             * register a new callback to execute on a custom event from the websocket connection
             *
			 * @param {string} event - event name
			 * @param {function} callback - function to execute
			 *
             */

			on: function (event, callback) {
				if(!_socket) _init();

				_socket.on(event, callback);
			},


			/**
             * @name emit
			 *
             * @description
             * trigger an event on the websocket connection
             *
			 * @param {string} event - event name
			 * @param {object} data - data to send to the server
			 *
             */

			emit: function (event, data){
				if(!_socket) _init();

				_socket.emit(event, data);
			}

		};

		return Socket;
	});
