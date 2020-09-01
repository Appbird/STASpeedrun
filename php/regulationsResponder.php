<?php
  require_once "expand.php";
/*
記録データ送信用スクリプト
ability...必要なデータのコピー能力の種類(string)
enemy...取得するレギュレーションの敵の名前
*/
if (!(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')&& (!empty($_SERVER['SCRIPT_FILENAME']) && 'json.php' === basename($_SERVER['SCRIPT_FILENAME']))){
  die ('このページは直接ロードしないでください。');
}

 $AbilityName   = (string)$_GET['ability'];
 $enemyName    = (string)$_GET['enemy'];
 $originalData  = json_decode_fromFile( "../Records/".$AbilityName.".json" )[$enemyName];
echo json_encode(array_keys($originalData));
