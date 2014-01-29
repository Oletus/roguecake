var CakeView = function(gameState) {
    this.gameState = gameState;
    this.slots = []; // list of FILLINGS indices
    this.slotPosition = 0; // float position in this.slots
    this.slotSpeed = 0;

    this.iconSprites = [];
    for (var i = 0; i < FILLINGS.length; ++i) {
        this.iconSprites.push(new Sprite(FILLINGS[i].replace(' ', '_').toLowerCase() + '.png'));
    }
    this.plateSprite = new Sprite('cakeplate.png');
    this.machineSprite = new Sprite('cake_machine.png');
    this.conveyorSprite = new Sprite('production_line.png');
    this.bgSprite = new Sprite('cake_background.png');
    this.listBgSprite = new Sprite('digitalsign.png');
    this.arrowSprite = new Sprite('arrow.png');
    this.arrowGlowSprite = new Sprite('arrowglow.png');
    this.spaceSprite = new Sprite('space.png');
    this.spaceGlowSprite = new Sprite('spaceglow.png');
    CakeLayer.loadSprites();

    this.music = new Audio('music_slot_loop', true);
    this.slotRollFx = new Audio('fx_slot_roll');
    this.slotButtonFx = new Audio('fx_slot_button');
    CakeView.splashFx = new Audio('fx_splash');

    this.particleSystem = new ParticleSystem(540 - CakeView.CONVEYOR_HEIGHT, this);

    this.state = CakeView.state.RANDOM;
    this.stateTime = 0;

    this.text = '';
    this.textHidden = 0;
    this.textHiddenDirection = 1;

    this.currentCake = 0;
    this.conveyorPosition = 0; // interpolated value corresponding to currentCake
};

CakeView.prototype = new View();

CakeView.SLOT_SPEED = 0.015;
CakeView.SLOT_COUNT = 20;
CakeView.SLOT_WIDTH = 75;
CakeView.SHOWN_SLOTS = 5;
CakeView.SLOT_RECT = new Rect(480 - CakeView.SLOT_WIDTH * CakeView.SHOWN_SLOTS * 0.5,
                              480 + CakeView.SLOT_WIDTH * CakeView.SHOWN_SLOTS * 0.5,
                              15, 15 + 75);
CakeView.CAKE_COUNT = 3;
CakeView.FILLINGS_PER_CAKE = 3;

CakeView.PLATE_DISTANCE = 240;
CakeView.CONVEYOR_HEIGHT = 160;

CakeView.state = {
    RANDOM: 0,
    SLOWING: 1,
    CHOOSECAKE: 2,
    FILLING: 3,
    FINISH: 4
};

CakeView.prototype.enter = function() {
    this.gameState.cakes = [];
        this.cakesLayers = [];
    while (this.gameState.cakes.length < CakeView.CAKE_COUNT) {
        this.gameState.cakes.push(new Cake());
        this.cakesLayers.push([]); // array for each cake's layers
    }
    this.conveyorPosition = CakeView.CAKE_COUNT + 2;
    this.currentCake = Math.floor((CakeView.CAKE_COUNT - 1) / 2);
    this.particleSystem.clear();

    this.text = '';
    this.state = CakeView.state.RANDOM;
    this.stateTime = 0;

    this.randomizeSlots();
    this.slotPosition = 0;
    this.slotSpeed = 0;
    this.nextSound = 1;

    this.arrowAnim = 0;
    this.music.play();
};

CakeView.prototype.exit = function() {
    this.music.stop();
};

var shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
};

CakeView.prototype.randomizeSlots = function() {
    this.slots = [];
    while (this.slots.length < CakeView.SLOT_COUNT) {
        var fillingSet = [];
        for (var i = 0; i < FILLINGS.length; ++i) {
            fillingSet.push(i);
        }
        shuffleArray(fillingSet);
        for (var i = 0; i < fillingSet.length; ++i) {
            this.slots.push(fillingSet[i]);
        }
    }
};

CakeView.prototype.startTextAnim = function() {
    this.textHidden = 0;
    this.textHiddenDirection = 1;
    this.textAnimTime = this.stateTime;
};

