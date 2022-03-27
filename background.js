console.log("Accessible Password Validaor Background running");

chrome.runtime.onMessage.addListener(receiver);

window.word = '';

function receiver(request, sender, sendResponse){
    window.word = request.text;
}