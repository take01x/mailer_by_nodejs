#!/usr/bin/env node

'use strict';

var fs = require('fs');

if (process.argv[2] == undefined) {
	console.log("argv:", process.argv);
}

if (process.argv[2] == "home") {
	console.log("HOME:", process.env.HOME);
}

if (process.argv[2] == "init") {
	var config = JSON.parse(fs.readFileSync(",/config.json")).installed;
	console.log(config);
}
