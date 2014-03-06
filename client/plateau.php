<?php
require 'ressources/entetes.php';
require 'ressources/grille.php';
entete('Plateau');
?>

	<div id="chat">
		<h1>Chat</h1>
		<section id="chatBox"></section>
		<input id="message" type="text" placeholder="&gt;" autocomplete="off" disabled />
	</div>

	<div id="conteneur">

		<div id="header">
			<h1>Bataille navale</h1>
		</div>

		<div id="operations">
			<h1>Opérations</h1>

			<input type="submit" id="join" value="Rejoindre une partie" />
			<section id="content"></section>
			<h2>Joueurs</h2>
			<ul id="players"></ul>
		</div>



		<div id="bataille">

			<div id="grille">
				<h1>Champ de bataille</h1>
				<?php echo genererGrille(10, 500); ?>
			</div>

			<div id="connexion">
				<h1>Connexion</h1>

				<fieldset>
					<legend>Rejoindre une partie</legend>
					<form id="identification" action="#">
						<p>Afin de rejoindre les autres joueurs, choisissez un pseudo :<br />
						<input id="pseudo" type="text" placeholder="Pseudo" />
						<input type="submit" value="Connexion" /></p>
					</form>
				</fieldset>
			</div>
		</div>




		<script>
		var chat = new Chat();
		var numPartie = 0;
		var players = [];

		function erasePlayers() {
			$('#players').html('');
		}

		function addPlayer(player) {
			$("#players").append('<li>'+player+'</li>');
		}

		function showPlayers() {
			erasePlayers();
			players.forEach( addPlayer );
		}

		var ws = $.websocket("ws://localhost:8080/", {
				events: {
						info: function(e) {chat.info(e.data);},
						p_in: function(e) {chat.info(e.data + " a rejoint le serveur"); players.push(e.data); showPlayers();},
						p_out: function(e) {chat.debug(e.data + " a quitté le serveur"); players.splice( $.inArray(e.data, players), 1 ); showPlayers();},
						p_join: function(e) { // Un joueur est parti joué
							chat.info(recept['player']+" a rejoint une partie");
							players.splice( $.inArray(recept['player'], players), 1 );
							showPlayers();
						},
						p_np: function(e) { // On retourne sur le champ des non joueurs
							chat.info(e.data + " est de nouveau disponible");
							numPartie = 0;
							players = [];
							erasePlayers();
						},
						who: function(e) { // Qui était là avant d'arriver (connexion, np_again et p_num/start)
							players = JSON.parse(e.data)
							if ($('#pseudo').val() != "")
								players.push($('#pseudo').val());
							showPlayers();
						},
						game: function(e) {
							recept = JSON.parse(e.data);
							chat.neutral('Partie #' + recept['num'] +" : "+recept['players']+"/"+recept['max']+" joueurs")
						},
						p_num: function(e) { // On arrive dans une partie (jouée ou non)
							numPartie = e.data;
						},
						p_add: function(e) {
							players.push(e.data);
							showPlayers();
							chat.info(e.data + " vous a rejoint");
						},
						start: function(e) {
							chat.info("La partie #"+numPartie+" peut démarrer !");
						},
						chat: function(e) {
							recept = JSON.parse(e.data);
							chat.chat('<strong>' + recept['sender'] + '</strong> − '+ recept['message']);
						},
						ping: function(e) {ws.send('pong', '');}
				}
		});

		$('#identification').submit(function( event ) {
			ws.send('pseudo', $('#pseudo').val());
			
			$('#pseudo').attr('disabled', 'disabled');
			$('#message').removeAttr('disabled');

			$('#connexion').css('display', 'none');
			$('#grille').css('display', 'block');
		});

		$('#message').change(function(){
		  ws.send('chat', this.value);
		  this.value = '';
		});

		$('#join').click(function(){
		  ws.send('game', 'join');
		});
		</script>

		<div style="clear:both;"></div>

		<div id="pied">-</div>

	</div>

<?php
pied();
