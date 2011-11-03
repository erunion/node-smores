var fs = require('fs'),
  util = require('util'),
  Campfire = require('campfire');

var nodeSmores = function() {
  this.version = '0.3';
  this.config = JSON.parse(fs.readFileSync(__dirname + '/../config.js', 'utf8'));

  this.executedOn = new Date();

  this.plugins = [];
  this.pluginNameRef = [];
  this.messageHandlers = [];

  this.room = null;

  var self = this;

  if (this.config.pluginConfig) {
    throw new Error('"pluginConfig" is a reserved word for node-smores. It cannot be used within your config.js.');
  }

  this.config.pluginConfig = {};

  this.options = require('nomnom')
    .opts({
      room: {
        string: '-r ROOM, --room=ROOM',
        help: 'Room to connect to; can either be the room name or the room ID.',
        required: true
      },
      verbose: {
        string: '-v, --verbose',
        help: 'If you wish to output verbose data when node-smores runs. Can also set this up in your config.js'
      },
      version: {
        string: '--version',
        callback: function() {
          return self.version;
        }
      }
    })
    .parseArgs();

  this.verbose = (this.options.verbose) ? true : ((typeof this.config.verbose != 'undefined') ? this.config.verbose : false);

  this.campfire = new Campfire({
    token: this.config.token,
    account: this.config.account,
    ssl: (this.config.ssl) ? this.config.ssl : true
  });

  // If the room that we're trying to connect to is a string and not a number,
  // we need to look up that room to pull up its campfire ID so we can connect
  // to it with node-campfire.
  if (typeof this.options.room == 'string') {
    this.campfire.rooms(function(error, rooms) {
      for (var room in rooms) {
        if (rooms[room].name === self.options.room) {
          self.room = rooms[room].id;
          break;
        }
      }

      if (self.room == null) {
        throw new Error('Could not locate the room: ' + self.options.room);
      }
    });
  } else {
    this.room = this.options.room;
  }
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
 * Connect to the specified Campfire room and start listening for commands.
 *
 */
nodeSmores.prototype.connect = function() {
  var self = this;

  // Check out who we're running as so we aren't recursively repeating commands.
  this.campfire.me(function(error, response) {
    var who = response.user;

    self.campfire.join(self.room, function(error, room) {
      if (error != null) {
        throw new Error(error.message);
        return;
      }

      if (self.verbose) {
        util.log('Listening...');
      }

      room.listen(function(message) {
        if (message.type != 'TextMessage') {
          return;
        } else if (who.id == message.userId) {
          return;
        }

        for (var i = 0; i < self.messageHandlers.length; i++) {
          var handler = self.messageHandlers[i],
            pluginName = self.pluginNameRef[handler.name];

          // Plugin only has a single regex trigger.
          if (typeof handler.regex == 'function') {
            if (!message.body.match(handler.regex)) {
              continue;
            }

          // Plugin has multiple triggers.
          } else {
            var foundMatch = false;
            for (var ii = 0; ii < handler.regex.length; ii++) {
              if (!message.body.match(handler.regex[ii])) {
                continue;
              } else {
                foundMatch = true;
              }
            }

            if (!foundMatch) {
              continue;
            }
          }

          if (self.verbose) {
            util.log('matched: ' + handler.name);
          }

          if (typeof self.config.pluginConfig[pluginName] == 'undefined') {
            handler.callback(message.body, message, room, self);
          } else {
            handler.callback(message.body, message, room, self, self.config.pluginConfig[pluginName]);
          }
        }
      });
    });
  });
};

/**
 * Connect to a room and speak.
 *
 * @param string message Message to send to a Campfire room.
 * @param object room node-campfire room object
 *
 */
nodeSmores.prototype.speak = function(message, room) {
  var self = this;

  room.speak(message, function(error, response) {
    if (self.verbose) {
      util.log('message: ' + message);
    }
  });
};

/**
 * Connect to a room and paste a message.
 *
 * @param string message Message to paste into a Campfire room.
 * @param object room node-campfire room object
 *
 */
nodeSmores.prototype.paste = function(message, room) {
  var self = this;

  room.paste(message, function(error, response) {
    if (self.verbose) {
      util.log('paste: ' + message);
    }
  });
};

/**
 * Connect to a room and print out a node-smores error message.
 *
 * @param string errorMessage Error to send to a Campfire room.
 * @param object room node-campfire room object
 *
 */
nodeSmores.prototype.speakError = function(errorMessage, room) {
  var self = this;

  room.speak('error: ' + errorMessage, function(error, response) {
    if (self.verbose) {
      util.log('error: ' + errorMessage);
    }
  });
};

/**
 * Load plugins out of the plugins directory.
 *
 * @param string dir Plugin directory that we're going to traverse into.
 *
 */
nodeSmores.prototype.loadPlugins = function(dir) {
  var self = this;

  if (typeof dir == "undefined") {
    dir = '/plugins';
  }

  fs.readdir(__dirname + dir, function(err, files) {
    if (err) {
      return;
    }

    for(var i = 0; i < files.length; i++) {
      file = files[i];

      // Ignore config.js-dist files.
      if (file == 'config.js-dist') {
        continue;
      }

      // Plugin has a config file.
      if (file == 'config.js') {
        var pluginName = dir.replace(/\/plugins\//, ''),
          filename = __dirname + dir + '/' + file;

        self.loadPluginConfig(pluginName, filename);

      // Load plugin.
      } else if (file.indexOf(".js") != -1) {
        var pluginName = file.replace(/.js/, ''),
          filename = __dirname + dir + '/' + file;

        self.loadPlugin(pluginName, filename);

      // Plugin happens to be stored within a subdirectory, traverse that.
      } else {
        self.loadPlugins(dir + "/" + file);
      }
    }
  });
};

/**
 * Load a configuration file for a specific plugin.
 *
 * @see nodeSmores.prototype.loadPlugins
 *
 * @param string pluginName Name of the plugin that we're loading.
 * @param string filename Plugin config filename.
 *
 */
nodeSmores.prototype.loadPluginConfig = function(pluginName, filename) {
  try {
    this.config.pluginConfig[pluginName] = JSON.parse(fs.readFileSync(filename, 'utf8'));

    if (this.verbose) {
      util.log("Loaded plugin config: " + pluginName + ".");
    }
  } catch (err) {
    util.log("There was a problem loading the config file for the plugin: " + pluginName);
  }
};

/**
 * Load a specific plugin.
 *
 * @see nodeSmores.prototype.loadPlugins
 *
 * @param string pluginName Name of the plugin that we're loading.
 * @param string filename Plugin filename.
 *
 */
nodeSmores.prototype.loadPlugin = function(pluginName, filename) {
  try {
    var plugin = require(filename);
    var command = new plugin.Command();

    this.addPlugin(pluginName, filename, command);

    if (this.verbose) {
      util.log("Loaded plugin: " + pluginName);
    }
  } catch (err) {
    util.log("There was a problem loading the plugin: " + filename);
  }
};

/**
 * Add a plugin into the plugins namespace.
 *
 * @param string pluginName Name of the plugin we're adding.
 * @param string filename Plugin filename.
 * @param object plugin Plugin command function.
 *
 */
nodeSmores.prototype.addPlugin = function(pluginName, filename, plugin) {
  if (typeof this.plugins[filename] === 'undefined') {
    this.plugins[filename] = {};
  }

  this.pluginNameRef[plugin.name] = pluginName;
  this.plugins[filename].plugin = plugin;
  this.plugins[filename].mtime = null;

  this.addMessageHandler(plugin);
};

/**
 * Remove a plugin from the plugins namespace.
 *
 * @param string filename Plugin filename.
 * @param object plugin Plugin command function.
 *
 */
nodeSmores.prototype.removePlugin = function(filename, plugin) {
  delete this.pluginNameRef[plugin.name];
  delete this.plugins[filename].plugin;

  this.removeMessageHandler(plugin.name);
};

/**
 * Create a new plugin message handler.
 *
 * @param object plugin Plugin command function.
 *
 */
nodeSmores.prototype.addMessageHandler = function(plugin) {
  this.messageHandlers.push(plugin);
};

/**
 * Remove a plugin message handler.
 *
 * @param string name Plugin name.
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
