/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

/*eslint-env browser, node, node*/
"use strict";

require("dotenv").config({
	silent : true
});

var express = require("express"); // app server
var bodyParser = require("body-parser"); // parser for post requests
var watson = require("watson-developer-cloud"); // watson sdk
var cloudant = require("cloudant");
var vcapServices = require("vcap_services");
var url = require("url");
var	https = require("https");

var WORKSPACE_ID = vcapServices.getCredentials('WORKSPACE_ID') || "<workspace-id>";

var app = express();

// Bootstrap application settings
app.use(express.static("./public")); // load UI from public folder
app.use(bodyParser.json());

//credentials
var conversation_credentials = vcapServices.getCredentials("conversation");
var cloudant_credentials = vcapServices.getCredentials("cloudantNoSQLDB");
var exitIntent = false;

// Create the service wrapper
var conversation = watson.conversation({
	url : "https://gateway.watsonplatform.net/conversation/api",
	username : conversation_credentials.username || '',
	password : conversation_credentials.password || '',
	version_date : "2016-07-11",
	version : "v1"
});

// Endpoint called from the client side
app.post("/api/message", function(req, res) {

	var workspace = process.env.WORKSPACE_ID || WORKSPACE_ID;
	if (!workspace || workspace === "<workspace-id>") {
		return res.json({
		  "output": {
			"text": "Your app is running but it is yet to be configured with a <b>WORKSPACE_ID</b> environment variable."
			}
		});
	}

	var userName = req.body.context.userName;

	getPerson(userName, function(err, person) {

		if(err){
			console.log("Error occurred while getting person data ::", err);
			return res.status(err.code || 500).json(err);
		}

		var payload = {
			workspace_id : workspace,
			context : {
				"name" : person.name,
				"userName" : person.userName,
				"emailId" : person.emailId,
				"address" : person.address,
				"mobileNumber" : person.mobileNumber,
			},
			input : {}
		};

		if (req.body) {
			if (req.body.input) {
				payload.input = req.body.input;
			}
			if (req.body.context) {
				payload.context = req.body.context;
				payload.context.name = person.name;
				payload.context.userName = person.userName;
				payload.context.emailId = person.emailId;
				payload.context.address = person.address;
				payload.context.mobileNumber = person.mobileNumber;
			}
		}

		callconversation(payload);

	});

	// Send the input to conversation service
	function callconversation(payload) {

		var query_input = JSON.stringify(payload.input);
		var context_input = JSON.stringify(payload.context);
		conversation.message(payload, function(err, data) {
			if (err) {
				console.log("Error occurred while invoking Conversation. ::", err);
				return res.status(err.code || 500).json(err);
			}
			return res.json(data);
		});
	}

});

// Endpoint called from the client side to validate the entered username
 app.post("/api/validate", function(req, res) {

	 var userName = req.body.input.userName;
	 var output = {};
	 getPerson(userName, function(err, person) {
		 if (err) {
			 console.log("Error occurred while getting person data ::", err);
			 return res.status(err.code || 500).json(err);
		 }
		 if (person) {
			 output = {
				 "valid": "yes"
			 };
		 } else {
			 output = {
				 "valid": "no"
			 };
		 }
		 return res.json(output);
	});

});

//To be implemented - get the details from Cloudant db
function getPerson(userName, callback) {
	var person : {
		"userName": "ajay",
	  "name": "Ajay Krishna",
	  "mobileNumber": "1234567890",
	  "emailId": "ajay.krishna@telco.com",
	  "address": "1, Krishna Street, Bangalore"
	}
	callback(null, person);
	return;
}

// To be implemented - update profile details to db

module.exports = app;
