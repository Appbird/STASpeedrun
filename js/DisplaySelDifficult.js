
function init_Setting_difficult(){
  var elem = document.getElementById('selectDifficult');
  var target = document.getElementsByClassName('nowSelecting')[0];
  var rangeValue = function(elem, target) {
    return function(evt) {
      var difficult_str = difficulty_namelist[elem.value];
      target.innerHTML = difficult_str + "辛  " + DifficultList[difficult_str]["japaneseName"];
    };
  }
  elem.addEventListener('input', rangeValue(elem, target));
}

function reflectSetting(){

  var nowDifficult = difficulty_namelist[document.getElementById("selectDifficult").value];
  if (difficult!=nowDifficult){
        difficult=nowDifficult;
        console.log(getNowFileName());
      if(getNowFileName() == "TheUltimateChoice.html#difficulty_sel"){RefreshDisplay();
      }else if(getNowFileName() == "Runner.html#difficulty_sel") Displayinfo(PlayerName).then();
  }

}
