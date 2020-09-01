<?php
require_once "expand.php";

  function send_nofication($offerinfo,$id_offer){
    global $EnemynameList,$AbilitiesList;
    try{
      $URLToHostServer = loadSecretData()->URLToHostServer;
      $TimeBounus= $EnemynameList[$offerinfo["BossName"]]["Bounus"] -  floor(  10 * ($offerinfo["Record"][0]*60.0 + $offerinfo["Record"][1] * 1.0 + $offerinfo["Record"][2] * 0.01) );
      $Enemyname_ja = $EnemynameList[$offerinfo["BossName"]]["ja"];
      $Ability_ja = $AbilitiesList[$offerinfo["Ability"]]["ja"];
      post_discord(
        [
          "username"    => "Notifier",
          "content"     => "id【" . $id_offer . "】新しい記録が投稿されました！",
          "embeds"  => [
              [
              "title" =>  $Enemyname_ja . "さんが、\n" . $offerinfo['Player'] ."さんの". $Ability_ja ."によって、\n倒されました",
              "description" => "この記録が適正か確認をお願いします！",
              "url" => $URLToHostServer ."/CheckTheRequest.php?id=". $id_offer,
              "color"=> 5620992
              ]
          ]
        ] );

      }catch(PDOException $e){
        finish_program(6);
      }
  }
function post_discord($contents){
    $discordWebhooksURL = loadSecretData()->discordWebhooksURL;
    $jsonData = json_encode( $contents );
  	$ch=curl_init($discordWebhooksURL);
  	curl_setopt($ch,CURLOPT_POST,true);
  	curl_setopt($ch,CURLOPT_HTTPHEADER,array('Content-Type: application/json'));
  	curl_setopt($ch,CURLOPT_POSTFIELDS,$jsonData);
  	curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
  	curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,false);
  	$res=curl_exec($ch);
  	curl_close($ch);
  	return $res;
  }

function loadSecretData(){
  $secretInResource = fopen("./secret.json","r");
  if ($secretInResource === false) die('secret.jsonが存在しません。');
  return json_decode(fread($secretInResource,filesize("./secret.json")));

}
