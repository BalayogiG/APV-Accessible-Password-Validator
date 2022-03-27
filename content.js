console.log("Accessible Password Validator running");

const input_tags = document.getElementsByTagName('input');

for(item of input_tags){
    if(item.getAttribute('type') === 'password'){
        readPassword(item);
    }
}

function readPassword(item){
    item.oninput = function(){
        var x = item.value;
        if(x != ''){
            let msg = {
                text: x
            };
            chrome.runtime.sendMessage(msg);
        }
        else{
            let msg = {
                text: 'empty'
            };
            chrome.runtime.sendMessage(msg);
        }
    }
}
