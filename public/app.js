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

        chat.prepend('<div class="well chatBox"><i class="fa fa-mars" aria-hidden="true"></i> <code>'+data.user.username+'</code><strong style="color:#337AB7;font-size:20px;margin-left:10px;"> '+data.msg+'</strong></div>');
    }else {
      chat.prepend('<div class="well chatbox"><i class="fa fa-venus" aria-hidden="true"></i> <code>'+data.user.username+'</code><strong style="color:#F29EC8;font-size:20px;margin-left:10px;"> '+data.msg+'</strong></div>');
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
        gender: userGender
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
        html += '<li class="list-group-item male"><i class="fa fa-mars" aria-hidden="true"></i> '+data[i].username+'<strong> <em>('+data[i].age+')</em></strong></li>';
      }else{
          html += '<li class="list-group-item female"><i class="fa fa-venus" aria-hidden="true"></i> '+data[i].username+'<strong> <em>('+data[i].age+')</em></strong></li>';
      }

    }
    users.html(html);
  })




});
