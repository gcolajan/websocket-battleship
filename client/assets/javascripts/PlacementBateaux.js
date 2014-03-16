function PlacementBateaux(grille, bateaux) {
	this.grille = grille;
	this.bateaux = bateaux;
	this.it = -1;
	this.currentShip = undefined;
	this.processing = true;

	// Indique s'il existe encore au moins un bateau à instancier
	this.hasNext = function() {
		this.it++;
		if (this.it >= this.bateaux.length)
		{
			this.processing = false; // on a fini de placer les bateaux
			return false;
		}

		return true;
	}.bind(this);


	// Retourne l'instance du bateau à placer
	this.getShip = function() {
		var ship = bateaux[this.it];
		return new Bateau(grille, ship.nom, ship.taille);
	}.bind(this);
}