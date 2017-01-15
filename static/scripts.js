
      $( document ).ready(function() {
          console.log( "ready!" );
          $('#modal_error').hide();
          $('#alert-success').hide();

          $('#issue_table thead th').each( function () {
        var title = $(this).text();
        {
          $(this).html( '<input type="text" placeholder="'+title+'" size="8"/>' );
        }

    } );

          var issue_table=$('#issue_table').DataTable( {
          "ajax": '/home/issueajax/'
          } );

    // App/*/*ly the search
    issue_table.columns().every( function () {
        var that = this;

        $( 'input', this.header() ).on( 'keyup change', function () {
            if ( that.search() !== this.value ) {
                that
                    .search( this.value )
                    .draw();
            }
        } );
        } );


      //historytable start


        //var htable=$('#historytable').DataTable({select: true});

        range=document.getElementById("daterange").value;
        console.log(encodeURI('/home/historybydate/?range='+range));
        var htable=$('#historytable').DataTable( {
          dom: '<"top"Bf>rt<"bottom"lp><"clear">',
          buttons: [
            {
                extend: 'colvis',
                text:'Select Columns',
            },
            {
            extend: 'csv',
            text: 'Export to CSV',
            filename:'History_requests',
            extension:'.csv',
            header:false,
            footer:true,
            fieldSeparator:',',
            exportOptions: {
               columns: ':visible'
           },
            customize: function (csv) {
              var colnames='Date;Item Name;Category;Location;Price;Quantity;Action;Requestee;Processed by'.split(';');
              var vh=get_visible_header(htable,colnames);
              return vh + csv;
           },
        },
        {
          extend:'print',
          title:document.title+" transactions",
          footer:true,
          customize: function ( win ) {
            var colnames='Date;Item Name;Category;Location;Price;Quantity;Action;Requestee;Processed by'.split(';');
            var vh=get_header_for_print(htable,colnames);
            var removed=0;
            for(var i=0;i<colnames.length;i++){
              if(htable.column(i).visible()==false){
                  var toremove=parseInt(i)-parseInt(removed);
                  $(win.document.body).find("table").find("tr").find("td:eq("+toremove+")").remove();
                  removed+=parseInt(1);
              }
            }


            $(win.document.body).find("table").find("thead").html(vh);
            $(win.document.body).find( 'table' ).addClass('compact');

            //return win;
          }
        }
      ],

          "ajax": encodeURI('/home/historybydate/?range='+range),
          'footerCallback': function ( row, data, start, end, display ) {
              var api = this.api(), data;
              var total = api.column(5).data();
              var pagetotal=api.column(5,{ page: 'current'}).data();

              $( api.column(5).footer() ).html(
                colsum(pagetotal)+' of:'+colsum(total)
              );
            }
          } );


          $('#historytable thead th').each( function () {
          var title = $(this).text();
          {

            $(this).html( '<input type="text" placeholder="'+title+'" size="8"/>' );
          }

      } );
    // Apply the search
    htable.columns().every( function () {
        var that = this;

        $( 'input', this.header() ).on( 'keyup change', function () {
            if ( that.search() !== this.value ) {
                that
                    .search( this.value )
                    .draw();
            }
        } );
        } );
    //historytable end


    //historyitemtable start

    var range_item=document.getElementById('daterange_item').value;
    console.log(encodeURI('/home/itemhistorybydate/?range='+range_item));
    var hitable=$('#historyitemtable').DataTable({
      dom: '<"top"Bf>rt<"bottom"lp><"clear">',
      buttons: [
        {
            extend: 'colvis',
            text:'Select Columns',
        },
        {
        extend: 'csv',
        text: 'Export to CSV',
        filename:'History_items',
        extension:'.csv',
        header:false,
        fieldSeparator:',',
        exportOptions: {
           columns: ':visible'
       },
        customize: function (csv) {
          var colnames='Date;Item Name;Category;Quantity;Action;Modification of;Remarks;Added by;Approved by'.split(';');
          var vh=get_visible_header(htable,colnames);
          return vh + csv;
       },
    },
    {
      extend:'print',
      title:document.title+" histories",
      customize: function ( win ) {
        var colnames='Date;Item Name;Category;Quantity;Action;Modification of;Remarks;Added by;Approved by'.split(';');
        var vh=get_header_for_print(hitable,colnames);
        var removed=0;
        for(var i=0;i<colnames.length;i++){
          if(hitable.column(i).visible()==false){
              var toremove=parseInt(i)-parseInt(removed);
              $(win.document.body).find("table").find("tr").find("td:eq("+toremove+")").remove();
              removed+=parseInt(1);
          }
        }


        $(win.document.body).find("table").find("thead").html(vh);
        $(win.document.body).find( 'table' ).addClass('compact');

        //return win;
      }
    }
    ],

      "ajax": encodeURI('/home/itemhistorybydate/?range='+range_item),});


      $('#historyitemtable thead th').each( function () {
      var title = $(this).text();
      {

        $(this).html( '<input type="text" placeholder="'+title+'" size="8"/>' );
      }

      } );
// Apply the search
hitable.columns().every( function () {
    var that = this;

    $( 'input', this.header() ).on( 'keyup change', function () {
        if ( that.search() !== this.value ) {
            that
                .search( this.value )
                .draw();
        }
    } );
    } );

    //historyitemtable end







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
          str=str.split('$')
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
          xhttp.open("GET", "itemqty?requested_name=" + str[0]+"&category="+str[1], true);
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
          selected_item=document.getElementById("requested_item_name_dropdown").value.split('$')

          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhttp.setRequestHeader("X-CSRFToken", csrftoken);
          query = "requested_item_name_dropdown="+selected_item[0];
          query += "&category="+selected_item[1];
          query += "&requested_quantity=" + document.getElementById("item_quantity_dropdown").value;
          query += "&requestee=" + document.getElementById("requestee").value.trim();
          query += "&description=" + document.getElementById("description").value;
          query +="&location="+document.getElementById("location").value.trim();

          var req=document.getElementById("requestee").value.trim();
          var item=document.getElementById("requested_item_name_dropdown").value;
          var location=document.getElementById("location").value.trim();

          if(req.length>0 & item!='Select..' & location.length>0){
            if(req!="Not Specified" || location!="Not Specified"){
            document.getElementById('requested_item_name_dropdown').value="Select..";
            document.getElementById('item_quantity_dropdown').value="1";
            document.getElementById("requestee").value="";
            document.getElementById("description").value=" ";
            document.getElementById("location").value="";

            xhttp.send(encodeURI(query));
            $('#myModal').modal('hide');
            /*$('#alert-success').show("drop", { direction: "up" }, "slow");

            setTimeout(function(){
              $("#alert-success").alert("close");
            },2000);*/
          }else{
            $('#modal_error').show();
            $('#myModal').effect('shake');

          }

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
          //Reload inventory table
          $('#inventorytable').DataTable().ajax.reload();
          //reload history table
          range=document.getElementById("daterange").value;
          $('#historytable').DataTable().ajax.url(encodeURI('/home/historybydate/?range='+range)).load();
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
      $('input[name="daterange_item"]').daterangepicker();
		});

      function showhistory(){

      	range=document.getElementById("daterange").value;
        console.log(encodeURI('/home/historybydate/?range='+range));
        $('#historytable').DataTable().ajax.url(encodeURI('/home/historybydate/?range='+range)).load();
      }

      function showitemhistory(){
        range=document.getElementById("daterange_item").value;
        console.log(encodeURI('/home/itemhistorybydate/?range='+range));
        $('#historyitemtable').DataTable().ajax.url(encodeURI('/home/itemhistorybydate/?range='+range)).load();
      }

      function resethistory(range){
        document.getElementById("daterange").value=range;
      }

      function resetitemhistory(range){
        document.getElementById("daterange_item").value=range;
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

function itemactionok(req_id){

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      }
    };
  xhttp.open("POST", "itemadminaction/", true);
  var csrftoken = getCookie('csrftoken');

  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.setRequestHeader("X-CSRFToken", csrftoken);
  query="req_id="+req_id;
  query+="&action=ok";

  xhttp.send(query);

  toclose="#createitem_req_panel"+req_id;
  console.log(toclose);
  $(toclose).hide("drop", { direction: "up" }, "slow");
  reload_inventory();
  reload_item_history();

}

