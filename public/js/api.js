// The Api module is designed to handle all interactions with the server

var Api = (function() {
  var requestPayload;
  var responsePayload;
  var messageEndpoint = '/api/message';

  // Publicly accessible methods defined
  return {
    sendRequest : sendRequest,
    validate : validate,

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
      payloadToWatson.context = context;
    } else {
    	payloadToWatson.context = {userName : sessionStorage.userName};
    }

    // Built http request
    var http1 = new XMLHttpRequest();
    http1.open('POST', messageEndpoint, true);
    http1.setRequestHeader('Content-type', 'application/json');

    http1.onreadystatechange = function() {
      if (http1.readyState === 4 && http1.status === 200 && http1.responseText) {
        Api.setResponsePayload(http1.responseText);
        document.getElementById('lblName').innerHTML=JSON.parse(http1.response).context.userName;
        document.getElementById('lblEmail').innerHTML=JSON.parse(http1.response).context.emailId;
        document.getElementById('lblAddress').innerHTML=JSON.parse(http1.response).context.address;
      }

  		var jsonResponse = JSON.parse(http1.responseText);

    };

    var params = JSON.stringify(payloadToWatson);

    // Stored in variable (publicly visible through Api.getRequestPayload)
    // to be used throughout the application
    if (Object.getOwnPropertyNames(payloadToWatson).length !== 0) {
      Api.setRequestPayload(params);
    }

    // Send request
    http1.send(params);

    //if(sendQueryToDiscovery){
      var username = '2e0ac76e-5376-4773-9a22-76c036ca3f3b';
      var password = 'KDG2sfU2sdaI';
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('GET', 'https://gateway.watsonplatform.net/discovery/api/v1/environments/cdd6c5fa-f76f-47ea-ad49-6c669e9a652f/collections/2e354788-b6ce-48bb-82c4-86b564b890b5/query?version=2016-11-07&query=enriched_text.entities.text%3AVodafone&count=&offset=&aggregation=&filter=&passages=true&highlight=true&return=passages.passage_text', true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader("Accept","application/json");
      xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200 && xhr.responseText) {

        }

    		var jsonResponse = JSON.parse(xhr.responseText);
        console.log("response from discovery"+jsonResponse);
      };
      xhr.send();
    //}
  }

  // Validate the userName from login page against db
  function validate(userName) {
    var payloadToService = {};
    if (userName) {
      payloadToService.input = {
        userName : userName
      };
    }
    var http = new XMLHttpRequest();
    http.open('POST', '/api/validate', true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function() {
      if (http.readyState === 4 && http.status === 200 && http.responseText) {
        if (JSON.parse(http.response).valid === 'yes') {
          window.location = '/chat.html';
        } else {
          window.alert('Invalid userName');
          return;
        }
      }
    };
    var params = JSON.stringify(payloadToService);
    http.send(params);
  }

}());
