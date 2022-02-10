// Reading Password
function readPassword(password){
    if(password == "empty"){
        console.log("empty");
    }
    else{
        lengthFilter(password);
        dictionaryScore(password);
    }
}

// length filter
function lengthFilter(password) {
    var len = password.length;
    if(len > 14){
        console.log('Password length limit exceeds.');
    }
}

// Dictionary Score
function dictionaryScore(password){
    setTimeout(function(){
        //tweak 9999 to get a larger dictionary, max size 9999 with default dictionary
        if(checkThisPassword(password, 9999) == true)
        {
            console.log('Common password, Found in dictionary');
            var msg = new SpeechSynthesisUtterance();
            msg.text = "Common password, Found in dictionary, Choose a different password";
            window.speechSynthesis.speak(msg);
        }
        else
        {
            console.log('Not a common password, Not found in dictionary');
            var t = timeToCrackScore(password);
            var e = entropyScore(password);
            var w = weightedScore(password);
            var nt = Normalization(t);
            var t_Score = totalScore(w, e, nt);
            AudioVisualChange(t_Score);
        }
    },100);
}

// Time-to-crack Score
function timeToCrackScore(password) {
    var minChars = 1;
    var maxChars = 14;
    var t = TimeToCrack(password, minChars, maxChars);
    var Tt = PCTN(t);
    return Tt;
}

function TimeToCrack(password, minChars, maxChars){
    // Input: Password
    // Calculation: CSL^L / R / N
    // Output: Time taken in minutes
    
    var l = password.length;
    var numOfPasswordsPerSec = 1000; // No. of passwords generated per second. (100000000);
    var numOfSystems = 10; // No. of systems (1000000)

    if(l < minChars || l > maxChars){
        var msg = new SpeechSynthesisUtterance();
        msg.text = "Longer password are hard to remember valid range is 1 to 14 characters.";
        window.speechSynthesis.speak(msg);
    }
    var charSetLength = CSTG(password);
    var t = Math.pow(charSetLength, l) / numOfPasswordsPerSec / numOfSystems;
    return t;
}

function CSTG(password){
    // Input: Password
    // Calculation: Find Uppercase, Lowercase, Digital, Special Characters
    // Output: Charset Length
    var charSetLength = 0;

    if(/[A-Z]+/g.exec(password)){
        charSetLength += 26;
    }

    if(/[a-z]+/g.exec(password)){
        charSetLength += 26;
    }

    if(/[\d]/g.exec(password)){
        charSetLength += 10;
    }

    if(/[\W]/g.exec(password)){
        charSetLength += 32;
    }
    return charSetLength;
}

// Password Crack Time Normalizer
function PCTN(t)
{
    // Input: Time taken in minutes
    // Calculation:  division operations
    // Output: Time taken in minute, minutes, hours, days, months, years.
    var s = "";
    if(t<60)
    {
        s = t + " minute"; 
    }
    else
    {
        t /= 60;
		if (t<180)
        {
			s = Math.ceil(t) + " minutes";
        }
		else
		{	
			t /= 60;
			if (t<72)
				{
                    s = Math.ceil(t) + " hours";    
                }
			else
			{	
                t /= 24;
                if (t<90)
                    {
                    s = Math.ceil(t) + " days";
                    }
                    else
                    {	
                        t /= 30;
                        if (t<36){
                            s = Math.ceil(t) + " months";   
                        }
                        else
                        {	t /= 12;
                            s = Math.ceil(t) + " years";   
                        }
                    }
                }
				
			}
		}
    return s;   
}

// Entrophy Score
function log(base, number) {
    return Math.log(number) / Math.log(base);
}

function entropyScore(password) {
    var len = password.length;
    var csl = CSTG(password);
    var entrophy = log(2,csl) * len;
    return entrophy;
}

// Weighted Score
function count(password){
    var u = 0, l = 0, d = 0; s = 0;
    var len = password.length;
    for(var i=0;i<password.length;i++){
        if(password[i] >= "A" && password[i] <= "Z"){
            u++;
        }
        else if(password[i] >= "a" && password[i] <= "z"){
            l++;
        }
        else if(password[i] >= "0" && password[i] <= "9"){
            d++;
        }
        else{
            s++;
        }
    }
    const countOfChars = {
        length: len,
        uppercase: u,
        lowercase: l,
        digit: d,
        special: s
    };
    return countOfChars;
}

