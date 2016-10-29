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
      type=document.getElementById('usertype').value;
      email=document.getElementById('email').value;
      password=document.getElementById('password').value;

      console.log(type, email,password); 

      var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
                if(this.responseText=="head_exceeded"){
                  document.getElementById("error").innerHTML="Aleready two heads are active!";
                  console.log("exceed");
                  }
                
                else{
                  location.reload();
                }                      
              
              
                       
              }
            };
          xhttp.open("POST", "adduser/", true);
          var csrftoken = getCookie('csrftoken');
                    
          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhttp.setRequestHeader("X-CSRFToken", csrftoken);
          if(type!='User Type' & email.length>0 & password.length>=8){

          query="type="+type;
          query+="&email="+email;
          query+="&password="+password;
          
          xhttp.send(query);
          $('#newuserModal').modal('hide'); 
          }
          else{
            $('#newuserModal').effect('shake');
          }

    };

    function changestatus(name){
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
            if(this.responseText=="head_exceed"){
              bootbox.alert("Aleready Two heads are active!");
              $('#'+name).bootstrapToggle('off')
            }
            else{
              document.getElementById("error").innerHTML="";
            }                      
          }
        };
      xhttp.open("POST", "changestatus/", true);
      var csrftoken = getCookie('csrftoken');
                
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.setRequestHeader("X-CSRFToken", csrftoken);
      query="id="+name;
      query+="&status="+status;
      
      xhttp.send(query);
    }
    function new_user_close(){
      document.getElementById('usertype').value="User Type";
      document.getElementById('email').value="";
      document.getElementById('password').value="";
    }