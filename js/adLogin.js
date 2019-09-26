(function() {
	
// Initialize Firebase
var firebaseConfig = {
	apiKey: "AIzaSyCC5r3rtnror2kB2pR6Jl2jNFiQLX4qZ5M",
	authDomain: "hitchhickerapp.firebaseapp.com",
	databaseURL: "https://hitchhickerapp.firebaseio.com",
	projectId: "hitchhickerapp",
	storageBucket: "",
	messagingSenderId: "206844179483",
	appId: "1:206844179483:web:0d67743e9a9e0628ecf4be"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
	
  //Get Elements
  const txtEmail = document.getElementById('adminEmail');
  const txtPassword = document.getElementById('adminPassword');
  const btnLogin = document.getElementById('logIn');
  const btnRegister = document.getElementById('register');
  // Add Login Event
  	  btnLogin.addEventListener('click', e => {
  		//Get email and password
	  const email = txtEmail.value.toString();
		const pass = txtPassword.value.toString();
		console.log(pass);
		if(email.indexOf("@", 0) < 0 || email.indexOf(".", 0) < 0 || email == "")
		{
				document.getElementById('adminEmail').style.borderColor = "red";
				document.getElementById('EmailFailed').innerHTML = "*Invalid Email!";
		}
		if(pass == "")
		{
			 document.getElementById('adminPassword').style.borderColor = "red";
			 document.getElementById('PasswordFailed').innerHTML = "*Invalid Password!";
		}
	  const auth = firebase.auth();
	 /*const promise = auth.signInWithEmailAndPassword(email, pass);
	 promise.catch(e => FailedLogin(e.message));*/
	  
			firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
		.then(function() {
			// Existing and future Auth states are now persisted in the current
			// session only. Closing the window would clear any existing state even
			// if a user forgets to sign out.
			// ...
			// New sign-in will be persisted with session persistence.
			return firebase.auth().signInWithEmailAndPassword(email, pass);
		})
		.catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			FailedLogin(errorMessage);
		});

	});
	
	btnRegister.addEventListener('click', e => {
		window.location="register.html";
	})

	  // Add a realtime listener
	  firebase.auth().onAuthStateChanged(firebaseUser => {
	  	if(firebaseUser){
			window.location="home.html";
		}		
	  });
		
}());


function FailedLogin(text){
		console.log(text);
		document.getElementById('adminEmail').style.borderColor = "red";
		document.getElementById('EmailFailed').innerHTML = "*Either Invalid Email or Password!";
		document.getElementById('adminPassword').style.borderColor = "red";
}