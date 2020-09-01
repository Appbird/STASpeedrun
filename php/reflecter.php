<?php
require_once "expand.php";
require_once "webhooks.php";
  //記録をデータベースに反映する。
  $offerid = $_GET['id'];
if((boolean)$_GET['approval']){
  $Offerdata = $offerlist['offered'][ "k".$offerid ];
  $BossName=$Offerdata["BossName"];
  $ApAbilities =$Offerdata["APAbilities"];
  $savedData  = json_decode_fromFile( "../Records/".$Offerdata['Ability'].".json" );
  if(!array_key_exists( $ApAbilities,$savedData[$BossName]))$savedData[$BossName][$ApAbilities]=array();

  array_unshift($savedData[$BossName][$ApAbilities],
  array(
    "Record" => $Offerdata["Record"],
    "Media"=> $Offerdata["ID"],
    "TypeOfMedia" => $Offerdata["TypeOfMedia"],
    "Player" => $Offerdata["Player"],
    "Date" => $Offerdata['Date']
  )
);
jsonfile_put_contents("../Records/".$Offerdata['Ability'].".json",$savedData);
$savedData_runner  = (file_exists("../PlayersRecords/".$Offerdata['Player'].".json")) ?
                json_decode_fromFile( "../PlayersRecords/".$Offerdata['Player'].".json" ) :
                  array("ShortingSec"=>0.0,"ShortingTime_total"=>0,"UpdateHistory"=>array());
      $savedData_runner["ShortingTime_total"]++;

      if(array_key_exists(0,$savedData[$BossName][$ApAbilities]))$savedData_runner["ShortingSec"] +=
       ( convert_Record_to_ms($savedData[$BossName][$ApAbilities][0]['Record']) - convert_Record_to_ms($Offerdata["Record"]) );

array_unshift($savedData_runner["UpdateHistory"],
array(
  "FirstP" => $Offerdata["Ability"],
  "AnotherP"=> $Offerdata["APAbilities"],
  "Boss" => $BossName,
  "Date" => $Offerdata['Date']
)
);
jsonfile_put_contents("../PlayersRecords/".$Offerdata['Player'].".json",$savedData_runner);
}
unset($offerlist['offered'][ "k".$offerid ]);
jsonfile_put_contents("../offer/offerList.json",$offerlist);
echo json_encode(array("result" => 0));
$Enemyname_ja = $EnemynameList[$Offerdata["BossName"]]["ja"];
$Ability_ja = $AbilitiesList[$Offerdata["Ability"]]["ja"];
post_discord(
  array(
    "username"    => "Notifier",
    "embeds"  => array(
      array(
        "title" =>  "id【" . $offerid . "】記録が". (($_GET['approval']) ? "承認":"却下")."されました",
        "color" => ($_GET['approval']) ? 4359924: 16729663
         )
       )
  ) );


 ?>
