var TargetingView = function(gameState) {
    this.gameState = gameState;
 
    this.img = document.createElement('img');
    this.img.src = "Assets/map.png";
    this.loaded = false;
    var that = this;
    this.img.onload = function() {
        that.loaded = true;
        that.width = that.img.width;
        that.height = that.img.height;
    };
    
    this.music = new Audio('music_map', true);
    this.crosshairFx = new Audio('fx_map_crosshair');

    this.cursorSprite = new Sprite("cursor_center.png");
    this.cursorHorizontal = new Sprite("cursor_horizontal.png");
    this.cursorVertical = new Sprite("cursor_vertical.png");
    this.overlaySprite = new Sprite('map_overlay.png');
    this.heartSprite = new Sprite('heart.png');
    this.flags = {}
    for (var i = 0; i < COUNTRIES.length; ++i) {
        this.flags[COUNTRIES[i].shortName] = new Sprite('Flags/' + COUNTRIES[i].shortName + '.png');
    }
    
    this.canvasWidth = 0;

};

TargetingView.prototype = new View();

TargetingView.state = {
    CHOOSE: 0,
    CONFIRM: 1,
    FINISH: 2
};

TargetingView.prototype.enter = function() {
    this.music.play();
    this.state = TargetingView.state.CHOOSE;
	console.log("Cakes");
	console.log(this.gameState.cakes);


    this.selectedPoint = Math.floor((Math.random()*COUNTRIES.length));
    this.positionX = -COUNTRIES[this.selectedPoint]["mapLocation"][0];
    this.positionY = -COUNTRIES[this.selectedPoint]["mapLocation"][1];
	//this.positionX = 0;
	//this.positionY = 0;
    this.targetPositionX = this.positionX;
    this.targetPositionY = this.positionY;
    this.previousPositionX = this.positionX;
	this.previousPositionY = this.positionY;
	//this.positionX = 0;
	//this.positionY = 0;


    this.scale = 2;

    this.selectedCake = 2;
    this.cameraStopped = false;

    this.deliveries = [undefined, undefined, undefined];

    this.menuOptions = [];
	for (var i = 0; i < this.gameState.cakes.length; i++) {
		var text = "Cake " + (3 - i) + ": ";
        text += this.gameState.cakes[i].fillings.join(' - ');
        this.menuOptions.push(text);
    }

    //this.gameState.cakes[0].fillings=['Mantis shrimp', "Booze", "Bullets"];
};

//Cake was a rather ok, jos ei oo mitään sanottavaa
//Jos nega ja pos, molemmat, posi eka
//spessucaset overrulaa

TargetingView.prototype.cakeMatches = function(cake, conditions) {
	//var conditionsOk = new Array(conditions.length);
	//console.log("Comparing: "+cake.fillings+" vs "+conditions);
	for (var i = 0; i < conditions.length; i++) {
		var filling = conditions[i];
		var ok = false;
		for (var f = 0; f < cake.fillings.length; f++) {
			if (cake.fillings[f] == filling) ok = true;
		}
		if (ok == false) return false;
	}
	return true;
}

//Should be called only for single fillings!
TargetingView.prototype.getMatchingCount = function(cake, conditions) {
		var filling = conditions[0];
		var count = 0;
		for (var f = 0; f < cake.fillings.length; f++) {
			if (cake.fillings[f] == filling) count++;
		}
		return count;

}

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

TargetingView.prototype.developerSkip = function() {
    for (var i = 0; i < this.deliveries.length; ++i) {
        this.deliveries[i] = Math.floor(Math.random() * COUNTRIES.length) % COUNTRIES.length;
    }
};

TargetingView.prototype.addMoney = function(amount) {
	console.log("Adding: "+amount);
	if (amount === undefined) {

	} else {
		this.gameState.balance += amount;
	}
}

TargetingView.prototype.getThirdFilling = function(cake, conditions) {
	var used = [0, 0];
	for (var i = 0; i < conditions.length; i++) {
		var filling = conditions[i];
		var ok = false;
		for (var f = 0; f < cake.fillings.length; f++) {
			if (!ok) {
				if (cake.fillings[f] == filling) ok = true;
				used[i] = f;
			}
		}
		if (ok == false) return false;
	}
	for (var f = 0; f < cake.fillings.length; f++) {
		if (!contains(used, f)) return cake.fillings[f];
	}
}

