Direct Browser to S3 Upload Example
===================================

This is an example of using the HTML5 FileAPI, XHR2, CORS and signed S3 PUT requests to upload files directly from a browser to S3. There are sample server side signing apps for both PHP and Ruby with Sinatra. The default

You can read more details about the code in my [direct browser uploading to Amazon S3](http://www.ioncannon.net/programming/1539/direct-browser-uploading-amazon-s3-cors-fileapi-xhr2-and-signed-puts) blog post.

## Setting up Amazon S3 CORS

Before using any of the examples you will need to set up your S3 CORS data. It is easy enough to do that using the AWS console. The following is an example CORS configuration that should work wherever you install the example:

``` XML
<CORSConfiguration>
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>PUT</AllowedMethod>
        <MaxAgeSeconds>3000</MaxAgeSeconds>
        <AllowedHeader>Content-Type</AllowedHeader>
        <AllowedHeader>x-amz-acl</AllowedHeader>
        <AllowedHeader>origin</AllowedHeader>
    </CORSRule>
</CORSConfiguration>
```

## Installing to Heroku

* Make sure your CORS configration is in place on the bucket you will use
* git clone https://github.com/carsonmcdonald/direct-browser-s3-upload-example.git
* heroku create
* Change the S3 information in app.rb (Key, Secret and Bucket)
* Change the endpoint in app.js to point to signput instead of signput.php
* git commit -a
* git push heroku master

For more information see the [Heroku rack guide](https://devcenter.heroku.com/articles/rack).
