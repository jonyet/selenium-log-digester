var _ = require('underscore');

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

	console.log(
		'\n>> steps: ' + summary.steps +
		'\n\n>> requests: ' + summary.requests +
		'\n>> responses: ' + summary.responses +
		'\n>> tasks: ' + summary.tasks +
		'\n>> outliars: ' + summary.outliars);
}

