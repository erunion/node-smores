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
