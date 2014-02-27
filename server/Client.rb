# encoding: UTF-8
require 'json'
require 'htmlentities'

class Client

	# Temps (secondes) à partir duquel un client est considéré comme mort
	@@pingDead = 3
	@@numClient = 0

	attr_reader :nammed
	attr_reader :game

	def initialize pool, ws
		@pool = pool
		@ws = ws
		@@numClient += 1
		@nammed = false
		@pseudo = "Joueur"+@@numClient.to_s
		@game = nil

		@cvPing = ConditionVariable.new
		@mutexPing = Mutex.new
		@ping = nil
		gestionPing
	end

	def removeFromGame
		@game.removeClient self
	end

	def abortGame
		@game = nil
		# Pas besoin de se déplacer, l'instance game a été détruite
		@pool.againNP self
	end

	def pseudo?
		return !@pseudo.empty?
	end

	def game?
		return @game != nil
	end

	def getPseudo
		if @pseudo.empty?
			return "Un joueur"
		end

		return @pseudo
	end

	def joinGame game
		@game = game
	end

	def gestionPing
		@ping = Thread.new do
			dead = false
			while !dead

				# On attend X secondes avant de lancer un ping
				sleep @@pingDead

				# Envoi d'un ping
				datePing = Time.now.to_i
				send 'ping', 'ping'

				# Attente réception
				@mutexPing.synchronize {
					@cvPing.wait(@mutexPing, @@pingDead) # Se réveille sur réception de ping OU sur timeout
				}

				# Si l'attente a été trop longue, on ferme le thread
				if (Time.now.to_i-datePing >= @@pingDead)
					puts "Timeout #{@pseudo}"
					dead = true
			  	end
			end
			# L'attente a été trop longue, on supprime le client
			close
		end
	end

	def send(type, data)
		msg = {
			"type" => type,
			"data" => data
		}.to_json
		@ws.send msg
		if type != 'ping'
			puts "Sent message: #{msg}"
		end
	end

	def receive(type, data)
		case type

		when "pong"
			@mutexPing.synchronize {
				@cvPing.signal
			}

		when "pseudo"
			@pseudo = HTMLEntities.new.encode(data)
			@nammed = true
			@pool.broadcastNP 'p_in', @pseudo

		when "chat"
			transmission = {
				"sender" => @pseudo,
				"message" => HTMLEntities.new.encode(data)
			}.to_json


			if @game == nil
				@pool.broadcastNP 'chat', transmission
			else
				@game.broadcast 'chat', transmission
			end

		when "game"
			if data == 'join'
				@pool.joinGame self
			else
				puts "Réception de type game non controlée : #{data}"
			end
		else
			puts "Réception de type inconnu #{type} (#{data})"
		end
	end

	def endPing
		Thread.kill(@ping)
	end

	def close
		endPing
		@ws.close
	end

end