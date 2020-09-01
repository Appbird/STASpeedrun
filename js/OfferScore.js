function Init() {
  var BossList = document.getElementById("BossName");
  var AbbFPList = document.getElementById("Abbility_FirstPlayer");
  var AbbCPList = document.getElementsByClassName("Abbility_AnotherPlayer");

  BossList.textContent = "";
  //ボスの一覧リストの要素の挿入
  for (var i in EnemyNameList) {
    BossList.insertAdjacentHTML("beforeend", '<option value="' + i + '">' + EnemyNameList[i]["ja"] + '</option>');
  }

  AbbFPList.textContent = "";
  AbbCPList.textContent = "";
  //コピー能力リストの要素の挿入
  for (var i in AbbilitesList) {
    AbbFPList.insertAdjacentHTML("beforeend", '<option value="' + i + '">' + AbbilitesList[i]["ja"] + '</option>');
    for (var k of AbbCPList) {
      k.insertAdjacentHTML("beforeend", '<option value="' + i + '">' + AbbilitesList[i]["ja"] + '</option>');
    }
  }
  //無名項目の挿入

  AbbCPList[0].insertAdjacentHTML("afterbegin", '<option value="Alone" selected>ひとりで</option>');
  AbbCPList[1].insertAdjacentHTML("afterbegin", '<option value="" selected>None</option>');
  AbbCPList[2].insertAdjacentHTML("afterbegin", '<option value="" selected>None</option>');

}

function check_entered(ele){
  if( ele.value=="Alone" )return;
  ele.nextElementSibling.style.display = "block";
}

function check_IsCollectURL(ele) {
  var state = State_EnteredLink(ele.parentNode);
  switch (state) {
    case "Twitter":
      if (ele.nextElementSibling) ele.nextElementSibling.style.display = "block";
      p_error[0].style.color = "#000"
      p_error[0].textContent = "TwitterのURLです。"
      document.getElementById('YoutubeURLOnly').style.display = "none";
      break;
    case "Youtube":
      if (ele.nextElementSibling) ele.nextElementSibling.style.display = "none";
      p_error[0].style.color = "#000"
      p_error[0].textContent = "Youtubeのリンクです。"
      document.getElementById('YoutubeURLOnly').style.display = "block";
      break;
    case "JamURLs":
      if (ele.nextElementSibling) ele.nextElementSibling.style.display = "none";
      p_error[0].style.color = "#ff0000"
      p_error[0].textContent = "Error:違う種類のリンクを混同していませんか？"
      document.getElementById('YoutubeURLOnly').style.display = "none";
      break;
    case "IsNotCollectTweetURL":
      if (ele.nextElementSibling) ele.nextElementSibling.style.display = "none";
      p_error[0].style.color = "#ff0000"
      p_error[0].textContent = "Error:正しいツイートのURLを入力してください。"
      document.getElementById('YoutubeURLOnly').style.display = "none";
      break;

    default:
      p_error[0].style.color = "#ff0000"
      if (ele.nextElementSibling) ele.nextElementSibling.style.display = "none";
      p_error[0].textContent = "Error:正しいYoutube/TweetへのURLを入力してください。"
      document.getElementById('YoutubeURLOnly').style.display = "none";
      break;
  }

}

function State_EnteredLink(par) {
  var StateLink = [];
  for (var i = 0; i < 5; i++) {
    var splited = par.children[i].value.split("/");
    if (par.children[i].value == "") continue;
    switch (splited[2]) {
      case "twitter.com":
        if ((splited[4] == "status") || (!isNaN(splited.pop()))) {
          StateLink[i] = "Twitter";
        } else {
          StateLink[i] = "IsNotCollectTweetURL"
        }
        break;
      case "youtu.be":
        StateLink[i] = "Youtube";
        break;
      default:
        StateLink[i] = "NotCollectURL";
        break;
    }
  }
  if (!IsArray_AllSame(StateLink)) return "JamURLs";
  return StateLink[0];
}

function fix_Name(ele) {
  if (ele.value.slice(0, 1) == "@") ele.value = ele.value.slice(1);
  if (ele.value == "") return false;
  return true;
}

function check_IsNumber(ele) {
  p_error[2].style.color = ((isNaN(ele.value)) ? "#ff0000" : "#000");
  p_error[2].textContent = ((isNaN(ele.value)) ? "敵撃破にかかった時間を記入してください" : "");
}

function check_IsAllNumber(par) {
  for (var i = 0; i < 3; i++) {
    if ((isNaN(par.children[i].value)) || (par.children[i].value=="")) return false;
  }
  return true;
}


function CreateOffer() /*記録を申請する*/ {
  var Enter_State = State_EnteredLink(document.getElementById('Enter_MediaURL'));
  var Enter_runnerName=document.getElementById('Enter_Runner').firstElementChild.value;
  if (((Enter_State != "Twitter") && (Enter_State != "Youtube"))) {
    alert("URLが適正なものではありません。");
    return;
  }
  if ((Enter_State == "Youtube") && (Enter_runnerName == "")) {
    alert("名前入力欄に名前が入っていないようです");
    return;
  }
  if (!check_IsAllNumber(document.getElementById('Enter_Timer'))) {
    alert("時間の入力欄に数字でないものが入っています。");
    return;
  }
  console.log(Enter_runnerName);
  sentvalue = {
    "Link": parseElementsToStringarray(document.getElementsByClassName("MediaLink")),
    "BossName": document.getElementById("BossName").value,
    "Ability_FirstPlayer": document.getElementById("Abbility_FirstPlayer").value,
    "Ability_AnotherPlayer": parseElementsToStringarray(document.getElementsByClassName("Abbility_AnotherPlayer")),
    "Record" : parseElementsToStringarray(convertAsCollectTime(document.getElementsByClassName("Record"))),
    "Runner" : (Enter_State=="Youtube") ? Enter_runnerName:null,
    "TypeOfMedia": Enter_State

  };
  console.log(sentvalue);
  document.getElementById("pagebody").textContent = "";
  SendOffer(sentvalue);
}


function MessageDisplay(IsSucceed, Message) {
  document.getElementById("pagebody").
  insertAdjacentHTML("afterbegin",
    "<ul class='menu'><li class='item_title'><p id='result'>" + ((IsSucceed) ? "申請に成功しました！" : "申請に失敗しました…") + "</p><p></p></li><li><p id='result_detail'>" + Message + "</p>");
}


function parseElementsToStringarray(obj_Elements) {
  var data = [];
  var elements = obj_Elements;
  for (var element of elements) {
    if (element.value) data.push(element.value);
  }
  return data;
}

function convertAsCollectTime(Record) {
  while (Record[1].value >= 60) {
    Record[0].value = Number(Record[0].value) + 1;
    Record[1].value -= 60;
  }
  return Record;
}
