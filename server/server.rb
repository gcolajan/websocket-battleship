#! /usr/bin/ruby
# encoding: UTF-8
require 'em-websocket'
require './Pool'
require './Client'

EventMachine.run {

	pool = Pool.new

	EventMachine::WebSocket.start(:host => "0.0.0.0", :port => 8080) do |ws|

		client = nil

		ws.onopen {
			puts "WebSocket connection open"
			client = pool.createClient ws

			puts "Actives connections: #{pool.length}"
			
			client.send 'info', 'Connexion établie'
			pool.sendGame client
		}

		ws.onclose {
			# Détruit l'instance du client (frozen pool ?)
			pool.remove(client)

			puts "Connection closed"
			puts "Actives connections: #{pool.length}"
		}

		ws.onmessage { |msg|
			transmission = JSON.parse(msg)

			if transmission["type"] != 'pong'
				puts "Received message: #{msg}"
			end

			client.receive transmission["type"], transmission["data"]
		}
	end
}
