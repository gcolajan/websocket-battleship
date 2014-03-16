<?php 

function entete($titre) {
	echo '<!DOCTYPE html>
	<html>
	<head>
		<title>'.$titre.' - Battleship</title>
		
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		
		<link rel="stylesheet" href="assets/stylesheets/design.css" />
		<link rel="stylesheet" href="assets/stylesheets/grille.css" />
		
		<script src="http://www.google.com/jsapi"></script>
		<script>google.load("jquery", "1.3")</script>
		<script src="http://jquery-json.googlecode.com/files/jquery.json-2.2.min.js"></script>

		<script src="assets/javascripts/_svg.js"></script>

		<script src="assets/javascripts/tools.js"></script>
		<script src="assets/javascripts/jquery.ws.js"></script>
		<script src="assets/javascripts/Chat.js"></script>
		<script src="assets/javascripts/Case.js"></script>
		<script src="assets/javascripts/Coord.js"></script>
		<script src="assets/javascripts/Bateau.js"></script>
		<script src="assets/javascripts/Grille.js"></script>
		<script src="assets/javascripts/PlacementBateaux.js"></script>
		<script src="assets/javascripts/Flotte.js"></script>
		<script src="assets/javascripts/Flotte_view.js"></script>
		<script src="assets/javascripts/main.js"></script>

	</head>
	<body>';
}


function pied() {
	echo '</body>';
	echo '</html>';
}