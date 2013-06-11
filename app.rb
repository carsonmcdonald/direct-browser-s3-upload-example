require 'sinatra'
require 'base64'
require 'openssl'
require 'cgi'

S3_KEY='S3 key here'
S3_SECRET='S3 secret here'
S3_BUCKET='/uploadtestbucket'

EXPIRE_TIME=(60 * 5) # 5 minutes
S3_URL='http://s3.amazonaws.com'

get '/' do
  send_file 'index.html'
end

get '/styles.css' do
  send_file 'styles.css'
end

get '/app.js' do
  send_file 'app.js'
end

get '/signput' do
  object_name = "/#{params['name']}"

  mime_type = params['type']
  expires = Time.now.to_i + EXPIRE_TIME

  amz_headers = "x-amz-acl:public-read"
  string_to_sign = "PUT\n\n#{mime_type}\n#{expires}\n#{amz_headers}\n#{S3_BUCKET}#{object_name}"
  sig = CGI::escape(Base64.strict_encode64(OpenSSL::HMAC.digest('sha1', S3_SECRET, string_to_sign)))

  CGI::escape("#{S3_URL}#{S3_BUCKET}#{object_name}?AWSAccessKeyId=#{S3_KEY}&Expires=#{expires}&Signature=#{sig}")
end
