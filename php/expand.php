<?php

$offerlist = json_decode_fromFile("../offer/offerList.json");
$DifficultyList = json_decode_fromFile("../Lists/DifficultyList.json");
$EnemynameList  = json_decode_fromFile("../Lists/EnemyNameList.json");
$AbilitiesList  = json_decode_fromFile("../Lists/AbilitiesList.json");

function json_decode_fromXmlhttp($value){
  return json_decode(
          mb_convert_encoding($value,'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN'),true);
}
function json_decode_fromFile($pass){
  return json_decode(
              mb_convert_encoding(file_get_contents($pass),'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN') ,true);
}
function jsonfile_put_contents($pass,$array){
  return file_put_contents($pass,json_encode( $array ));
}
function get_jsonfile_record($AbilityName){
  return json_decode_fromFile( "../Records/".$AbilityName.".json" );
}
function convert_Record_to_ms(array $Record_array,$isfloat=false){
  return ($Record_array[0] * 6000 + $Record_array[1] * 100 + $Record_array[2])*(($isfloat)?0.01:1);
}
function array_last(array $array){
    return end($array);
}

function finish_program($message){
  echo $message;
  exit;
}
function console_log($value){
  error_log(print_r($value,true)."\n","3","C:\MAMP\logs\php_error.log");
}

?>
