<?php
require_once "expand.php";
require_once "webhooks.php";
if (!(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') && (!empty($_SERVER['SCRIPT_FILENAME']) && 'json.php' === basename($_SERVER['SCRIPT_FILENAME']))){
  die ('このページは直接ロードしないでください。');
}
$SentData     = json_decode_fromXmlhttp($_POST['data']);
 $BossName     = $SentData["BossName"];
 $AbilityName = $SentData["Ability_FirstPlayer"];
 array_multisort($SentData["Ability_AnotherPlayer"]);
 $APAbilities_str = implode( "," , $SentData["Ability_AnotherPlayer"] );
 $MediaObj = array();
 $originalData  = get_jsonfile_record($AbilityName)[$BossName];

 if(!Check_ShouldAdd())                 {finish_program(1);}
 if(!Check_IsEqualAuthor())             {finish_program(2);}
 if(!Check_Duplication())               {finish_program(3);}
 if(!Check_Duplication_InOffer())       {finish_program(4);}
 if(!($offerlist["How_in15mins"] < 180)){finish_program(5);}

  Add_Offer();
  finish_program(0);
/*-------------------------------------------------------------------------*/
function Check_ShouldAdd(){
  //オファーを追加するべきか判断する
  //レギュレーションごとの1位の記録と比べられる。
  //そもそもそのレギュレーションがまず存在しなかった場合はtrue
  global $APAbilities_str,$originalData,$SentData;
  if(array_key_exists($APAbilities_str,$originalData)){
  $data_d = current($originalData[$APAbilities_str]);
  return ( $SentData["Record"][0] * 6000 + $SentData["Record"][1] * 100 + $SentData["Record"][2])
                                                < ($data_d["Record"][0] * 6000 + $data_d["Record"][1] * 100 + $data_d["Record"][2]);

  }else{
    return true;
  }

}
function Check_IsEqualAuthor(){
  //著者が全員同じか確認
  global $SentData,$MediaObj;
  if ($SentData['TypeOfMedia']=="Twitter"){
  $author = "";
  $id = array();
  foreach( $SentData['Link'] as $i => $link ){
    $splited = explode("/", $link);
    if ($i==0) $author = $splited[3];
    if ($author != $splited[3]) return false;
    $id[] = explode('?',array_last($splited))[0];
  }
}else{
  $author = $SentData['Runner'];

  $id[] = explode('?',explode("/",$SentData['Link'][0])[3])[0];
}

  $MediaObj = array(
    "Author" => $author,
    "TypeOfMedia" => $SentData['TypeOfMedia'],
    "ID" => $id
  );
  return true;
}
function Check_Duplication(){
  //オファーリスト内の申請済記録のリンクと今回出された記録のリンクに重複がないか確認
  global $offerlist,$MediaObj;
  $offered = $offerlist["offered"];

  foreach($offered as $ele_host){
    if ($MediaObj['TypeOfMedia'] !== $ele_host['TypeOfMedia']) continue;
    foreach($MediaObj['ID'] as $id_sent){
    //総当たりで判定。一つでも重複があればfalse
    if (array_search($id_sent, $ele_host['ID']) !== false)return false;
  }
}
  return true;
}
function Check_Duplication_InOffer(){
  //申請内でツイートが被っていないか確認。重複があればfalse。
  global $MediaObj;
  $ary_d = $MediaObj['ID'];
  if($MediaObj['ID'] == array_unique($ary_d)) return true;
  return false;
}


function Add_Offer(){
  global $SentData,$AbilityName,$APAbilities_str,$BossName,$SentData,$MediaObj,$offerlist,$originalData;
  //オファー情報をリストに追加する
  $new_key = time()*10;
  while( array_key_exists("k".(string)$new_key,$offerlist['offered']) ){$new_key++;};

  $AddObj=array(
  "IsAlready_CertificationReply" => false,
  "Player"    => $MediaObj["Author"],
  "Ability"  => $AbilityName,
  "APAbilities"=> $APAbilities_str,
  "BossName"  => $BossName,
  "Record"    => $SentData["Record"],
  "ID"        => $MediaObj["ID"],
  "TypeOfMedia"=> $SentData['TypeOfMedia'],
  "Date"      => date("Y/n/j H:i:s")
);
  send_nofication($AddObj,$new_key);
  $offerlist["offered"]["k".(string)$new_key] = $AddObj;
  $savedData = array( "offered" => $offerlist['offered'],"How_in15mins" => $offerlist["How_in15mins"]++);
  jsonfile_put_contents("../offer/offerList.json",$savedData);
}

?>
