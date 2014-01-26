var IntroView = function(gameState) {
    this.gameState = gameState;
};

IntroView.prototype = new View();

IntroView.prototype.enter = function() {
    console.log("IntroView enter");
    this.addAElements();
    this.exiting = false;
    this.readTime = 0;
};

IntroView.prototype.exit = function() {
    console.log("IntroView exit");

    var companyName = "Default";
    companyName = document.getElementById('company_input').value;
    console.log("Company: "+companyName);
    if (companyName == "") companyName = "Caaake";
    this.gameState.companyName = companyName;

    if(document.getElementById("animview")){
    var elem = document.getElementById("animview");
    elem.parentNode.removeChild(elem);
    }

};

IntroView.prototype.update = function(deltaTimeMillis) {
    this.readTime += deltaTimeMillis;
    return this.exiting;
};

IntroView.prototype.space = function() {
    /*if (this.readTime > 500) {
        this.exiting = true;
    }*/
};

IntroView.prototype.enterKey = function() {
    console.log("enterKey");
    if (this.readTime > 500 && document.getElementById('company_input').value.length >= 3) {
        this.exiting = true;
    }
};


IntroView.prototype.addAElements = function() {
var wrap = document.getElementById("canvaswrap");
animw = document.createElement("div");
animw.id = 'animview';
wrap.appendChild(animw);

var globeplace = document.createElement("div");
globeplace.id = 'globe';

var logo = document.createElement("div");
logo.id = 'logo';
logo.style.position="absolute";
logo.style.zIndex="1";

var logoimg = document.createElement("img");
logoimg.src = "Assets/intrologo.png";

var logname = document.createElement("div");
logname.id = 'company_name';
animw.appendChild(logname);
var inputElement = document.createElement("input");
inputElement.id = 'company_input';
inputElement.placeholder = "Company name";
inputElement.maxLength = 18;
inputElement.autofocus = true;

logname.appendChild(inputElement);

var textElem = document.createElement("div");
textElem.id = 'instructions';
textElem.textContent = 'Use arrow keys and space to play!';
animw.appendChild(textElem);

textElem = document.createElement("div");
textElem.id = 'credits';
textElem.textContent = 'A GGJ2014 game by Annika Alhokankare, Olli Etuaho, Antti Havara, Eero Klami, Katri Laine, Sami Rämä and Pyry Takkunen';
animw.appendChild(textElem);

animw.appendChild(globeplace);
logo.appendChild(logoimg);
animw.appendChild(logo);
};


