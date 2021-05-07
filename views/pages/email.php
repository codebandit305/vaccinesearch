<?php

if(isset($_POST['submit'])) {
    $recipient = 'vaccinesnearyou@gmail.com';
    // $subject=$_POST['sendersubject'];
    $sender = $_POST['name'];
    $senderEmail = $_POST['useremail'];
    $message = $_POST['message'];

    //$mailBody="Name: $sender\nEmail: $senderEmail\n\n$message";

    mail($recipient, $mailBody, "From: $sender <$senderEmail>");
}

?>
