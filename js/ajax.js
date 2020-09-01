function CreateHttpRequest(){

  var xmlhttp = null;
 if (window.XMLHttpRequest){
    xmlhttp = new XMLHttpRequest();
  }
  if(xmlhttp == null){
    alert("このブラウザはXMLHTTPRequestに対応していません。\nブラウザを最新バージョンにするか、ブラウザを変えるかなどしてからもう一度このページを訪れてみてください。");
  }
  return xmlhttp;
}


function SendRequest(url) /*xmlhttp同期通信でサーバーから取得*/ {
  return new Promise( (resolve) => {
  var xmlhttp = CreateHttpRequest();
  xmlhttp.open("GET", `${location.origin}/${url}`, true);
  xmlhttp.send(null);
  xmlhttp.onreadystatechange = function(){
    if(xmlhttp.readyState==4 && xmlhttp.status==200){
     resolve( JSON.parse(xmlhttp.responseText) || "null" );
  }
};
});
}


function SendOffer(value)/*記録を申請する*/{
  var xmlhttp=CreateHttpRequest();
  var form = document.getElementById("pagebody");

  xmlhttp.open("POST", `${location.origin}/php/offerReceive.php` , true);
  xmlhttp.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
  xmlhttp.send( "data=" + JSON.stringify(value) );

  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState==4){
      form.innerHTML = "";

      var Messages= [ "申請が承認され次第、あなたの記録が反映されます！",
                      "申請した記録が従来の記録を更新できなかったようです。",
                      "申請した記録内で同一人物でないツイートが混じっているようです。",
                      "既にこのツイートを含んだ記録が登録されているようです。",
                      "同一のツイートを複数申請しているようです。",
                      "申請データを追加できなかったようです。<br>時間をおいてもう一度お試しください。",
                      "エラーが発生しました。<br>時間をおいてもう一度お試しください。",
                      "サーバーエラーが発生しました。(500)<br>もしよろしければ、Twitterにて@projectappbirdにご一報いただけると幸いです。"
                    ];
      MessageDisplay(!(parseInt(xmlhttp.responseText)),Messages[xmlhttp.responseText]);
    }else if (xmlhttp.readyState==0){

    }
  }
}
