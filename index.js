var s3;
let bucketURL = "https://s3.amazonaws.com/group-project-images/";
let apiURL = "https://gjty9ggb34.execute-api.us-east-1.amazonaws.com/prod/queryDynamoForImage?tag=";

$(() => {

  configure();

  showAllPhotos();

  $('#photo-form').submit((e) => {
    e.preventDefault();
    photoUpload();
  });//submit upload

  $('#searchbox').submit((e) => {
    e.preventDefault();

    var typedText = $('#searchbox input').first().val();
    var tag = typedText.charAt(0).toUpperCase() + typedText.substr(1).toLowerCase();

    $.ajax({
      type: "GET",
      url: apiURL + tag,
      crossDomain: true,
      contentType: "application/json",
      success: function (data, error) {
        showSomePhotos(data)
      },
      error: function(xhr, error){
        console.debug(xhr); console.debug(error);
      },
    });
  });//submit search

  $('#add-icon').click(() => {
    $('#modal-background').show();
  });

  $('#modal-background').click((e) => {
    if (!$(e.target).parents('#modal-background').length) {
      $('#modal-background').hide();
    }
  });



});

//authenticate AWS
function configure() {
  var albumBucketName = 'group-project-images';
  var bucketRegion = 'us-east-1';
  var IdentityPoolId = 'POOL_ID_HERE';

  AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
  });

  s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: albumBucketName}
  });
}



function photoUpload() {
  var files = document.getElementById('photo-upload').files;
  if (!files.length) {
    return alert('Please choose a file to upload first.');
  }
  var file = files[0];
  var fileName = file.name.replace(' ','_');

  var photoKey = fileName;
  s3.upload({
    Key: photoKey,
    Body: file,
    ACL: 'public-read'
  }, function(err, data) {
    if (err) {
      return alert('There was an error uploading your photo: ', err.message);
    }
    alert('Successfully uploaded photo.');
    $('#modal-background').hide();
    showAllPhotos();

  });
}

function showAllPhotos() {


  $('#photos').html('');

  s3.listObjects({Delimiter: '/'},
    function(err, data) {
      if (err) {
        return alert('There was an error retreiving the photos');
      } else {
        data.Contents.forEach((item) => {
          var html = "<a data-fancybox=\"gallery\" href=\"" + bucketURL + item.Key + "\"><img src=\"" + bucketURL + item.Key + "\"></a>";
          $('#photos').append(html);
        });
      }
    });
}

function showSomePhotos(data, success) {
  $('#photos').html('');

  if (data.body.length) {
    data.body.forEach((item)=> {
      var html = "<a data-fancybox=\"gallery\" href=\"" + bucketURL + item.image + "\"><img src=\"" + bucketURL + item.image + "\"></a>";
      $('#photos').append(html);
    });
  } else {
    $('#photos').html('<p>No matching photos found</p><br /><a href="javascript:showAllPhotos()"">back</a>')
  }


}
