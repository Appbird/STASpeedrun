function CreateRecordTable(array_element, array_vartical = null, array_horizontal = null) {
  /*
  array_vartical    =>  一階層の配列(array->str)
                        表の一番右の縦列を表す。(大抵は表示するコピー能力名)

  array_horizontal  =>  一階層の配列(array->str)
                        表の一番上の横列を表す。(大抵は表示する敵名)

  array_element     =>  二階層の配列(array->obj{ 'vartical':str, 'horizontal':str, 'element':obj})
                        表のそれぞれの要素を表す。順不同。対応した場所にelementを入力する、
                        指定したものがオブジェクト(一階層)のものであれば改行されて順々に表示される
                        要素が重複した際、obj内にRankプロパティがあればRankが高いものが表示される。
  */

  var returndiv = document.createDocumentFragment();
  //基本表構成
  for (var h = 0; h < array_vartical.length + 1; h++) {　
    //行
    var tr_add = returndiv.appendChild(CreateDOM('tr', ''));
    tr_add.className = "AbilityLine";
    for (var w = 0; w < array_horizontal.length + 1; w++) {
      var abilityname = array_vartical[h - 1];
      var enemyname = array_horizontal[w - 1];
      if (!h) {
        //列-一行目
        //0番目の要素なら空白、それ以外なら文字列を埋め込む

        tr_add.appendChild(CreateDOM('th', ((w) ? convertAndTobr(convertEnNameToJa(enemyname)) : "")));

      } else {
        //列-二行目以降(第二要素以降を無要素で埋め込む)
        //第一要素はコピー名で埋め込む

        var ele_add = CreateDOM((w) ? 'td' : "th",
          (w) ? "<br>" : convertAbNameToJa(abilityname),
          (w) ? "NotExists" : "");

        if (!w) {

          //第二要素以降の要素は色を変えたり
          var FriAb = AbilitiesList[abilityname]["FriAb"];
          ele_add.style.backgroundColor = FriAbList[FriAb][0];
          ele_add.style.borderColor = FriAbList[FriAb][1] + "33";
          ele_add.style.color = FriAbList[FriAb][2];
        }
        tr_add.appendChild(ele_add);
      }

    }
  }
  //array_elementから要素を編集
  for (var element of array_element) {
    var vartical_n = array_vartical.indexOf(element['vartical']) + 1;
    var horizontal_n = array_horizontal.indexOf(element['horizontal']) + 1;
    if ((vartical_n != -1) && (horizontal_n != -1)) {
      var td = returndiv.children[vartical_n].children[horizontal_n];
      ((a, b) => {
        td.addEventListener("click", function() {
          DetailDisplay(a, b, 0, "Alone", true);
        });
      })(element['vartical'], element['horizontal']);
      td.innerHTML = "<a href='#display_detail'>" + element['element'] + "</a>";
      td.className = "RecordCell";
    }
  }

  return returndiv;

}

function CreateListTable(array_top, array_element, task, selected_row = null) {
  var div = document.createDocumentFragment();
  var tr_top = div.appendChild(CreateDOM('tr', '', 'list_line_top'));
  appendChild_fewtext(array_top, "th", tr_top);

  for (var record of array_element) {
    var line = CreateDOM('tr', '', 'list_line');

    for (var ele_itemname of array_top) {
      var td = CreateDOM('td', '', 'list');
      switch (ele_itemname) {
        case "Ability":
          td.innerHTML = convertAbNameToJa(record.Ability);
          break;
        case "Friends":
          td.innerHTML = apability_jaConverter(record.Friends);
          break;
        case "Enemy":
          td.innerHTML = convertAndTobr(convertEnNameToJa(record.Enemy));
          break;
        case "Time":
          td.innerHTML = convertRecordAsString(record.Time);
          break;
        case "Time/Rank":
          td.innerHTML = convertRecordAsString(record.Time) +
            "(" + rankstr_add(parseInt(record.Rank) + 1) + ")";
          break;
        case "Rank":
          td.innerHTML = rankstr_add(parseInt(record.Rank) + 1);
          break;
        case "Date":
          td.innerHTML = record.Date.replace(" ", "<br>");
          break;
        default:
          td.innerHTML = record[ele_itemname];
          break;
      }
      if (selected_row == record.Rank) {
        line.className = "Selectedline"
      }
      line.appendChild(td);
    }
    if (selected_row != record.Rank) {
      ((a, b, c, d, e, f, g) => {
        switch (task) {
          case "LoadNewData":
            line.addEventListener("click", function() {
              DetailDisplay(a, b, c, d, true);
            });
            break;
          case "Change_only":
            line.addEventListener("click", function() {
              DetailDisplay_ChangeRank(a, c, d, e , f, g);
            });
            break;
        }
      })(record.Ability, record.Enemy, record.Rank, record.Friends, record.Media, record.TypeOfMedia, record.Player);
    }

    div.appendChild(line);
  }

  return div;
}
