<?php
/**
* Notifications Controller
*/

namespace APP\CONTROLLERS;

class notifications_controller extends app_controller{

	private $_data;

	public function __construct(){
		parent::__construct();
	}

	public function historique($f3){
		$this->_data = $this->_notificationsModel->getHistorique(array('user_id'=>$f3->get('SESSION.id')));
	}
	
	public function get($f3){
		$this->_data = $this->_notificationsModel->getNotifications(array('user_id'=>$f3->get('SESSION.id')));
	}

	public function post($f3){
		if(		$f3->get('POST.user_nom')
			&& 	$f3->get('POST.user_prenom')
			&& 	$f3->get('POST.receiver_id')
			&& 	$f3->get('POST.type')
		){
			$this->_data =  $this	->_notificationsModel
									->postNotifications(
										array(
											'user_id'=>$f3->get('SESSION.id'),
											'user_nom'=>$f3->get('POST.user_nom'),
											'user_prenom'=>$f3->get('POST.user_prenom'),
											'user_wifidevice'=>$f3->get('POST.user_wifidevice'),
											'receiver_id'=>$f3->get('POST.receiver_id'),
											'content'=>$f3->get('POST.content'),
											'type'=>$f3->get('POST.type')
										)
									);	
		}else{
			$this->_data = '{"msg" : "no datas"}';
		}
	}

	public function count($f3){
		$this->_data = intval($this->_notificationsModel->count(array('id'=>$f3->get('SESSION.id'))));
	}

	public function viewed($f3){
		$this->_data =  $this->_notificationsModel->viewed(array('id'=>$f3->get('SESSION.id')));
	}

	public function beforeroute($f3){
		if(!$f3->get('SESSION.is_allowed')){
			die('{ "msg" : "not allowed" }');
		}
	}
	
	public function afterroute($f3){

		if(isset($this->_data)){
			
			if(is_array($this->_data)){
				$this->_data = array_map(function($data){
					return $data->cast();

				}, $this->_data);
			}elseif(is_object($this->_data)){
				$this->_data = $this->_data->cast();
			}

			echo json_encode($this->_data);
		}

	}

}