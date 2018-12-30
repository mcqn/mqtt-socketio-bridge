// mqtt-socketio-bridge
//
// (c) Copyright 2018 MCQN Ltd
//

var mqtt = require('mqtt')
//var socketio = require('socket.io').listen(5000)
var app = require('express')()
var http = require('http').Server(app)
var socketio = require('socket.io')(http)

var port = process.env.PORT || 3000;

// Enter details of the MQTT broker that you want to interface to
// By default we'll use the public HiveMQ one, so any Arduino clients using
// the PubSubClient library can easily talk to it
var MQTT_SERVER = "mqtt://broker.mqtt-dashboard.com"

var client = mqtt.connect(MQTT_SERVER)
client.on('connect', function() {
        client.subscribe('mcqn/#')
        client.publish('mcqn/hello', 'world')
})

client.on('message', function(topic, payload) {
        console.log("topic: "+topic)
        console.log("payload: "+payload)
        // Send it to any interested sockets
        socketio.sockets.emit('mqtt', { 'topic': topic, 'payload': payload.toString() })
})

socketio.sockets.on('connection', function(sock) {
        // New connection, listen for...
        console.log("New connection")

        // ...subscribe messages
        sock.on('subscribe', function(msg) {
                console.log("Asked to subscribe to "+msg.topic)
                sock.join(msg.topic)
                client.subscribe(msg.topic)
        })

        // ...publish messages
        sock.on('publish', function(msg) {
                console.log("socket published ["+msg.topic+"] >>"+msg.payload+"<<")
                client.publish(msg.topic, msg.payload)
        })
})

// Set up web server to serve 
app.get('/', function(req, res) {
        //res.send("<h1>Hello world</h1>")
        res.sendFile(__dirname+"/static_files/mqtt-socket.html")
})

http.listen(port, function() {
        console.log("listening on "+port)
})
