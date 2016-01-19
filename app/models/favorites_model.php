<?php 
/**
* Favorites Model
**/

namespace APP\MODELS;

class favorites_model extends model {

	function __construct(){
	    parent::__construct();
	}

	public function getFavorites($params){

		return $this->getMapper('favorite')->find(array('user_id=?', $params['user_id']));
	}

	public function addFavorite($params){
		//mapping to favorite
		$map = $this->getMapper('favorite');
		//verification if the favoritealready exist
		$favorite=$map->load(array('favorite_id=? and user_id=?',$params['favorite_id'],$params['user_id']));

		if(!$favorite){
			//insert all data in Db
			$map->user_id=$params['user_id'];
			$map->favorite_id=$params['favorite_id'];
			$map->nom=$params['nom'];
			$map->prenom=$params['prenom'];
			//Save the data
			$map->save();
			//return true
			return array('msg' => 'success');
		}else{
			//If the favorite already exist
			return array('msg' => 'already exist');
		}

	}

	public function deleteFavorite($params){
		$map = $this->getMapper('favorite');
		$favorite=$map->load(array('favorite_id=? and user_id=?', $params['favorite_id'],$params['user_id']));
		if($favorite){
			$favorite->erase();
			return array('msg' => 'success');
		}else{
			return array('msg' => 'doesn\'t exist in your favorites');
		}
	}
}
?>