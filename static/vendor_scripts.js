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

    function createvendor(){
    	name=document.getElementById('vname').value;
    	cperson=document.getElementById('cperson').value;
    	address=document.getElementById('vaddress').value;
    	contact=document.getElementById('vcontact').value;
    	email=document.getElementById('vemail').value;
    	description=document.getElementById('vdescription').value;

    	var xhttp = new XMLHttpRequest();
          
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
                console.log("vendor table updated");  
                window.location="/vendor/";    
              
              }
            };
      xhttp.open("POST", "addvendor/", true);
      var csrftoken = getCookie('csrftoken');
                
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.setRequestHeader("X-CSRFToken", csrftoken);
      query="name="+name;
      query+="&cperson="+cperson;
      query+="&address="+address;
      query+="&contact="+contact;
      query+="&email="+email;
      query+="&description="+description;
      
      xhttp.send(query);

    };