"use strict"

var fs = require('fs');
var _ = require('underscore');
var utility = require('./utility');
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


function parser(string, separator) {
  var linkArray = string.split(separator)
  linkArray.join(' / ')
  // console.log(linkArray)
  return linkArray
}

function digester(doc){
	fs.readFile(doc, 'utf8', function(err, data){
		if (err) {
			return console.log(err);
		}		
		parser(data, '\n')
	})
}

function gatherer(array){
	// var control = ['61563,61604', '61563,61605', '61563,61607', '61563,61608', '61563,61609']
	// var treatment = ['61563,61599', '61563,61600', '61563,61601', '61563,61602', '61563,61603']
	var pages = []
	_.each(array, function(url){
		request(url, {headers: headers, maxRedirects: 10}, function(error, res, html){	
			if(error){
				console.error(url + ' ERROR ' + error);
			} else{
				var resolve = utility.parseUri(url);
				var cmp = utility.getUrlParameter(url, 'bkCmpID');
				var test = utility.getUrlParameter(url, 'test');
				// var type = test.substring(3, test.length);
				var data = {
					url: url,
					status: res.statusCode,
					redirect: res.request.href,
					params: cmp.substring(6, cmp.length),
					body: res.body,
					type: test.substring(3, test.length)
				}
				console.log(data.status + '\n', data.url, '\n', data.type, '\n', data.params);
				// console.log(data)
				pages.push(data);
				// renderer.render(url, resolve.query) //for whatever reason, the renderer isn't working. works fine in the other app.
				// validator(data)

			}
		});			
	});
}

function validator(obj){
	_.each(pages, function(obj){
		obj.body
	})
}

function sorter(array){
	var linkArray = _.uniq(array)
	var urlArray = []
	_.each(linkArray, function(url){
		var base = url.replace(/(http(s)?:\/\/)|(\/.*){1}/g, '')
		if (base === 'www.verizonwireless.com'){
			urlArray.push(url)
			return urlArray
		}
	})
	gatherer(urlArray)
}

fs.readFile('linkIndexAnalytics.txt', 'utf8', function(err, data){
	if (err) {
		return console.log(err);
	}		
	var linkArray = data.split('\n')
	linkArray.join(' / ')
	sorter(linkArray)
})
