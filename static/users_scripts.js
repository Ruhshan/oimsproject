function getCookie(name) {
          var cookieValue = null;
          if (document.cookie && document.cookie != '') {
              var cookies = document.cookie.split(';');
              for (var i = 0; i < cookies.length; i++) {
                  var cookie = jQuery.trim(cookies[i]);
                  // Does this cookie string begin with the name we want?
                  if (cookie.substring(0, name.length + 1) == (name + '=')) {
                      cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                      break;
                  }
              }
          }
          return cookieValue;
      };

    function createuser(){
      //reseting error
      document.getElementById("error").innerHTML="";
      var p1=document.getElementById('adminpassword1').value.trim();
      var p2=document.getElementById('adminpassword2').value.trim();

      ///ajax initialization
      var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
                if(this.responseText=="admin_exceeded"){
                  document.getElementById("error").innerHTML="Aleready two admins are active!";
                  $('#newuserModal').modal('show');
                  $('#newuserModal').effect('shake');
                  console.log("exceed");
                  }
                else if(this.responseText=="password_error"){
                  document.getElementById("error").innerHTML="You entered wrong password";
                  $('#newuserModal').modal('show');
                  $('#newuserModal').effect('shake');
                }
                else if(this.responseText=="user_exists"){
                  document.getElementById("error").innerHTML=("User with this email already exists!");
                  $('#newuserModal').modal('show');
                  $('#newuserModal').effect('shake');
                }
                else{
                  //$('#newuserModal').modal('hide');
                  location.reload();
                }



              }
          };
          xhttp.open("POST", "adduser/", true);
          var csrftoken = getCookie('csrftoken');

          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhttp.setRequestHeader("X-CSRFToken", csrftoken);
       //ajax initialization

      type=document.getElementById('usertype').value;
      if(type=="User Type"){
        $('#newuserModal').effect('shake');
      }
      else{
          email=document.getElementById('email').value.trim();
          password=document.getElementById('password').value.trim();
          nick_name=document.getElementById("nick_name").value.trim();

          try{
            password2=document.getElementById('password2').value.trim();
            if(email.length>0 & password.length>=8 &password2.length>=8){

              query="type="+type;
              query+="&email="+email;
              query+="&password="+password;
              query+="&password2="+password2;
              query+="&adminpassword1="+p1;
              query+="&adminpassword2="+p2;
              query+="&nick_name="+nick_name;
              xhttp.send(encodeURI(query));
            //$('#newuserModal').modal('hide');
            }
            else{
              $('#newuserModal').effect('shake');
            }
          }
          catch(err){
            console.log(err);
            if(email.length>0 & password.length>=8){

              query="type="+type;
              query+="&email="+email;
              query+="&password="+password;
              query+="&adminpassword1="+p1;
              query+="&adminpassword2="+p2;
              query+="&nick_name="+nick_name;

              xhttp.send(encodeURI(query));

            }
            else{
              $('#newuserModal').effect('shake');
            }


          }

          console.log(type, email,password);




      }


    };

function takepwd(name){
  console.log("takepwd",name);
  $('#id-carrier').val(name);
  $("#passwordModal").modal();
  return 0;
};

function changestatus(){
      var name=document.getElementById('id-carrier').value;
      p1=document.getElementById('cpassword').value.trim();
      p2=document.getElementById('cpassword2').value.trim();

      var status;
      if(document.getElementById(name).checked){
        status="active";
      }
      else{
        status="inactive";
      }
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            if(this.responseText=="admin_exceed"){
              //bootbox.alert("Aleready Two heads are active!")

              $('#'+name).toggle(
                  function () {
                      $('.check').attr('Checked','Checked');
                  },
                  function () {
                      $('.check').removeAttr('Checked');
                  }
              );
            }
            if(this.responseText=="password_error"){
              //bootbox.alert("Password error, reverting change!")
              console.log(name);
              if( document.getElementById(name).checked == true){
                document.getElementById(name).checked =false;
                document.getElementById("error").innerHTML="Password error!";
              }
              else{
                document.getElementById(name).checked=true;
                document.getElementById("error").innerHTML="Password error!";
              }
              /*$('input[id^="toggle"]').each(function(){
              $('#'+this.id).bootstrapToggle();

            });*/
            }

          }
        }
      xhttp.open("POST", "changestatus/", true);
      var csrftoken = getCookie('csrftoken');

      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.setRequestHeader("X-CSRFToken", csrftoken);
      query="id="+name;
      query+="&status="+status;
      query+="&p1="+p1;
      query+="&p2="+p2;
      xhttp.send(encodeURI(query));

    };

