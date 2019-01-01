# MQTT-Socket.io Bridge

Simple server to provide a Socket.io interface to MQTT, allowing you to subscribe, publish and receive messages on an MQTT broker from a web page (specifically p5.js)

## Usage

The easiest way to use it is to deploy it to Heroku.  It can run easily in one of the free dynos.  Create a Heroku account and then hit the button below:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

If you want to use a different MQTT broker to the default (broker.mqtt-dashboard.com) then set the `MQTT_BROKER` accordingly (explained in the [Environment Variables section](#Environment Variables)).

There is an open instance running at [mqtt-socketio-bridge.herokuapp.com/](https://mqtt-socketio-bridge.herokuapp.com/) but it isn't guaranteed to keep running.  If you need to rely on it, you should spin up your own version.

### Running it locally

If you want to run it on your own machine, you'll need to have `NodeJS` and `npm` installed.

 1. Clone this repository or download the code
 1. Run `npm install` from inside the folder where the code is on your machine
 1. (Optional) Set the `PORT` and/or `MQTT_BROKER` environment variables (explained in the [Environment Variables section](#Environment Variables) below)
 1. Start the bridge by running `node index.js`
 1. Check that it is working by going to [localhost:3000/](http://localhost:3000/) in a browser.  That will give you a simple interface to test subscribing, publishing and receiving messages

### Environment Variables

Some parts of the operation of the bridge are configurable without having to change the code.  They are set using environment variables:

 * **MQTT_BROKER** This is a URI specifying the MQTT broker to connect to.  It follows the format described in [MQTT URI scheme](https://github.com/mqtt/mqtt.github.io/wiki/URI-Scheme) documentation.  By default it uses the open broker at broker.mqtt-dashboard.com - [public_brokers](https://github.com/mqtt/mqtt.github.io/wiki/public_brokers) has a list of alternative public brokers.
 * **PORT** The port that the web server should listen on for new connections.  Defaults to 3000 for local use, and is set automatically by Heroku for deployment there.

