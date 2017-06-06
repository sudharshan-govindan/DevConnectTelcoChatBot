// The Api module is designed to handle all interactions with the server

var Api = (function() {
  var requestPayload;
  var responsePayload;
  var messageEndpoint = '/api/message';

  // Publicly accessible methods defined
  return {
    sendRequest: sendRequest,
    validate: validate, 
    logChat: logChat,
    logSurvey: logSurvey,
    // The request/response getters/setters are defined here to prevent internal methods
    // from calling the methods without any of the callbacks that are added elsewhere.
    getRequestPayload: function() {
      return requestPayload;
    },
    setRequestPayload: function(newPayloadStr) {
      requestPayload = JSON.parse(newPayloadStr);
    },
    getResponsePayload: function() {
      return responsePayload;
    },
    setResponsePayload: function(newPayloadStr) {
      responsePayload = JSON.parse(newPayloadStr);
    }
  };

  // Send a message request to the server
  function sendRequest(text, context) {

   
    // Build request payload
    var payloadToWatson = {};
    if (text) {
      payloadToWatson.input = {
        text: text
      };
    }
    
    if (context) {
      payloadToWatson.context =context;
    }
    else
    {
    	payloadToWatson.context={phonenumber:sessionStorage.phone};
     
    }

    // Built http request
    var http1 = new XMLHttpRequest();
    http1.open('POST', messageEndpoint, true);
    http1.setRequestHeader('Content-type', 'application/json');
   
    http1.onreadystatechange = function() {
      if (http1.readyState === 4 && http1.status === 200 && http1.responseText) {
        Api.setResponsePayload(http1.responseText);
        document.getElementById('lblName').innerHTML=JSON.parse(http1.response).context.username;
        document.getElementById('lblEmail').innerHTML=JSON.parse(http1.response).context.email;
        document.getElementById('lblAddress').innerHTML=JSON.parse(http1.response).context.address;
      }
      
		
		var jsonResponse = JSON.parse(http1.responseText);
		if(jsonResponse.intents && jsonResponse.intents[0]  &&  jsonResponse.intents[0].intent=='exiting'){
			window.location="/survey.html";
		}

		
		
    };
	 var params = JSON.stringify(payloadToWatson);
    // Stored in variable (publicly visible through Api.getRequestPayload)
    // to be used throughout the application
    if (Object.getOwnPropertyNames(payloadToWatson).length !== 0) {
      Api.setRequestPayload(params);
    }
    
    // Send request
    http1.send(params);
  }
  
  function validate(number)
  {
  	var payloadToService = {};
    if (number) {
      payloadToService.input = {
        phone: number
      };
    }
  	// Built http request
    var http = new XMLHttpRequest();
    http.open('POST', '/api/validate', true);
    http.setRequestHeader('Content-type', 'application/json');
   
    http.onreadystatechange = function() {
      if (http.readyState === 4 && http.status === 200 && http.responseText) {
              if (JSON.parse(http.response).valid==='yes') 
              {
              	window.location='/chat.html';
   				
   				
              }
              else
              {
              	window.alert('Invalid phone number');
              	
              	return;
              }
      }
    };
     var params = JSON.stringify(payloadToService);
    // Send request
    http.send(params);
   
	
   
  }

  function logChat(logString)
  {
  	// Built http requestvar payloadToWatson = {};
     var payloadTolog = {"text":logString, "number":sessionStorage.phone};
    
    
    var http = new XMLHttpRequest();
    http.open('POST', '/api/log', true);
    http.setRequestHeader('Content-type', 'application/json');
   
    http.onreadystatechange = function() {
      if (http.readyState === 4 && http.status === 200 && http.responseText) {
      }
    };
     var params = JSON.stringify(payloadTolog);
    // Send request
    http.send(params);
  }
  
    function logSurvey(logString)
  {
  	// Built http requestvar payloadToWatson = {};
     var payloadTolog = {"text":logString, "number":sessionStorage.phone};
    
    
    var http = new XMLHttpRequest();
    http.open('POST', '/api/logSurvey', true);
    http.setRequestHeader('Content-type', 'application/json');
   
    http.onreadystatechange = function() {
      if (http.readyState === 4 && http.status === 200 && http.responseText) {
      	
      }
    };
     var params = JSON.stringify(payloadTolog);
    // Send request
    http.send(params);
  }
  
  
}());
