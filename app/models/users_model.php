<?php 
/**
* User Model
**/

namespace APP\MODELS;

class users_model extends model {
	private $_mapUser;

	public function __construct(){
	    parent::__construct();
	    $this->_mapUser = $this->getMapper('user');
	}

	public function getUser($params){
		$user = $this->_mapUser->load(array('id=?', $params['id']));
		if(is_numeric($params['id'])){
			if($user){
				return $this->_mapUser->load(array('id=?', $params['id']));
			}else{
				return 'user don t exist';
			}
		}else{
			return false;
		}
		
	}

	public function getUsers(){
		return $this->_mapUser->find();
	}

	public function postMe($params){
		$user = $this->_mapUser->load(array('id=?', $params['id']));
		$map = $this->_mapUser;
		if(!$user){
			if(	isset($params['id'])
				&& isset($params['nom'])
				&& isset($params['prenom'])
				&& isset($params['mail']))
			{
				$map->id = $params['id'];
				$map->nom = $params['nom'];
				$map->prenom = $params['prenom'];
				$map->mail= $params['mail'];

				$this->_mapUser->save();
				return '{"msg": "user added"}';
			}else{
				return '{"msg": "no data"}';
			}
		}else{
			
			if(	isset($params['citation'])
				|| isset($params['website'])
				|| isset($params['github'])
				|| isset($params['behance'])
				|| isset($params['twitter'])
				|| isset($params['dribbble'])
				|| isset($params['ghost_at'])
				|| isset($params['slack_id']))
			{
				if(isset($params['citation'])){
					$user->citation = $params['citation'];
				}
				if(isset($params['website'])){
					$user->website = $params['website'];
				}
				if(isset($params['github'])){
					$user->github = $params['github'];
				}
				if(isset($params['behance'])){
					$user->behance = $params['behance'];
				}
				if(isset($params['dribbble'])){
					$user->dribbble = $params['dribbble'];
				}
				if(isset($params['twitter'])){
					$user->twitter = $params['twitter'];
				}
				if(isset($params['ghost_at'])){
					$user->ghost_at = $params['ghost_at'];
				}
				if(isset($params['slack_id'])){
					$user->slack_id = $params['slack_id'];
				}
				
				$user->save();
				return '{"msg":"user updated"}';
			}else{
				return '{"msg":"no data"}';
			}
		}
	}
}