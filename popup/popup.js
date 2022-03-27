const rules_for_password = "Password should contain at least 8 characters, at least one Uppercase character, at least one Lowercase character, at least one number, at least one special symbol";
var accept  = 'a' || 'A';
var reject = 'z' || 'Z';

var generate = 'q' || 'Q';
var not_generate = 'x' || 'X';

var bgpage = chrome.extension.getBackgroundPage();
var password = bgpage.word;

readOutAloud("Accessible Password Validator is activated.");

var want_rules = "Do you want me to read the password rules?";
readOutAloud(want_rules);
readOutAloud('Press A to accept and Z to reject');

window.addEventListener('keydown', function (e) {
    var response = e.key;
    if (response == accept){
        readOutAloud("Reading the password rules.");
        readOutAloud(rules_for_password);
        readOutAloud("You can enter the password considering the rules");
        PasswordEmptyOrNot();
    }

    if(response == reject){
        readOutAloud("Ok, I won't read the password rules.");
        PasswordEmptyOrNot();
    }
  }, false);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function PasswordEmptyOrNot(){
    if(password == 'empty'){
        var feedback = document.getElementById('feedback');
        feedback.innerText = "No password available";
        readOutAloud(feedback.innerText);
    }
    else{
        readOutAloud("Password is validating");
        sleep(1000);        
        DictionaryScore(password);
    }
}

function DictionaryScore(password){
    setTimeout(function ()
        {
            if(checkThisPassword(password, 9999) == true){
                var feedback = document.getElementById('feedback');
                feedback.innerText = "Common password, Choose a different password";
                readOutAloud(feedback.innerText);
            }
            else{
                var score = PasswordValidator(password);
                sleep(4000);
                PasswordScorer(score);
            }
    });
}

function PasswordPolicyChecker(password){
    policies = {
        uppercase : /[A-Z]/,
        lowercase : /[a-z]/,
        digits : /\d/,
        symbols : /\W/,
        onlyuppercase : /^[A-Z]*$/,
        onlylowercase : /^[a-z]*$/,
        onlydigits : /^[0-9]*$/
    }   

    var length = password.length;
    var p = {};

    if(length <= 8){
        var feedback = document.getElementById('feedback');
        feedback.innerText = "Your password does not contain 8 characters";
        readOutAloud(feedback.innerText);
    }
    else{
        var policies_keys = Object.keys(policies);
        for(var i=0;i<policies_keys.length;i++){
            p[policies_keys[i]] = policies[policies_keys[i]].test(password);
        }
    return p;
    }
}

function StrongPassword(result){
    var score = 0;
    var feedback = document.getElementById('feedback');
    if(result.digits == true && result.symbols == true && result.uppercase == true && result.lowercase == true){
        feedback.innerText = "Your password has satisfied the rules";
        readOutAloud(feedback.innerText);
        score = 100;
    }
    return score
}

function MediumPassword(result){
    var score = 0;
    var feedback = document.getElementById('feedback');
    if(result.digits == true && result.lowercase == true && result.uppercase == true){
        score = 35;
    }
    else if(result.digits == true && result.lowercase == true && result.symbols == true){
        score = 35;
    }
    else if(result.digits == true && result.uppercase == true && result.symbols == true){
        score = 35;
    }
    else if(result.lowercase == true && result.uppercase == true && result.symbols == true){
        score = 35;
    }
    else{
        score = 0;
    }
    return score
}

function WeakPassword(result){
    var score = 0;
    var feedback = document.getElementById('feedback');
    if(result.digits == true && result.lowercase == true){
        score = 20;
    }
    else if(result.digits == true && result.uppercase == true){
        score = 20;
    }
    else if(result.digits == true && result.symbols == true){
        score = 20;
    }
    else if(result.lowercase == true && result.uppercase == true){
        score = 20;
    }
    else if(result.lowercase == true && result.symbols == true){
        score = 20;
    }
    else if(result.uppercase == true && result.symbols == true){
        score = 20;
    }
    else if(result.onlydigits == true){
        score = 20;
    }
    else if(result.onlylowercase == true){
        score = 20;
    }
    else if(result.onlyuppercase == true){
        score = 20;
    }
    else{
        score = 0;
    }
    return score;
}

