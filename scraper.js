var request = require("request");
var cheerio = require('cheerio');

function getAnswer(argument,callback){
	//Gets the wait time for the next inner loop bus at bus stop Alderman @ AFC
var request = require("request");
var cheerio = require('cheerio');

//this will always finish first
function getStopCode(stopsearch,callback){
	var searchurl="http://uva.transloc.com/m/search?s="+stopsearch;
	var stopcode;

	request({
  	uri: searchurl,
	}, function(error, response, body) {
		$ = cheerio.load(body);
		stopcode=$('.posted').text().substring(11,14);
		return callback(stopcode);
	});
}

//make this what the user says

//this will always finish second

getStopCode(argument,function(val){
	request({
  		uri:"http://uva.transloc.com/m/stop/code/"+val,
	}, function(error, response, body) {
		var dict = {
  		"Inner U-Loop": 4003290,
  		"Northline": 4003286,
  		"Outer U-Loop": 4003294
		};
		var response;
		var cheerio = require('cheerio'), $ = cheerio.load(body);
		for(var key in dict){
			var route="#route_" + dict[key]
			if($('.wait_time', route).text()!=""){
				response += "\nThe " + key + " will arrive in";
				response += $('.wait_time', route).text();
			}
			else{
				response += "\nThe " + key + " does not come to this stop.";
			}

		}
		return callback(response);


	});


});
}

function getStopCode(stopsearch,callback){
	var searchurl="http://uva.transloc.com/m/search?s="+stopsearch;
	var stopcode;

	request({
  	uri: searchurl,
	}, function(error, response, body) {
		$ = cheerio.load(body);
		stopcode=$('.posted').text().substring(11,14);
		return callback(stopcode);
	});
}

getStopCode("kellogg",function(val){
	console.log(val);
});











