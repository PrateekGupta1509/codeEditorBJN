import './css/main.less';
import './theme';
import ws from './js/web-socket';
import LanguageObject from './js/language.json';

var meetingid = "10";
var Client;

var pending;

function updateCode(){
	var options = getValueObject();
	Client.changeCode(options);
}


editor.on("change", function() {
  clearTimeout(pending);
  pending = setTimeout(updateCode, 400);
});

var languageInput = document.getElementById('language-select');
languageInput.onchange = updateCode;

function changeUIonUpdate(options){
  var languageId = document.getElementById('language-select').value;
  var code = editor.getValue();
	if(languageId !== options.language_id){
		languageInput.value = options.language_id;
	}
	if(code !== options.source_code){
		editor.setValue(options.source_code);
	}
}

ws("localhost:4100/code-editor", meetingid)
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


		Client.recieveCode = function(options) {
		    // CALL API
			console.log(options);
		}

		Client.changeCode = function(options) {
		    // CALL API
			console.log(options);
		}

		Client.uploadCode = function(options) {
		    // CALL API
		    changeUIonUpdate(options);
			console.log(options);
		}
	})
	.catch((err) => {
	    console.error(err)
	});

function getValueObject(){
  var code = editor.getValue();
  var languageId = document.getElementById('language-select').value;
  return {
  	'language_id': languageId,
  	'source_code': code
  }
}

function runCode(){
	var options = getValueObject();
    Client.uploadCode(options);
}

var runCodeButton = document.getElementById("runCodeButton");
runCodeButton.onclick = runCode;

var themeInput = document.getElementById("theme-select");
function selectTheme() {
	var theme = themeInput.options[themeInput.selectedIndex].textContent;
	editor.setOption("theme", theme);
}
themeInput.onchange = selectTheme;