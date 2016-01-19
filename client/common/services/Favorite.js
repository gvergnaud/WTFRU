'use strict';


angular.module('services.Favorite', [
		'ngResource',
		'constants'
	])
	.factory('Favorite', function ($q, $http, $resource, SERVER) {
		// Service logic
		// ...

		var Favorite = $resource(SERVER.apiUrl + '/favorites/:id');

		var _data = {
			favorites: false
		};

		var _checkOptions = function(options){
			if(!options){
				options = {
					reload: false,
					fakeData: false
				};
			}

			return options;
		};

		// Public API here
		var Api = {


			/**
             * @name find
			 *
             * @description
             * find all favorite of the current user
             *
			 * @param {object} options - contains two boolean to know wether or not to reload data or use fakeData
			 *
             * @return {object} Promise
             */

			find: function (options) {

				options = _checkOptions(options);

				if(!options.reload && _data.favorites !== false){ //pas de rechargement

					var deferred = $q.defer();
			        deferred.resolve(_data.favorites);
					return deferred.promise;

				}else{ // rechargement des données

					var favorites;
					return favorites = Favorite.query(function(){
						_data.favorites = favorites;
					});
				}
			},



			/**
             * @name add
			 *
             * @description
             * add a user to the current user's favorites
             *
			 * @param {object} favorite - user to add to my favorites
			 *
             * @return {object} Promise
             */

			add: function(favorite){
				var deferred = $q.defer();

				Favorite.save(favorite, function(response){
					deferred.resolve(response);
				});

				return deferred.promise;
			},



			/**
             * @name remove
			 *
             * @description
             * remove a user to the current user's favorites
             *
			 * @param {object} favorite - user to remove from my favorites
			 *
             * @return {object} Promise
             */

			remove: function(favoriteId){
				var deferred = $q.defer();

				Favorite.delete({id: favoriteId}, function(response){
					deferred.resolve(response);
				});

				return deferred.promise;
			},




			/**
             * @name isFavorite
			 *
             * @description
             * return if a user is or isnt in the current user's favorites
             *
			 * @param {number} userId - id of the user
			 * @param {object} options - contains two boolean to know wether or not to reload data or use fakeData
			 *
             * @return {object} Promise
             */

			isFavorite: function(userId, options){
				options = _checkOptions(options);

				var deferred = $q.defer();

				function isFavorite(favorites){
					var BreakException = {};
					try{
						angular.forEach(favorites, function(favorite){
							if (favorite.favorite_id === userId){
								deferred.resolve();
								throw BreakException;
							}
						});
						deferred.reject();
					} catch(e) {
						if (e !== BreakException) throw e;
					}
				}

				if(!options.reload && _data.favorites !== false){ //pas de rechargement

			        isFavorite(_data.favorites);

				}else{ // rechargement des données
					Favorite.query(isFavorite);
				}

				return deferred.promise;
			}
		};

		return Api;
	});
