async function initPlayerList() {

  var div = document.getElementById("RunnerList");

  var PlayersList = await SendRequest("php/PlayerResponder.php");
  for (var player of PlayersList) {
    var li = CreateDOM('li', "<a href='#!'>" + player['name'] + "</a>", 'item_click');
    ((a,b) => {
      li.addEventListener("click", function() {
        PlayerName = a;
        total_time = b;
        document.getElementById("runner_sel").getElementsByClassName('nowSelecting')[0].textContent = a;
        Displayinfo(a).then(function(){
          ChangeMode_Loading_icon(false);
        }
        );
      });
    })(player['name'],player["ShortingTime"]);

    div.appendChild(li);
  }
  return;
}

async function Displayinfo(playername) {
  var tutorial_popup = document.getElementById('tutorial');
  if(tutorial_popup)tutorial_popup.parentNode.removeChild(tutorial_popup);

  var PlayersRecordsList = await SendRequest("php/RecordResponder.php?level=3&runner=" + playername);

  var div = document.getElementById('DisplayAllHistory');
  div.textContent = null;
  div.appendChild(
    CreateListTable(['Ability','Friends','Enemy','Time/Rank','Date'],PlayersRecordsList,"LoadNewData")
  );

  div = document.getElementById('DisplayInfo').firstElementChild;
  div.firstElementChild.textContent = playername;
  div.lastElementChild.textContent = total_time;

}
