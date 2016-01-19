<?php
// Kickstart the framework
$f3=require('lib/base.php');

session_start();

if(!$f3->get('SESSION.token')){
	$f3->set('SESSION.token', md5(uniqid(mt_rand(), true)) );
}

if(!$f3->get('SESSION.id')){
	$f3->set('SESSION.id', '');
}

// Load configuration
$f3->config('config.ini');

$f3->map('/favorites', '\APP\CONTROLLERS\favorites_controller');

$f3->map('/notifications', '\APP\CONTROLLERS\notifications_controller');

$f3->map('/users', '\APP\CONTROLLERS\users_controller');
$f3->map('/users/@id', '\APP\CONTROLLERS\users_controller');
$f3->run();
