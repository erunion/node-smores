/**
 * node-smores plugin to calculate bot uptime.
 *
 */
function Command() {
  this.name = "/uptime";
  this.regex = /\/uptime/;
  this.description = "Calculate bot uptime.";
  this.callback = function(body, message, room, smores) {
    var uptime = [];
    var current = new Date();
    var currentDiff = current.getTime() - smores.executedOn.getTime();
    var diff = new Object();

    diff.days = Math.floor(currentDiff / 1000 / 60 / 60 / 24);
    currentDiff -= diff.days * 1000 * 60 * 60 * 24;

    diff.hours = Math.floor(currentDiff / 1000 / 60 / 60);
    currentDiff -= diff.hours * 1000 * 60 * 60;

    diff.minutes = Math.floor(currentDiff / 1000 / 60);
    currentDiff -= diff.minutes * 1000 * 60;

    diff.seconds = Math.floor(currentDiff / 1000);

    if (diff.days >= 1) {
      uptime.push(diff.days + ' day' + ((diff.days > 1) ? 's' : ''));
    }

    if (diff.hours >= 1) {
      uptime.push(diff.hours + ' hour' + ((diff.hours > 1) ? 's' : ''));
    }

    if (diff.minutes >= 1) {
      uptime.push(diff.minutes + ' minute' + ((diff.minutes > 1) ? 's' : ''));
    }

    if (diff.seconds >= 1) {
      uptime.push(diff.seconds + ' second' + ((diff.seconds > 1) ? 's' : ''));
    }

    uptime = uptime.join(', ');

    smores.speak('uptime: ' + uptime, room);
  }
};

exports.Command = Command;
