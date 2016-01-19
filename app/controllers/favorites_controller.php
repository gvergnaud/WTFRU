<?php
/**
* Favorites Controller
*/

namespace APP\CONTROLLERS;

class favorites_controller extends app_controller{

	private $_data;

	function __construct(){
		parent::__construct();

	}
	
	public function get($f3){
		$this->_data = $this->_favoritesModel->getFavorites(array('user_id'=>$f3->get('SESSION.id')));
	}

	public function post($f3){
		if($f3->get('POST.favorite_id') && $f3->get('POST.nom') && $f3->get('POST.prenom')){
			$this->_data = $this->_favoritesModel->addFavorite(
				array(
					'user_id'=>$f3->get('SESSION.id'),
					'favorite_id'=>$f3->get('POST.favorite_id'),
					'nom'=>$f3->get('POST.nom'), 
					'prenom'=>$f3->get('POST.prenom')
				)
			);
		}else{
			$this->_data = array('msg' => 'no data in post');
		}
	}

	public function delete($f3, $params){
		if(isset($params['id'])){
			$this->_data = $this->_favoritesModel->deleteFavorite(array('user_id'=>$f3->get('SESSION.id'), 'favorite_id'=>$params['id'])); 
		}else{
			$this->_data = array('msg' => 'missing id');
		}
	}

	public function beforeroute($f3){
		if(!$f3->get('SESSION.is_allowed')){
			die('{ "msg" : "not allowed" }');
		}
	}

	public function afterroute($f3){
		if(isset($this->_data)){

			if(!isset($this->_data['msg'])){
			//si data n'est pas un message
				if(is_array($this->_data)){
					$this->_data = array_map(function($data){
						return $data->cast();

					}, $this->_data);
				}elseif(is_object($this->_data)){
					$this->_data = $this->_data->cast();
				}
			}

			echo json_encode($this->_data);
		}
	}

}