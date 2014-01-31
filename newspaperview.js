var Paper = function(newspaperDiv) {
    this.dateslot = document.createElement("p");
    this.dateslot.classList.add('dateslot');
    newspaperDiv.appendChild(this.dateslot);

    this.headline = document.createElement("h1");
    newspaperDiv.appendChild(this.headline);
    this.country = document.createElement("b");
    this.country.classList.add('country');
    newspaperDiv.appendChild(this.country);
    this.article = document.createElement("p");
    this.article.classList.add('article');
    newspaperDiv.appendChild(this.article);

    this.newsimg = document.createElement("img");
    this.newsimg.classList.add('newsimg');
    this.newsimg.src ="Assets/lion.png";
    newspaperDiv.appendChild(this.newsimg);
};

var NewspaperView = function(gameState) {
    this.gameState = gameState;

    var wrap = document.getElementById("canvaswrap");
    this.newsView = document.createElement("div");
    this.newsView.id = 'newsviewd';
    wrap.appendChild(this.newsView);
    
    this.newspaperDivs = [];
    this.papers = [];
    for (var i = 0; i < 3; ++i) {
        var newspaperDiv = document.createElement("div");
        newspaperDiv.classList.add('newspaper');
        newspaperDiv.classList.add('n' + i);
        this.newsView.appendChild(newspaperDiv);
        this.newspaperDivs.push(newspaperDiv);
        this.papers.push(new Paper(newspaperDiv));
    }

    this.music = new Audio('music_morning', true);
    this.date = new Date();
    this.date.setFullYear(2040);
    
    this.selectedPaper = 1;
    this.targetPaper = 1;
};

NewspaperView.prototype = new View();

NewspaperView.prototype.draw = function(ctx) {
};

NewspaperView.prototype.enter = function() {
    this.music.play();
    this.date.setTime(this.date.getTime() + 1000 * 60 * 60 * 24);
    for (var i = 0; i < this.papers.length; ++i) {
        if (i < this.gameState.news.length) {
            this.papers[i].headline.textContent = this.gameState.news[i].headline;
            this.papers[i].article.innerHTML = this.gameState.news[i].text;
            this.papers[i].country.innerHTML = '';
            if (this.gameState.news[i].country) {
                for (var j = 0; j < COUNTRIES.length; ++j) {
                    if (COUNTRIES[j].name === this.gameState.news[i].country) {
                        this.papers[i].country.innerHTML += '<img src="Assets/Flags/' + COUNTRIES[j].shortName + '.png" style="height: 12px"> ';
                        this.papers[i].country.innerHTML += COUNTRIES[j].name.toUpperCase();
                    }
                }
            }
            this.papers[i].dateslot.textContent = this.date.toDateString();
            this.newspaperDivs[i].style.display = 'block';
        } else {
            this.newspaperDivs[i].style.display = 'none';
        }
    }
    this.newsView.style.display = 'block';
    this.readTime = 0;
    this.exiting = false;

    this.selectedPaper = Math.floor(this.gameState.news.length / 2);
    this.targetPaper = this.selectedPaper;
};

NewspaperView.prototype.exit = function() {
    this.music.stop();
    this.newsView.style.display = 'none';
};

NewspaperView.prototype.update = function(deltaTimeMillis) {
    this.readTime += deltaTimeMillis;
    if (this.selectedPaper < this.targetPaper) {
        this.selectedPaper += deltaTimeMillis * 0.002;
        if (this.selectedPaper > this.targetPaper) {
            this.selectedPaper = this.targetPaper;
        }
    }
    if (this.selectedPaper > this.targetPaper) {
        this.selectedPaper -= deltaTimeMillis * 0.002;
        if (this.selectedPaper < this.targetPaper) {
            this.selectedPaper = this.targetPaper;
        }
    }
    for (var i = 0; i < 3; ++i) {
        this.setPapertransform(i);
    }
    return this.exiting;
};

NewspaperView.prototype.space = function() {
    if (this.readTime > 500) {
        this.exiting = true;
    }
};

NewspaperView.prototype.setPapertransform = function(paperIndex) {
    var element = this.newspaperDivs[paperIndex];
    var offset = this.selectedPaper - paperIndex;
    var trans = "rotate(" + (offset * 4) + "deg) translate(" + (offset * 94) + "%, 0) translateZ(0)";
    element.style.webkitTransform = trans;
    element.style.transform = trans;
    element.style.MozTransform = trans;
};

NewspaperView.prototype.rightArrow = function() {
    var len = this.gameState.news.length;
    this.targetPaper = (this.targetPaper + len - 1) % len;
};

NewspaperView.prototype.leftArrow = function() {
    var len = this.gameState.news.length;
    this.targetPaper = (this.targetPaper + 1) % len;
};
