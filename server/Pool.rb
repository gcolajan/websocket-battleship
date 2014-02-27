# encoding: UTF-8
require './Client'
require './Game'

class Pool

	def initialize
		# Liste des connexions actives
		@NPCMutex = Mutex.new
		@NoPlayingConnections = Array.new

		# Compteur de parties
		@num = 1
		
		# Parties en cours
		@gamesMutex = Mutex.new
		@games = Array.new

		@game = Game.new(self, @num)
	end

	# Retourne le nombre de joueurs ayant rejoint la partie courante mais non démarrée
	def currentPlayerWaiting
		return @game.nbClients
	end

	def joinGame client
		# On ajoute le client à la partie à remplir
		if not @game.addClient client
			puts "ERR: partie pleine"
		end

		# On l'enlève des non joueurs
		@NPCMutex.synchronize {
			@NoPlayingConnections.delete(client)
		}

		# Si la partie est pleine après l'ajout, on en prépare une vide
		if @game.full?
			@game.start
			@gamesMutex.synchronize {
				@games << @game
				@num += 1
				@game = Game.new(self, @num)
			}
			broadcastNP 'game', @game.state.to_json
		end

		# On averti les non joueurs qu'ils ne pourront plus discuté avec X car il est parti joué
		broadcastNP 'p_join', client.getPseudo
	end

	# Lorsqu'une partie a été abandonnée avant la fin par abandon d'un joueur
	# On replace alors le joueur dans les non joueurs
	def againNP client
		existingClients = []
		@NoPlayingConnections.each do |c|
			if (c.nammed)
				existingClients.push(c.getPseudo)
			end
		end
		client.send 'who', existingClients.to_json

		# On signale que le joueur est de nouveau disponible
		broadcastNP 'p_np', client.getPseudo

		@NPCMutex.synchronize {
			@NoPlayingConnections << client
		}
	end

	def createClient ws
		client = Client.new(self, ws)

		existingClients = []
		@NoPlayingConnections.each do |c|
			if (c.nammed)
				existingClients.push(c.getPseudo)
			end
		end
		client.send 'who', existingClients.to_json

		@NPCMutex.synchronize {
			@NoPlayingConnections << client
		}

		return client
	end

	def sendGame client
		client.send 'game', @game.state.to_json
	end

	def remove client

		# On arrête le ping du client
		client.endPing

		# On prévient les autres joueurs
		if client.pseudo?
			broadcastNP 'p_out', client.getPseudo
		end

		if client.game?
			client.game.broadcast 'p_out', client.getPseudo
		end

		# On supprime les références vers cette instance de Client
		deleted = false

		# Il peut se situer à 3 endroits : non placé, en attente ou en jeu

		# En attente
		@NPCMutex.synchronize {
			if @NoPlayingConnections.delete(client) != nil
				deleted = true
			end
		}

		# Placé dans une partie
		if not deleted
			client.removeFromGame
			# Si la partie était démarrée, il faut alors l'enlever de la liste des jeux en cours
			if client.game.started
				@games.delete(client.game)
			end
		end
	end

	# Nombre de clients présents dans le pool (non joueurs, ayant rejoint une partie mais en attente, entrain de jouer)
	def length
		length = @NoPlayingConnections.count + @game.nbClients

		@games.each do |game|
			length += game.nbClients
		end

		return length
	end

	# Envoie un message aux non joueurs uniquement
	def broadcastNP type, data
		
		@NoPlayingConnections.each do |client|
			client.send type, data
		end
	end

	# Envoie un message à tout le monde
	def broadcast type, data
		# Envoyé aux NP
		broadcastNP type, data

		# Envoyé aux joueurs
		@games.each do |game|
			game.clients.each do |client|
				client.send type, data
			end
		end

		# Envoyé aux joueurs en attente
		@game.broadcast type,data
	end

end