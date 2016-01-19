<?php
class Slack{
	private $options = [
		'client_id'=>'',
		'client_secret'=>''
	],
	$endpoint = 'https://slack.com/api/oauth.access?',
	$message = 'https://slack.com/api/rtm.start?';

	public function __construct($options)
	{
		$this->options = array_merge($this->options, $options);
	}

	public function getAccess($code)
	{
		try{
			$curl = curl_init($this->endpoint."client_id={$this->options['client_id']}&client_secret={$this->options['client_secret']}&code=$code");
			curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 3);
			curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

			$data = curl_exec($curl);
		}catch(Exception $e){
			throw new Exception($e->getMessage());
		}
		$json= json_decode($data);

		if($json->ok != true){
			throw new Exception($json->error);
		}

		return $json->access_token;
	}

	public function me($token){
		try{
			$curl = curl_init($this->message."token=$token");
			curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 3);
			curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

			$data = curl_exec($curl);
		}catch(Exception $e){
			throw new Exception($e->getMessage());
		}
		$json= json_decode($data);

		return $json;
	}
}