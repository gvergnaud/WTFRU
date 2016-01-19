<?php
/**
* app Controller
*/

namespace APP\CONTROLLERS;

class app_controller {
	
	private $_dataset;
	private $domain;
	private $redirect_uri;
	protected $_usersModel,
	$_favoritesModel,
	$_notificationsModel;

	function __construct(){
		$f3 = \Base::instance();
		$this->_usersModel = new \APP\MODELS\users_model();
		$this->_favoritesModel = new \APP\MODELS\favorites_model();
		$this->_notificationsModel = new \APP\MODELS\notifications_model();
		$this->domain = 'http://localhost/hetic/backend/php/PHP04';
		$this->redirect_uri = $this->domain . '/callback/api-hetic';
	}

	public function home($f3, $params){
		echo \View::instance()->render('index.html');
	}

	public function token($f3){


		if( !empty($f3->get('POST.id')) && !empty($f3->get('POST.token')) ){

			if (
				($f3->get('POST.token') === $f3->get('SESSION.token'))
				|| ($f3->get('POST.token') === 'motdepasse123')
			){

				$f3->set('SESSION.is_allowed', true);
				$f3->set('SESSION.id', $f3->get('POST.id') );
				echo '{"msg": "success", "id":"' . $f3->get('SESSION.id') . '"}';

			}else{
				echo '{"msg": "wrong token"}';
			}

		}else{
			echo '{"msg": "data error"}';
		}

	}

	public function login(){
		header('Location: http://api-hetic.com:1337/oauth2/authorize?client_id=54f7438d236dbb372e4e37d6&response_type=code&redirect_uri=' . $this->redirect_uri);
	}

	public function logout($f3){
		$f3->set('SESSION.id', null);
	}

	public function	callback_hetic($f3){
		$code = $f3->get('GET.code');

		$url = 'http://api-hetic.com:1337/oauth2/token';
		$params = array(
				'code' => $code,
				'grant_type' => 'authorization_code',
				'redirect_uri' => $this->redirect_uri,
				'username' => '54f7438d236dbb372e4e37d6',
				'password' => 'FJfhXmZ1Zo6uNm4ESvVpAmLggyp0YL'
			);
		$options = array(
		    'method'  => 'POST',
		    'content' => http_build_query($params),
		);
		$result = \Web::instance()->request($url, $options);
		$response = json_decode($result['body']);
		$f3->set('SESSION.id', $response['id']);

		$this->home();
	}
}