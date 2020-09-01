function CreateDOM(type, text) {
  var th = document.createElement(type);
  th.innerHTML = text;
  return th;
}

function CreateDOM_id(type, text, id_name) {
  var th = document.createElement(type);
  th.innerHTML = text;
  th.id = id_name;
  return th;
}

function CreateDOM(type, text, class_name) {
  var th = document.createElement(type);
  th.innerHTML = text;
  th.className = class_name;
  return th;
}

function appendChild_fewtext(ary, eleName, added) {
  for (var ele of ary) {
    added.appendChild(CreateDOM(eleName, ele, "list"));
  }
}

function getNowFileName() {
  return document.location.href.split('/').pop();
}
function IsArray_AllSame(ary){
  for(var i = 0;i<ary.length;i++){
    if(!ary[i+1])break;
    if(ary[i] != ary[i+1])return false;
  }
  return true;
}
function URL_targetChange(target) {
  try {
    var withoutTarget = document.location.href.split('#')[0];
    document.location.href = withoutTarget + "#" + target;
    return true;
  } catch {
    return false;
  }
}

function ChangeEnebleSetting(str) {
  var headermenu = document.getElementById('SettingMenu');
  var dif = headermenu.getElementsByClassName('dif')[0];
  var fri = headermenu.getElementsByClassName('fri')[0];
  var run = headermenu.getElementsByClassName('run')[0];
  switch (str) {
    case "normal":
      if (dif) dif.style.display = null;
      if (fri) fri.style.display = "none";
      if (run) run.style.display = null;
      break;
    case "detail":
      if (dif) dif.style.display = "none";
      if (fri) fri.style.display = null;
      if (run) run.style.display = "none";
      break;
    case "runner":
      if (dif) dif.style.display = "none";
      if (fri) fri.style.display = "none";
      if (run) run.style.display = null;
      break;
  }

}

function parseAsTableBuilderElement(array, type) {
  for (var i in array) {
    var context = "";
    switch (type) {
      case 'normal':
        context = "<p class='time'>" + convertRecordAsString(array[i]['Time']) + "</p><br><p class='player'>" + array[i]['Player'] + "</p>";
        break;
    }

    array[i] = {
      'vartical': array[i]['Ability'],
      'horizontal': convertAndTobr(array[i]['Enemy']),
      'element': context
    };
  }
}

function convertRecordAsString(Record_array) {
  return add0(Record_array[0]) + ":" + add0(Record_array[1]) + "." + add0(Record_array[2]);
}

function array_column(key, array) {
  var returndata = [];
  for (var ele of array) {
    returndata.push(ele[key]);
  }
  return returndata;
}

function convertAndTobr(str) {
  return str.replace(/＆/g, "<br>");
}




function add0(value) {
  return (((value+"").length <= 1) ? "0" : "") + value;
}

function rankstr_add(rank) {
  switch (rank) {
    case 1:
      return rank + "st"
    case 2:
      return rank + "nd"
    case 3:
      return rank + "rd"
    default:
      return rank + "th"
  }
}

function getArray_AllAbilities() {
  var content = [];
  for (var ability in AbilitiesList) {
    content.push(ability);
  }
  return content;
}

function convertAbNameToJa(str) {
  return AbilitiesList[str]['ja'];
}

function convertEnNameToJa(str) {
  return EnemyNameList[str]['ja'];
}

function ChangeMode_Loading_icon(IsValid) {
  var div = document.getElementById('Loading_icon');
  div.className = (IsValid) ? 'valid' : 'invalid';
}

function ChangeMode_DisplayRecord(IsValid) {
  var div = document.getElementById("DisplayInformation");
  div.style.display = (IsValid) ? 'flex' : 'none';
}

function parse_RequestAbilityList(abilityname) {
  var returndata = [];
  if (abilityname == 'All') {
    returndata = getArray_AllAbilities();
  } else if (Array.isArray(abilityname)) {
    returndata = abilityname;
  } else {
    returndata = [abilityname];
  }

  return JSON.stringify(returndata);
}

function apability_jaConverter(apability) {
  var anotherPlayers = apability.split(",");

  if (anotherPlayers[0] == "Alone") {
    anotherPlayers[0] = "ひとりで";
  } else {
    for (var i in anotherPlayers) {
      anotherPlayers[i] = AbilitiesList[anotherPlayers[i]]["ja"];
    }
  }
  return anotherPlayers;
}
