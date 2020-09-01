function onYouTubeIframeAPIReady() {

}
async function DetailDisplay(abilityName, enemyName, rank, friends, needRequest) {
  ChangeEnebleSetting('detail')
  addElements_item_li(abilityName, enemyName);
  URL_targetChange("display_detail");
  rank = parseInt(rank);
  var div_dit = document.getElementById("Record_detail");
  var div_reg = document.getElementById("Regulation");

  if (needRequest) {
    history_obj = await SendRequest("php/RecordResponder.php?" +
      "level=2&ability=" + abilityName + "&enemyname=" + enemyName +
      "&apability=" + friends + "&first_rank=0&last_rank=All"
    );
  }
  //追加するべき要素を生成。その後Tweetのリンクを張り付けるなどする
  div_dit.firstElementChild.innerHTML = rankstr_add(rank + 1) + " " + convertRecordAsString(history_obj[rank]["Time"]);
  div_dit.lastElementChild.innerHTML = history_obj[rank]["Player"];

  var anotherPlayers_ja = apability_jaConverter(friends);
  div_reg.firstElementChild.innerHTML = convertAndTobr(convertEnNameToJa(enemyName));
  div_reg.lastElementChild.innerHTML = convertAbNameToJa(abilityName) + "<br>" + anotherPlayers_ja.join("<br>");


  if (needRequest) addElements_history(rank);

  var Medias = history_obj[rank]['Media'];
  var TypeOfMedia = history_obj[rank]['TypeOfMedia'];
  document.getElementById("media_detail").textContent = "";
  //ツイートを取得する
  try {
    if(TypeOfMedia=="Twitter"){
      for (var Tweetid of Medias) {
        twttr.widgets.createTweet(Tweetid, document.getElementById("media_detail"), {height:"300px" });
      }
    }else if(TypeOfMedia=="Youtube"){
      player = new YT.Player("media_detail", {width: "100%",videoId: Medias[0],host: 'https://www.youtube.com'});

    }
  } catch {
    document.getElementById("media_detail").textContent = "エラーが発生しました。";
  }

  div_dit.parentNode.parentNode.style.display = "block";

}
//項目の変更だけ行う
function DetailDisplay_ChangeRank(abilityName, rank, friends, Medias,TypeOfMedia, player) {
  rank = parseInt(rank);
  console.log(abilityName + rank + friends + Medias + player);
  var div_dit = document.getElementById("Record_detail");
  var div_reg = document.getElementById("Regulation");

  //変更が必要な項目を変化させる
  div_dit.firstElementChild.innerHTML = rankstr_add(rank + 1) + " " + convertRecordAsString(history_obj[rank]["Time"]);
  div_dit.lastElementChild.innerHTML = player;
  var anotherPlayers_ja = apability_jaConverter(friends);
  div_reg.lastElementChild.innerHTML = convertAbNameToJa(abilityName) + "<br>" + anotherPlayers_ja.join("<br>");

  document.getElementById("media_detail").textContent = "";
  addElements_history(rank);
  //もう一度ツイートを取得する
    if(TypeOfMedia=="Twitter"){
      for (var Tweetid of Medias) {
        twttr.widgets.createTweet(Tweetid, document.getElementById("media_detail"), {});
      }
    }else if(TypeOfMedia=="Youtube"){
      player = new YT.Player("media_detail", {width: "100%",videoId: Medias[0],host: 'https://www.youtube.com'});
    }
}

function addElements_history(rank) {
  //歴代記録を載せる
  var div = document.getElementById("displayhistory");
  div.textContent = "";
  div.appendChild(
    CreateListTable(['Rank', 'Time', "Player", "Date"], history_obj, "Change_only", rank)
  );

}

async function addElements_item_li(abilityName, enemyName) {

  //レギュレーション選択画面に適当なレギュレーションを追加する。(存在するレギュレーションを選択項目に追加)
  var div = document.getElementById("anotherFriends");
  if (div) {
    div.textContent = "";
    var regulations = await SendRequest("php/regulationsResponder.php?" +
      "ability=" + abilityName + "&enemy=" + enemyName
    );
    for (var regulation of regulations) {
      var insertedele = CreateDOM('li', "", "item_click");
      ((a, b, d) => {
        insertedele.addEventListener("click", function() {
          DetailDisplay(a, b, 0, d, true);
        });
      })(abilityName, enemyName, regulation);
      insertedele.innerHTML = apability_jaConverter(regulation).join("&");
      div.appendChild(insertedele);
    }
  }
}
