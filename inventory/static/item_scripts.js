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
      address=document.getElementById('vaddress').value;
      cperson=document.getElementById('cperson').value;
      contact=document.getElementById('vcontact').value;
      email=document.getElementById('vemail').value;
      description=document.getElementById('vdescription').value;

      var xhttp = new XMLHttpRequest();
          
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
                console.log("vendor table updated"); 
                document.getElementById('vendor_list').innerHTML+="<option value="+name+">"; 
                //window.location="/vendor/";    
              
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
      send();

    }

      function send(){

         name=document.getElementById('iname').value;
          quantity=document.getElementById('iquantity').value;
          minquant=document.getElementById('minquant').value;
          price=document.getElementById('uprice').value;
          description=document.getElementById('description').value;
          vendor=document.getElementById('vendor').value;

          var xhttp = new XMLHttpRequest();
          
          xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                  if(this.responseText=="oka"){
                    document.getElementById('new').innerHTML="<b>"+name+" added successfully to database";

                  }  
                     
                
                }
              };
          xhttp.open("POST", "additem/", true);
          var csrftoken = getCookie('csrftoken');
                    
          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhttp.setRequestHeader("X-CSRFToken", csrftoken);
          query="name="+name;
          query+="&quantity="+quantity;
          query+="&minquant="+minquant;
          query+="&price="+price;
          query+="&description="+description;
          query+="&vendor="+vendor;
          
          xhttp.send(query);

          };

      function additem(){
        vendor=document.getElementById("vendor").value;

        var array = $('#vendor_list option').map(function () {
              return this.value;
              }).get();
        

        if(array.indexOf(vendor)==-1){
          console.log('add vendor first');
          document.getElementById('vname').value=vendor;
          $('#newvendorModal').modal('show');

          
        }

        
        else{
          if(vendor.length==0){
            bootbox.confirm("Proceed with empty vendor?", function(result){ 
            if(result==true){
              send();
              } 
            })
          }
          else{
            send();
          }
          
        }

        



      };

      function information(name){
        if(name!='Select..'){
          xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                  val=this.responseText.split('-');
                  console.log(val);
                  document.getElementById('qty').innerHTML="Add Item(Existing "+val[0]+"):";
                  document.getElementById('minquant2').value=val[1];
                  document.getElementById('uprice2').value=val[2];
                  document.getElementById('vendor2').value=val[3];
                  document.getElementById('description2').value=val[4];

              }
          };
          xhttp.open("GET", "information/?item_name=" + name, true);
          xhttp.send();
        }
      };

      function updateitem(){
        name=document.getElementById('iname2').value;
        newname=document.getElementById('newname').value;
        quant=document.getElementById('iquantity2').value;
        minquant=document.getElementById('minquant2').value;
        price=document.getElementById('uprice2').value;
        description=document.getElementById('description2').value;
        vendor=document.getElementById('vendor2').value;

        var xhttp = new XMLHttpRequest();
          
          xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                  if(this.responseText=="okay"){
                    document.getElementById('existing').innerHTML="<b>"+name+" successfully updated </b>";

                  }  
                     
                
                }
              };
          xhttp.open("POST", "updateitem/", true);
          var csrftoken = getCookie('csrftoken');
                    
          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhttp.setRequestHeader("X-CSRFToken", csrftoken);
          query="name="+name;
          query+="&quantity="+quant;
          query+="&minquant="+minquant;
          query+="&price="+price;
          query+="&description="+description;
          query+="&vendor="+vendor;
          query+="&newname="+newname;
          
          
          xhttp.send(query);
        

      };