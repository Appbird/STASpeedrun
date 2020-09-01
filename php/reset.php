<?php
$originalData = json_decode( mb_convert_encoding(  file_get_contents("../Records/Records.json")  ,'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN') ,true);
$originalData["How_in15mins"]=0;
file_put_contents("../offer/offerList.json",json_encode($originalData) );
 ?>