function itemactioncancel(req_id){

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      }
    };
  xhttp.open("POST", "itemadminaction/", true);
  var csrftoken = getCookie('csrftoken');

  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.setRequestHeader("X-CSRFToken", csrftoken);
  query="req_id="+req_id;
  query+="&action=cancel";

  xhttp.send(query);

  toclose="#createitem_req_panel"+req_id;
  console.log(toclose);
  $(toclose).hide("drop", { direction: "up" }, "slow");
  reload_inventory();
  reload_item_history();
}

function itemactionadd(req_id){

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      }
    };
  xhttp.open("POST", "itemadminaction/", true);
  var csrftoken = getCookie('csrftoken');

  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.setRequestHeader("X-CSRFToken", csrftoken);
  query="req_id="+req_id;
  query+="&action=add";

  xhttp.send(query);

  toclose="#createitem_req_panel"+req_id;
  console.log(toclose);
  $(toclose).hide("drop", { direction: "up" }, "slow");
  reload_inventory();
  reload_item_history();
}

function itemactionremove(req_id){

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      }
    };
  xhttp.open("POST", "itemadminaction/", true);
  var csrftoken = getCookie('csrftoken');

  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.setRequestHeader("X-CSRFToken", csrftoken);
  query="req_id="+req_id;
  query+="&action=remove";

  xhttp.send(query);

  toclose="#createitem_req_panel"+req_id;
  console.log(toclose);
  $(toclose).hide("drop", { direction: "up" }, "slow");
  reload_inventory();
  reload_item_history();
}

