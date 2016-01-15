#!/bin/env node

;(function() {

    'use strict';

    var defaults = {
        serverHost: 'localhost',
        serverPort: 3000,
        appName: 'vw-cashback',
        staticFolder: 'src'
    };

    var staticFolder = process.argv[2] || defaults.staticFolder;

    var serverHost = process.env.OPENSHIFT_NODEJS_IP;
    if (!serverHost) {
        serverHost = defaults.serverHost;
        console.warn('Host: ' + serverHost);
    }

    var serverPort = parseInt(process.env.OPENSHIFT_NODEJS_PORT);
    if (!serverPort) {
        serverPort = process.argv[3] || defaults.serverPort;
        console.warn('Port: ' + serverPort);
    }

    var appName = process.env.OPENSHIFT_APP_NAME;
    if (!appName) {
        appName = defaults.appName;
        console.warn('Application: ' + appName + ':' + staticFolder);
    }

    var serverConfig = {
        serverHost: serverHost,
        serverPort: serverPort,
        appName: appName
    };

    function createServer(staticFolder){

        // Scope
        var server = {};
        var express = require('express');

        server.app = (function() {
            return express();
        }());

        (function registerTerminationListeners() {
            process.on('exit', function() { console.log('%s: Node server stopped.', new Date(Date.now()) ); });

            [
                'SIGHUP',
                'SIGINT',
                'SIGQUIT',
                'SIGILL',
                'SIGTRAP',
                'SIGABRT',
                'SIGBUS',
                'SIGFPE',
                'SIGUSR1',
                'SIGSEGV',
                'SIGUSR2',
                'SIGPIPE',
                'SIGTERM'
            ].forEach(function(element) {
                    process.on(element, function() {
                        console.log('%s: Received %s - terminating Node server ...', new Date(Date.now()), element);
                        process.exit(1);
                        console.log('%s: Node server stopped.', new Date(Date.now()) ); });
                }
            );
        }());

        server.start = function() {
            var http = require('http');
            // Create an HTTP service.
            server.app.use(express.static(process.cwd() + '/' + staticFolder));
            http.createServer(server.app).listen(serverConfig.serverPort);
        };

        return server;
    }


    process.argv.forEach(function(val, index) {
        if (index === 2) {
            staticFolder = val;
        }
    });
    createServer(staticFolder).start();

}());
