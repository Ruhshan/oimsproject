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
function isvalid(pass){
         var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    return re.test(pass);

      };
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
}

function validateForm(){

  fname=document.getElementById('fname').value;
  oldp=document.getElementById('oldp').value;

  //console.log(fname);
  //console.log(newp);
  console.log(oldp);
  console.log(fname);
  if(fname==null || fname==""){
    bootbox.alert("Name is empty");
    return false;
  }
  if(oldp==null||oldp==""){
    bootbox.alert("Password is empty");
    return false;
  }

}


function changepassword(){
  var name=document.getElementById("myusername").value;
  console.log(name);
  ///ajax initialization
      var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
                if(this.responseText=="wrong password"){
                  console.log("wrong password");
                }
                if(this.responseText=="okay"){
                  window.location="/login/";
                }

              }

          };
          xhttp.open("POST", "changepassword/", true);
          var csrftoken = getCookie('csrftoken');

          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhttp.setRequestHeader("X-CSRFToken", csrftoken);
       //ajax initialization

  try{
    var old2=document.getElementById("oldpassword2").value;
    var new2=document.getElementById("newpassword2").value;

    var new1=document.getElementById("newpassword1").value;
    var old1=document.getElementById('oldpassword1').value;

    query="old1="+old1;
    query+="&old2="+old2;
    query+="&new1="+new1;
    query+="&new2="+new2;
    query+="&type="+'admin';
    query+="&name="+name;
    bootbox.confirm("Your account will be automatically logged out!",
          function(result){
            if(result==true){
               xhttp.send(query);
               }
            else{
              console.log("cancelled");
            }

            });
  }
  catch(err){
    var new1=document.getElementById("newpassword1").value;
    var old1=document.getElementById('oldpassword1').value;

    query="old1="+old1;
    query+="&new1="+new1;
    query+="&type="+'user';
    query+="&name="+name;

    bootbox.confirm("Your account will be locked until admin confirms!",
          function(result){
            if(result==true){
               xhttp.send(query);
               }
            else{
              console.log("cancelled");
            }

            });
          }


  }
