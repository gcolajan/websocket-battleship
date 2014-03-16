function Grille(dimensions) {

	// Création d'un tableau 2D d'instances de Case
	this.currentShip = undefined; // pour placement
	this.cases = new Array();
	for (var i = 0 ; i < dimensions ; i++)
	{
		var ligne = new Array();
		for (var j = 0 ; j < dimensions ; j++)
			ligne.push(new Case());

		this.cases.push(ligne);
	}


	// Retourne l'instance de la case pointée par la coordonnée
	this.getCase = function(coord) {
		var coordNum = coord.getNumeric();
		return this.cases[coordNum.ligne][coordNum.colonne];
	}.bind(this);


	// Vérifie la présence d'un bateau sur une case
	this.hasShip = function(coord) {
		return this.getCase(coord).hasShip();
	}.bind(this);


	// Vérifie la présence d'un bateau entre deux coordonnées
	this.crossShip = function(c1, c2) {
		var coords = c1.to(c2);
		for (var i = 0 ; i < coords.length ; i++)
			if (this.hasShip(coords[i]))
				return true;
		return false;
	}.bind(this);


	// Renseigne les cases sur leur contenu
	this.addShip = function(ship) {
		// La position a déjà été vérifiée (superposition)
		var coords = ship.coord1.to(ship.coord2);
		for (var i = 0 ; i < coords.length ; i++)
			this.getCase(coords[i]).setShip(ship);
	}.bind(this);


	// Interactions avec la grille pour le placement
	this.placer = function(ship) {
		this.currentShip = ship;
	}

	this.onMouseOver = function(coord) {
		if (this.currentShip.coord1 === undefined)
		{
			if (this.currentShip.couldBeC1(coord))
			{
				console.log('could be C1');
			}
		}
		else
		{
			if (this.currentShip.couldBeC2(coord))
			{
				console.log('could be C2');
			}
		}
	}

	// 
	this.onClick = function(coord) {
		if (this.currentShip.coord1 === undefined)
		{
			this.currentShip.setC1(coord);
		}
		else
		{
			this.currentShip.setC2(coord);
		}
	}

	this.onRightClick = function(coord) {
		this.currentShip.unsetCoord();
		grille.placer(undefined);
	}
}