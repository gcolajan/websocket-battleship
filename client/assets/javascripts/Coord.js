function Coord(col, row) {
	this.colonne = col;
	this.ligne = row;

	// Appelé avec un seul argument, constructeur sur l'id
	if (row === undefined) {
		var coord = col.split('_')[1]; // case_A1
		this.colonne = coord.substr(0,1);
		this.ligne = coord.substr(1);
	}


	// Affiche la coordonnée stockée
	this.print = function() {
		return this.colonne+this.ligne;
	}.bind(this);


	// Retourne le DOM de la case
	this.getId = function() {
		return $('svg g.cases #case_'+this.print());
	}.bind(this);


	// Retourne les coordonnées sans lettre (démarrage à 0)
	this.getNumeric = function() {
		return {
			colonne:	this.colonne.charCodeAt(this.colonne)-65,
			ligne:		this.ligne-1
		};
	}.bind(this);


	// Vérifie que deux points sont égaux
	this.equals = function(coord) {
		return this.ligne == coord.ligne && this.colonne == coord.colonne;
	}.bind(this);


	// Vérifie si l'on forme une droite horizontale ou verticale
	this.isAligned = function(coord) {
		return (this.colonne == coord.colonne || this.ligne == coord.ligne);
	}.bind(this);


	// Uniquement vertical ou horizontal (sinon renvoie 0)
	this.lengthWith = function(coord) {
		if (!this.isAligned(coord))
			return -1;

		return 1 +
			Math.abs(this.ligne - coord.ligne) + 
			Math.abs(this.getNumeric().colonne - 
				coord.getNumeric().colonne);
	}.bind(this);


	// Retourne les cases présentes entre deux coordonnées
	this.to = function(coordTo) {
		if (!this.isAligned(coordTo))
			return new Array();

		var next = function() {};
		if (this.ligne != coordTo.ligne) // Vertical
			if (this.ligne < coordTo.ligne)
				next = function() {ligne++;}
			else
				next = function() {ligne--;}

		else // Horizontal
			if (this.colonne.charCodeAt(this.colonne) < coordTo.colonne.charCodeAt(coordTo.colonne))
				next = function() {
						colonne = String.fromCharCode(
							colonne.charCodeAt(colonne)+1);
				}
			else
				next = function() {
					colonne = String.fromCharCode(
						colonne.charCodeAt(colonne)-1);
				}

		var coord = this;
		var colonne = this.colonne;
		var ligne = this.ligne;

		var path = [coord];

		while (!coord.equals(coordTo))
		{
			next();
			path.push(coord = new Coord(colonne, ligne));
		}

		return path;
	}.bind(this);
}