var system = require('sys'),
  inArray = require('../vendor/in_array.commonjs').in_array;

exports.Smores = {
  init: function(options) {
    this.useragent = 'node-smores/0.1 (http://github.com/pastfuture/node-smores)';

    this.campfire = require('../vendor/node-campfire/lib/campfire').Campfire;
    this.campfire.initialize({
      token: options.token,
      account: options.account,
      ssl: options.ssl
    });

    this.who = options.userId;

    this.reservedMacros = [
      '/help',
      '/shutdown',
      '/sleep',
      '/uptime',
      '/wall'
    ];

    this.executionTime = null;

    this.inSleepMode = false;
    this.sleepStartTime = null;
    this.sleepLengthTime = 300;

    this.processMessage = true;
    this.sentMessage = false;

    this.adminId = null;

    this.room = null;
    this.roomId = null;

    this.rooms = {};
    this.ignoreUsers = [];

    this.customActions = {};

    this.macros = {};
    this.variablePhraseMacros = {};
    this.randomPhraseMacros = {};
  },

  setupPredefinedCustomActions: function() {
    var self = this;

    /**
     * /wall {{INPUT}} support for blasting out a global message to all
     * available chatrooms
     */
    this.addCustomAction('/wall', false, function(message) {
      var wall = trim(body.replace('/wall ', ''));
      var callingUserId = message.user_id;

      self.campfire.Rooms(function(data) {
        if (typeof data.rooms == 'undefined') {
          self.say('error: unable to pull rooms list', self.roomId);
          return;
        }

        var rooms = data.rooms;
        self.campfire.User(callingUserId, function(data) {
          if (typeof data == 'undefined' || data.user_id == '') {
            self.say('error: unable to pull /wall caller', null);
            return;
          }

          for (var x=0; x<=rooms; x++) {
            if (rooms[x].id == self.roomId) {
              continue;
            }

            self.say('ALERT:' + message.body + ' (via ' + data.name + ')', rooms[x].id);
            self.leave(rooms[x].id);
          }
        });
      });
    });
  },

  say: function(message, roomId) {
    roomId = (roomId != null) ? roomId : this.roomId;
    var room = this.campfire.Room(roomId);
    room.join(function() {
      room.speak(message, function(data) {
        system.puts('message sent at ' + data.message.created_at + '.');
      });
    });
  },

  paste: function(message, roomId) {
    roomId = (roomId != null) ? roomId : this.roomId;
    var room = this.campfire.Room(roomId);
    room.join(function() {
      room.paste(message, function(data) {
        system.puts('message sent at ' + data.message.created_at + '.');
      });
    });
  },

  leave: function(roomId) {
    roomId = (roomId != null) ? roomId : this.roomId;
    var room = this.campfire.Room(roomId);
    room.leave(function() {
      // do nothing
    });
  },

  connectTo: function(roomName) {
    var self = this;

    if (self.rooms[roomName]) {
      self.roomId = self.rooms[roomName];
    } else {
      throw new Error('Error: Unknown roomName supplied.');
    }

    // must be called in connectTo so we have the current room id available at call time
    this.setupPredefinedCustomActions();

    self.executionTime = new Date().getTime();

    var room = self.campfire.Room(self.roomId);
    room.join(function() {
      console.log('listening...');
      room.listen(function(message) {
        // Wrapping this all in a private function so we can easily return
        // after writing to the room, or continue to search for work instead of
        // managing a slew of booleans and nested ifs.
        var processMessage = function() {
          if (message.user_id == self.who || message.type != 'TextMessage' || message.body == '') {
            return false;
          }

          // If currently in sleep mode, detect if we can wake up yet.
          if (self.inSleepMode) {
            if ((new Date().getTime()) - self.sleepStartTime >= self.sleepLengthTime) {
              self.inSleepMode = false;
              self.sleepStartTime = null;

              self.say('Sleep mode disabled', self.roomId);
            } else {
              return false;
            }
          }

          // If the current message was written by a user we should ignore,
          // ignore them. Duh.
          if (inArray(message.user_id, self.ignoreUsers)) {
            return false;
          }

          var messageBody = self.trim(message.body);

          // Process system-level macros
          switch (messageBody) {
            case '/help':
              var help;
              help += "/shutdown - shutdown the Smores bot\n";
              help += "/sleep - silence the Smores bot for " + self.sleepLengthTime + " seconds\n";
              help += "/uptime - return the current uptime for the Smores bot\n";
              help += "/wall {{text}} - send a global message across chatrooms";

              self.paste(help, self.roomId);
              return true;
            break;

            case '/shutdown':
              if (message.user_id != self.adminId) {
                self.say('Error: Command only available to Smores admin.', self.roomId);
                self.sendFailure();
              }

              self.say('Smores shutdown intiated.', self.roomId);
              self.leave(self.roomId);
              process.exit();
            break;

            case '/sleep':
              if (message.user_id != self.adminId) {
                self.say('Error: Command only available to Smores admin.', self.roomId);
                self.sendFailure();
              }

              self.inSleepMode = true;
              self.sleepStartTime = new Date().getTime();
              self.say('Sleep mode enabled');
              return true;
            break;

            case '/uptime':
              self.say('Uptime currently disabled.', self.roomId);
              /*var uptime_str = new Array();
              var uptime = self.calculateUptime(new Date().getTime() - self.executionTime);
              for (var x in uptime) {
                if (uptime[x] != '0') {
                  uptime_str[x] = uptime[x];
                }
              }

              console.dir(uptime);
              console.dir(uptime_str);
              console.log(uptime_str.join(', '));

              self.say('Smores uptime: ' + uptime_str.join(', '), self.roomId);*/
              self.sendSuccess();
            break;
          }

          return true;
        };

        processMessage(message);

        if (self.processMessage) {

          //
          // process custom actions
          //
          if (this.processMessage && !this.sentMessage) {
            for (var x in self.customActions) {
              console.log('action=' + x);
              console.log('absolute=' + self.customActions[x].absolute);
              console.log('callback=' + self.customActions[x].callback);

              if (self.customActions[x].absolute) {
                if (body === x) {

                }
              } else {
                if (body.indexOf(x + ' ') !== -1) {

                }
              }
            }

            //
            // process macros
            //
            if (this.processMessage && !this.sentMessage) {

            }
          }
        }
      });
    });
  },

  addRoom: function(roomName, roomId) {
    this.rooms[roomName] = roomId;
  },

  addRooms: function(rooms) {
    for (var x in rooms) {
      this.rooms[x] = rooms[x];
    }
  },

  addMacro: function(macroName, macroResponse) {
    this.macros[macroName] = macroResponse;
  },

  addMacros: function(macros) {
    for (var x in macros) {
      this.addMacro(x, macros[x]);
    }
  },

  addRandomPhraseMacro: function(phraseName, phrasesResponses) {
    this.randomPhraseMacros[phraseName] = phrasesResponses;
  },

  addRandomPhraseMacros: function(phrases) {
    for (var x in phrases) {
      this.addRandomPhraseMacro(x, phrases[x]);
    }
  },

  addVariablePhraseMacro: function(phraseName, phraseResponse) {
    if (phraseResponse.indexOf('{{INPUT}}') === -1) {
      throw new Error('Supplied variable phrase missing an {{INPUT}} parameter.');
    }

    this.variablePhraseMacros[phraseName] = phraseResponse;
  },

  addVariablePhraseMacros: function(phrases) {
    for (var x in phrases) {
      this.addVariablePhraseMacro(x, phrases[x]);
    }
  },

  addCustomAction: function(actionName, actionIsAbsolute, actionCallback) {
    this.customActions[actionName] = {
      absolute: actionIsAbsolute,
      callback: actionCallback
    }
  },

  setAdmin: function(adminId) {
    this.adminId = adminId;
  },

  calculateUptime: function(time) {
    var value = {
      years: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };

    if (time >= 31556926) {
      value.years = Math.floor(time / 31556926);
      time = (time % 31556926);
    }

    if (time >= 86400) {
      value.days = Math.floor(time / 86400);
      time = (time % 86400);
    }

    if (time >= 3600) {
      value.hours = Math.floor(time / 3600);
      time = (time % 3600);
    }

    if (time >= 60) {
      value.minutes = Math.floor(time / 60);
      time = (time % 60);
    }

    value.seconds = Math.floor(time);
    return value;
  }
};



























//
