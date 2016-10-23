
      $( document ).ready(function() {
          console.log( "ready!" );
          $('#modal_error').hide();
          $('#alert-success').hide();


      });

      function req_close(){
        
        document.getElementById('requested_item_name_dropdown').value="Select..";
        document.getElementById('item_quantity_dropdown').value="1";
        document.getElementById("requestee").value="";
        document.getElementById("description").value=" ";
        $('#modal_error').hide();
      };

      

      function generateOptions(id, qty) {
          var xhttp;
          if (qty == "") {
              document.getElementById(id).innerHTML = "";
              return;
          }
          xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                  document.getElementById(id).innerHTML = this.responseText;
              }
          };
          xhttp.open("GET", "generateoptions?given_qty=" + qty, true);
          xhttp.send();
      };

      function showQuantity(str) {
          var xhttp;
          if (str == "") {
              document.getElementById("item_quantity_dropdown").innerHTML = "";
              return;
          }
          xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                  document.getElementById("item_quantity_dropdown").innerHTML = this.responseText;
              }
          };
          xhttp.open("GET", "itemqty?requested_name=" + str, true);
          xhttp.send();
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
      };

      function placerequest() {
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                  //document.getElementById("demo").innerHTML = this.responseText;
                  document.getElementById("request_panel").innerHTML = this.responseText + document.getElementById("request_panel").innerHTML;
                  
              }
          };
          xhttp.open("POST", "placerequest/", true);
          var csrftoken = getCookie('csrftoken');

          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhttp.setRequestHeader("X-CSRFToken", csrftoken);
          query = "requested_item_name_dropdown=";
          query += document.getElementById("requested_item_name_dropdown").value;
          query += "&requested_quantity=" + document.getElementById("item_quantity_dropdown").value;
          query += "&requestee=" + document.getElementById("requestee").value;
          query += "&description=" + document.getElementById("description").value;

          var req=document.getElementById("requestee").value;
          var item=document.getElementById("requested_item_name_dropdown").value;
          

          if(req.length>0 & item!='Select..'){
            document.getElementById('requested_item_name_dropdown').value="Select..";
            document.getElementById('item_quantity_dropdown').value="1";
            document.getElementById("requestee").value="";
            document.getElementById("description").value=" ";
            
            xhttp.send(query);
            $('#myModal').modal('hide');
            /*$('#alert-success').show("drop", { direction: "up" }, "slow");
            
            setTimeout(function(){
              $("#alert-success").alert("close");
            },2000);*/
            
          }
          else{
            $('#modal_error').show();
            $('#myModal').effect('shake');

          }
          
      };


      function processrequest(id, decesion, value) {
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              //document.getElementById("demo").innerHTML = this.responseText;
              //document.getElementById("demo").innerHTML =document.getElementById("demo").innerHTML;
              }
            };
          xhttp.open("POST", "processrequest/", true);
          var csrftoken = getCookie('csrftoken');
                    
          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhttp.setRequestHeader("X-CSRFToken", csrftoken);
          query="requested_id="+id;
          query+="&decesion="+decesion;
          query+="&value="+value;
          xhttp.send(query);

          console.log(id);
          console.log(decesion);
          console.log(value);

          toclose="#req_panel"+id;
          $(toclose).hide("drop", { direction: "up" }, "slow");
      };

      function acknowledge(id){
        var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              //document.getElementById("demo").innerHTML = this.responseText;
              //document.getElementById("demo").innerHTML =document.getElementById("demo").innerHTML;
              }
            };
          xhttp.open("POST", "acknowledge/", true);
          var csrftoken = getCookie('csrftoken');
                    
          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhttp.setRequestHeader("X-CSRFToken", csrftoken);
          query="requested_id="+id;
          
          xhttp.send(query);

        tovanish="#"+id;
        $(tovanish).hide("drop",{direction:"down"},"slow");

      };

      $(function() {
    	$('input[name="daterange"]').daterangepicker();
		});

      function showhistory(){
      	range=document.getElementById("daterange").value;
      	console.log(range);

      	var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              document.getElementById("historytable").innerHTML = this.responseText;
              		htable.destroy();
              
        			htable=$('#historytable').DataTable({
          			select: true}
                                      );
      				
              
              //document.getElementById("demo").innerHTML =document.getElementById("demo").innerHTML;
              //console.log(this.responseText);
              }
            };
          xhttp.open("POST", "historybydate/", true);
          var csrftoken = getCookie('csrftoken');
                    
          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhttp.setRequestHeader("X-CSRFToken", csrftoken);
          query="range="+range;
          
          xhttp.send(query)
      }

      function resethistory(range){
        document.getElementById("daterange").value=range;
      }

function passwordchangeok(uname,count){
  
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      }
    };
  xhttp.open("POST", "passwordchange/", true);
  var csrftoken = getCookie('csrftoken');
            
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.setRequestHeader("X-CSRFToken", csrftoken);
  query="name="+uname;
  query+="&action=ok";
  
  xhttp.send(query);
  
  toclose="#passwordreq_req_panel"+count;
  console.log(toclose);
  $(toclose).hide("drop", { direction: "up" }, "slow");

}

function passwordchangecancel(uname,count){
  
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      }
    };
  xhttp.open("POST", "passwordchange/", true);
  var csrftoken = getCookie('csrftoken');
            
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.setRequestHeader("X-CSRFToken", csrftoken);
  query="name="+uname;
  query+="&action=cancel";
  
  xhttp.send(query);
  
  toclose="#passwordreq_req_panel"+count;
  console.log(toclose);
  $(toclose).hide("drop", { direction: "up" }, "slow");

}  