<?php
require('Slack.php');

$Slack = new Slack([
		'client_id'=>'3760872023.3763031462',
		'client_secret'=>'52690cf68c50885a85d187bbba4a5d57'
	]);

if(isset($_POST['code'])){

	try{
		$token = $Slack->getAccess($_POST['code']);
	}catch(Exception $e){
		//die($e->getMessage());
		
		//renvoyer un chaine vide
		return false;
	}
	if(isset($token)){
		
		print_r($token);
		
	}
}else if(isset($_POST['token'])){
	$user = $Slack->me($_POST['token']);
	print_r(json_encode($user));
}else{
	return 'slack.php';
}


?>