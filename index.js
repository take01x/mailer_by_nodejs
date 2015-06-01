#!/usr/bin/env node

'use strict';

var fs = require('fs');
var querystring = require('querystring');
var readline = require('readline-sync');
var request = require('request');
var open = require('open');

if (process.argv[2] === undefined) {
	console.log("argv:", process.argv);
}

if (process.argv[2] == "home") {
	console.log("HOME:", process.env.HOME);
}

if (process.argv[2] == "init") {
	var config = JSON.parse(fs.readFileSync(",/config.json")).installed;
	var params = {
		response_type: 'code',
		approval_prompt: 'force',
		access_type: 'offline',
		client_id: config.client_id,
		redirect_uri: config.redirect_uris[0],
		scope: 'https://www.googleapis.com/auth/gmail.labels',
		state: 'some random string'
	};

	var url = config.auth_uri + "?" + querystring.encode(params);
	open(url);
}

if (process.argv[2] == "init_readonly") {
	var config = JSON.parse(fs.readFileSync(",/config.json")).installed;
	var params = {
		response_type: 'code',
		approval_prompt: 'force',
		access_type: 'offline',
		client_id: config.client_id,
		redirect_uri: config.redirect_uris[0],
		scope: 'https://www.googleapis.com/auth/gmail.readonly',
		state: 'some random string'
	};

	var url = config.auth_uri + "?" + querystring.encode(params);
	open(url);
}

if (process.argv[2] == "token") {
	var config = JSON.parse(fs.readFileSync(",/config.json")).installed;
	var code = readline.question("Input returned code:");
	var params = {
		grant_type: 'authorization_code',
		code: code,
		client_id: config.client_id,
		client_secret: config.client_secret,
		redirect_uri: config.redirect_uris[0]
	};
	var options = {
		uri: config.token_uri,
		form: params,
		json: true
	};
	request.post(options, function (error, response, body) {
		if (response.statusCode !== 200) {
			console.log("Error:", error);
			console.log("Status_body:", response.statusCode);
			console.log("body:", body);
			return false;
		}
		fs.writeFileSync(',/token.json', JSON.stringify(body));
	});
}

if (process.argv[2] == "labels") {
	var token = JSON.parse(fs.readFileSync(",/token.json"));
	var endpoint = 'https://www.googleapis.com/gmail/v1/users/me/labels';
	var params = {
		access_token: token.access_token,
		prettyPrint: true
	};
	var options = {
		uri: endpoint,
		qs: params,
		json: true
	};
	request.get(options, function (error, response, body) {
		if (response.statusCode !== 200) {
			console.log("Error:", error);
			console.log("Status_body:", response.statusCode);
			console.log("body:", body);
			return false;
		}
		console.log(body.labels);
	});
}

if (process.argv[2] == "messages") {
	var token = JSON.parse(fs.readFileSync(",/token.json"));
	var endpoint = 'https://www.googleapis.com/gmail/v1/users/me/messages';
	var params = {
		access_token: token.access_token,
		prettyPrint: true
	};
	var options = {
		uri: endpoint,
		qs: params,
		json: true
	};
	request.get(options, function (error, response, body) {
		if (response.statusCode !== 200) {
			console.log("Error:", error);
			console.log("Status_body:", response.statusCode);
			console.log("body:", body);
			return false;
		}
		console.log(body.messages);
	});
}
