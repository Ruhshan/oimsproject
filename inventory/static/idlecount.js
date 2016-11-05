var IDLE_TIMEOUT_REFRESH = 60;
var IDLE_TIMEOUT_LOGOUT = 360; //seconds
var _idleSecondsCounter = 0;
document.onclick = function () {
    _idleSecondsCounter = 0;
};
document.onmousemove = function () {
    _idleSecondsCounter = 0;
};
document.onkeypress = function () {
    _idleSecondsCounter = 0;
};
window.setInterval(CheckIdleTime, 1000);

function CheckIdleTime() {
    _idleSecondsCounter++;
    
    if (_idleSecondsCounter >= IDLE_TIMEOUT_REFRESH) {
        
        location.reload();
    }
    if (_idleSecondsCounter >= IDLE_TIMEOUT_LOGOUT){
        document.location.href = "/logout/";
    }


}