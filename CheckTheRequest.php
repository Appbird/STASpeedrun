<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>記録一覧|Theアルティメットチョイス</title>
  <link rel="stylesheet" href="css/Constitution_pc.css">
  <link rel="stylesheet" href="css/Standard.css">
  <link rel="stylesheet" href="css/RecordDisplaytable.css">
  <link rel="stylesheet" href="css/recordDetail.css">

  <link href="https://fonts.googleapis.com/css?family=Lato:400,900" rel="stylesheet">
  <link href="https://fonts.googleapis.com/earlyaccess/notosansjapanese.css" rel="stylesheet">
  <script type="text/javascript" src="js/expand.js"></script>
  <script type="text/javascript" src="js/ajax.js"></script>
  <script type="text/javascript" src="https://platform.twitter.com/widgets.js"></script>
  <script src = "https://www.youtube.com/player_api"> </script>

  <?php
    $offerlist = json_decode(
                mb_convert_encoding(file_get_contents("./offer/offerList.json"),'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN') ,true
              );
    $EnemynameList = json_decode(
                mb_convert_encoding(file_get_contents("./Lists/EnemyNameList.json"),'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN') ,true
              );
    $offerid = $_GET['id'];
    if (array_key_exists("k".$offerid, $offerlist['offered'])){
      $Offerdata = $offerlist['offered'][ "k".$offerid ];
    }else{
      $Offerdata = null;
    };
    $TimeBounus = $EnemynameList[$Offerdata["BossName"]]["Bounus"] -  floor(  10 * ($Offerdata["Record"][0]*60.0 + $Offerdata["Record"][1] * 1.0 + $Offerdata["Record"][2] * 0.01) );

    $Time = $Offerdata['Record'];
  ?>
  <script type="text/javascript">
    var AbilitiesList, DifficultList, EnemyNameList, FriAbList, Favabilities = null;
    //Get cookie information,if the user have used cookie on this website;


    async function onload() {
      AbilitiesList = await SendRequest("Lists/AbilitiesList.json");
      DifficultList = await SendRequest("Lists/DifficultyList.json");
      EnemyNameList = await SendRequest("Lists/EnemyNameList.json");
      FriAbList = await SendRequest("Lists/FriendsAbilitiesColor.json");
      return;
    }
    function ready(){
      var Player = "<?php echo $Offerdata['Player'] ?>";
      var Ability_ja = convertAbNameToJa("<?php echo $Offerdata['Ability']?>");
      var Enemyname_ja = convertEnNameToJa("<?php echo $Offerdata['BossName']?>");
      var ApAbilities_ja = apability_jaConverter("<?php echo $Offerdata['APAbilities'] ?>");
      var Record = convertRecordAsString(JSON.parse('<?php echo json_encode($Offerdata['Record']) ?>'));
      var date = "<?php echo $Offerdata['Date'] ?>";
        document.getElementById('Record_header').innerHTML = "申請済み記録　id： + <?php echo $offerid ?> ";
        var timeAndPlayer = document.getElementById("Record_detail");
        timeAndPlayer.firstElementChild.innerHTML = Record + "<br>" + "( + <?php echo $TimeBounus; ?> pt)" ;
        timeAndPlayer.lastElementChild.textContent = Player;
        var regulation = document.getElementById('Regulation');
        regulation.firstElementChild.textContent = Enemyname_ja;
        regulation.lastElementChild.innerHTML = Ability_ja + "<br>" + ApAbilities_ja.join("<br>");

        var Medias =   JSON.parse('<?php echo json_encode($Offerdata['ID'])?>');
        var TypeOfMedia = "<?php echo $Offerdata['TypeOfMedia'] ?>";


        try {
          if(TypeOfMedia=="Twitter"){
            for (var Tweetid of Medias) {
              twttr.widgets.createTweet(Tweetid, document.getElementById("media_detail"), {height:"300px"});
            }
          }else if(TypeOfMedia=="Youtube"){
            player = new YT.Player("media_detail", {width: "100%",videoId: Medias[0],host: 'https://www.youtube.com'});

          }
        } catch {
          document.getElementById("media_detail").textContent = "エラーが発生しました。";
        }
    }

    async function SendRequest_ApprovalRecords(id,approval){
      if(confirm("記録を" + ( (approval) ? "承認" : "却下" ) + "しますか？")){
      var res = await SendRequest("php/reflecter.php?id=" + id + "&approval=" + approval );
      if (!res["result"]){
        alert(( (approval) ? "承認" : "却下" ) + "しました。このウィンドウは閉じられます。");
        window.open('about:blank','_self').close();
      }else{
        alert("動作を完了できませんでした。時間をおいてもう一度お試しください。");
        return;
      }
      }
    }
  </script>
</head>
<body onload="onload().then(function(){ready()})">

  <header>
    <ul id="SettingMenu">
</ul>
    <ul id="HeaderMenu">
      <li><a href="TheUltimateChoice.html"><img src="UIImages\Timer.png"><br>記録一覧</a></li>
      <li><a href="Runner.html"><img src="UIImages\People.png"><br>走者一覧</a></li>
      <li><a href="OfferScore.html"><img src="UIImages\Offer.png"><br>記録申請</a></li>
    </ul>
  </header>


  <!--隠れてるメニュー-->

  <!--メインページ-->
  <section id="main">

    <article id="pagebody">

        <ul class="menu">
          <li class="item_title" id="Record_header"></li>
          <li class="item_title" id="Record_detail">
            <p></p>
            <p></p>
          </li>
          <li class="item_title" id="Regulation">
            <p></p>
            <p></p>
          </li>
          <li class="item_display" id="media_detail"></li>
          <li class="item_display"></li>
          <li class="item_click" id="approval" onclick="SendRequest_ApprovalRecords(<?php echo $offerid ?>,1)"><p>承認</p></li>
          <li class="item_click" id="reject" onclick="SendRequest_ApprovalRecords(<?php echo $offerid ?>,0)"><p>却下</p></li>
        </ul>



    </article>
  </section>

</body>

</html>
