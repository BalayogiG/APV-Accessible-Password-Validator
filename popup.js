console.log('popup running');

let bgpage = chrome.extension.getBackgroundPage();

console.log(bgpage.word);

createComponents();
if(bgpage.word != ''){
    checkStrength(bgpage.word);
    changeColors(bgpage.word);
}

function createComponents(){
    var H1 = document.getElementsByTagName('H1')[0];
    var rect = document.createElement('div');
    var cracktime = document.createElement('p');
    cracktime.setAttribute('class','cracktime');
    cracktime.innerText = 'no password';
    rect.setAttribute('class','rectangle');
    rect.setAttribute('style','height:20px; width:200px; display: flex; justify-content: center; align-items:center; margin:auto; background-color:red;color:white;font-weight:bold;margin-top:20px;');
    rect.innerText = "WEAK";
    H1.after(rect);
    var r = document.getElementsByTagName('div')[0];
    r.after(cracktime);
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
    var eight = document.getElementsByClassName('flex-child magenta')[0];
    var uc = document.getElementsByClassName('flex-child green')[0];
    var lc = document.getElementsByClassName('flex-child yellow')[0];
    var digit = document.getElementsByClassName('flex-child red')[0];
    var spcl = document.getElementsByClassName('flex-child white')[0];

    if(checkCharacterLimit(password) == true)
    {
        eight.setAttribute('style','color: green; font-weight:bold;');
        var eight_chars = new SpeechSynthesisUtterance();
        eight_chars.text = "your password have eight character or more.";
        window.speechSynthesis.speak(eight_chars);
        if(checkUpperCase(password) == true){
            uc.setAttribute('style','color: green; font-weight:bold;');
            var uc_chars = new SpeechSynthesisUtterance();
            uc_chars.text = "your password have eight characters and Uppercase characters.";
            window.speechSynthesis.speak(uc_chars);
        }
        if(checkLowerCase(password) == true){
            lc.setAttribute('style','color: green; font-weight:bold;');
            var lc_chars = new SpeechSynthesisUtterance();
            lc_chars.text = "your password have Eight characters, Uppercase, and Lowercase characters.";
            window.speechSynthesis.speak(lc_chars);
        }
        if(checkNumeric(password) == true){
            digit.setAttribute('style','color: green; font-weight:bold;');
            var digits_chars = new SpeechSynthesisUtterance();
            digits_chars.text = "your password have Eight characters, Uppercase, Lowercase, and Numerical characters.";
            window.speechSynthesis.speak(digits_chars);
        }
        if(checkSpecialCharacterCase(password) == true){
            spcl.setAttribute('style','color: green; font-weight:bold;');
            var spcl_chars = new SpeechSynthesisUtterance();
            spcl_chars.text = "your password have Eight characters, Uppercase, Lowercase, Numerical, and Special characters.";
            window.speechSynthesis.speak(spcl_chars);
        }
    }
    else{
        console.log('password is under 8 char limit');
        var bad = new SpeechSynthesisUtterance();
        bad.text = "your password does not have Eight characters.";
        window.speechSynthesis.speak(bad);
    }
}

function checkStrength(password) {
    var cr = document.getElementsByClassName('cracktime')[0];
    var rect = document.getElementsByTagName('div')[0];
    var cr_time = checkCrackTime(password);
        if(checkCharacterLimit(password) == true && 
        checkLowerCase(password) == true &&
        checkUpperCase(password) == true &&
        checkNumeric(password) == true &&
        checkSpecialCharacterCase(password) == true){
            console.log('strong password');
            rect.setAttribute('style','height:20px; width:200px; margin:auto; background-color:green;color:white;font-weight:bold;margin-top:20px;');
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
            rect.setAttribute('style','height:20px; width:200px; margin:auto; background-color:blue;color:white;font-weight:bold;margin-top:20px;');
            rect.innerText = "MEDIUM";
            cr.innerText = cr_time;
            var medium = new SpeechSynthesisUtterance();
            medium.text = "your password is medium and can be cracked in ".concat(cr_time);
            window.speechSynthesis.speak(medium);
        }
        else{
            console.log('weak password');
            rect.setAttribute('style','height:20px; width:200px; margin:auto; background-color:red;color:white;font-weight:bold;margin-top:20px;');
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