function rate(password, countOfChars) {
    var ur = 0, lr = 0, dr = 0; sr = 0;
    var l = password.length;
    var uc = countOfChars.uppercase;
    var lc = countOfChars.lowercase;
    var dc = countOfChars.digit;
    var sc = countOfChars.special;

    for(var i = 0; i< password.length; i++){
        if(password[i] >= "A" && password[i] <= "Z"){
            ur = (l - uc) *2;
        }
        else if(password[i] >= "a" && password[i] <= "z"){
            lr = (l - lc) *2;
        }
        else if(password[i] >= "0" && password[i] <= "9"){
            dr = dc * 4;
        }
        else{
            sr = sc * 6;
        }
    }

    const rateOfChars = {
        length: l*4,
        uppercase: ur,
        lowercase: lr,
        digit : dr,
        special: sr
    };
    return rateOfChars;
}

function weightedScore(password){
    var countOfChars = count(password);
    var rateOfChars = rate(password, countOfChars);
    
    wc_Score = rateOfChars.digit 
    + rateOfChars.special 
    + rateOfChars.length 
    + rateOfChars.lowercase 
    + rateOfChars.uppercase;

    return wc_Score;
}

// Normalization
function Normalization(t) {
    var tscore = 0;
    var time = t.split(" ");
    if(time[1] == 'minute'){
        tscore = 1;
    }
    else if(time[1] == 'minutes'){
        tscore = 5;
    }
    else if(time[1] == 'hours'){
        tscore = 10;
    }
    else if(time[1] == 'days'){
        tscore = 20;
    }
    else if(time[1] == 'months'){
        tscore = 50;
    }
    else if(time[1] == 'years'){
        tscore = 80;
    }
    else{
        tscore = 0;
    }
    return tscore;
}

// Total Score
function totalScore(w, e, nt) {
    var total = w+e+nt;
    var totalScore = total/3/100;
    var t_score = totalScore * 100;
    return t_score;
}

// Audio-visual Response
function AudioVisualChange(t_score) {
    var strength = document.getElementById('strength');
    var score = document.getElementById("progress-bar");

    if(t_score < 20){
        strength.innerText = "Very weak";
        score.setAttribute('style', 'background-color:red;');
        var msg = new SpeechSynthesisUtterance();
        msg.text = "Very weak password";
        window.speechSynthesis.speak(msg);
    }
    else if(t_score > 20 && t_score < 50){
        strength.innerText = "Weak";
        score.setAttribute('style', 'background-color:orange;');
        var msg = new SpeechSynthesisUtterance();
        msg.text = "Weak password";
        window.speechSynthesis.speak(msg);
    }
    else if(t_score > 50 && t_score <55){
        strength.innerText = "Medium";
        score.setAttribute('style', 'background-color:blue;');
        var msg = new SpeechSynthesisUtterance();
        msg.text = "Medium password";
        window.speechSynthesis.speak(msg);
    }
    else if(score > 55 && t_score < 70){
        strength.innerText = "Strong";
        score.setAttribute('style', 'background-color:green;');
        var msg = new SpeechSynthesisUtterance();
        msg.text = "Strong password";
        window.speechSynthesis.speak(msg);
    }
    else{
        strength.innerText = "Very strong";
        score.setAttribute('style', 'background-color:darkgreen;');
        var msg = new SpeechSynthesisUtterance();
        msg.text = "Very strong password";
        window.speechSynthesis.speak(msg);
    }
    if(t_score <= 100){
        var i = 0;
        if (i == 0) {
            i = 1;
            var elem = document.getElementById("progress-bar");
            var width = 1;
            var id = setInterval(frame, 10);
            function frame() {
            if (width >= t_score) {
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

// Main driver 

function main() {
    var bgpage = chrome.extension.getBackgroundPage();
    var password = bgpage.word;
    readPassword(password);
}


main();