function popovercontent(id,rep){
  item_id=id.replace(rep,'');
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          console.log(this.responseText);
      }
  };
  xhttp.open("GET", "item/" + item_id+"/", true);
  xhttp.send();

  //return item_id;
}

function showretrequestee(item_name){

  if(item_name!='Select Item'){
    console.log(item_name);
    var selected=item_name.split('$');
    console.log(item_name);
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText);
            document.getElementById('ret_requestee').innerHTML=`<option>Select Requestee</option>`+this.responseText;
        }
    };
    xhttp.open("GET", "showrequestee/?item_name="+selected[0]+"&category="+selected[1], true);
    xhttp.send();

  }
  else{
    document.getElementById('ret_requestee').innerHTML=`<option>Select Requestee</option>`;
    document.getElementById('button-place').innerHTML=``;
    //document.getElementById('button-place').innerHTML=``;
  }
}

function showretamounts(ret_location){
  if(ret_location!='Select Location'){
    selected_item=document.getElementById('ret_item_name').value.split('$');
    requestee=document.getElementById('ret_requestee').value;
    console.log(selected_item,requestee);
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        console.log(this.responseText);
        if (this.readyState == 4 && this.status == 200) {
          for(var i=0;i<=this.responseText;i++){
            //console.log(i);
            if(i==0){
              document.getElementById('ret_amount').innerHTML='<option>'+i+'</option>';
            }
            else{
              document.getElementById('ret_amount').innerHTML+='<option>'+i+'</option>';
            }

          }
          document.getElementById('button-place').innerHTML=`<button type="button" class="btn btn-primary" onclick="returnbutton()">Submit</button>`;
        }
    };
    console.log("showretamounts/?item=" + selected_item[0]
      +"&category="+selected_item[1]+"&req_name="+requestee+"&ret_location="+ret_location);
    xhttp.open("GET", "showretamounts/?item=" + selected_item[0]
      +"&category="+selected_item[1]+"&req_name="+requestee+"&ret_location="+ret_location, true);
    xhttp.send();

  }
  else{
    document.getElementById('ret_amount').innerHTML=`<option></option>`;
    document.getElementById('button-place').innerHTML=``;
  }


}



function showlocation(){
  var req_name=document.getElementById("ret_requestee").value;
  if(req_name!="Select Requestee"){
    selected_item=document.getElementById('ret_item_name').value.split('$');
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          document.getElementById("ret_location").innerHTML='<option>Select Location</option>'+this.responseText;
        }
    };

    var uri=encodeURI("showlocations/?item="+selected_item[0]+"&category="+selected_item[1]+"&req_name="+req_name);
    console.log(req_name);
    console.log(uri);
    xhttp.open("GET",uri,true);
    xhttp.send();
  }
  else{
    document.getElementById('ret_location').innerHTML=`<option>Select Location</option>`;
    document.getElementById('button-place').innerHTML=``;
    //document.getElementById('button-place').innerHTML=``;
  }
}

function returnbutton(){
  console.log("Return called");
  itm=document.getElementById("ret_item_name").value.split('$');
  person=document.getElementById("ret_requestee").value;
  loc=document.getElementById("ret_location").value;
  amnt=document.getElementById("ret_amount").value;
  console.log(itm,person,loc, amnt);

  xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          //document.getElementById("ret_location").innerHTML='<option>Select Location</option>'+this.responseText;
          document.getElementById("ret_requestee").selectedIndex=0;
          document.getElementById("ret_location").selectedIndex=0;
          document.getElementById("ret_amount").selectedIndex=0;
          console.log(this.responseText+"R");
          bootbox.alert("Item Returned, tables updated");
          reload_inventory();
          reload_history();

        }
    };
    xhttp2.open("GET","retitem/?item="+itm[0]+"&category="+itm[1]+"&person="+person+'&loc='+loc+'&amnt='+amnt,true);
    xhttp2.send();

}

function showretrequestee_issue(item_name){

  if(item_name!='Select Item'){
    var selected=item_name.split('$');
    console.log("before:"+item_name);
    console.log("after:"+selected);
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText);
            document.getElementById('issue_requestee').innerHTML=`<option>Select Requestee</option>`+this.responseText;
        }
    };
    xhttp.open("GET", "showrequestee/?item_name="+selected[0]+"&category="+selected[1], true);
    xhttp.send();

  }
  else{
    document.getElementById('issue_requestee').innerHTML=`<option>Select Requestee</option>`;
    //document.getElementById('button-place').innerHTML=``;
    document.getElementById('issue-button-place').innerHTML=``;
  }
}

