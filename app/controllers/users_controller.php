<?php
/**
*	Users Controller
**/

namespace APP\CONTROLLERS;

class users_controller extends app_controller{
	private $_data,
		$_api_hetic_url = 'http://api-hetic.com:1337';

	public function __construct(){
		parent::__construct();
	}

	public function get($f3, $params){
		if(empty($params['id'])){
			$this->_data = $this->_usersModel->getUsers();
		}else{
			$this->_data = $this->_usersModel->getUser(array('id'=>$params['id']));
		}
	}

	public function get_me($f3){
		$this->_data = $this->_usersModel->getUser(array('id'=>$f3->get('SESSION.id')));;
	}

	public function post_me($f3){
		$this->_data = $this->_usersModel->postMe(
			array(
				'id'=>$f3->get('SESSION.id'),
				'nom'=> $f3->get('POST.nom'),
				'prenom'=> $f3->get('POST.prenom'),
				'ghost_at'=> $f3->get('POST.ghost_at'),
				'citation'=> $f3->get('POST.citation'),
				'mail'=> $f3->get('POST.mail'),
				'website'=> $f3->get('POST.website'),
				'twitter'=> $f3->get('POST.twitter'),
				'behance'=> $f3->get('POST.behance'),
				'dribbble'=> $f3->get('POST.dribbble'),
				'github'=> $f3->get('POST.github'),
				'slack_id'=>$f3->get('POST.slack_id')
			));
	}

	public function get_hetic_users(){
		header('Content-Type: application/json');

		$url = $this->_api_hetic_url . '/users';
		$params = array();
		$options = array('method' => 'GET');
		$url .= '?'.http_build_query($params);

		$result = \Web::instance()->request($url, $options);
		echo $result['body'];
	}

	public function get_hetic_skills(){
		header('Content-Type: application/json');

		$url = $this->_api_hetic_url . '/skills';
		$params = array();
		$options = array('method' => 'GET');
		$url .= '?'.http_build_query($params);

		$result = \Web::instance()->request($url, $options);
		echo $result['body'];
	}

	public function beforeroute($f3){
		if(!$f3->get('SESSION.is_allowed')){
			die('{ "msg" : "not allowed" }');
		}
	}
	
	public function afterroute($f3){

		if(isset($this->_data)){
			if(!isset($this->data['msg'])){
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