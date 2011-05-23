var fs = require('fs'),
  util = require('util'),
  Campfire = require('../vendor/node-campfire/lib/campfire').Campfire;

var nodeSmores = function() {
  this.version = '0.2.1';
  this.config = JSON.parse(fs.readFileSync(__dirname + '/../config.js', 'utf8'));

  this.executedOn = new Date();

  this.plugins = [];
  this.pluginNameRef = [];
  this.messageHandlers = [];

  var self = this;

  if (this.config.pluginConfig) {
    console.warn('"pluginConfig" is a reserved word for node-smores. It cannot be used within your config.js.');
    process.exit();
  }

  this.config.pluginConfig = {};

  this.options = require('nomnom')
    .opts({
      room: {
        string: '-r ROOM, --room=ROOM',
        help: 'Room to connect to; can either be the room name or the room ID.'
      },
      verbose: {
        string: '-v, --verbose'
      },
      version: {
        string: '--version',
        callback: function() {
          return self.version;
        }
      }
    })
    .callback(function(options) {
      // Do type checking for --room in here instead of having it be a required
      // option because it needing to be a required option means that in order
      // to get --version you need to specify --room. Might patch nomnom to
      // allow exclusions for "version" since needing to specify *anything* to
      // get a version number back other than a version call is dumb. As is
      // doing manual type checking in here.
      if (typeof options.room == 'undefined') {
        console.warn('--room is required');
        process.exit();
      } else if (typeof options.room.length == 'undefined') {
        console.warn('--room cannot be empty');
        process.exit();
      }
    })
    .parseArgs();

  this.campfire = new Campfire({
    token: this.config.token,
    account: this.config.account,
    ssl: (this.config.ssl) ? this.config.ssl : true
  });

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
 * @param string message Message to send to a Campfire room.
 * @param object room node-campfire room object
 *
 */
nodeSmores.prototype.speak = function(message, room) {
  var self = this;

  room.speak(message, function(data) {
    if (self.options.verbose) {
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

  room.paste(message, function(data) {
    if (self.options.verbose) {
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

  room.speak('error: ' + errorMessage, function(data) {
    if (self.options.verbose) {
      util.log('error: ' + errorMessage);
    }
  });
}

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
        if (self.options.verbose) {
          util.log('Listening...');
        }

        room.listen(function(message) {
          if (message.type != 'TextMessage') {
            return;
          } else if (who.id == message.user_id) {
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

            if (self.options.verbose) {
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
  });
}

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

    util.log("Loaded plugin config: " + pluginName + ".");
  } catch (err) {
    util.log("There was a problem loading the config file for the plugin: " . pluginName);
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

    util.log("Loaded plugin: " + pluginName);
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
}

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
}

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
