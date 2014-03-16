Flotte.prototype.writeList = function() {
	for (var i = 0 ; i < this.flotte.length ; i++) {
		var bateau = this.flotte[i];
		$("#ships").append('<li id="ship_'+i+'" onclick="flotte.select('+i+');">'+bateau.nom+' ('+bateau.taille+' cases)</li>');
	}
};