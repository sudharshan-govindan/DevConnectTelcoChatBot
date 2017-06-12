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

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require("cfenv");
var cloudant = require("cloudant");
var vcapServices = require("vcap_services");
var url = require("url");
var	http = require("http");
var	https = require("https");
var	numeral = require("numeral");

var telcoServices = require("./telco_services");

var CONVERSATION_USERNAME = "", CONVERSATION_PASSWORD = "";

var WORKSPACE_ID = vcapServices.WORKSPACE_ID || "<workspace-id>"
	|| vcapServices.getCredentials('WORKSPACE_ID');

var app = express();

// Bootstrap application settings
app.use(express.static("./public")); // load UI from public folder
app.use(bodyParser.json());

//credentials
var conversation_credentials = vcapServices.getCredentials("conversation");
var cloudant_credentials = vcapServices.getCredentials("cloudantNoSQLDB");

//details for chatlog
var conversationTranscript= new Array();
var phonenumber="";
var logsessionid="";
var exitIntent=false;


// Create the service wrapper
var conversation = watson.conversation({
	url : "https://gateway.watsonplatform.net/conversation/api",
	username : conversation_credentials.username || CONVERSATION_USERNAME,
	password : conversation_credentials.password || CONVERSATION_PASSWORD,
	version_date : "2016-07-11",
	version : "v1"
});

