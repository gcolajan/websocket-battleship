

function Flotte(grille) {
	this.grille = grille;
	this.flotte = new Array();
	this.selectedShip = undefined;

	// Réception de la flotte
	this.receiving = function(ships) {
		for (var i = 0 ; i < ships.length ; i++)
			this.flotte.push(new Bateau(grille, ships[i].nom, ships[i].taille));
	}.bind(this);


	// Permet de vérifier que tous les bateaux sont placés
	this.allPlaced = function() {
		for (var i = 0 ; i < flotte.length ; i++)
			if (!flotte[i].isPlaced())
				return false;
		return true;
	}.bind(this);


	// Sélectionne un bateau (pour interactions)
	this.select = function(offset) {
		this.selectedShip = this.flotte[offset];
		console.log(this.selectedShip.nom);
	}.bind(this);


	// Désectionne un bateau (fin de l'interaction)
	this.unselect = function() {
		this.selectedShip = undefined;
	}


	// Permet de savoir si un navire est sélectionné
	this.hasSelectedShip = function() {
		return (this.selectedShip !== undefined);
	}.bind(this);
}

/*

		var placeur = new PlacementBateaux(grilleJoueur, bateauxFromServer);
		while (placeur.hasNext()) {
			var bateau = placeur.getShip();
			$("#ships").append('<li onclick="grilleJoueur.placer('+bateaux.length+');">'+bateau.nom+' ('+bateau.taille+')</li>');
			bateaux.push(bateau);
		}
*/