$(function(){

  var socket = io.connect();

  var messageForm = $('#messageForm');
  var message = $('#message');
  var chat = $('#chat');
  var userFormArea = $('#userFormArea');
  var userForm = $('#userForm');
  var messageArea = $('#messageArea');
  var users = $('#users');
  var username = $('#username');
  var age = $('#age');
  var gender = $('#gender');
  var numberOfUsers= $('.well h3>span');
  var location = null;

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }else {
    alert('Do it !');
  }

  function showPosition(position) {
    console.log(position.coords.latitude+':'+position.coords.longitude);
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    $.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key=AIzaSyCaTbaq-KfJy-Qq_jdY9Yo5yLAjqdCrdG0', function(data){
      console.log(data);
      location = data.results[5].address_components[0].short_name;
    })
  }

  message.keyup(function(e) {
    if(e.keyCode == 13) {
      messageForm.submit();
    }
  })

  messageForm.submit(function(e){
    e.preventDefault();
    socket.emit('send message', message.val());
    message.val('');
})



  socket.on('new message', function(data) {
    if(data.user.gender === 'M'){
        chat.prepend('<div class="well chatBox"><code>'+data.user.username+'</code><strong style="color:#337AB7;font-size:20px;margin-left:10px;"> '+data.msg+'</strong></div>');
    }else {
      chat.prepend('<div class="well chatbox"><code>'+data.user.username+'</code><strong style="color:#F29EC8;font-size:20px;margin-left:10px;"> '+data.msg+'</strong></div>');
    }

  })

  userForm.submit(function(e){
    if($( "#gender option:selected" ).text() != 'Select') {
      var userName = username.val();
      var userAge = age.val();
      var userGender = gender.val();
      var credentials = {
        username:userName,
        age: userAge,
        gender: userGender,
        location: location
      }
      e.preventDefault();
      socket.emit('new user', credentials, function(data) {
        if(data) {
          userFormArea.hide();
          messageArea.show();
          messageForm.show();
        }
      });
      username.val('');
      age.val('');
    }else {
      alert('aren\'t you human ?');
    }

  })

  socket.on('get users', function(data) {
    var html = '';
    numberOfUsers[0].innerHTML= ''+data.length+'';
    for(var i=0; i < data.length; i++) {

      if(data[i].gender === 'M'){
        console.log(data[i].location);
        html += '<li class="list-group-item male">('+data[i].age+')&nbsp<strong>'+data[i].username+'</strong><span id="location">'+data[i].location+'</span></li>';
      }else{
        html += '<li class="list-group-item female">('+data[i].age+')&nbsp<strong>'+data[i].username+'</strong><span id="location">'+data[i].location+'</span></li>';
      }

    }
    users.html(html);
  })




});