CakeView.prototype.selectFilling = function(fillingIndex) {
    this.text = FILLINGS[fillingIndex];
    this.startTextAnim();
};

CakeView.prototype.splashCallback = function(x, y) {
    var currentLayers = this.cakesLayers[this.currentCake];
    var i = currentLayers.length - 1;
    while (i > 0 && currentLayers[i].isCandle) {
        --i;
    }
    currentLayers[i].splash(x, y);
};

CakeView.prototype.chooseCake = function(fillingIndex, createEffects) {
    if (createEffects === undefined) {
        createEffects = true;
    }
    var centerX = (CakeView.SLOT_RECT.left + CakeView.SLOT_RECT.right) * 0.5;
    this.gameState.cakes[this.currentCake].fillings.push(FILLINGS[fillingIndex]);
    this.changeState(CakeView.state.FILLING);
    if (createEffects) {
        var maxY = 540 - CakeView.CONVEYOR_HEIGHT - 5 - this.cakesLayers[this.currentCake].length * 17;
        this.cakesLayers[this.currentCake].push(new CakeLayer(maxY, false, FILLING_COLORS[fillingIndex]));
        if (this.cakesLayers[this.currentCake].length === CakeView.FILLINGS_PER_CAKE) {
            this.cakesLayers[this.currentCake].push(new CakeLayer(maxY - 22, true));
        }
        this.particleSystem.groundY = maxY - 5;
        for (var i = 0; i < 30; ++i) {
            var x = centerX + (Math.random() - 0.5) * 80;
            var y = CakeView.SLOT_RECT.bottom - 200 + Math.random() * 100;
            var pos = new Vec2(x, y);
            var vel = new Vec2(0, 1200);
            var acc = new Vec2(0, 500);
            var size = 20;
            var color = FILLING_COLORS[fillingIndex];
            var lifeSeconds = 1;
            var createsSplash = true;
            var splashCount = 2;
            var splashAngle = Math.PI * 1.5;
            var splashAngleVariation = Math.PI * 0.7;
            var splashVel = 350;
            var splashVelVariation = 260;
            var splashVelYMult = 0.8;
            var part = new Particle(pos, vel, acc, size, color, lifeSeconds,
                                createsSplash, splashCount,
                                splashAngle, splashAngleVariation,
                                splashVel, splashVelVariation,
                                splashVelYMult);
            part.groundVar = (Math.random() - 0.5) * Math.sqrt(Math.pow(50, 2) - Math.pow(x - centerX, 2)) * 0.4;
            this.particleSystem.particles.push(part);
        }
    }
};

CakeView.prototype.logCakes = function() {
    for (var i = 0; i < this.gameState.cakes.length; ++i) {
        cakeStr = [];
        for (var j = 0; j < this.gameState.cakes[i].fillings.length; ++j) {
            cakeStr.push(this.gameState.cakes[i].fillings[j]);
        }
        console.log('Cake ' + i + ': ' + cakeStr.join(', '));
    }
};

CakeView.prototype.changeState = function(state) {
    this.state = state;
    this.stateTime = 0;
};

CakeView.ease = function(x) {
    return (Math.asin(x * 2 - 1) + 0.5 * Math.PI) / Math.PI;
};

