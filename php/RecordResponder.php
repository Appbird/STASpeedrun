<?php
  require_once "expand.php";
/*
記録データ送信用スクリプト

【フィルタ一覧】
・走者
　runner.....指定した走者が出した記録を取得する。
・コピー能力
  ability(string)...指定したコピー能力で倒した記録を取得する(All指定で全取得。複数の場合は,で区切る)

・敵
  difficulty(int)...指定した難易度内に登場する敵を倒した記録を取得する。
  enemyname(string)....指定した敵を倒した記録を取得する。(複数の場合は,で区切る)
  (どちらも指定された際はenemynameプロパティの方が優先される。)

・フレンズ
  apability(string)...フレンズのコピーの組み合わせ(複数の場合は,で区切る)

・順位
  first_rank(int)...指定した順位からの記録を取得
  Last_rank(int)...指定した順位までの記録を取得(All指定でそこから全ての記録が返される)(基本自然数)

・取得レベル
level(int)...二段階に分かれる。
level=1　=>　コピーを早い順に並べた配列を返す。
level=2　=>　レギュレーション、順位から記録を取得する。
            取得された情報は順位通りである
level=3　=>　特定の走者の記録をすべて取得する
*/

if (!(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')&& (!empty($_SERVER['SCRIPT_FILENAME']) && 'json.php' === basename($_SERVER['SCRIPT_FILENAME']))){
  die ('このページは直接ロードしないでください。');
}
$Returndata = array();/*echo用配列*/

switch ($_GET['level']){

case 1:
$Abilities  = parseAsAbilityArray((string)$_GET['ability']);
$enemylist = (array_key_exists('enemyname', $_GET)) ? explode(",",(string)$_GET['enemyname']) : $DifficultyList[$_GET['difficulty']]["AppearBosses"];

//コピーを早い順に並べた配列を返す。
foreach ( $Abilities as $name){

  $Record_json = get_jsonfile_record($name);
  $total = 0;
  foreach( $enemylist as $Enemy){
      if (array_key_exists("Alone",$Record_json[$Enemy])){
        $total +=  convert_Record_to_ms($Record_json[$Enemy]["Alone"][0]["Record"]);
      }
  }
  if($total==0)$total=999999;
  $Returndata[] = array( 'name' => $name, 'total' => $total );
}

foreach ($Returndata as $key => $value){
  $key_id[$key] = $value['total'];
}
array_multisort ( $key_id , SORT_ASC , $Returndata);
echo json_encode($Returndata);
break;

case 2:
//指定された記録を取得する
  $Abilities    = parseAsAbilityArray((string)$_GET['ability']);
  $enemylist    = (array_key_exists('enemyname', $_GET)) ? explode(",",(string)$_GET['enemyname']) : $DifficultyList[$_GET['difficulty']]["AppearBosses"];
  $APAbility    = (string)$_GET['apability'];
  $First_rank   = $_GET['first_rank'];
  $Last_Rank    = $_GET['last_rank'];

 foreach( $Abilities as $Ability){
   $originalData  = json_decode_fromFile( "../Records/". $Ability .".json" );
   foreach ( $enemylist as $enemyname ) {

     if (! (array_key_exists($APAbility,$originalData[$enemyname])) ) continue;

       if ($Last_Rank=="All") $Last_Rank = count($originalData[$enemyname][$APAbility]);

         for ($rank = $First_rank;$rank <= $Last_Rank;$rank++) {

         //指定された順位をまとめた配列を作る。もしもデータが一切存在しなければ値をnullにする。
           if( !(array_key_exists($rank,$originalData[$enemyname][$APAbility])) )break;
            $info_onRecord = $originalData[$enemyname][$APAbility][$rank];
             $Returndata[] = array(  'Enemy'   => $enemyname,
                                     'Ability' => $Ability,
                                     'Friends' => $APAbility,
                                     'Rank'    => $rank,
                                     'Time'    => $info_onRecord['Record'],
                                     'Media'   => $info_onRecord['Media'],
                                     'TypeOfMedia'=> $info_onRecord['TypeOfMedia'],
                                     'Player'  => $info_onRecord['Player'],
                                     'Date'    => $info_onRecord['Date']
                                  );
         }
     }
   }
echo json_encode($Returndata);
break;

case 3:
//特定の走者名から記録を取得
$RunnerInfo = json_decode_fromFile("../PlayersRecords/". $_GET['runner'] .".json");
$UpdateHistory = $RunnerInfo['UpdateHistory'];

foreach ( $UpdateHistory as $info ){
      $data = get_jsonfile_record( $info['FirstP'] )[ $info['Boss'] ];

      if (!array_key_exists( $info['AnotherP'] , $data )) continue;
      $data = $data[ $info['AnotherP'] ];

      foreach($data as $rank => $unit){

        if (!($info["Date"] === $unit["Date"]))continue;
        if ( (array_key_exists('ability', $_GET) ) && ( $_GET['ability']  != $info['FirstP'] ) ) continue;

          $Returndata[] = array(  'Enemy'   => $info['Boss'],
                                  'Ability' => $info['FirstP'],
                                  'Friends' => $info['AnotherP'],
                                  'Rank'    => $rank,
                                  'Time'    => $unit['Record'],
                                  'Player'  => $unit['Player'],
                                  'Media'   => $unit['Media'],
                                  'TypeOfMedia' => $unit['TypeOfMedia'],
                                  'Date' => $unit['Date']
                                );
      }
}
echo json_encode($Returndata);
break;
}



function parseAsAbilityArray($str){
  global $AbilitiesList;
    return (($str == 'All') ? array_keys($AbilitiesList):explode(',', $str));

}


 ?>
