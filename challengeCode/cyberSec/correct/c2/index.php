<?php
  $salt = "4235";
  $password = "2Nk8xQ0FLZuy";
  $hashedPassword = md5($salt . $password);//hash password using md5 with preceding salt
?>