CakeView.prototype.draw = function(ctx) {
    this.bgSprite.draw(ctx, 0, 0);

    this.drawConveyor(ctx);
    
    if (this.state === CakeView.state.RANDOM || this.state === CakeView.state.CHOOSECAKE) {
        var spaceY = ctx.canvas.height - CakeView.CONVEYOR_HEIGHT - 90 - Math.sin(this.arrowAnim) * 5;
        var centerX = (CakeView.SLOT_RECT.left + CakeView.SLOT_RECT.right) * 0.5;
        this.spaceSprite.drawRotated(ctx, centerX, spaceY);
        ctx.globalAlpha = Math.sin(this.arrowAnim) * 0.5 + 0.5;
        this.spaceGlowSprite.drawRotated(ctx, centerX, spaceY);
        ctx.globalAlpha = 1.0;
    }

    this.particleSystem.draw(ctx);

    ctx.save();
    canvasUtil.clipRect(ctx, CakeView.SLOT_RECT);
    ctx.fillStyle = '#eee';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (var i = 0; i < CakeView.SHOWN_SLOTS + 1; ++i) {
        var slotIndex = (i + Math.floor(this.slotPosition)) % CakeView.SLOT_COUNT;
        var slotOffset = this.slotPosition - Math.floor(this.slotPosition);
        this.iconSprites[this.slots[slotIndex]].drawRotated(ctx, (i - CakeView.ease(slotOffset) + 0.5) * CakeView.SLOT_WIDTH + CakeView.SLOT_RECT.left, (CakeView.SLOT_RECT.top + CakeView.SLOT_RECT.bottom) * 0.5);
    }
    ctx.restore(ctx);
    this.machineSprite.draw(ctx, ctx.canvas.width * 0.5 - this.machineSprite.width * 0.5, 0);
    this.drawText(ctx);
};

CakeView.prototype.drawText = function(ctx) {
    ctx.font = '46px digital';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    var shownText = this.text;
    if (this.textHidden >= 0 && this.textHidden < this.text.length && this.state !== CakeView.state.FILLING) {
        shownText = this.text.substring(0, this.textHidden) + ' ' + this.text.substring(this.textHidden + 1, this.text.length);
    }

    var textX = (CakeView.SLOT_RECT.left + CakeView.SLOT_RECT.right) * 0.5;
    var textY = CakeView.SLOT_RECT.bottom + 27;
    ctx.fillStyle = '#b05';
    ctx.fillText(shownText, textX + 1, textY + 1);
    ctx.fillText(shownText, textX - 1, textY + 1);
    ctx.fillText(shownText, textX + 1, textY - 1);
    ctx.fillText(shownText, textX - 1, textY - 1);
    ctx.fillStyle = '#f8a';
    ctx.fillText(shownText, textX, textY);
};

CakeView.prototype.drawConveyor = function(ctx) {
    var centerX = (CakeView.SLOT_RECT.left + CakeView.SLOT_RECT.right) * 0.5;
    var platePos = new Vec2(centerX, ctx.canvas.height - CakeView.CONVEYOR_HEIGHT + 4);
    var listPos = new Vec2(centerX, ctx.canvas.height - 92);
    if (this.state === CakeView.state.FINISH) {
        listPos.y += this.stateTime * 0.2;
    }
    var listBgPos = new Vec2(listPos.x, listPos.y + 37);

    platePos.x -= this.conveyorPosition * CakeView.PLATE_DISTANCE;
    listPos.x -= this.currentCake * CakeView.PLATE_DISTANCE;
    listBgPos.x -= CakeView.CAKE_COUNT * CakeView.PLATE_DISTANCE;
    for (var i = 0; i < CakeView.CAKE_COUNT * 2; ++i) {
        this.listBgSprite.drawRotated(ctx, listBgPos.x, listBgPos.y);
        listBgPos.x += CakeView.PLATE_DISTANCE;
    }

    var conveyorX = platePos.x;
    while (conveyorX < 0) {
        conveyorX += ctx.canvas.width;
    }
    conveyorX = conveyorX % ctx.canvas.width;

    this.conveyorSprite.draw(ctx, conveyorX, platePos.y - 15);
    this.conveyorSprite.draw(ctx, conveyorX - ctx.canvas.width, platePos.y - 15);
    for (var i = 0; i < CakeView.CAKE_COUNT; ++i) {
        this.plateSprite.drawRotated(ctx, platePos.x, platePos.y);
        if (Math.abs(this.conveyorPosition - this.currentCake) < 0.2) {
            this.gameState.cakes[i].drawList(ctx, listPos.x, listPos.y, '#000', '#555');
        }
        var arrowY = ctx.canvas.height - CakeView.CONVEYOR_HEIGHT - 90 - Math.sin(this.arrowAnim) * 5;
        if (this.acceptsMoves() && this.currentCake === i) {
            this.arrowSprite.drawRotated(ctx, listPos.x + CakeView.PLATE_DISTANCE * 0.5, arrowY);
            ctx.globalAlpha = Math.sin(this.arrowAnim) * 0.5 + 0.5;
            this.arrowGlowSprite.drawRotated(ctx, listPos.x + CakeView.PLATE_DISTANCE * 0.5, arrowY);
            ctx.globalAlpha = 1.0;
        }
        if (this.acceptsMoves() && this.currentCake === i) {
            this.arrowSprite.drawRotatedNonUniform(ctx, listPos.x - CakeView.PLATE_DISTANCE * 0.5, arrowY, 0, -1.0, 1.0);
            ctx.globalAlpha = Math.sin(this.arrowAnim) * 0.5 + 0.5;
            this.arrowGlowSprite.drawRotatedNonUniform(ctx, listPos.x - CakeView.PLATE_DISTANCE * 0.5, arrowY, 0, -1.0, 1.0);
            ctx.globalAlpha = 1.0;
        }
        for (var j = 0; j < this.cakesLayers[i].length; j++) {
            if (this.cakesLayers[i][j].down) {
                this.cakesLayers[i][j].draw(ctx, platePos.x);
            } else {
                this.cakesLayers[i][j].draw(ctx, centerX);
            }
        }
        platePos.x += CakeView.PLATE_DISTANCE;
        listPos.x += CakeView.PLATE_DISTANCE;
    }
};