function new_user_close(){
      document.getElementById('usertype').value="User Type";
      document.getElementById('email').value="";
      document.getElementById('password').value="";
    }

function showinput(type){
  console.log(type);
  var email=  `<div class="form-group" id='hemail'>
                <label class="control-label col-sm-2" for="email">Email:</label>
                <div class="col-sm-10">
                  <input type="email" class="form-control" id="email" placeholder="Enter email">
                </div>
              </div>
              `;
  var nickfield=`<div class="form-group" id=hnick>
                <label class="control-label col-sm-2" for="nick_name">Nick Name:</label>
                <div class="col-sm-10">
                  <input type="email" class="form-control" id="nick_name" placeholder="Enter Nick Name:">
                </div>
              </div>`
  var password = `<div class="form-group" id='hpwd'>
                    <label class="control-label col-sm-2" for="password">Password:</label>
                    <div class="col-sm-10">
                      <input type="password" class="form-control" id="password" placeholder="Enter Password">
                    </div>
                  </div>
                  `;
  var password2 = `<div class="form-group" id='hpwd2'>
                    <label class="control-label col-sm-2" for="password2">Seccondary Password:</label>
                    <div class="col-sm-10">
                      <input type="password" class="form-control" id="password2" placeholder="Enter Seccondary Password">
                    </div>
                  </div>
                  `;
  var adminpassword=`<div class="well" id="adminpassword">
                        <div class="form-group" id='adminpone'>
                          <label class="control-label col-sm-3" for="adminpassword1">Password 1:</label>
                            <div class="col-sm-8">
                            <input type="password" class="form-control" id="adminpassword1" placeholder="Enter Your Password 1">
                            </div>
                        </div>
                        <div class="form-group" id='adminptwo'>
                          <label class="control-label col-sm-3" for="adminpassword2">Password 2:</label>
                          <div class="col-sm-8">
                            <input type="password" class="form-control" id="adminpassword2" placeholder="Enter Your Password 2">
                          </div>
                        </div>
                      </div>
                  `;
  if(type=="admin" || type=="temporary-admin"){
    $("#hemail").replaceWith(email);
    $("#hnick").replaceWith(nickfield);
    $("#hpwd").replaceWith(password);
    $("#hpwd2").replaceWith(password2);
    $('#adminpassword').replaceWith(adminpassword);
  }
  else if(type=="user"){
      $("#hemail").replaceWith(email);
      $("#hnick").replaceWith(nickfield);
      $("#hpwd").replaceWith(password);
      $("#hpwd2").replaceWith('<div id="hpwd2"></div>');
      $('#adminpassword').replaceWith(adminpassword);
  }
  else{
    $("#hemail").replaceWith('<div id="hemail"></div>');
    $("#hpwd").replaceWith('<div id="hpwd"></div>');
    $("#hnick").replaceWith('<div id="hnick"></div>');
    $("#hpwd2").replaceWith('<div id="hpwd2"></div>');
    $('#adminpassword').replaceWith('<div id="adminpassword"></div>');
  }

}


