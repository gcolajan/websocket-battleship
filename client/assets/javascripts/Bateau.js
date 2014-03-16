function Bateau(grille, nom, taille, coord1, coord2) {
	this.grille = grille;
	this.nom = nom;
	this.taille = taille;
	this.coord1 = coord1;
	this.coord2 = coord2;
	this.touched = new Array(); // Coordonnées auxquelles le bateau a été touché


	this.unsetCoord = function() {
		this.coord1 = undefined;
		this.coord2 = undefined;
	}.bind(this);


	this.hasC1 = function() {
		return (this.coord1 !== undefined);
	}.bind(this);


	this.couldBeC1 = function(coord) {
		// Si on n'emploie pas une case déjà utilisée
		return !grille.hasShip(coord);
	}.bind(this);


	this.setC1 = function(coord) {
		if (!this.couldBeC1(coord))
			return false;

		this.coord1 = coord;
		return true;
	}.bind(this);


	// Vérifie que la coordonnée indiquée puisse être la bonne
	this.couldBeC2 = function(coord) {
		// Si la longueur du bateau est correcte
		if (this.coord1.lengthWith(coord) != this.taille)
			return false;

		// Si le bateau ne superpose pas un autre
		if (grille.crossShip(this.coord1, coord))
			return false;

		return true;
	}.bind(this);


	this.setC2 = function(coord) {
		if (!this.couldBeC2(coord))
			return false;

		this.coord2 = coord;
		grille.addShip(this);
		return true;
	}.bind(this);


	// Indique si le bateau est entièrement placé
	this.isPlaced = function() {
		return (this.coord1 !== undefined && this.coord2 !== undefined);
	}


	// Le bateau a-t-il déjà été touché à cet endroit ?
	this.isTouchedAt = function(coord) {
		for (var i = 0 ; i < this.touched.length ; i++)
			if (coord.equals(this.touched[i]))
				return true;
		return false;
	}.bind(this);


	// On insère la coordonnée touchée (on ne vérifie pas si la coordonnée est sur le bateau)
	this.touched = function(coord) {
		if (!this.isTouchedAt(coord)) this.touched.push(coord);
	}.bind(this);


	// Le bateau est-il coulé
	this.isSunk = function() {
		return (this.touched.length == this.taille);
	}.bind(this);
}