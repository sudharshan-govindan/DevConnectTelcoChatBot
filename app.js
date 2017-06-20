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
var Cloudant = require("cloudant");
var vcapServices = require("vcap_services");
var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');

//var WORKSPACE_ID = vcapServices.getCredentials('WORKSPACE_ID') || "<workspace-id>";
var WORKSPACE_ID = 'ad81f0f6-fcd0-455e-abe9-be799b632f1b';

var app = express();

// Bootstrap application settings
app.use(express.static("./public")); // load UI from public folder
app.use(bodyParser.json());

//credentials
var conversation_credentials = vcapServices.getCredentials("conversation");
var cloudant_credentials = vcapServices.getCredentials("cloudantNoSQLDB");

// Create the service wrapper
var conversation = watson.conversation({
	url : "https://gateway.watsonplatform.net/conversation/api",
	username : conversation_credentials.username || '',
	password : conversation_credentials.password || '',
	version_date : "2016-07-11",
	version : "v1"
});

var discovery = new DiscoveryV1({
  username: '2e0ac76e-5376-4773-9a22-76c036ca3f3b',
  password: 'KDG2sfU2sdaI',
  version_date: DiscoveryV1.VERSION_DATE_2017_04_27
});

var usersMap;
var userDetails;

if (usersMap === undefined || usersMap === null) {
	usersMap = new Map();
	var cloudant = Cloudant({account:cloudant_credentials.username, password:cloudant_credentials.password});
	var db = cloudant.db.use('telco-users');

	db.list({include_docs:true}, function (err, data) {
		if (err) {
			throw err;
		}
		for (var i = 0; i < data.rows.length; i++) {
			userDetails = [data.rows[i].doc.name, data.rows[i].doc.mobileNumber, data.rows[i].doc.emailId, data.rows[i].doc.address];
			usersMap.set(data.rows[i].doc.userName, userDetails);
		}
	});
}

// Endpoint called from the client side
app.post("/api/message", function(req, res) {

	var workspace = WORKSPACE_ID;
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

		discovery.query({
		    environment_id: 'cdd6c5fa-f76f-47ea-ad49-6c669e9a652f',
		    collection_id: '2e354788-b6ce-48bb-82c4-86b564b890b5',
		    query: 'enriched_text.entities.text:Vodafone'
		  }, function(err, response) {
		        if (err) {
		          console.error(err);
		        } else {
		          console.log(JSON.stringify(response, null, 2));
		        }
		   });

	});

	// Send the input to conversation service
	function callconversation(payload) {
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

//Get the details from Cloudant db
function getPerson(userName, callback) {
	var person = {};
	if (usersMap !== undefined && usersMap !== null && usersMap.has(userName)) {
		var userDetails = usersMap.get(userName);
		person = {
			"userName": userName,
			"name": userDetails[0],
			"mobileNumber": userDetails[1],
			"emailId": userDetails[2],
			"address": userDetails[3]
		};
	} else {
		person = null;
	}
	callback(null, person);
	return;
}

// To be implemented - update profile details to db

module.exports = app;
