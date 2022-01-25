console.log('background running');

chrome.runtime.onMessage.addListener(receiver);

window.word = 'a';

function receiver(request, sender, sendResponse) {
  window.word = request.text;
  console.log(request.text);
}