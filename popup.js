console.log('popup running');

let bgpage = chrome.extension.getBackgroundPage();

//console.log(bgpage.word);

if(bgpage.word != ''){
    checkStrength(bgpage.word);
    changeColors(bgpage.word);
}
else{
    var empty = new SpeechSynthesisUtterance();
    empty.text = "No Password";
    window.speechSynthesis.speak(empty);
    var cr = document.getElementById('pass-2');
    cr.innerText = "NO PASSWORD";
}

function checkUpperCase(password) {
    var format = /[A-Z]/gm;
    if(format.test(password)){
        return true;
    }
    else{
        return false;
    }
}

function checkLowerCase(password) {
    var format = /[a-z]/gm;
    if(format.test(password)){
        return true;
    }
    else{
        return false;
    }
}

function checkNumeric(password) {
    var format = /\d/gm;
    if(format.test(password)){
        return true;
    }
    else{
        return false;
    }
}

function checkSpecialCharacterCase(password) {
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if(format.test(password)){
        return true;
    }
    else{
        return false;
    }
}

function checkCharacterLimit(password) {
    if(password.length >= 8){
        return true;
    }
    else{
        return false;
    }
}

function changeColors(password){
    var eight = document.getElementById('1');
    var uc = document.getElementById('2');
    var lc = document.getElementById('3');
    var digit = document.getElementById('4');
    var spcl = document.getElementById('5');
    
    if(checkCharacterLimit(password) == true)
    {
        eight.setAttribute('style','font-weight:bold;color:green;');
        if(checkUpperCase(password) == true){
            uc.setAttribute('style','font-weight:bold;color:green;');
        }
        if(checkLowerCase(password) == true){
            lc.setAttribute('style','font-weight:bold;color:green;');
        }
        if(checkNumeric(password) == true){
            digit.setAttribute('style','font-weight:bold;color:green;');
        }
        if(checkSpecialCharacterCase(password) == true){
            spcl.setAttribute('style','font-weight:bold;color:green;');
        }
    }
    else{
        var bad = new SpeechSynthesisUtterance();
        bad.text = "Need eight characters.";
        window.speechSynthesis.speak(bad);
    }
}

function checkStrength(password) {
    var cr = document.getElementById('pass-2');
    var rect = document.getElementById('strength');
    var cr_time = checkCrackTime(password);
        if(checkCharacterLimit(password) == true && 
        checkLowerCase(password) == true &&
        checkUpperCase(password) == true &&
        checkNumeric(password) == true &&
        checkSpecialCharacterCase(password) == true){
            console.log('strong password');
            rect.setAttribute('style','background-color:green;color:white;');
            rect.innerText = "STRONG";
            cr.innerText = cr_time;
            var strong = new SpeechSynthesisUtterance();
            strong.text = "your password is strong";
            window.speechSynthesis.speak(strong);
        }
        else if(checkCharacterLimit(password) == true && 
        checkLowerCase(password) == true &&
        checkUpperCase(password) == true &&
        checkNumeric(password) == false &&
        checkSpecialCharacterCase(password) == true){
            console.log('medium password');
            rect.setAttribute('style','background-color:blue;color:white;');
            rect.innerText = "MEDIUM";
            cr.innerText = cr_time;
            var medium = new SpeechSynthesisUtterance();
            medium.text = "your password is medium and can be cracked in ".concat(cr_time);
            window.speechSynthesis.speak(medium);
        }
        else{
            console.log('weak password');
            rect.setAttribute('style','background-color:red;color:white;');
            rect.innerText = "WEAK";
            cr.innerText = cr_time;
            var weak = new SpeechSynthesisUtterance();
            weak.text = "your password is weak and can be cracked in ".concat(cr_time);
            window.speechSynthesis.speak(weak);
        }
}

function checkCrackTime(password) {
    var results = zxcvbn(password);
    return results.crack_times_display.online_throttling_100_per_hour;
}
