try {
  var smores = require(__dirname + '/lib/smores');
  var bot = new smores.nodeSmores();
  bot.run();
} catch (error) {
  util.log(error);
  process.exit();
}
