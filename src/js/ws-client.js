const ws = require("./web-socket");
var meetingid = "10";
var Client;
ws("10.5.22.216:4100/code-editor", meetingid)
.then((client) => {
    Client = client;

})
.catch((err) => {
    console.error(err)
})



