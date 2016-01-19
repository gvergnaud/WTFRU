<?php 
/**
* Notifications Model
**/

namespace APP\MODELS;

class notifications_model extends model {

	private $_mapUser,
	$_mapNotification,
	$_mapNotificationReceiver,
	$_notificationCombined;

	public function __construct(){
	    parent::__construct();
	    //all Mappers
	    //$this->_mapUser = $this->getMapper('user');
	    $this->_mapNotification = $this->getMapper('notification');
	    $this->_mapNotificationReceiver = $this->getMapper('notification_receiver');
	    $this->_notificationCombined = new \DB\SQL\Mapper($this->dB,'notification_combined');
	}

	public function getNotifications($params){
		return $this->_notificationCombined->find(array('receiver_id=?', $params['user_id']), array(
				'order' => 'id DESC'
			)
		);
	}

	public function getHistorique($params){
		return $this->_notificationCombined->find(array('sender_id=?', $params['user_id']), array(
				'order' => 'id DESC'
			)
		);
	}

	public function postNotifications($params){
		
		$receivers = json_decode($params['receiver_id']);
		
		foreach($receivers as $receiver){

			$this->_mapNotification->reset();
			$this->_mapNotificationReceiver->reset();

			$this->_mapNotification->sender_id = $params['user_id'];
			$this->_mapNotification->sender_nom = $params['user_nom'];
			$this->_mapNotification->sender_prenom = $params['user_prenom'];
			$this->_mapNotification->sender_wifidevice = $params['user_wifidevice'];
			$this->_mapNotification->content = $params['content'];
			$this->_mapNotification->type = $params['type'];
			$this->_mapNotification->date = time();
			$this->_mapNotification->save();

			$this->_mapNotificationReceiver->notification_id = $this->_mapNotification->get('_id');
			$this->_mapNotificationReceiver->receiver_id = $receiver;
			$this->_mapNotificationReceiver->save();
		}

		//envoyer la base de la notification
		return '{"msg" : "notifications sended"}';
	}

	public function count($params){
		$count = $this->_notificationCombined ->count(array('receiver_id=? AND isViewed=?', $params['id'], 0));
		if($count == 0){
			return "{'msg': 'all notifications are viewed' }";
		}else{
			return $count;
		}
	}

	public function viewed($params){
		$notifications = $this->_notificationCombined->find(array('receiver_id=? AND isViewed=?', $params['id'], 0));
		
		if(array_key_exists('0', $notifications)){
			foreach($notifications as $notification){
				$notification->isViewed = 1;
				$notification->save();
			}
			return "{'msg': 'all notifications are viewed'}";
		}else{
			return "{'msg': 'no unreaded notifications'}";
		}
	}

}
?>