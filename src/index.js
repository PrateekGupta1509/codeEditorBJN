import './css/main.less';
import './theme';
import ws from './js/web-socket';
import LanguageObject from './js/language.json';

var meetingid = "10";
var Client;
var didIMakeChange = false;
var pending;

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function updateCode(){
	var options = getValueObject();
	Client.changeCode(options);
}


editor.on("paste", 
	debounce(function(){updateCode();},500) 
);

editor.on("keypress", 
	debounce(function(){updateCode();},500) 
);

var languageInput = document.getElementById('language-select');
languageInput.onchange = updateCode;



ws("10.5.22.216:4100/code-editor", meetingid)
	.then((client, data, someBlah) => {
	    Client = client;


		if(someBlah) {

			Client.on('a2mevent.notification.message', (data) => {
                if(data.action == "CHANGE_CODE") {
		    		changeUIonUpdate(data.message);
		        }
		        if(data.action == "SHOW_RESULT") {
		        	// change result ui block
		        } 

		    	console.log("receiveCode", data.message);
            });
		    
		}

		Client.changeCode = function(options) {
		    console.log("changeCode", options);
		    Client.emit("a2mevent.notification.message", {
		        meetingId: meetingid,
		        action : "CHANGE_CODE",
		        message: options
		    });
		}

		Client.uploadCode = function(options) {
		    // CALL API

			console.log("uploadCode", options);
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