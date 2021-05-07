<?php

    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
    $recepient = "vaccinesnearyou@gmail.com";

    mail($recepient,"My subject",$message);


 ?>
