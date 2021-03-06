
      $( document ).ready(function() {

          $('#return_date_checkbox').change(function() {
            if($(this).is(':checked')){
                     $('#return_date').prop('disabled',false);
                     $("#return_date").val(moment().format('DD-MM-YYYY'));
                     $('input[name="return_date"]').daterangepicker({
                       locale: {
                         format: 'DD-MM-YYYY'
                       },
                         singleDatePicker: true,
                         showDropdowns: true
                     });
                }
                 else
                     {
                      $('#return_date').prop('disabled',true);
                      $("#return_date").val("Date not set");

            }
           });

          console.log( "ready!" );
          $('#modal_error').hide();
          $('#alert-success').hide();



          var issue_table=$('#issue_table').DataTable( {
          dom: '<"top"Bf>rt<"bottom"lp><"clear">',
          buttons: [
            {
                extend: 'colvis',
                text:'',
                className:'select_column',
                titleAttr: 'Select Columns',
            },
            {
            extend: 'csv',
            text: '',
            filename:'Issues',
            extension:'.csv',
            className:'csv_export',
            titleAttr: 'Export csv',
            header:false,
            footer:true,
            fieldSeparator:',',
            exportOptions: {
               columns: ':visible'
           },
            customize: function (csv) {
              var colnames='Date;Item;Category;Requestee;Place;Quantity;Occurance Date;Description'.split(';');
              var vh=get_visible_header(issue_table,colnames);
              return vh + csv;
           },
        },
        {
          extend:'print',
          text:'',
          titleAttr: 'Print',
          className:'print',
          title:document.title+" transactions",
          footer:true,
          customize: function ( win ) {
            var colnames='Date;Item;Category;Requestee;Place;Quantity;Occurance Date;Description'.split(';');
            var vh=get_header_for_print(issue_table,colnames);
            var removed=0;
            for(var i=0;i<colnames.length;i++){
              if(issue_table.column(i).visible()==false){
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

          "ajax": '/home/issueajax/'
          } );
          $('#issue_table thead th').each( function () {
          var title = $(this).text();
          {

            $(this).html( '<input type="text" placeholder="'+title+'" size="8"/>' );
          }

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
        range=date_formater(range);
        console.log(encodeURI('/home/historybydate/?range='+range));
        var htable=$('#historytable').DataTable( {
          dom: '<"top"Bf>rt<"bottom"lp><"clear">',
          buttons: [
            {
                extend: 'colvis',
                text:'',
                className:'select_column',
                titleAttr: 'Select Columns',
            },
            {
            extend: 'csv',
            text: '',
            filename:'History_requests',
            extension:'.csv',
            className:'csv_export',
            titleAttr: 'Export csv',
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
          text:'',
          titleAttr: 'Print',
          className:'print',
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
    range_item=date_formater(range_item);
    console.log(encodeURI('/home/itemhistorybydate/?range='+range_item));
    var hitable=$('#historyitemtable').DataTable({
      dom: '<"top"Bf>rt<"bottom"lp><"clear">',
      buttons: [
        {
            extend: 'colvis',
            text:'',
            className:'select_column',
            titleAttr: 'Select Columns',
        },
        {
        extend: 'csv',
        text: '',
        filename:'History_items',
        extension:'.csv',
        className:'csv_export',
        titleAttr: 'Export to csv',
        header:false,
        fieldSeparator:',',
        exportOptions: {
           columns: ':visible'
       },
        customize: function (csv) {
          // column5=column_normalize(hitable.column(5).data());
          // console.log(column5);


          var colnames='Date;Item Name;Category;Quantity;Action;New Value;Previous Value;Added by;Approved by'.split(';');
          var vh=get_visible_header(hitable,colnames);
          return vh + csv;
       },
    },
    {
      extend:'print',
      className:'print',
      titleAttr: 'Print',
      text:'',
      title:document.title+" histories",
      customize: function ( win ) {
        var colnames='Date;Item Name;Category;Quantity;Action;New Value;Previous Value;Added by;Approved by'.split(';');
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

          if($('#return_date_checkbox').is(':checked')){
            var t_date=$("#return_date").val().split('-');
            query+="&return_date="+t_date[2]+'-'+t_date[1]+'-'+t_date[0];
            console.log(query);
          }
          else{
            query+="&return_date=2050-01-01";
          }

          var req=document.getElementById("requestee").value.trim();
          var item=document.getElementById("requested_item_name_dropdown").value;
          var location=document.getElementById("location").value.trim();



          if(req.length>0 & item!='Select..' & location.length>0 & is_valid_date()==1){
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
              console.log("why?? "+req.length+' '+item+' '+location.length +' ' +is_valid_date);
              $('#modal_error').show();
              $('#myModal').effect('shake');

            }

          }
          else{
            console.log("why?? "+req.length+' '+item+' '+location.length +' ' +is_valid_date);
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
          range=date_formater(range);
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
    	$('input[name="daterange"]').daterangepicker({
          locale: {
              format: 'DD/MM/YYYY'
            },
            });

      $('input[name="daterange_item"]').daterangepicker({
        locale: {
            format: 'DD/MM/YYYY'
          },
          });
		  });
      function date_formater(d){
        d_split=d.split(' - ');
        d1=d_split[0].split('/')
        d1f=d1[1]+'/'+d1[0]+'/'+d1[2];

        d2=d_split[1].split('/');
        d2f=d2[1]+'/'+d2[0]+'/'+d2[2];

        console.log(d1f+'-'+d2f);

        return d1f+'-'+d2f;

      }

      function showhistory(){

      	range=document.getElementById("daterange").value;
        range=date_formater(range);
        console.log(encodeURI('/home/historybydate/?range='+range));
        $('#historytable').DataTable().ajax.url(encodeURI('/home/historybydate/?range='+range)).load();
      }

      function showitemhistory(){
        range=document.getElementById("daterange_item").value;
        range=date_formater(range);
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
  if(amnt==0){
    bootbox.alert("Can't return 0 item!");
  }
  else{
    console.log(itm,person,loc, amnt);

    xhttp2 = new XMLHttpRequest();
      xhttp2.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            //document.getElementById("ret_location").innerHTML='<option>Select Location</option>'+this.responseText;
            document.getElementById("ret_requestee").selectedIndex=0;
            document.getElementById("ret_location").selectedIndex=0;
            document.getElementById("ret_amount").selectedIndex=0;
            console.log(this.responseText+"R");
            bootbox.alert(
            {
              message: "Item Returned, tables updated",
              callback: function () {
                  location.reload();
                }
              }
            );
            reload_inventory();
            reload_history();

          }
      };
      xhttp2.open("GET","retitem/?item="+itm[0]+"&category="+itm[1]+"&person="+person+'&loc='+loc+'&amnt='+amnt,true);
      xhttp2.send();

  }


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
            bootbox.alert(
            {
              message: "Issue created, tables updated",
              callback: function () {
                  location.reload();
                }
              }
            );
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
      h+=colnames[i]+",";
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
  range=date_formater(range);
  $('#historyitemtable').DataTable().ajax.url(encodeURI('/home/itemhistorybydate/?range='+range)).load();
}

function reload_history(){
  range=document.getElementById("daterange").value;
  range=date_formater(range);
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
        // var pval=$("#changeprevval").html();
        // pval=pval.replace('anchor',obj.previous_value);
        // console.log(pval);
        $("#changeprevval").html(obj.previous_value)

        // var nval=$("#changenewval").html();
        // nval=nval.replace('anchor',obj.new_value);
        // console.log(nval);
        $("#changenewval").html(obj.new_value);

        $("#detailsModal").modal('show');

      }
  };
  xhttp2.open("GET","getchangedetails/?id="+id,true);
  xhttp2.send();
}

function column_normalize(col){
  for(var i=0;i<col.length;i++){
    if(col[i].visible()==true){
      s=String(col[i]);
      console.log(s.indexOf('showchangedetails'));
    }

  };
  return col;
}

function is_valid_date(){
  var x=document.getElementById("return_date").value;
  var r;
  if(x=="Date not set"){
    r=1;
  }
  else{
    var d=$("#return_date").val().split('-');
    var f=d[1]+'-'+d[0]+'-'+d[2];
    var d1 = new Date(f);
    var today = new Date(moment().format('MM-DD-YYYY'));

    if(d1.getTime()>today.getTime()){
      r=1;
    }
    else{
      r=0;
    }
  }
  return r;
}
