function showPos(colonne, ligne) {
	erasePos();
	$('#col'+colonne).css('fill', '#0090EE').css('font-weight', 'bold');
	$('#row'+ligne).css('fill', '#0090EE').css('font-weight', 'bold');
}

function erasePos() {
	$('.posGrille text').css('fill', 'black').css('font-weight', 'normal');
}