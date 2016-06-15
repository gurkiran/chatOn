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




  messageForm.submit(function(e){
    e.preventDefault();
    console.log('submitted');
    socket.emit('send message', message.val());
    message.val('');
  })

  socket.on('new message', function(data) {
    console.log(data);
    chat.append('<div class="well"><strong>'+data.user.username+' <code>('+data.user.age+'/'+data.user.gender+')</code></strong>:<i> '+data.msg+'</i></div>');
  })

  userForm.submit(function(e){

    var userName = username.val();
    var userAge = age.val();
    var userGender = gender.val();
    var credentials = {
      username:userName,
      age: userAge,
      gender: userGender
    }
    e.preventDefault();
    console.log('submitted');
    socket.emit('new user', credentials, function(data) {
      console.log(data);
      if(data) {
        userFormArea.hide();
        messageArea.show();
      }
    });
    username.val('');
    age.val('');
  })

  socket.on('get users', function(data) {
    var html = '';
    console.log(data);
    for(var i=0; i < data.length; i++) {
      html += '<li class="list-group-item">'+data[i].username+'<strong> <code>('+data[i].age+'/'+data[i].gender+ ')</code></strong></li>';
    }
    users.html(html);
  })

});
