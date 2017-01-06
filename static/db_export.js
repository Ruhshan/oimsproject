function getdate(){
  d=Date().split(' ');
  r=d[1]+'_'+d[2]+'_'+d[3];
  return r;
}

function export_db(){

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {

  if (this.readyState == 4 && this.status == 200) {

    var blob = new Blob([this.responseText], {type: "application/json;charset=utf-8"});
    saveAs(blob, "backup-"+getdate()+".json");
  }
  };
xhttp.open("GET", "/superadminexport", true);
xhttp.send();
}
