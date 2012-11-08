# node-smores

node-smores is a simple extensible bot for Campfire.

# Requirements

* A valid [Campfire](http://campfirenow.com/) account.
* [Node.js](http://nodejs.org) >= 0.4.7
* [nomnom](https://github.com/harthur/nomnom) >= 0.5.0
* [node-campfire](https://github.com/tristandunn/node-campfire) >= 0.1.0

# Running node-smores

Copy `config.js-dist` over to `config.js` and edit in the appropriate values for your Campfire installation.

* `account` is the domain of your account. So if your url is "smores.campfirenow.com", your account is "smores".
* `token` is the API token of the user you want to act as your bot.
* `ssl` is self-explanatory.

Run node-smores:

    node run.js --room=ROOM

Note that `--room` accepts either the ID of your room, or its name. It's badass like that.

# Plugins

node-smores is controlled via plugins in `lib/plugins`, and as such, has an easy to use plugin interface.

Plugins consist of a singular function with a command that consists of at least three variables:

1. `name` - Name of the plugin.
2. `regex` - Regex applied to messages to capture and execute this command. As of v0.2 this can be an array of regular expressions if your plugin requires multiple triggers.
3. `callback` - Code to execute for this command.

The order of arguments for the callback are as such:

* `body` - The regex matched message body
* `message` - The message object as returned from the Campfire API.
* `room` - The current room object as returned from node-campfire.
* `smores` - The instance node-smores object.
* `config` - (optional) As of v0.2 plugins can have their own configuration files so if your plugin requires its own configuration file (config.js), node-smores will dump the contents of that into this argument. If your plugin doesn't need any of that, this argument will not be present.

The following is a simple plugin to respond to "/ping" calls.

    /**
     * node-smores plugin to respond to a ping.
     *
     */
    function Command() {
      this.name = "/ping";
      this.regex = /\/ping/;
      this.description = "Respond to a ping.";
      this.callback = function(body, message, room, smores) {
        smores.speak('pong', room);
      }
    };

    exports.Command = Command;

Simple.

# Mentions

* A majority of the code surrounding how plugins work was borrowed from https://github.com/indiefan/nodebot
* Tristan Dunn for node-campfire: https://github.com/tristandunn/node-campfire
