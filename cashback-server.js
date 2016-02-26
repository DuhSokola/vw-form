var express = require('express');
var proxyMiddleware = require('http-proxy-middleware');

// configure proxy middleware context
var context = '/VWCashBackBackend/vwCashBack';     // requests with this path will be proxied

// configure proxy middleware options
var options = {
    target: 'https://www.leadcollector.amag.ch', // target host
    changeOrigin: true,               // needed for virtual hosted sites
    ws: true
};

// create the proxy
var proxy = proxyMiddleware(context, options);

// use the configured `proxy` in web server
var app = express();

app.set('port', (process.env.PORT || 3000));

app.use(proxy);
app.use(express.static(__dirname + '/src'));

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});