TargetingView.prototype.exit = function() {
    this.music.stop();
	console.log("TargetingView.exit");
	this.gameState.news = [];
	var i = 0;
	for (i = 0; i < this.deliveries.length; i++) {
		console.log("Delivering cake: "+i);
		var cake = this.gameState.cakes[i];
		var country = COUNTRIES[this.deliveries[i]]["name"];
		var countryShort = COUNTRIES[this.deliveries[i]]["shortName"];
		//COUNTRIES[this.deliveries[i]].life -= 3;

		var matchingTriggers = new Array();

		for (var c = 0; c < TRIGGERS.length; c++) {
			var cond = TRIGGERS[c].conditions;
			//console.log("Trigger("+c+"): "+TRIGGERS[c].inCountry);
			if (TRIGGERS[c].inCountry === undefined) {
				if (this.cakeMatches(cake, cond)) {
					//this.gameState.news.push(new Article(TRIGGERS[c].headline, TRIGGERS[c].text));
					matchingTriggers.push(TRIGGERS[c]);
				}
			} else if (contains(TRIGGERS[c].inCountry, countryShort)) {
				if (this.cakeMatches(cake, cond)) {
					//this.gameState.news.push(new Article(TRIGGERS[c].headline, TRIGGERS[c].text));
					matchingTriggers.push(TRIGGERS[c]);
				}
			}
		}

		console.log("Triggers\n"+matchingTriggers);
		if (matchingTriggers.length == 0) {
			var bodyText = /*country.toUpperCase()+ " " + */"In a shocking turn of events, the citizens of [country] announced yesterday that [company name] supplied them with cake that they really thought nothing special about. It wasn’t horrendous, it wasn’t good, it wasn’t an explosive and no mythical animals jumped out of the cake to abolish all evil. However, market analysts assure that different combinations of cake fillings delivered to this country can make this front page a lot more interesting.";
			this.gameState.news.push(new Article(0, country, "Cake Is Apparently Rather OK", bodyText));
		} else {
			var priority = 0;
			var selected = 0;
			for (var s = 0; s < matchingTriggers.length; s++) {
				if (matchingTriggers[s].priority > priority) {
					priority = matchingTriggers[s].priority;
					selected = s;
				}	
			}
			if (priority <= 2) {
				//Might be multiple items!
				var body = "";
				for (var s = 0; s < matchingTriggers.length; s++) {
					if (matchingTriggers[s].priority == 2) {
						body += matchingTriggers[s].text;
						body += "\n\n<br><br>";
						var count = this.getMatchingCount(cake, matchingTriggers[s].conditions);
						var money = matchingTriggers[s].profit;
						if (count == 2) money = 25;
						if (count == 3) money = 50;
						this.addMoney(money);
					}
				}
				for (var s = 0; s < matchingTriggers.length; s++) {
					if (matchingTriggers[s].priority == 1) {
						body += matchingTriggers[s].text;
						body += "\n\n<br><br>";
						var count = this.getMatchingCount(cake, matchingTriggers[s].conditions);
						if (count == 2) money = -25;
						if (count == 3) money = -50;
						this.addMoney(money);
						COUNTRIES[this.deliveries[i]].life -= 1 * count;
					}
				}
				//console.log("BODY:"+body);
				this.gameState.news.push(new Article(priority, country, "Caky News With a Generic Headline", body));
			} else {
				var article = new Article(priority, country, matchingTriggers[selected].headline, matchingTriggers[selected].text);
				this.addMoney(matchingTriggers[selected].profit);
				if (matchingTriggers[selected].conditions.length == 2) {
					article.thirdFilling = this.getThirdFilling(cake, matchingTriggers[selected].conditions);
					console.log("ThirdFIlling: "+article.thirdFilling);
				}
				if (matchingTriggers[selected].damage === undefined) {

				} else {
					COUNTRIES[this.deliveries[i]].life -= matchingTriggers[selected].damage;
				}
				this.gameState.news.push(article);
			}
		}
		//this.gameState.news.push(new Article(""+country+" received "+cake["fillings"][0]+" "+cake["fillings"][1]+" "+cake["fillings"][2]));
	}

	console.log(this.gameState.news);
	console.log("BALANCE: "+this.gameState.balance);
	if (this.gameState.news.length == 0) this.gameState.news.push(new Article(1, "", "Developer skipped"));//, new Article("This too")];


};



