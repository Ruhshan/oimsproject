

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var reload=document.getElementById("reload").value;
var timeout=document.getElementById("tout").value;


var IDLE_TIMEOUT_REFRESH = parseInt(reload);
//var IDLE_TIMEOUT_REFRESH=30;
var IDLE_TIMEOUT_LOGOUT = parseInt(timeout); //seconds
var IDLE_TIMEOUT_LOGOUT_ALERT=IDLE_TIMEOUT_LOGOUT-20;
console.log("idle logout:"+IDLE_TIMEOUT_LOGOUT);
var _idleSecondsCounter = 0;
var logflag=0;
document.onclick = function () {
    _idleSecondsCounter = 0;
    setCookie("logout_after", 0, 2);
    alerted=0;
    
};
document.onmousemove = function () {
    _idleSecondsCounter = 0;
    setCookie("logout_after", 0, 2);
    alerted=0;
    
};
document.onkeypress = function () {
    _idleSecondsCounter = 0;
    setCookie("logout_after", 0, 2);
    alerted=0;

};

var alerted=0;
var cancelled=0;
window.setInterval(CheckIdleTime, 1000);
function CheckIdleTime() {
    _idleSecondsCounter++;

    if (_idleSecondsCounter >= IDLE_TIMEOUT_REFRESH) {
        var now = parseInt(getCookie("logout_after"));
        var drop=now+_idleSecondsCounter;
        setCookie("logout_after", drop, 2);

        setTimeout(function(){
            window.location.reload();
        }, 10);
        
    }

    var now = parseInt(getCookie("logout_after"));
    if(now >= IDLE_TIMEOUT_LOGOUT){
        setCookie("logout_after", 0, 2);
        console.log("logging out!");
        setTimeout(function(){
            window.location="/logout/";
        }, 10);
              
    }

    if(now >= IDLE_TIMEOUT_LOGOUT_ALERT && alerted==0){
        alerted=1;
        bootbox.confirm({
            message: "You'll be logged out in <div id='SecondsRemaining'>20</div> Secconds! \
            click cancel to keep logged in",
            buttons: {
                confirm: {
                    label: 'Ok',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'Cancel',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if(result==false){
                    alerted=0;
                    _idleSecondsCounter = 0;
                    setCookie("logout_after", 0, 2);
                    cancelled=1;
                }
            }
        });
        (function(){
    var remaining = 20; // Number of seconds
    var obj = document.getElementById("SecondsRemaining");
    var timeout = window.setInterval(function(){
        remaining--;
        if(remaining==0) {
            // Time is up, stop the timer and hide the bootbox
            window.clearInterval(timeout);
            bootbox.hideAll();
            if(cancelled==0){
                setTimeout(function(){
                window.location="/logout/";
                }, 2);    
                }
            
            return;
        }
        obj.innerHTML = remaining; // Update the value displayed
    }, 1000); // Decrease counter every second
    })(); 
    }

    


}