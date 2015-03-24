var fs = require('fs');
var _ = require('underscore');
var handlebars = require('handlebars');

module.exports.getSummary = function(array){
	var others = []
	var summary = {
		steps: array.length,
		requests: _.where(array, {type: 'request'}).length,
		responses: _.where(array, {type: 'response'}).length,
		tasks: _.where(array, {type: 'task'}).length,
		outliars: _.where(array, {type: 'response', detail: 'unknown'}).length
	}

	if (_.where(array, {type: 'response', detail: 'unknown'}).length > 0){
		_.each(array, function(objArray){
			if (objArray.detail === 'unknown'){
				others.push(objArray)
				// console.log('foo')
			}
		})
	}

	createReport();

	console.log(
		'\n>> steps: ' + summary.steps +
		'\n\n>> requests: ' + summary.requests +
		'\n>> responses: ' + summary.responses +
		'\n>> tasks: ' + summary.tasks +
		'\n>> outliars: ' + summary.outliars);
}

createReport = function(){
	var self = this;
	fs.readFile(('./resultsTemplate.html'), 'UTF-8', function(err, content){
		var template = handlebars.compile(content);
		// var result = new ValidationResult(self);
		var report = template(getSummary());
		console.log('>> Generated report');
		fs.writeFile('./results.html', report)
	});
}

