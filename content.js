console.log("Accessible Password Validator running");

const input_tags = document.getElementsByTagName('input');

for(item of input_tags){
    console.log(item);
    if(item.getAttribute('type') == "password"){
      readPassword(item);
    }
    else{
        console.log("No password Field Found");
        var msg = new SpeechSynthesisUtterance();
        msg.text = "No password Field Found";
        window.speechSynthesis.speak(msg);
        break;
    }
}

function readPassword(item) {
    item.oninput = function(){
        var x = item.value;
        if(x != ''){
            let msg = {
                text: x
            };
            chrome.runtime.sendMessage(msg);
        }
        else{
            let empty = {
                text: "empty"
            }
            chrome.runtime.sendMessage(empty);
        }
    }
}