function PasswordValidator(password){
    var score = 0;
    let result = PasswordPolicyChecker(password);
    console.log(result);
    
    strong = StrongPassword(result);
    medium = MediumPassword(result);
    weak = WeakPassword(result);

    console.log(strong);
    console.log(medium);
    console.log(weak);
    sum_score = strong + medium + weak;
    return sum_score;
}

function PasswordScorer(score){
    console.log(score);
    var strength = document.getElementById('strength');
    var score_bar = document.getElementById('progress-bar');
    var feedback = document.getElementById('feedback');
    if(score >= 0 && score <= 30){
        strength.innerText = "Weak password"
        feedback.innerText = strength.innerText;
        readOutAloud(strength.innerText);
        score_bar.setAttribute('style','background-color:red;');
        readOutAloud("Would you like to Generate a new password?");
        readOutAloud("Press Q to generate and X to reject");
        GeneratePassword();
    }
    else if(score >= 30 && score <= 60){
        strength.innerText = "Medium password";
        feedback.innerText = strength.innerText;
        score_bar.setAttribute('style','background-color:orange;');
        readOutAloud(strength.innerText);
    }
    else{
        strength.innerText = "Strong password";
        feedback.innerText = strength.innerText;
        score_bar.setAttribute('style','background-color:green;');
        readOutAloud(strength.innerText);
    }
    VisualScorer(score);
}

function GeneratePassword(){
    var feedback = document.getElementById('feedback');
    var pass_suggestion = document.getElementById('suggestion');
    window.addEventListener('keydown', function (e) {
        var response = e.key;
        if(response == generate){
            readOutAloud("Password is generating");
            feedback.innerText = "Password is generating";
            sleep(1000);
            feedback.innerText = "Password generated";
            readOutAloud("Password Generated");
            var genpass = PasswordSuggestor(password)
            readOutAloud("Your password is "+ genpass);
            CopyToClipboard(genpass);
        }

        if(response == not_generate){
            feedback.innerText = "No password generated";
            readOutAloud("No Password generated");
        }
    }, false);
}

function CopyToClipboard(genpass) {
    var feedback = document.getElementById('feedback');
    feedback.innerText = "Generated Password is copied to clipboard";
    readOutAloud(feedback.innerText);
    navigator.clipboard.writeText(genpass);
}


function VisualScorer(score){
    if(score <= 100){
        var i = 0;
        if (i == 0) {
            i = 1;
            var elem = document.getElementById("progress-bar");
            var width = 1;
            var id = setInterval(frame, 10);
            function frame() {
            if (width >= score) {
                clearInterval(id);
                i = 0;
            } else {
                width++;
                elem.style.width = width + "%";
            }
            }
        }
    }
    else{
        var i = 0;
        if (i == 0) {
            i = 1;
            var elem = document.getElementById("progress-bar");
            var width = 1;
            var id = setInterval(frame, 10);
            function frame() {
            if (width >= 100) {
                clearInterval(id);
                i = 0;
            } else {
                width++;
                elem.style.width = width + "%";
            }
            }
        }
    }
}

function PasswordSuggestor(password){
    var password = password + '!@#$%^&*()_1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // Fisher-Yates Algorithm or Knuth-Fisher-Yates Algorithm
    var arr = Array.from(password);
    var i = arr.length, k , temp;      // k is to generate random index and temp is to swap the values
    while(--i > 0){
        k = Math.floor(Math.random() * (i+1));
        temp = arr[k];
        arr[k] = arr[i];
        arr[i] = temp;
    }
    let new_password = arr.join();
    let clean_password = new_password.replace(/,/g,'');
    return clean_password.substring(0,12);
}

function readOutAloud(text){
    var msg = new SpeechSynthesisUtterance();
    msg.text = text;
    speechSynthesis.speak(msg);
}