function showlocation_issue(req_name){
  if(req_name!="Select Requestee"){
    selected_item=document.getElementById('issue_item_name').value.split('$');
    console.log(selected_item,req_name);
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          document.getElementById("issue_location").innerHTML='<option>Select Location</option>'+this.responseText;
        }
    };
    xhttp.open("GET","showlocations/?item="+selected_item[0]+"&category="+selected_item[1]+"&req_name="+req_name,true);
    xhttp.send();
  }
  else{
    document.getElementById('issue_location').innerHTML=`<option>Select Location</option>`;
    document.getElementById('issue-button-place').innerHTML=``;
  }
}


function showretamounts_issue(ret_location){
  if(ret_location!='Select Location'){
    selected_item=document.getElementById('issue_item_name').value.split('$');
    requestee=document.getElementById('issue_requestee').value;
    console.log(selected_item,requestee, ret_location);
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          for(var i=1;i<=this.responseText;i++){
            //console.log(i);
            if(i==1){
              document.getElementById('issue_amount').innerHTML='<option>'+i+'</option>';
            }
            else{
              document.getElementById('issue_amount').innerHTML+='<option>'+i+'</option>';
            }

          }
          document.getElementById('issue-button-place').innerHTML=`<button class="btn btn-primary" type="button" onclick="issuebutton()">Make Issue</button>`;
        }
    };
    xhttp.open("GET", "showretamounts/?item=" + selected_item[0]+"&category="+selected_item[1]+
      "&req_name="+requestee+"&ret_location="+ret_location, true);
    xhttp.send();

  }
  else{
    document.getElementById('issue_amount').innerHTML=`<option></option>`;
    document.getElementById('issue-button-place').innerHTML=``;

  }


}


function issuebutton(){
  console.log("issue called");
  itm=document.getElementById("issue_item_name").value.split('$');
  person=document.getElementById("issue_requestee").value;
  loc=document.getElementById("issue_location").value;
  amnt=document.getElementById("issue_amount").value;
  desc=document.getElementById("issue_description").value;
  date=document.getElementById("issue_date").value;
  console.log(itm,person,loc, amnt,desc);

  xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

          console.log(this.responseText+"R");
          if(this.responseText=="ok"){
            $('#issue_table').DataTable().ajax.reload();
          }
          //location.reload();
        }
    };
    xhttp2.open("GET","createissue/?item="+itm[0]+"&category="+itm[1]+"&person="+person+
      '&loc='+loc+'&amnt='+amnt+'&desc='+desc+'&date='+date,true);
    xhttp2.send();

}

function get_visible_header(dtable,colnames){
  var h="";
  for(var i=0;i<colnames.length;i++){
    if(dtable.column(i).visible()==true){
      h+=colnames[i]+";";
    }
  }
  return h+"\n";
}

function get_header_for_print(dtable,colnames){
  var h="";
  for(var i=0;i<colnames.length;i++){
    if(dtable.column(i).visible()==true){
      h+="<th>"+colnames[i]+"</th>";
    }
  }
  return "<tr>"+h+"</tr>";
}

function colsum(data){
  var ret=0;
  try{
      for(var i=0;i<data.length;i++){
        ret+=parseFloat(data[i]);
      }
  }
  catch(err){
    console.log(err.message);
  }
  return ret;

}

function reload_inventory(){
  $('#inventorytable').DataTable().ajax.reload();
}

function reload_item_history(){
  range=document.getElementById('daterange_item').value;
  $('#historyitemtable').DataTable().ajax.url(encodeURI('/home/itemhistorybydate/?range='+range)).load();
}

function reload_history(){
  range=document.getElementById("daterange").value;
  $('#historytable').DataTable().ajax.url(encodeURI('/home/historybydate/?range='+range)).load();
}


function getchangedetails(id){

}

function showchangedetails(id){
  xhttp2 = new XMLHttpRequest();
  xhttp2.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {

        obj=JSON.parse(this.responseText);
        console.log(obj.action);
        $("#changeheader").html("Changes in: "+obj.name+'('+obj.category+')');
        var pval=$("#changeprevval").html();
        pval=pval.replace('anchor',obj.previous_value);
        console.log(pval);
        $("#changeprevval").html(pval)

        var nval=$("#changenewval").html();
        nval=nval.replace('anchor',obj.new_value);
        console.log(nval);
        $("#changenewval").html(nval);

        $("#detailsModal").modal('show');

      }
  };
  xhttp2.open("GET","getchangedetails/?id="+id,true);
  xhttp2.send();
}
