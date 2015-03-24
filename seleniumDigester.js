"use strict"

var fs = require('fs');
var _ = require('underscore');
var utility = require('./utility');
var result = require('./result.js');
var nodemailer = require('nodemailer');
var transport = require('nodemailer-smtp-transport');
var serverOptions = require('./MailOptions.js').server,
    clientOptions = require('./MailOptions.js').client,
    pathy = require('./MailOptions.js').paths;
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: serverOptions.username,
        pass: serverOptions.password,
        debug: true
    }
});

function consumer(array){
	var digested = []
	_.each(array, function(line){
		if (line.indexOf("RESPONSE") > -1){
			if (line.indexOf("success") > -1){
				var status = {
					type: 'response',
					line: line,
					detail: 'success'
				}
			} else {
					var status = {
						type: 'response',
						line: line,
						detail: 'unknown'
					}
				}
			digested.push(status)
		}
		if (line.indexOf("DEBUG") > -1){
			var status = {
				type: 'task',
				line: line
			}
			digested.push(status)
		}
		if (line.indexOf("REQUEST") > -1){
			if (line.indexOf("GET") > -1){
				var status = {
					type: 'request',
					line: line,
					detail: 'get'
				}
			}
			if (line.indexOf("POST") > -1){
				var status = {
					type: 'request',
					line: line,
					detail: 'post'
				}
			}
			digested.push(status)
		}
	})
	result.getSummary(digested);
}

fs.readFile('syskalogs.txt', 'utf8', function(err, data){
	if (err) {
		return console.log(err);
	}
	var array = data.split('\n')
	consumer(array)
})
