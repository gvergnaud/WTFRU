<?php
namespace APP\HELPERS;
use F3;

class Common {

 /**
   * Return the array of name/value pairs passed in via a PUT request.
   * 
   * If the $name paramater is provided return the value associated with the $name
   * rather than the entire array of name/value pairs.
   * 
   * @param string $name (Optional) The name (key) whose value is returned
   * @return mixed Array of name/value pairs or String value for given name
   */
  public static function getPutData($name=null) {
    $data = array();
    $body = F3::get('REQBODY');
    $pairs = explode('&', $body);

    foreach($pairs as $pair) {
      list($k, $v) = explode('=', $pair);
      $data[$k] = $v;
    }

    if(isset($name)) {
      $data = $data[$name];
    }

    return $data;
  }

}