CakeView.prototype.animateConveyor = function(deltaTimeMillis) {
    if (this.state === CakeView.state.FINISH) {
        this.conveyorPosition -= 0.010 * deltaTimeMillis;
    } else {
        if (this.conveyorPosition < this.currentCake) {
            this.conveyorPosition += 0.006 * deltaTimeMillis;
            if (this.conveyorPosition > this.currentCake) {
                this.conveyorPosition = this.currentCake;
            }
        } else if (this.conveyorPosition > this.currentCake) {
            this.conveyorPosition -= 0.006 * deltaTimeMillis;
            if (this.conveyorPosition < this.currentCake) {
                this.conveyorPosition = this.currentCake;
            }
        }
    }
};

CakeView.prototype.animateText = function(deltaTimeMillis) {
    if (this.stateTime > this.textAnimTime && this.text.length > 0) {
        this.textHidden += this.textHiddenDirection;
        if (this.textHidden > this.text.length) {
            this.textHiddenDirection = -1;
        }
        if (this.textHidden < -1) {
            this.textHiddenDirection = 1;
        }
        this.textAnimTime += 500 / (this.text.length + 2);
    }
};

CakeView.prototype.update = function(deltaTimeMillis) {
    this.slotPosition += deltaTimeMillis * this.slotSpeed;
    this.stateTime += deltaTimeMillis;
    if (this.state === CakeView.state.RANDOM) {
        if (this.slotSpeed < CakeView.SLOT_SPEED) {
            this.slotSpeed += deltaTimeMillis * 0.00004;
            if (this.slotSpeed > CakeView.SLOT_SPEED) {
                this.slotSpeed = CakeView.SLOT_SPEED;
            }
        }
        if (this.slotPosition > this.nextSound) {
            this.nextSound += 1;
            this.slotRollFx.playClone();
        }
    }
    if (this.state === CakeView.state.SLOWING) {
        if (this.slotPosition > this.nextSlow) {
            this.slotSpeed -= CakeView.SLOT_SPEED * 0.333;
            this.nextSlow += 1;
            if (this.slotSpeed < CakeView.SLOT_SPEED * 0.01) {
                this.slotSpeed = 0;
                this.slotPosition = Math.round(this.slotPosition);
                var slotIndex = (Math.floor(CakeView.SHOWN_SLOTS / 2) + Math.round(this.slotPosition)) % CakeView.SLOT_COUNT;
                this.changeState(CakeView.state.CHOOSECAKE);
                this.fillingIndex = this.slots[slotIndex];
                this.selectFilling(this.fillingIndex);
            }
        }
    }
    if (this.state === CakeView.state.FILLING) {
        var currentLayers = this.cakesLayers[this.currentCake];
        if (currentLayers[currentLayers.length - 1].down && this.stateTime < 9000) {
            this.stateTime = 10000;
        }
        if (this.stateTime > 10250) {
            this.changeState(CakeView.state.RANDOM);
            this.text = '';
            if (this.cakeFull(this.currentCake)) {
                this.right();
            }
            if (this.cakeFull(this.currentCake)) {
                this.changeState(CakeView.state.FINISH);
            }
        }
    }
    
    if (this.state === CakeView.state.FINISH) {
        var text = 'LAUNCHING';
        if (this.stateTime > 1000) {
            text = 'ORBITAL';
        }
        if (this.stateTime > 2000) {
            text = 'CAKE';
        }
        if (this.stateTime > 3000) {
            text = 'DELIVERY';
        }
        if (text !== this.text) {
            this.text = text;
            this.startTextAnim();
        }
    }

    for (var i = 0; i < this.cakesLayers.length; ++i) {
        for (var j = 0; j < this.cakesLayers[i].length; ++j) {
            this.cakesLayers[i][j].update(deltaTimeMillis);
        }
    }

    this.animateConveyor(deltaTimeMillis);
    this.animateText(deltaTimeMillis);

    this.particleSystem.update(deltaTimeMillis);
    
    this.arrowAnim += deltaTimeMillis * 0.005;

    if (this.state === CakeView.state.FINISH && this.stateTime > 4000) {
        return true;
    }
};

