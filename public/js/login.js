var Login = (function() {
  // Publicly accessible methods defined
  return {
    login:login
  };
  
  function login(event, inputBox){
  	if (event.keyCode === 13 && inputBox.value) {
  		sessionStorage.phone=inputBox.value;
  		//window.location='/chat.html';
   		
  		Api.validate(inputBox.value);
  		}
  	
  	
  }
    }());