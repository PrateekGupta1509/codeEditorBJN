const primus = require('./primus')

module.exports = (eventSocketUrl, meetingId) => {
    
    console.log(eventSocketUrl);
    // eventSocketUrl = primusHeadlessCookies(eventSocketUrl);
    // console.log(eventSocketUrl.match(/http(s)?:\/\/([^\.]+\.)+(\w+):?(\d+)?/g));
    // let wsSocketUrl = eventSocketUrl.match(/http(s)?:\/\/([^\.]+\.)+(\w+):?(\d+)?/g)[0];
    // let wsPathname = eventSocketUrl.substring(wsSocketUrl.length);

    let registerData = {
        meetingId: meetingId,
    }

    let socketOptions = {
        timeout: 15000,
        pathname: "/code-editor",
        transformer: "sockjs",
        plugin: {
            emit: require('primus-emit')
        },
        iknowclusterwillbreakconnections: true
    };

    let rejectSent = false;

    return new Promise((resolve, reject) => {

        let client = primus.connect(eventSocketUrl, {
            reconnect: {
                max: 30000,
                min: 2000,
                retries: 10
            },
            port : 4100,
            ping : 5000
        });

        try{
            client.on('error', (err) => {
                console.error(`ws errored : ${((err.stack === undefined) ? err : err.stack)}`);
                if(rejectSent){
                    console.info(`Rejection already sent. Got a client error : ${err}`);
                }else{
                    reject(err);
                    rejectSent = true;
                }
            });
    
            client.on("close", () => {
                console.info(`ws closed`);
            });
    
            client.on('end', () => {
                console.info(`Client ended. It was a self close.`);
            });
    
            client.on('reconnect scheduled', (opts) => {
                console.error(`ws reconnect scheduled. ${JSON.stringify(opts)}`);
            });
    
            client.on('reconnect', (opts) => {
                console.error(`ws reconnection attempt started. Reconnect opts : ${JSON.stringify(opts)}`);
            });
    
            client.on('reconnected', (opts) => {
                console.info(`ws reconnected. ${JSON.stringify(opts.duration)}`);
            });
    
            client.on('reconnect timeout', (err, opts) => {
                console.error(`ws reconnect timeout. ${(err = (err.stack === undefined) ? err : err.stack)}`);
            });
    
            client.on('reconnect failed', (err, opts) => {
                console.error(`ws reconnect failed ${(err = (err.stack === undefined) ? err : err.stack)}`);
            });
    
            client.on('open', () => {
                console.info(`ws opened. Emitting a2mevent.notification.register`);
                client.emit("a2mevent.notification.register", registerData);
            });
    
            client.on('a2mevent.notification.registered', (data) => {
                console.info(`ws registered. Data from server : ${JSON.stringify(data)}`)
                resolve(client);
            });

            client.on('a2mevent.notification.message', (options) => {
                console.info(`Message from server : ${JSON.stringify(options)}`)
                if(options.action == "CHANGE_CODE") {
                    var languageId = document.getElementById('language-select').value;
                    var languageInput = document.getElementById('language-select');
                    var code = editor.getValue();
                    if(languageId !== options.message.language_id){
                        languageInput.value = options.message.language_id;
                    }
                    if(code !== options.message.source_code){
                        editor.setValue(options.message.source_code);
                    }
                } 
                if(options.action == "SHOW_RESULT") {
                        var resultDiv = document.getElementById('output');
                        resultDiv.value = options.message;
                }

            });
    
            client.on('data', (data) => {
                console.info(`ws received data from server : ${JSON.stringify(data)}`);
            });
        }catch(err){
            if(rejectSent){
                console.info(`Rejection already sent. Current exception : ${err}`)
            }else{
                reject(err)
                rejectSent = true;
            }
        }

    });
}