// Endpoint to be called from the client side
app.post("/api/message", function(req, res) {
	var workspace = process.env.WORKSPACE_ID || WORKSPACE_ID;

	if (!workspace || workspace === "<workspace-id>") {
		return res.json({
		  "output": {
			"text": "Your app is running but it is yet to be configured with a <b>WORKSPACE_ID</b> environment variable. "+
					"These instructions will be provided in your lab handout <b>on the day of your lab.</b>"
			}
		});
	}

	var phone=req.body.context.phonenumber;

	telcoServices.getPerson(phone, function(err, person) {

		if(err){
			console.log("Error occurred while getting person data ::", err);
			return res.status(err.code || 500).json(err);
		}

		var payload = {
			workspace_id : workspace,
			context : {
				"userid" : person.ID,
				"username":person.name,
				"gender":person.gender,
				"email":person.email,
				"address":person.address,
				"city":person.city,
				"circlecode":person.circlecode,
				"device":person.device,
				"plantype" : person.plan_type,
				"dueamt":person.dueamt,
				"rechargeamt":person.recharge_amt,
				"recharge_date":person.recharge_date,
				"phonenumber":person.number,
				"last_payment_date" : person.last_payment_date,
				"last_payment_amt" : person.last_payment_amt,
				"payment_due_date" : person.payment_due_date,
				"last_statement_balance":person.last_statement_balance,
				"dob" : person.dob,
			  "planname":person.planname,
				"pincode" :person.pincode,
				"free_mins":person.free_mins,
				"free_data":person.free_data,
				"roaming":person.roaming,
				"monthly_sms":person.monthly_sms,
				"promo_data_pack":person.promo_data_pack,
				"data_used_mb":person.data_used_mb,
				"sms_used":person.sms_used,
				"bill_cycle":person.bill_cycle,
				"billed_amt":person.billed_amt,
				"last_payment_mode":person.last_payment_mode,
				"balance":person.balance,
				"alt_number":person.alt_number,
				"credit_limit":person.credit_limit,
				"pin":person.pin,
				"puk":person.puk,
				"outgoing_bar":person.outgoing_bar,
				"conn_status":person.conn_status,
				"bill_mode":person.bill_mode,
				"vas_active":person.vas_active,
				"intl_roam":person.intl_roam,
				"dnd":person.dnd,
				"dnd_category":person.dnd_category,
				"activated_packs":person.activated_packs,
				"pack_name":person.pack_name,
				"pack_validity":person.pack_validity,
				"pack_type":person.pack_type,
				"pack_benefit":person.pack_benefit,
				"plan_change_date":person.plan_change_date,
				"prev_plan":person.prev_plan,
				"device_model":person.device_model,
				"my_account":person.my_account,
				"vas_content_downloaded":person.vas_content_downloaded,
				"nw_strength":person.nw_strength,
				"roamer":person.roamer,
				"circle_type":person.circle_type,
				"cust_segment":person.cust_segment,
				"open_req_status":person.open_req_status,
				"red_family":person.red_family,
				"stmtdate":person.stmtdate
			},
			input : {}
		};

		if (req.body) {

			if (req.body.input) {
				payload.input = req.body.input;
			}

			if (req.body.context) {
				// The client must maintain context/state
				payload.context = req.body.context;
				payload.context.userid=person.ID;
				payload.context.username=person.name;
				payload.context.gender=person.gender;
				payload.context.email=person.email;
				payload.context.address=person.address;
				payload.context.city=person.city;
				payload.context.circlecode=person.circlecode;
				payload.context.device=person.device;
				payload.context.plantype=person.plan_type;
				payload.context.rechargeamt=person.recharge_amt;
				payload.context.recharge_date=person.recharge_date;
				payload.context.phonenumber=person.number;
				payload.context.last_payment_date=person.last_payment_date;
				payload.context.last_payment_amt=person.last_payment_amt;
				payload.context.dueamt=person.dueamt;
				payload.context.payment_due_date=person.payment_due_date;
				payload.context.last_statement_balance=person.last_statement_balance;
				payload.context.dob =person.dob;
				payload.context.planname  =person.planname;
				payload.context.pincode  =person.pincode;
				payload.context.free_mins  =person.free_mins;
				payload.context.free_data  =person.free_data;
				payload.context.roaming  =person.roaming;
				payload.context.monthly_sms  =person.monthly_sms;
				payload.context.promo_data_pack =person.promo_data_pack;
				payload.context.data_used_mb  =person.data_used_mb;
				payload.context.sms_used =person.sms_used;
				payload.context.bill_cycle =person.bill_cycle;
				payload.context.billed_amt =person.billed_amt;
				payload.context.last_payment_mode=person.last_payment_mode;
				payload.context.balance=person.balance;
				payload.context.alt_number=person.alt_number;
				payload.context.credit_limit=person.credit_limit;
				payload.context.pin=person.pin;
				payload.context.puk=person.puk;
				payload.context.outgoing_bar=person.outgoing_bar;
				payload.context.conn_status=person.conn_status;
				payload.context.bill_mode=person.bill_mode;
				payload.context.vas_active=person.vas_active;
				payload.context.intl_roam=person.intl_roam;
				payload.context.dnd=person.dnd;
				payload.context.dnd_category=person.dnd_category;
				payload.context.activated_packs=person.activated_packs;
				payload.context.pack_name =person.pack_name;
				payload.context.pack_validity=person.pack_validity;
				payload.context.pack_type =person.pack_type;
				payload.context.pack_benefit =person.pack_benefit;
				payload.context.plan_change_date=person.plan_change_date;
				payload.context.prev_plan=person.prev_plan;
				payload.context.device_model=person.device_model;
				payload.context.my_account=person.my_account;
				payload.context.vas_content_downloaded=person.vas_content_downloaded;
				payload.context.nw_strength=person.nw_strength;
			    payload.context.roamer=person.roamer;
				payload.context.circle_type=person.circle_type;
				payload.context.cust_segment=person.cust_segment;
				payload.context.open_req_status=person.open_req_status;
				payload.context.red_family=person.red_family;
				payload.context.stmtdate=person.stmtdate;
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
		var consoleStr = {};
		consoleStr.input = data.input;
		consoleStr.intent = data.intents[0];
		consoleStr.output = data.output.text[0];

		//console.log("Intent in this dialog "+JSON.stringify(data.intents[0]));
		if(data.intents[0] && data.intents[0].intent && data.intents[0].intent=='exiting'){
			console.log("Exit intent");
			exitIntent = true;
		}

		//phonenumber = data.output.context.phonenumber;
		conversationTranscript.push(consoleStr);
		return res.json(data);

		});

	}

});

app.post("/api/logSurvey", function(req,res){
	var headers = {};
	logsessionid = phonenumber+'_'+new Date().getTime();
	var dataString = JSON.stringify({'_id': logsessionid,'timestamp':new Date() + ' ' + new Date().getTime(),'number':phonenumber,'chattranscript':'logging the survey details'});

	headers = {
	  'Content-Type': 'application/json',
	  'Content-Length': dataString.length,
	  'Authorization': 'Basic ' + new Buffer(cloudant_credentials.username + ':' + cloudant_credentials.password).toString('base64')
	};

		var options = {
			host: cloudant_credentials.host,
			port: 443,
			path: 'https://'+cloudant_credentials.host+'/chatrecord',
			method: "POST",
			headers: headers
		};

	console.log('Body length = ' + dataString.length + " - Body: " + dataString);
	callSvc(res,headers,dataString,options);
});



app.post("/api/log", function(req,res){
	var headers = {};
	logsessionid = phonenumber+'_'+new Date().getTime();
	var dataString = JSON.stringify({'_id': logsessionid,'timestamp':new Date() + ' ' + new Date().getTime(),'number':phonenumber,'chattranscript':conversationTranscript});

	headers = {
	  'Content-Type': 'application/json',
	  'Content-Length': dataString.length,
	  'Authorization': 'Basic ' + new Buffer(cloudant_credentials.username + ':' + cloudant_credentials.password).toString('base64')
	};

		var options = {
			host: cloudant_credentials.host,
			port: 443,
			path: 'https://'+cloudant_credentials.host+'/chatrecord',
			method: "POST",
			headers: headers
		};

	callSvc(res,headers,dataString,options);
});



function callSvc(res,headers, dataString, options) {
	// console.log(options);
	var reqPost = https.request(options, function(resPost) {
		resPost.setEncoding('UTF-8');

		var responseString = '';

		resPost.on('data', function(data) {
		  responseString += data;
		});

		resPost.on('end', function() {

		  if (resPost.statusCode === 200) {
		  	var responseObject = {};
		  	if (responseString != ""){
		  		responseObject = JSON.parse(responseString);
			}
			res.status(200).send(responseObject);
		  }
		  else {
			res.status(resPost.statusCode).send(responseString);
		  }

		});
	});

	reqPost.write(dataString);
	reqPost.end();
	reqPost.on('error', function(e) {
		console.error(e);
	});
}


// Endpoint to be called from the client side
 app.post("/api/validate", function(req, res) {
	var phone = req.body.input.phone;
	phonenumber = req.body.input.phone;
	var output = {};
	telcoServices.getPerson(phone, function(err, person) {

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

module.exports = app;