CakeView.prototype.space = function() {
    if (this.state === CakeView.state.RANDOM) {
        if (this.stateTime > 300) {
            this.slotButtonFx.playClone();
            this.changeState(CakeView.state.SLOWING);
            this.nextSlow = Math.ceil(this.slotPosition);
        }
    }
    if (this.state === CakeView.state.CHOOSECAKE && this.stateTime > 200) {
        this.chooseCake(this.fillingIndex);
    }
    if (this.state === CakeView.state.FINISH && this.stateTime > 200) {
        this.stateTime += 5000;
    }
};

CakeView.prototype.animateCakeChange = function() {
};

CakeView.prototype.cakeFull = function(cakeIndex) {
    return this.gameState.cakes[cakeIndex].fillings.length >= CakeView.FILLINGS_PER_CAKE;
};

CakeView.prototype.right = function() {
    this.currentCake = (this.currentCake + 1) % CakeView.CAKE_COUNT;
    var moves = 1;
    while (this.cakeFull(this.currentCake) && moves < CakeView.CAKE_COUNT) {
        this.currentCake = (this.currentCake + 1) % CakeView.CAKE_COUNT;
        ++moves;
    }
    this.animateCakeChange();
};

CakeView.prototype.acceptsMoves = function() {
    var cakesFull = 0;
    for (var i = 0; i < CakeView.CAKE_COUNT; ++i) {
        if (this.cakeFull(i)) {
            ++cakesFull;
        }
    }
    return this.state === CakeView.state.CHOOSECAKE && cakesFull < CakeView.CAKE_COUNT - 1;
}

CakeView.prototype.rightArrow = function() {
    if (this.acceptsMoves()) {
        this.right();
    }
};

CakeView.prototype.leftArrow = function() {
    if (this.acceptsMoves()) {
        this.currentCake = (this.currentCake - 1 + CakeView.CAKE_COUNT) % CakeView.CAKE_COUNT;
        var moves = 1;
        while (this.cakeFull(this.currentCake) && moves < CakeView.CAKE_COUNT) {
            this.currentCake = (this.currentCake - 1 + CakeView.CAKE_COUNT) % CakeView.CAKE_COUNT;
            ++moves;
        }
        this.animateCakeChange();
    }
};

CakeView.prototype.developerSkip = function() {
    while (!this.cakeFull(this.currentCake)) {
        this.chooseCake(Math.floor(Math.random() * FILLINGS.length) % FILLINGS.length, false);
        if (this.cakeFull(this.currentCake)) {
            this.right();
        }
    }
    this.logCakes();
};
