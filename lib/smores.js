var fs = require('fs'),
  util = require('util'),
  Campfire = require('../vendor/node-campfire/lib/campfire').Campfire,
  nomnom = require('nomnom');

var nodeSmores = function() {
  this.version = '0.1';
  this.config = JSON.parse(fs.readFileSync(__dirname + '/../config.js', 'utf8'));

  this.executedOn = new Date();

  this.plugins = [];
  this.messageHandlers = [];

  this.options = nomnom.opts({
    room: {
      string: '-r ROOM, --room=ROOM',
      required: true,
      help: 'Campfire room you wish node-smores to connect to. Can either be the room name or the room ID.'
    },
    version: {
      string: '--version'
    }
  }).parseArgs();

  if (this.options.version) {
    util.debug(this.version);
    process.exit();
  }

  this.campfire = new Campfire({
    token: this.config.token,
    account: this.config.account,
    ssl: (this.config.ssl) ? this.config.ssl : true
  });

  var self = this;
  this.campfire.me(function(data) {
    self.self = data.user
  });
};

/**
 * Run node-smores.
 *
 */
nodeSmores.prototype.run = function() {
  this.loadPlugins();
  this.connect();
};

/**
 * Connect to a room and speak.
 *
 * @param string message
 * @param object room
 *
 */
nodeSmores.prototype.speak = function(message, room) {
  var self = this;

  room.speak(message, function(data) {
    util.log('message: ' + message);
  });
};

/**
 * Connect to the specified Campfire room and start listening for commands.
 *
 */
nodeSmores.prototype.connect = function() {
  var self = this;

  // Check out who we're running as so we aren't recursively repeating commands.
  this.campfire.me(function(data) {
    var who = data.user;

    self.campfire.room(self.options.room, function(room) {
      room.join(function() {
        room.listen(function(message) {
          if (message.type != 'TextMessage') {
            return;
          } else if (who.id == message.user_id) {
            return;
          }

          for (var i = 0; i < self.messageHandlers.length; i++) {
            var handler = self.messageHandlers[i];

            if (message.body.match(handler.regex)) {
              util.log('matched: ' + handler.name);
              handler.callback(message.body, message, room, self);
            }
          }
        });
      });
    });
  });
}

/**
 * Load plugins out of the plugins directory.
 *
 */
nodeSmores.prototype.loadPlugins = function(dir) {
  var self = this;

  if (typeof dir == "undefined") {
    var dir = '/plugins';
  }

  fs.readdir(__dirname + dir, function(err, files) {
    if (err) {
      return;
    }

    for(var i = 0; i < files.length; i++) {
      file = files[i];
      if (file == 'config.js' || file == 'config.js-dist') {
        continue;
      }

      if (file.indexOf(".js") != -1) {
        var filename = __dirname + dir + '/' + file;
        self.loadPlugin(filename);
      } else {
        self.loadPlugins(dir + "/" + file);
      }
    }
  });
};


/**
 * Load a specific plugin.
 *
 * @see loadPlugins
 *
 * @param string filename
 *
 */
nodeSmores.prototype.loadPlugin = function(filename) {
  try {
    var plugin = require(filename);
    var command = new plugin.Command();

    this.addPlugin(filename, command);

    util.debug("Plugin loaded successfully: " + filename);
  } catch (err) {
    util.debug("There was a problem loading the plugin: " + filename);
  }
};

/**
 * Add a plugin into the plugins namespace.
 *
 * @param string filename
 * @param object plugin
 *
 */
nodeSmores.prototype.addPlugin = function(filename, plugin) {
  if (typeof this.plugins[filename] === 'undefined') {
    this.plugins[filename] = {};
  }

  this.plugins[filename].plugin = plugin;
  this.plugins[filename].mtime = null;

  this.addMessageHandler(plugin);
}

/**
 * Remove a plugin from the plugins namespace.
 *
 * @param string filename
 * @param object plugin
 *
 */
nodeSmores.prototype.removePlugin = function(filename, plugin) {
  delete this.plugins[filename].plugin;

  this.removeMessageHandler(plugin.name);
}

/**
 * Create a new plugin message handler.
 *
 * @param object plugin
 *
 */
nodeSmores.prototype.addMessageHandler = function(plugin) {
  this.messageHandlers.push(plugin);
};

/**
 * Remove a plugin message handler.
 *
 * @param string name
 *
 */
nodeSmores.prototype.removeMessageHandler = function(name) {
  for (var i = 0; i < this.messageHandlers.length; i++) {
    var handler = this.messageHandlers[i];
    if (handler.name == name) {
      this.messageHandlers.splice(i, 1);
      return true;
    }
  }

  return false;
};

exports.nodeSmores = nodeSmores;