TargetingView.prototype.leftArrow = function() {
	this.cameraStopped = false;
	this.selectedPoint = (this.selectedPoint + COUNTRIES.length - 1) % COUNTRIES.length;
	this.previousPositionX = this.positionX;
	this.previousPositionY = this.positionY;
    this.targetPositionX = -COUNTRIES[this.selectedPoint]["mapLocation"][0];// + this.canvasWidth / 2;
    this.targetPositionY = -COUNTRIES[this.selectedPoint]["mapLocation"][1];// + this.canvasWidth / 2;
    this.crosshairFx.playClone();
};
TargetingView.prototype.rightArrow = function() {
	this.cameraStopped = false;
	this.selectedPoint = Math.abs((this.selectedPoint + 1) % COUNTRIES.length);
	this.previousPositionX = this.positionX;
	this.previousPositionY = this.positionY;
    this.targetPositionX = -COUNTRIES[this.selectedPoint]["mapLocation"][0];// + this.canvasWidth / 2;
    this.targetPositionY = -COUNTRIES[this.selectedPoint]["mapLocation"][1];// + this.canvasWidth / 2;
    this.crosshairFx.playClone();
};

TargetingView.prototype.downArrow = function() {
    if (this.state !== TargetingView.state.FINISH) {
        this.selectedCake = (this.selectedCake + this.menuOptions.length - 1) % this.menuOptions.length;
    }
};
TargetingView.prototype.upArrow = function() {
    if (this.state !== TargetingView.state.FINISH) {
        this.selectedCake = (this.selectedCake + 1) % this.menuOptions.length;
    }
};

TargetingView.prototype.nextPoint = function() {
	this.selectedPoint = Math.abs((this.selectedPoint + 1) % COUNTRIES.length);
	this.previousPositionX = this.positionX;
	this.previousPositionY = this.positionY;
    this.targetPositionX = -COUNTRIES[this.selectedPoint]["mapLocation"][0];// + this.canvasWidth / 2;
    this.targetPositionY = -COUNTRIES[this.selectedPoint]["mapLocation"][1];// + this.canvasWidth / 2;
}

TargetingView.prototype.space = function() {
    if (this.state === TargetingView.state.CONFIRM && this.selectedCake >= this.gameState.cakes.length) {
        this.state = TargetingView.state.FINISH;
        this.stateTime = 0;
        return;
    }
    if (COUNTRIES[this.selectedPoint].life <= 0) return;
	if (this.cameraStopped && this.state !== TargetingView.state.FINISH) {
		console.log("deliveries " + this.deliveries + " - selected point " + this.selectedPoint);
        var removedDelivery = false;
		for (i = 0; i < this.deliveries.length; i++) {
			if (this.deliveries[i] == this.selectedPoint) {
				console.log("Already delivered, removing");
				this.deliveries[i] = undefined;
                removedDelivery = true;
			}
		}
        this.deliveries[this.selectedCake] = this.selectedPoint;
        for (i = this.selectedCake; i > this.selectedCake - 3; --i) {
            if (this.deliveries[(i + 3) % 3] === undefined) {
                this.selectedCake = (i + 3) % 3;
                break;
            }
        }
        var definedDeliveries = 0;
        for (var i = 0; i < this.deliveries.length; ++i) {
            if (this.deliveries[i] !== undefined) {
                ++definedDeliveries;
            }
        }
        if (definedDeliveries === 3 && this.state !== TargetingView.state.CONFIRM) {
            this.state = TargetingView.state.CONFIRM;
            this.stateTime = 0;
            this.menuOptions.push('CONFIRM CAKE DELIVERY');
            this.selectedCake = 3;
        } else if (definedDeliveries !== 3 && this.state === TargetingView.state.CONFIRM) {
            this.state = TargetingView.state.CHOOSE;
            this.stateTime = 0;
            this.menuOptions.splice(this.menuOptions.length - 1, 1);
        }
	}
};



