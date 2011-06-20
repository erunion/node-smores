/**
 * node-smores plugin to send a message to all available chatrooms.
 *
 */
function Command() {
  this.name = "/wall";
  this.regex = /\/wall \w/;
  this.description = "Send a message to all available chatrooms.";
  this.callback = function(body, message, room, smores) {
    var wall = body.substring(6);

    smores.campfire.user(message.userId, function(error, who) {
      smores.campfire.rooms(function(error, rooms) {
        for (var i = rooms.length - 1; i >= 0; i--) {
          var chatroom = rooms[i];

          if (room.id == chatroom.id) {
            continue;
          }

          smores.speak('ALERT: ' + wall + ' (via ' + who.user.name + ')', chatroom);
        }
      });
    });
  }
};

exports.Command = Command;
