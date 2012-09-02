function createCORSRequest(method, url) 
{
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) 
  {
    xhr.open(method, url, true);
  } 
  else if (typeof XDomainRequest != "undefined") 
  {
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } 
  else 
  {
    xhr = null;
  }
  return xhr;
}

function handleFileSelect(evt) 
{
  setProgress(0, 'Upload started.');

  var files = evt.target.files; 

  var output = [];
  for (var i = 0, f; f = files[i]; i++) 
  {
    uploadFile(f);
  }
}

/**
 * Execute the given callback with the signed response.
 */
function executeOnSignedUrl(file, callback)
{
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'signput.php?name=' + file.name + '&type=' + file.type, true);

  // Hack to pass bytes through unprocessed.
  xhr.overrideMimeType('text/plain; charset=x-user-defined');

  xhr.onreadystatechange = function(e) 
  {
    if (this.readyState == 4 && this.status == 200) 
    {
      callback(decodeURIComponent(this.responseText));
    }
    else if(this.readyState == 4 && this.status != 200)
    {
      setProgress(0, 'Could not contact signing script. Status = ' + this.status);
    }
  };

  xhr.send();
}

function uploadFile(file)
{
  executeOnSignedUrl(file, function(signedURL) 
  {
    uploadToS3(file, signedURL);
  });
}

/**
 * Use a CORS call to upload the given file to S3. Assumes the url
 * parameter has been signed and is accessible for upload.
 */
function uploadToS3(file, url)
{
  var xhr = createCORSRequest('PUT', url);
  if (!xhr) 
  {
    setProgress(0, 'CORS not supported');
  }
  else
  {
    xhr.onload = function() 
    {
      if(xhr.status == 200)
      {
        setProgress(100, 'Upload completed.');
      }
      else
      {
        setProgress(0, 'Upload error: ' + xhr.status);
      }
    };

    xhr.onerror = function() 
    {
      setProgress(0, 'XHR error.');
    };

    xhr.upload.onprogress = function(e) 
    {
      if (e.lengthComputable) 
      {
        var percentLoaded = Math.round((e.loaded / e.total) * 100);
        setProgress(percentLoaded, percentLoaded == 100 ? 'Finalizing.' : 'Uploading.');
      }
    };

    xhr.setRequestHeader('Content-Type', file.type);
    xhr.setRequestHeader('x-amz-acl', 'public-read');

    xhr.send(file);
  }
}

function setProgress(percent, statusLabel)
{
  var progress = document.querySelector('.percent');
  progress.style.width = percent + '%';
  progress.textContent = percent + '%';
  document.getElementById('progress_bar').className = 'loading';

  document.getElementById('status').innerText = statusLabel;
}
