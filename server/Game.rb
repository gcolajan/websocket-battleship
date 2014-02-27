# encoding: UTF-8

class Game
	@@nbClientsMax = 2

	attr_reader :started
	attr_reader :clients

	def initialize pool, num
		@id = num
		@pool = pool
		@mutexClients = Mutex.new
		@clients = Array.new
		@started = false
	end

	def broadcast type, data
		@clients.each do |client|
			client.send type, data
		end
	end

	def state
		return {"num" => @id, "players" => @pool.currentPlayerWaiting, "max" => @@nbClientsMax}
	end

	def full?
		return @clients.count == @@nbClientsMax
	end

	def nbClients
		return @clients.count
	end

	def addClient client
		@mutexClients.synchronize {
			if full?
				return false
			else
				client.send 'p_num', @id
				# On prévient les autres joueurs de notre arrivée
				broadcast 'p_add', client.getPseudo
				# On récupère les joueurs présents
				existingClients = []
				@clients.each do |c|
					existingClients.push(c.getPseudo)
				end
				client.send 'who', existingClients.to_json

				@clients << client
				client.joinGame self
				@pool.broadcastNP 'game', state.to_json 
				return true
			end
		}
	end

	def containsClient client
		return @clients.include?(client)
	end

	def removeClient client
		@mutexClients.synchronize {
			@clients.delete(client)
		}

		if (@started)
			@clients.each do |client|
				client.abortGame
			end
		else
			@pool.broadcast 'info', "Une place s'est libérée dans la partie ##{@id}"
			@pool.broadcast 'game', state.to_json
		end
	end

	def start
		@started = true
		@pool.broadcastNP 'info', "La partie ##{@id} est complète !"
		players = []
		@clients.each do |client|
			players.push(client.getPseudo)
		end

		broadcast 'start', players.to_json
	end

end