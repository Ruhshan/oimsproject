    /*function getCookie(name) {
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
      }
      function isvalid(pass){
      	 var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
		return re.test(pass);

      };
*/

      function validateForm(){
        var ret=true;
        var r=true;
        fname=document.getElementById('fname').value;
        newp=document.getElementById('newp').value;
        //console.log(fname);
        //console.log(newp);

        if(fname==null || fname==""){
          bootbox.alert("Name is empty");
          ret= ret && false;

        }
        
        if(newp.length>0){

          r=confirm("Account will be locked");
           
        }
      if(r==true){
        ret=ret&&true;
      }
      else{
        ret=ret&&false;
      }

      console.log("l:"+ret);
      
      return ret;
      }

