# MQTT-Socket.io Bridge

Simple server to provide a Socket.io interface to MQTT, allowing you to subscribe, publish and receive messages on an MQTT broker from a web page (specifically p5.js)

## Usage

The easiest way to use it is to deploy it to Heroku.  It can run easily in one of the free dynos.  Create a Heroku account and then hit the button below:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

If you want to use a different MQTT broker to the default (broker.mqtt-dashboard.com) then set the `MQTT_BROKER` accordingly (explained in the [Environment Variables section](#environment-variables)).

There is an open instance running at [mqtt-socketio-bridge.herokuapp.com/](https://mqtt-socketio-bridge.herokuapp.com/) but it isn't guaranteed to keep running.  If you need to rely on it, you should spin up your own version.

### Running it locally

If you want to run it on your own machine, you'll need to have `NodeJS` and `npm` installed.

 1. Clone this repository or download the code
 1. Run `npm install` from inside the folder where the code is on your machine
 1. (Optional) Set the `PORT` and/or `MQTT_BROKER` environment variables (explained in the [Environment Variables section](#environment-variables) below)
 1. Start the bridge by running `node index.js`
 1. Check that it is working by going to [localhost:3000/](http://localhost:3000/) in a browser.  That will give you a simple interface to test subscribing, publishing and receiving messages

### Environment Variables

Some parts of the operation of the bridge are configurable without having to change the code.  They are set using environment variables:

 * **MQTT_BROKER** This is a URI specifying the MQTT broker to connect to.  It follows the format described in [MQTT URI scheme](https://github.com/mqtt/mqtt.github.io/wiki/URI-Scheme) documentation.  By default it uses the open broker at broker.mqtt-dashboard.com - [public_brokers](https://github.com/mqtt/mqtt.github.io/wiki/public_brokers) has a list of alternative public brokers.
 * **PORT** The port that the web server should listen on for new connections.  Defaults to 3000 for local use, and is set automatically by Heroku for deployment there.

## Tips

### Using With p5.js

This project was initially conceived to make an easier way to get sensor data from an Arduino into [p5.js](https://p5js.org/) to do more interesting visualizations.

If you use the [OpenProcessing](https://www.openprocessing.org/) environment to write your p5.js sketches then you can add the Socket.IO library to your sketch (go to the "Libraries" section of your sketch, choose "Show all" and then you enable the "SocketIO" library).

Then replace the starter code with this:

```js
var socket;

// This is the URL for the MQTT-SocketIO bridge we're connecting to
var MQTT_BRIDGE = "https://mqtt-socketio-bridge.herokuapp.com/"
// Which topic should we subscribe to to receive messages?
// (This can include wildcards - e.g. "mcqn/#" would get messages to "mcqn/123" and "mcqn/somethingelse"
//  but then you should check the topic value in messageReceived too to know which is which)
var MQTT_TOPIC = "mcqn/test"

// This function is called each time we receive a message from the MQTT-SocketIO bridge
function messageReceived(msg) {
	println("mqtt message received! ["+msg.topic+"] >>"+msg.payload+"<<")
	// Do something with the payload...
}

function setup() {
	// Set up the connection to the MQTT-SocketIO bridge...
	// Connect to the MQTT-SocketIO bridge
	socket = io.connect(MQTT_BRIDGE)
	// Set up the callback for when the connection succeeds
	socket.on('connect', function() {
		// We're connected, so we should subscribe to the topic(s) we care about
		socket.emit('subscribe', { 'topic': MQTT_TOPIC })
		// And publish a "we're alive" message, to (a) show that the connection
		// is working, and (b) show how to publish messages
		socket.emit('publish', { 'topic': 'mcqn/test', 'payload': "We're alive!" })
	})
	// Set up the callback for whenever we receive an MQTT message
	socket.on('mqtt', messageReceived)

        // Do any other setup you want to do here...

        // e.g. create a canvas the size of the window
	createCanvas(windowWidth, windowHeight);
}

function draw() {
        // Put your drawing code in here
}

```

That gives you the basics of receiving messages from the MQTT-SocketIO bridge.  There's a more complete example [which graphs the last 200 values received](https://www.openprocessing.org/sketch/648910) too.

For an example of how to feed data to is, check out this [Arduino sketch for an ESP32 to publish sensor data](https://github.com/DoESLiverpool/what-does-health-look-like/tree/master/sensor_mqtt_publish).

### Making Local Data Public

When using the Bridge on Heroku, the MQTT broker that it connects to must be accessible from the wider Internet.  If your broker has been deployed locally, it's unlikely to be accessible from outside your local network.

A simple workaround for this is to republish the data from your local broker to [a publicly accessible broker](https://github.com/mqtt/mqtt.github.io/wiki/public_brokers) (that your Bridge is also pointed at).  **This will make your data public, so don't do it with data that you don't want to make more widely available!**

If you've got `mosquitto_pub` and `mosquitto_sub` installed then you can achieve that with this command line (replacing the parts in ALL CAPS as appropriate):

```
mosquitto_sub -h HOSTNAME-OF-LOCAL-BROKER -t "LOCAL/TOPIC-NAME" | mosquitto_pub -h HOSTNAME-OF-PUBLIC-BROKER -t "PUBLIC/TOPIC-NAME" -l
```

