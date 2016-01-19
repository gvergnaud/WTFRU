<?php

namespace APP\MODELS;

class model{
  
protected $dB;
  
  function __construct(){
    $this->dB = new \DB\SQL('mysql:host=127.0.0.1;dbname=WTFRU', 'root', '');
  }
  
  function getMapper($table){
        return new \DB\SQL\Mapper($this->dB,$table);
  }
  
  
  
  
}

?>