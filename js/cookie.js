function GetFavoriteAbilities(){

if(document.cookie == ""){
var content=[];
  for (var ability in AbbilitesList) {
    content.push(ability);
}
display_all=true;
return content;

}else{
  var data_string = document.cookie.split(';')[0];
  var content = data_string.split('=')[1];
  display_all=false;
  return content.split('+');
}


}
