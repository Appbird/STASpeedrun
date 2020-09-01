<?php
require_once "expand.php";


$str='{
            "Whispy Woods":         {},
            "Yggy Woods":           {},
            "Middle Bosses 1":      {},
            "Middle Bosses 1 Ex":   {},
            "King Dedede":          {},
            "Middle Bosses 2":      {},
            "Middle Bosses 2 Ex":   {},
            "Meta Knight":          {},
            "Pon & Con":            {},
            "Goldon & Silvox":      {},
            "Kracko":               {},
            "Francisca":            {},
            "Francisca Ex":         {},
            "Flamberge":            {},
            "Flamberge Ex":         {},
            "Zan Partizanne":       {},
            "Zan Partizanne Ex":    {},
            "Hyness":               {},
            "Hyness Ex":            {},
            "Morpho Knight":        {},
            "Void Termina":         {},
            "Void Termina & Void Soul":{}
}';
foreach($AbilitiesList as $key => $value){

  if(file_exists("../Records/".$key.".json"))file_put_contents("../Records/".$key.".json",$str);
}
 ?>
