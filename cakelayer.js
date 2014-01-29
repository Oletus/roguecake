var CakeLayer = function(maxY, isCandle, fillingColor) {
    this.y = CakeView.SLOT_RECT.bottom + 60;
    this.maxY = maxY;
    this.down = false;
    this.fillingColor = fillingColor;
    this.splashes = [];
    this.fillingSpread = 0.0;
    this.lastDrawX = 0;
    this.isCandle = isCandle;
    if (this.isCandle) {
        this.y -= 1000;
    }
};

CakeLayer.cakeLayerSprite = null;
CakeLayer.candleSprite = null;

CakeLayer.loadSprites = function() {
    CakeLayer.cakeLayerSprite = new Sprite('cake_layer.png');
    CakeLayer.candleSprite = new Sprite('candle.png');
};

CakeLayer.prototype.update = function(deltaTMillis) {
    if (this.y < this.maxY) {
        this.y += deltaTMillis * 1.5;
        if (this.y > this.maxY) {
            this.y = this.maxY;
            this.down = true;
        }
    } else {
        if (this.fillingSpread < 1.0 && this.splashes.length > 3) {
            this.fillingSpread += deltaTMillis * 0.003;
        }
    }
};

CakeLayer.prototype.draw = function(ctx, x) {
    if (this.isCandle) {
        CakeLayer.candleSprite.drawRotated(ctx, x, this.y);
    } else {
        CakeLayer.cakeLayerSprite.drawRotated(ctx, x, this.y);
        this.lastDrawX = x;
        ctx.fillStyle = this.fillingColor;
        ctx.globalAlpha = 1.0;
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, this.y - 8);
        ctx.scale(1.0, 23 / 58);
        ctx.translate(-x, -(this.y - 8));
        ctx.arc(x, this.y - 8, 58 * this.fillingSpread, 58 * this.fillingSpread, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.globalAlpha = 0.8;
        for (var i = 0; i < this.splashes.length; ++i) {
            ctx.save();
            ctx.beginPath();
            ctx.translate(x + this.splashes[i].x, this.y + this.splashes[i].y);
            ctx.scale(1.0, 23 / 58);
            ctx.translate(-(x + this.splashes[i].x), -(this.y + this.splashes[i].y));
            ctx.arc(x + this.splashes[i].x, this.y + this.splashes[i].y, 20, 13, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        ctx.globalAlpha = 1.0;
    }
};

CakeLayer.prototype.splash = function(x, y) {
    this.splashes.push(new Vec2(x - this.lastDrawX, y - this.y));
    if (this.splashes.length === 3) {
        CakeView.splashFx.playClone();
    }
    if (this.fillingSpread < 1) {
        this.fillingSpread += 0.02;
    }
};
