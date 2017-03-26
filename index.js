// Copyright 2016, Google, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

/*
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
*/
var request = require("request");
var cheerio = require('cheerio');

function getStopCode(stopsearch, callback){
  var searchurl="http://uva.transloc.com/m/search?s="+stopsearch;
  var stopcode;

  request({
    uri: searchurl,
  }, function(error, response, body) {
    var $ = cheerio.load(body);
    stopcode=$('.posted').text().substring(11,14);
    callback(stopcode);
  });
}

//actual google home part
function getAnswer(argument,callback){
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
    callback(response);


  });


});
}

process.env.DEBUG = 'actions-on-google:*';

const ActionsSdkAssistant = require('actions-on-google').ActionsSdkAssistant;

exports.sayNumber = (req, res) => {
  const assistant = new ActionsSdkAssistant({request: req, response: res});

  function mainIntent (assistant) {
    console.log('mainIntent');
    let inputPrompt = assistant.buildInputPrompt(true, '<speak>Hi! <break time="1"/> ' +
          'I can tell you when a bus will be at your stop.' +
          ' Say a stop.</speak>',
          ['I didn\'t hear a stop', 'If you\'re still there, what\'s the stop?', 'What is the stop?']);
    assistant.ask(inputPrompt);
  }

  function rawInput (assistant) {
    console.log('rawInput');
    if (assistant.getRawInput() === 'bye') {
      assistant.tell('Goodbye!');
    } else {
      getAnswer(assistant.getRawInput(), function(val){
        let inputPrompt = assistant.buildInputPrompt(true, '<speak>You said '+ val + '</speak>',
          ['I didn\'t hear a stop', 'If you\'re still there, what\'s the stop?', 'What is the stop?']);
        assistant.ask(inputPrompt);
      });
      
      
    }
  }

  let actionMap = new Map();
  actionMap.set(assistant.StandardIntents.MAIN, mainIntent);
  actionMap.set(assistant.StandardIntents.TEXT, rawInput);

  assistant.handleRequest(actionMap);
};