function showaction(action, is_active, email,id){
  console.log(action , is_active, email,id);
  var status_checked=`<div class="form-group" id='actiondiv`+id+`'>
                <label class="control-label col-sm-2" for="toggle`+id+`">Status:</label>
                <div class="col-sm-10">
                  <input type="checkbox" checked id="toggle`+id+`" data-on="Active" data-off="Inactive">
                </div>
              </div>`;
  var status_unchecked=`<div class="form-group" id='actiondiv`+id+`'>
                <label class="control-label col-sm-2" for="toggle`+id+`">Status:</label>
                <div class="col-sm-10">
                  <input type="checkbox" id="toggle`+id+`" data-on="Active" data-off="Inactive">
                </div>
              </div>`;

  var new_email=  `<div class="form-group" id="actiondiv`+id+`"">
                <label class="control-label col-sm-2" for="new_email`+id+`">Email:</label>
                <div class="col-sm-10">
                  <input type="email" class="form-control" id="new_email`+id+`"placeholder="Enter New email">
                </div>
              </div>`;
  var delete_user=  `<div class="form-group" id="actiondiv`+id+`"">
                <label class="control-label col-sm-2" for="delete_user`+id+`">Confirm:</label>
                <div class="col-sm-10">
                  <input type="email" class="form-control" id="delete_user`+id+`"placeholder="Confirm User's Email">
                </div>
              </div>`;
  var passwordinput = `<div class="well" id="passwordinput`+id+`">
                        <div class="form-group" id='modpone`+id+`'>
                          <label class="control-label col-sm-3" for="modpassword1`+id+`">Password 1:</label>
                            <div class="col-sm-8">
                            <input type="password" class="form-control" id="modpassword1`+id+`" placeholder="Enter Your Password 1">
                            </div>
                        </div>
                        <div class="form-group" id='modptwo`+id+`'>
                          <label class="control-label col-sm-3" for="modpassword2`+id+`">Password 2:</label>
                          <div class="col-sm-8">
                            <input type="password" class="form-control" id="modpassword2`+id+`" placeholder="Enter Your Password 2">
                          </div>
                        </div>
                      </div>
                  `;

  if(action=='status'){
    if(is_active=="True"){
      $("#actiondiv"+id).replaceWith(status_checked);
      $("#passwordinput"+id).replaceWith(passwordinput);
    }
    else{
     $("#actiondiv"+id).replaceWith(status_unchecked);
     $("#passwordinput"+id).replaceWith(passwordinput);
    }
    $('#toggle'+id).bootstrapToggle();
  }
  else if(action=="edit"){
    $("#actiondiv"+id).replaceWith(new_email);
    $("#passwordinput"+id).replaceWith(passwordinput);

  }
  else if(action=="delete"){
     $("#actiondiv"+id).replaceWith(delete_user);
     $("#passwordinput"+id).replaceWith(passwordinput);
  }
  else{
    $("#actiondiv"+id).replaceWith('<div id="actiondiv'+id+'"></div>');
    $("#passwordinput"+id).replaceWith('<div id="passwordinput'+id+'"></div>');
  }

}

function moduser(id){
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
      if(this.responseText=="okay"){
        $('#moduserModal'+id).modal('hide');
        location.reload();
      }
      else if(this.responseText=="password_error"){
       $('#moduserModal'+id).effect('shake');
       console.log("password error")
      }
      else if(this.responseText=="to_delete_not_matched"){
        console.log("to_delete_not_matched");
        $('#moduserModal'+id).effect('shake');
      }
      else if(this.responseText=="admin_exceeded"){
        bootbox.alert("Already two adminss are active");
        $('#toggle'+id).bootstrapToggle('toggle');
        $('#moduserModal'+id).effect('shake');

      }
      else{
       $('#moduserModal'+id).effect('shake');
      }

    }
  }

  xhttp.open("POST", "modifyuser/", true);
  var csrftoken = getCookie('csrftoken');

  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.setRequestHeader("X-CSRFToken", csrftoken);
  //var status=document.getElementById("toggle"+id).checked;
  //var new_email=document.getElementById("new_email"+id).value;
  //var delete_user=document.getElementById("delete_user"+id).value;
  var p1=document.getElementById("modpassword1"+id).value.trim();
  var p2=document.getElementById("modpassword2"+id).value.trim();

  var action=document.getElementById("actiontype"+id).value.trim();
  console.log(action);
  if(action=="status"){
    var val=document.getElementById("toggle"+id).checked;
    var status;
    if(val==true){
      status="activate";
    }
    else{
      status="deactivate";
    }
    console.log(status);
    console.log(p1,p2);
    query="id="+id;
    query+="&status="+status;
    query+="&p1="+p1;
    query+="&p2="+p2;
    xhttp.send(encodeURI(query));

  }
  else if(action=="edit"){
    var new_email=document.getElementById("new_email"+id).value;
    console.log(new_email);
    console.log(p1,p2);
    query="id="+id;
    query+="&newemail="+new_email;
    query+="&p1="+p1;
    query+="&p2="+p2;
    xhttp.send(encodeURI(query));
  }
  else if(action=="delete"){
    var delete_user=document.getElementById("delete_user"+id).value;
    console.log(delete_user);
    console.log(p1,p2);
    query="id="+id;
    query+="&delete="+delete_user;
    query+="&p1="+p1;
    query+="&p2="+p2;
    xhttp.send(query);
  }
  else{
    $('#moduserModal'+id).effect('shake');
  }

}
