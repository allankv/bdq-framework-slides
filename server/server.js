var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');
var mustache = require('mustache');
var fs = require('fs');
var hash = require('object-hash');
var async = require('async');
require('compression');
var app = module.exports = loopback();

app.start = function() {  
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
}; 
// app.use(loopback.compress());
app.use(loopback.static(path.resolve(__dirname, '../client')));

// Aqui (para a chave) vai ter que ser diferente porque a quantidade de parâmetros é variável. Vai ter que usar os parametros do tipo ?parmA=X&paramB=Y

app.get('/', function(req, res) {  
  var template = fs.readFileSync('./client/index.mustache', 'utf8');
  // var partials = {
  //   item: fs.readFileSync('./client/item_partial.mustache', 'utf8')
  // };
  // var params = {query: req.query};
  var params = {};
  res.send(mustache.render(template, params));
});
app.get('/demo', function(req, res) {  
  var template = fs.readFileSync('./client/demo.mustache', 'utf8');
  // var partials = {
  //   item: fs.readFileSync('./client/item_partial.mustache', 'utf8')
  // };
  // var params = {query: req.query};
  var params = {};
  res.send(mustache.render(template, params));
});


var ds = loopback.createDataSource({
    connector: require('loopback-component-storage'),
    provider: 'filesystem',
    root: __dirname+'/../storage'
});

var container = ds.createModel('storage');
app.model(container);

console.log("START: ");

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
