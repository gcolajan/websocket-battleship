var STATE = {NONE:0, EMPTY:1, TOUCHED:2};

// TODO: refactor colorisation de la grille dans la classe Case

function Case(state, ship) {
	this.state = state || STATE.NONE;
	this.ship = ship || undefined;


	// Ajoute un bateau à cette case
	this.setShip = function(ship) {
		this.ship = ship;
	}.bind(this);


	// Informe si la case comporte un bateau
	this.hasShip = function() {
		return (this.ship !== undefined);
	}.bind(this);


	// Informe la case qu'elle a été "touchée", retourne son état
	this.shoot = function() {
		if (this.hasShip)
			this.state = STATE.TOUCHED;
		else
			this.state = STATE.EMPTY;

		return this.state;
	}.bind(this);


	// Indique si la fraction de bateau contenue sur la case a été touché
	this.isTouched = function() {
		return (this.state == STATE.TOUCHED);
	}.bind(this);
}