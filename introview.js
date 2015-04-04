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

    var companyName = document.getElementById('company_input').value.trim();
    if (companyName == "") companyName = "Caaake";
    this.gameState.companyName = companyName;

    if (document.getElementById("animview")) {
        var elem = document.getElementById("animview");
        elem.parentNode.removeChild(elem);
    }
    
    var newsIndex = Math.floor(Math.random() * RANDOM_ARTICLES.length);

    this.gameState.news = [
        new Article(10, "", "Food waste illegalized", "From this day onwards, neither consumers nor food manufacturers are allowed to throw away edible things. Anything passable as human nutrition needs to be distributed and eaten. Analysts expect this to be extremely detrimental to innovation in the gastronomic industries."),
        new Article(5, "", "Cake About To Hit the World", "Demand of cakes has increased worldwide, and a local confectionery [company name] aims to answer the high demand using their questionable random cake machine, ‘The Cakifier’. The Cakifier’s advantage on the market lies in the fact that it was originally intended for extremely rapid prototyping: it randomly picks ingredients and bakes a cake faster than anything else would. However, due to the recent changes in international legislation, [company name] is forced to sell every and any combination the Cakifier comes up with. Shareholders expect [company name] to produce and distribute three(3) cakes internationally per day."),
        new Article(1, RANDOM_ARTICLES[newsIndex].country, RANDOM_ARTICLES[newsIndex].headline, RANDOM_ARTICLES[newsIndex].text)
    ];
    this.gameState.replaceArticleKeywords();

};

IntroView.prototype.update = function(deltaTimeMillis) {
    this.readTime += deltaTimeMillis;
    return this.exiting;
};

IntroView.prototype.draw = function() {
    var elem = document.getElementById("animview");
    elem.style.transform = 'scale(' + canvasResizer.getScale() + ')';
};

IntroView.prototype.enterKey = function() {
    console.log("enterKey");
    if (this.readTime > 500 && document.getElementById('company_input').value.trim().length >= 3) {
        this.exiting = true;
    }
};

IntroView.prototype.developerSkip = function() {
    document.getElementById('company_input').value = 'CAKE Inc.';
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
    textElem.textContent = 'A GGJ2014 game by Annika Alhokankare, Olli Etuaho, Antti Hamara, Eero Klami, Katri Laine, Sami Rämä and Pyry Takkunen - post-jam version';
    animw.appendChild(textElem);

    animw.appendChild(globeplace);
    logo.appendChild(logoimg);
    animw.appendChild(logo);
};
