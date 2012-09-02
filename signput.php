<?php

//
// Change the following settings
//
$S3_KEY='S3 Key Here';
$S3_SECRET='S3 Secret Here';
$S3_BUCKET='/uploadtestbucket'; // Make sure to leave the / on the front of the bucket here

$EXPIRE_TIME=(60 * 5); // 5 minutes
$S3_URL='http://s3.amazonaws.com';

$objectName='/' . $_GET['name'];

$mimeType=$_GET['type'];
$expires = time() + $EXPIRE_TIME;
$amzHeaders= "x-amz-acl:public-read";
$stringToSign = "PUT\n\n$mimeType\n$expires\n$amzHeaders\n$S3_BUCKET$objectName";
$sig = urlencode(base64_encode(hash_hmac('sha1', $stringToSign, $S3_SECRET, true)));

$url = urlencode("$S3_URL$S3_BUCKET$objectName?AWSAccessKeyId=$S3_KEY&Expires=$expires&Signature=$sig");

echo $url;

?>
