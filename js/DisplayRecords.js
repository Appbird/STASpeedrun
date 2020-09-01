function RefreshDisplay() /* 記録表示を更新する */ {
    ChangeMode_Loading_icon(true);
    ChangeMode_DisplayRecord(false);
    ChangeEnebleSetting("normal");

  TableBuilder().then(() => {
    console.log("Finish the task!");
    ChangeMode_Loading_icon(false);
    ChangeMode_DisplayRecord(true);
  });

}

async function TableBuilder /*表を構築し一行ずつ挿入する*/ () {

  var div_Re = document.getElementById("DisplayRecord");
  div_Re.textContent = null;

  var Order = await SendRequest("php/RecordResponder.php?level=1&ability=All&difficulty=" + difficult);
  Order = array_column("name",Order);
  var Record = await SendRequest("php/RecordResponder.php?"+
  "level=2&ability=All&difficulty=" + difficult + "&apability=Alone&first_rank=0&last_rank=0"
  );
    parseAsTableBuilderElement(Record,'normal');
    div_Re.appendChild(
      CreateRecordTable(Record,Order,DifficultList[difficult]['AppearBosses'])
    );
}
