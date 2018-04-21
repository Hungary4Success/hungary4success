<?php
//function to generate salt
function generateSalt($max = 5) {
    $characterList = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*?";
    $i = 0;
    $salt = "";
    while ($i < $max) {
        $salt .= $characterList{mt_rand(0, (strlen($characterList) - 1))};
        $i++;
    }
    return $salt;
  }

  $password = "2Nk8xQ0FLZuy";
  $hashedPassword = //hash password using md5 preceding salt
?>
