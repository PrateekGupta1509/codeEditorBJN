const ws = require("./web-socket");
var meetingid = "10";
var Client;
ws("10.5.22.216:4100/code-editor", meetingid)
.then((client) => {
    Client = client;
    Client.startIDE = function() {

    this.emit("a2mevent.notification.message", {
        meetingId: meetingid,
        message: {
            "ACTION": "IDE_STARTED"
        }
    });
}


    Client.stopIDE = function() {

    this.emit("a2mevent.notification.message", {
        meetingId: meetingid,
        message: {
            "ACTION": "IDE_STOPPED"
        }
    });
}




    Client.uploadCode = function() {
    // CALL API
}





})
.catch((err) => {
    console.error(err)
})



