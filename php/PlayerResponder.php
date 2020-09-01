<?php
require_once "expand.php";
/*
プレイヤーごとの記録一覧を取得。
level...三段階の取得レベルに分かれている
      1 > 全ての走者の名前を取得
      2 > 特定の走者のデータから必要な情報を入手
          runner(string)...走者名
      3 > 特定の走者が走ったデータを特定の一つのレギュレーションデータべ―スから取り出す
  */

  $returndata = array();
  $dir = '../PlayersRecords/';

      $filelist = glob( $dir . "*.json" );
      foreach($filelist as $file){
        $runner = explode(".", explode("/", $file)[2] )[0];
        $value = json_decode_fromFile("../PlayersRecords/". $runner .".json");
        if(is_file($file)){
            $returndata[] = array('name' => $runner,
            'ShortingTime' =>$value["ShortingTime_total"],
            'ShortingTimeSec' => $value["ShortingSec"]
          );

        }
      }

echo json_encode($returndata);




 ?>
