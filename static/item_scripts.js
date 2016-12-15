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
      query="name="+name.trim();
      query+="&cperson="+cperson.trim();
      query+="&address="+address.trim();
      query+="&contact="+contact.trim();
      query+="&email="+email.trim();
      query+="&description="+description.trim();

      xhttp.send(query);
      send();

    }
    function is_alphabet(c){
      return /^[a-z-A-Z]$/.test(c);
    }
    function process(val){
      var r="";
      for(var i=0;i<val.length;i++){
        if(i==0 && is_alphabet(val.charAt(i))){
          r+=val.charAt(i).toUpperCase();
        }
        else if(i>0 && is_alphabet(val.charAt(i))){
          r+=val.charAt(i).toLowerCase();
        }
        else{
          r+=val.charAt(i);
        }
      }
      return r;
    }

      function send(){

         name=document.getElementById('iname').value;
         name=process(name);

         category=document.getElementById('category').value;
         category=process(category);
          quantity=document.getElementById('iquantity').value;
          minquant=document.getElementById('minquant').value;
          price=document.getElementById('uprice').value;
          description=document.getElementById('description').value;
          vendor=document.getElementById('vendor').value;

          var xhttp = new XMLHttpRequest();

          xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                  if(this.responseText=="oka"){
                    //document.getElementById('new').innerHTML="<b>"+name+" created successfully to database";
                    bootbox.alert({
                      message: "Item created in the database, waiting for admin approval",
                      callback: function () {
                          location.reload();
                        }
                      });


                  }
                  else{
                    bootbox.alert(this.responseText);
                  }


                }
              };
          xhttp.open("POST", "additem/", true);
          var csrftoken = getCookie('csrftoken');

          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhttp.setRequestHeader("X-CSRFToken", csrftoken);
          query="name="+name.trim();
          query+="&category="+category.trim();
          query+="&quantity="+quantity.trim();
          query+="&minquant="+minquant.trim();
          query+="&price="+price.trim();
          query+="&description="+description.trim();
          query+="&vendor="+vendor.trim();

          if(check_num(quantity)==true && check_num(minquant)==true && check_num(price)==true){
            xhttp.send(query);
          }
          else{
            bootbox.alert("Invalid Data: Only numerics and dot is allowed");
          }


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
            });
          }
          else{
            send();
          }

        }





      };

      function information(name){
        if(name!='Select..'){
          name=name.split(',')
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
          xhttp.open("GET", "information/?item_name=" + name[0]+"&category="+name[1], true);
          xhttp.send();
        }
      };

      function updateitem(){
        name=document.getElementById('iname2').value.split(',')[0];
        category=document.getElementById('iname2').value.split(',')[1];
        newname=document.getElementById('newname').value;
        quant=document.getElementById('iquantity2').value;
        minquant=document.getElementById('minquant2').value;
        price=document.getElementById('uprice2').value;
        description=document.getElementById('description2').value;
        vendor=document.getElementById('vendor2').value;

        var xhttp = new XMLHttpRequest();

          xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                  console.log(this.responseText);
                  if(this.responseText=="namechange"){
                    document.getElementById('existing').innerHTML="<b> successfully updated name changed</b>";

                  }
                  if(this.responseText=="_itemupdate"){
                    document.getElementById('existing').innerHTML="<b> successfully placed request to update</b>";

                  }
                  if(this.responseText=="namechange_itemupdate"){
                    document.getElementById('existing').innerHTML="<b> successfully name chaned and placed request to update</b>";

                  }


                }
              };
          xhttp.open("POST", "updateitem/", true);
          var csrftoken = getCookie('csrftoken');

          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhttp.setRequestHeader("X-CSRFToken", csrftoken);
          query="name="+name.trim();
          query+="&category="+category.trim();
          query+="&quantity="+quant.trim();
          query+="&minquant="+minquant.trim();
          query+="&price="+price.trim();
          query+="&description="+description.trim();
          query+="&vendor="+vendor.trim();
          query+="&newname="+newname.trim();

          if(check_num(quant)==true && check_num(minquant)==true && check_num(price)==true){
            xhttp.send(query);
          }
          else{
            bootbox.alert("Invalid Data: Only numerics and dot is allowed");
          }



      };


function check_num(num){
  try{
  return /^[0-9]*\.?[0-9]*$/.test(num);
  }
  catch(err){
    return false;

  }

}

function checking( id, val){
  var target=id+'l';
  if(check_num(val)==false){
    document.getElementById(target).innerHTML=`Invalid Input`;
  }
  if(check_num(val)==true){
    document.getElementById(target).innerHTML=``;

  }
}
