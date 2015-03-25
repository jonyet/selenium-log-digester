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

function cleaner(index){
	index.split('=')
	return index[1]
}

function content(string){
	if (string != "  "){
		return string
	}else{
		return 'none'
	}

}

function funk(thing){
	var junk = _.last(thing, thing.length - 3)
	junk = junk.join(' ')
	return junk
}

function next(objArray){
	var fails = []
	_.each(objArray, function(obj){
		if (obj.log && obj.log === '[error]'){
			console.log('>> ' + obj.log, obj.status)
			fails.push(obj.log + ' ' + obj.status)
		} else {
			if (obj.task === 'inform' && obj.log != '[error]'){
				console.log(
					'\n>>', obj.date, obj.status);
			} else {
				console.log(obj.test + obj.subject);
			}
		}
		// if (obj.status && obj.status.indexOf('failed') > -1){
		// 	fails.push(obj)
		// }
	})
	if (fails.length > 0){
		console.log('\n\n>> Failures:', fails.length)
		_.each(fails, function(failure){
			console.log(failure)
		});
	}
}

function consumer(array){
	var first = []
	var third = []
	// console.log(array)
	_.each(array, function(line){
		if (line.indexOf("Executing") > -1){
			first = line.split("|")
			var second = {
				task: 'perform',
				test: first[1],
				subject: first[2],
				content: content(first[3]),
			}
			third.push(second)
		} else {
			line = line.split(" ")
			var shift = {
				task: 'inform',
				date: (line[0] + ' ' + line[1]),
				log: line[2],
				status: funk(line) 
			}
			third.push(shift)
		}
	})
	// console.log(third)
	next(third)
}

fs.readFile(process.argv[2], 'utf8', function(err, data){
	if (err) {
		return console.log(err);
	}
	var array = data.split('\n')
	// console.log(array)
	consumer(array)
})
