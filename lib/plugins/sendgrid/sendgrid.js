/**
 * node-smores plugin to pull SendGrid.com statistics for the current date for a specific account.
 *
 */
function Command() {
  this.name = "/sendgrid";
  this.regex = [/\/sendgrid \w/, /\/sendgrid/];
  this.description = "Pull SendGrid stats for today for a specific account.";
  this.callback = function(body, message, room, smores, config) {
    var https = require('https'),
      util = require('util');

    /**
     * Pull all available accounts from the current sendgrid config.
     *
     * @param object config Current sendgrid config.
     *
     * @return array Available accounts.
     */
    function getAvailableAccounts(config) {
      var accounts = [];
      for (account in config) {
        if (account != 'login' && account != 'password') {
          accounts.push(account);
        }
      }

      return accounts;
    }

    var login = null,
      password = null,
      availableAccounts = getAvailableAccounts(config),
      account = body.substring(10);

    if (account != null && account != '') {
      if (typeof config[account] == 'undefined') {
        errorMsg = 'account not found in sendgrid config.';
        if (availableAccounts.length > 0) {
          errorMsg += ' available accounts: ' + availableAccounts.join(', ');
        }

        smores.speakError(errorMsg, room);
        return;
      }

      login = config[account].login;
      password = config[account].password;
    } else {
      if (typeof config.login == 'undefined' || typeof config.password == 'undefined') {
        errorMsg = 'sendgrid login and password not found.';
        if (availableAccounts.length > 0) {
          errorMsg += ' try specifying one of these accounts: ' + availableAccounts.join(', ');
        }

        smores.speakError(errorMsg, room);
        return;
      }

      login = config.login;
      password = config.password
    }

    var params = {
      host: 'sendgrid.com',
      port: 443,
      method: 'GET',
      path: '/api/stats.get.json?api_user=' + login + '&api_key=' + password
    };

    var request = https.request(params, function(response) {
      var data = '';

      response.on('data', function(chunk) {
        data += chunk;
      });

      response.on('end', function() {
        try {
          data = JSON.parse(data);
        } catch(e) {
          util.log('unable to parse response from sendgrid.');
          process.exit();
        }

        if (response.statusCode == 200) {
          var stats = '';
          data = data[0];
          for (i in data) {
            stats += i + ': ' + data[i] + "\n";
          }

          smores.paste(stats, room);
        } else {
          smores.speakError(data.error.message + ' (sendgrid response)', room);
        }
      });
    });

    request.end();
  }
};

exports.Command = Command;
