/*
	Register.js
	Version 1.2, Sarah - added input checking
	Version 1.1, Ryan
	version 1.0, Sherzod

	This file is designed to process and handle the new user register page.
*/

(function() {

//Firebase Keys such as API key, authentication Domain, database URLs and application ID are saved in FirebaseConfig
	var firebaseConfig = {
		apiKey: "AIzaSyCC5r3rtnror2kB2pR6Jl2jNFiQLX4qZ5M",
		authDomain: "hitchhickerapp.firebaseapp.com",
		databaseURL: "https://hitchhickerapp.firebaseio.com",
		projectId: "hitchhickerapp",
		storageBucket: "",
		messagingSenderId: "206844179483",
		appId: "1:206844179483:web:0d67743e9a9e0628ecf4be"
	};
    // Initialize Firebase using FirebaseConfig variable
	firebase.initializeApp(firebaseConfig);

	//Get Elements
	const txtEmail = document.getElementById('adminEmail');
	const txtPassword = document.getElementById('adminPassword');

	const btnLogin = document.getElementById('logIn');
	// Add Login Event
	btnLogin.addEventListener('click', e => {
		//Get email and password
		const email = txtEmail.value.toString();
		const pass = txtPassword.value.toString();
		//Validating if the inputted email has the email format and password is not empty
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
		
		firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
		.then(function() {
			// Existing and future Auth states are now persisted in the current
			// session only. Closing the window would clear any existing state even
			// if a user forgets to sign out.
			// ...
			// New sign-in will be persisted with session persistence.
			return firebase.auth().createUserWithEmailAndPassword(email, pass);
		})
		.catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			FailedLogin(errorMessage);
		});

	});

	// Add a realtime listener
	firebase.auth().onAuthStateChanged(firebaseUser => {
		const txtFirstName = document.getElementById('firstName');
		const txtLastName = document.getElementById('lastName');
		const txtPhoneNumber = document.getElementById('phone');
		const firstName = txtFirstName.value.toString();
		const lastName = txtLastName.value.toString();
		const phoneNumber = txtPhoneNumber.value.toString();
		
		//Checks to ensure user has entered valid information
		var pNumber = /^\(\d{3}\)\s*\d{3}(?:-|\s*)\d{4}$/;
		var nameCheck =/^[a-z0-9]+$/i;
		//Validate if phone number, first name and last name are not empty
        if(!(pNumber.test(phoneNumber)) || phoneNumber == ""){
            window.alert("Please enter a valid phone number.");
        }
        if(!(nameCheck.test(firstName) || firstName == "")){
            window.alert("Please enter a valid first name.");
        }
        if(!(nameCheck.test(lastName)) || lastName == ""){
            window.alert("Please enter a valid last name.");
		}
		
		if(firebaseUser){
			var userInfoJSON = {
				'firstName' : firstName,
				'lastName' : lastName,
				'phoneNumber' : phoneNumber,
			}
			//All of the user information is added to the All Users table
			//See file script.js for the structure of the database
			var fireRef = firebase.database().ref('AllUsers').child(firebaseUser.uid);
			fireRef.push();
			fireRef.set(userInfoJSON).then(function(){
				window.location="home.html" //redirect the user to the home page after he/she is logged in
			})
		}		
	});
		
}());

//In case of Failed Login, let the user know that either email or password is incorrect
function FailedLogin(text){
	console.log(text);
	document.getElementById('adminEmail').style.borderColor = "red";
	document.getElementById('EmailFailed').innerHTML = "*Either Invalid Email or Password!";
	document.getElementById('adminPassword').style.borderColor = "red";
}