function sign(x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

TargetingView.prototype.isLocationOccupied = function(location) {
	if (this.deliveries.length == 0) return false;
	var length = this.deliveries.length;
	for (t = 0; t < length; t++) {
		if (this.deliveries[t] == location) {
			return true;
		}
	}
	return false;

}



TargetingView.prototype.update = function(deltaTimeMillis) {
    this.stateTime += deltaTimeMillis;
    if (this.state === TargetingView.state.FINISH && this.stateTime > 2000) {
        return true;
    }

    if (this.positionX != this.targetPositionX) {
    	speed = Math.min(Math.abs(this.targetPositionX - this.positionX), 25 * deltaTimeMillis / (1000 / 30));
    	this.positionX += sign(this.targetPositionX - this.positionX) * speed;
    }
    if (this.positionY != this.targetPositionY) {
    	speed = Math.min(Math.abs(this.targetPositionY - this.positionY), 25 * deltaTimeMillis / (1000 / 30));
    	this.positionY += sign(this.targetPositionY - this.positionY) * speed;
    }
    var totalDist = Math.sqrt((this.previousPositionX - this.targetPositionX) * (this.previousPositionX - this.targetPositionX) +
    	(this.previousPositionY - this.targetPositionY) * (this.previousPositionY - this.targetPositionY));
    var dist = Math.sqrt((this.positionX - this.targetPositionX) * (this.positionX - this.targetPositionX) +
    	(this.positionY - this.targetPositionY) * (this.positionY - this.targetPositionY));
    if (dist <= 0) this.cameraStopped = true;
    if (totalDist > 0) {
    	var frac = dist / totalDist;
    	if (frac > 0.5) frac = 0.5 - (frac - 0.5);
    	this.scale = 2.0 - frac * 1.4;
	} else this.scale = 2.0;
};


TargetingView.prototype.drawMap = function(ctx) {
	ctx.save();
		ctx.drawImage(this.img, 0, 0);

	    for (var i = 0; i < COUNTRIES.length; i++) {
			ctx.fillStyle = '#fb8';
			if (this.isLocationOccupied(i)) ctx.fillStyle = '#00ff00';
    		px = COUNTRIES[i]["mapLocation"][0];
    		py = COUNTRIES[i]["mapLocation"][1];
    		ctx.save();
    		ctx.translate(px, py);
			ctx.fillRect(-5, -5,10,10);
			ctx.font = "16px digital";
			ctx.textAlign = "left";
			ctx.textBaseline = "hanging";
			ctx.fillText(COUNTRIES[i]["name"], 22, 2);
            for (var j = 0; j < COUNTRIES[i].life; ++j) {
                this.heartSprite.drawRotatedNonUniform(ctx, -30 - 18 * j, 11, 0, 0.6, 0.6);
            }
            for (var j = 0; j < this.deliveries.length; ++j) {
                if (this.deliveries[j] === i) {
                    ctx.font = "12px digital";
                    ctx.textBaseline = "bottom";
                    ctx.fillText(this.menuOptions[j], 22, -2);
                }
            }
			ctx.restore();
		}


	ctx.restore();
}

TargetingView.prototype.toScreenX = function(worldX, ctx) {
	return worldX * this.scale + ctx.canvas.width * 0.5;
}

TargetingView.prototype.toScreenY = function(worldY, ctx) {
	return worldY * this.scale + ctx.canvas.height * 0.5;
}

TargetingView.prototype.drawDecorText = function(ctx) {
	var tx = this.positionX + 100.0;
	var screen_X = this.toScreenX(tx, ctx);
	var ty = this.positionY + 100.0;
	var screen_Y = this.toScreenY(ty, ctx);
 	/*ctx.save();
		ctx.translate(screen_X, screen_Y)
		ctx.fillStyle = '#0000ff';
		ctx.fillRect(- 5, - 5, 10, 10);
	ctx.restore();*/

    ctx.save();
    ctx.translate(20, 20);
    ctx.globalAlpha = 0.4;
    ctx.font = '12px digital';
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
    var rowH = 15;
	ctx.fillText("tx: "+tx+" "+Math.round(screen_X),0,0);
	ctx.fillText("ty: "+ty+" "+Math.round(screen_Y),0,rowH);
	screen_Y = this.toScreenY(this.positionY, ctx);
	ctx.fillText("posX: "+ty+" "+Math.round(screen_X),0,rowH * 2);
	screen_Y = this.toScreenY(this.positionY + this.img.height, ctx);
	ctx.fillText("posY: "+ty+" "+Math.round(screen_Y),0,rowH * 3);
	ctx.fillText("TARGET: "+this.targetPositionX+","+this.targetPositionY,0,rowH * 4);
    ctx.restore();
};

var strikeThrough = function(ctx, text, textX, y, color, thickness) {
    var width = ctx.measureText(text).width;

    switch(ctx.textAlign) {
      case "center":
        textX -= (width/2); break;
      case "right":
        textX -= width; break;
    }

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.moveTo(textX, y);
    ctx.lineTo(textX + width, y);
    ctx.stroke();
};

TargetingView.prototype.draw = function(ctx) {

    ctx.fillStyle = '#f8a';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	if (this.canvasWidth == 0) this.canvasWidth = ctx.canvas.width;
	ctx.mozImageSmoothingEnabled = true;
	ctx.save();

	//this.positionX = 0;
	//this.positionY = 0;
	//this.scale = 1.5;

	//Map & all related scrolling stufff
	var screenY = this.toScreenY(this.positionY, ctx);
	var clamp = 0;
	if (screenY > 0) {
		clamp = -screenY / this.scale;
	}
	var screenY = this.toScreenY(this.positionY + this.img.height, ctx);
	if (screenY < ctx.canvas.height) {
		clamp = (ctx.canvas.height - screenY) / this.scale;
	}
	var clamped_y = this.positionY + clamp;

	if (this.loaded) {
 
 		ctx.save();
 		ctx.translate(ctx.canvas.width * 0.5, ctx.canvas.height * 0.5);
        var scale = this.scale;
        if (this.state === TargetingView.state.FINISH) {
            scale *= Math.pow(2, this.stateTime * 0.005);
        }
		ctx.scale(scale, scale);
		ctx.translate(this.positionX, clamped_y);
		this.drawMap(ctx);

		//Repeats
		ctx.translate(-this.img.width, 0);
		this.drawMap(ctx);
		ctx.translate(2 * this.img.width, 0);
		this.drawMap(ctx);
		ctx.restore();
	}

    if (this.cameraStopped) {
        var flag = this.flags[COUNTRIES[this.selectedPoint].shortName];
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.translate(ctx.canvas.width - 22 - flag.width * 0.7, 22);
        ctx.scale(0.7, 0.7);
        flag.draw(ctx, 0, 0);
        ctx.globalAlpha = 1.0;
        ctx.restore();
    }
    
    // screen overlay effect
    this.overlaySprite.draw(ctx, 0, 0);

	//Targeting cursor
	ctx.restore();
	ctx.fillStyle = '#00ffff';
	ctx.save();
	ctx.translate(0, clamp * this.scale);
	this.cursorSprite.drawRotated(ctx, ctx.canvas.width * 0.5, ctx.canvas.height * 0.5, 0, 1);
	var lineWidth = ctx.canvas.width * 0.75;
	var scaleRatio = lineWidth / this.cursorHorizontal.width;
	var cw = this.cursorSprite.width * 0.55 + (2-this.scale) * 50;
	var ch = this.cursorSprite.width * 0.55 + (2-this.scale) * 50;
	this.cursorHorizontal.drawRotatedNonUniform(ctx, ctx.canvas.width * 0.5 + cw + lineWidth * 0.5, ctx.canvas.height * 0.5, 0, scaleRatio, 1);
	this.cursorHorizontal.drawRotatedNonUniform(ctx, ctx.canvas.width * 0.5 - cw - lineWidth * 0.5, ctx.canvas.height * 0.5, 0, scaleRatio, 1);
	scaleRatio = lineWidth / this.cursorVertical.height;
	this.cursorVertical.drawRotatedNonUniform(ctx, ctx.canvas.width * 0.5, ctx.canvas.height * 0.5 + ch + lineWidth * 0.5, 0, 1, scaleRatio);
	this.cursorVertical.drawRotatedNonUniform(ctx, ctx.canvas.width * 0.5, ctx.canvas.height * 0.5 - ch - lineWidth * 0.5, 0, 1, scaleRatio);
	ctx.restore();

    this.drawDecorText(ctx);

    for (var i = 0; i < this.menuOptions.length; ++i) {
        ctx.font = '22px digital';
        ctx.textAlign = 'left';
		ctx.textBaseline = "bottom";
		if (i == this.selectedCake) ctx.fillStyle = "#ff0"; else ctx.fillStyle = "#0ff";
        var text = this.menuOptions[i];
        var x = 30;
        var y = ctx.canvas.height - 25 * i - 20;
		ctx.fillText(text, x, y);
        if (this.deliveries[i] !== undefined) {
            strikeThrough(ctx, text, x, y - 11, ctx.fillStyle, 2);
        }
	}
};