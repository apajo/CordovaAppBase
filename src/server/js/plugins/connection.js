
/*
 * Display "waiting for connection" modal on online state change events
 */
Core.extend("connection", function (core) {
    var updateOnlineStatus = function (e) {

        if (navigator.onLine) {
            $('#modal-connection').modal('hide');
        } else {
            $('#modal-connection').modal('show');
        }
    }
    
    document.addEventListener("online", updateOnlineStatus, false);
    document.addEventListener("offline", updateOnlineStatus, false);
    window.addEventListener('online',  updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
});