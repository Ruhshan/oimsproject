var reload=document.getElementById("reload").value;
var timeout=document.getElementById("tout").value;


//var IDLE_TIMEOUT_REFRESH = parseInt(reload);
var IDLE_TIMEOUT_REFRESH=30;
//var IDLE_TIMEOUT_LOGOUT = parseInt(timeout); //seconds
var _idleSecondsCounter = 0;
var logflag=0;
document.onclick = function () {
    _idleSecondsCounter = 0;
    logflag=0;
};
document.onmousemove = function () {
    _idleSecondsCounter = 0;
    logflag=0;
};
document.onkeypress = function () {
    _idleSecondsCounter = 0;
    logflag=0;
};

window.setInterval(CheckIdleTime, 1000);
function CheckIdleTime() {
    _idleSecondsCounter++;

    if (_idleSecondsCounter >= IDLE_TIMEOUT_REFRESH) {
        logflag++;
        console.log("logflag value:"+logflag);

        setTimeout(function(){
            window.location.href = null;
        }, 3000);
        
    }
    


}