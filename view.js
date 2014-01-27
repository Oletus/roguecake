var View = function() {
};

View.prototype.leftArrow = function() {
};
View.prototype.rightArrow = function() {
};
View.prototype.downArrow = function() {
};
View.prototype.upArrow = function() {
};
View.prototype.space = function() {
};
View.prototype.enterKey = function() {
    this.space();
};

// Should return true when the view wants to exit. Note that the view doesn't exit immediately after returning true.
View.prototype.update = function(deltaTimeMillis) {
};
View.prototype.draw = function(ctx) {
};
View.prototype.enter = function() {
};
View.prototype.exit = function() {
};

// For testing, should fill in random player input and exit the view.
View.prototype.developerSkip = function() {    
};