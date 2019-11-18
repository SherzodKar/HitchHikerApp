/*
    Version 1.1: Dynamic display and update functionality added
		Author:	 		Ryan Bump
		Completed On: 	11/3/19

	Version 1.0: Basic display function created
		Author:	 		Ryan Bump
		Completed On: 	10/27/19
*/

window.onload = function() {
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
    var database = firebase.database()
    //Checking, if user is authenticated (loged in) by verifying authentication token
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser){
            //Adding an event listener to the 'Sign Out' button 
            database.ref('AllUsers').child(firebase.auth().currentUser.uid).once('value', e => {
                //Whenever user clicks sign out, he/she is being redirected to the Login Page
                //Authentication Token is being disabled
                this.console.log(firebaseUser.email)
                this.console.log("HellO")
                var userInfo = e.val()
                this.console.log(userInfo.firstName, userInfo.lastName)
                document.getElementById("firstName").value = userInfo.firstName;
                document.getElementById("lastName").value = userInfo.lastName;
                document.getElementById("phoneNumber").value = userInfo.phoneNumber;
                document.getElementById("email").value = firebaseUser.email;

                //Adding an event listener to the Update button 
	            const updateBtn = document.getElementById('updateBtn');
                updateBtn.addEventListener('click', e => {
                    this.console.log("Inside button click")
                    this.console.log(userInfo.firstName)
                    
                    
                    firebase.auth().onAuthStateChanged(firebaseUser => {
                        const txtFirstName = document.getElementById('firstName');
                        const txtLastName = document.getElementById('lastName');
                        const txtPhoneNumber = document.getElementById('phoneNumber');
                        const firstName = txtFirstName.value.toString();
                        const lastName = txtLastName.value.toString();
                        const phoneNumber = txtPhoneNumber.value.toString();
                        if(firebaseUser){
                            var userInfoJSON = {
                                'firstName' : firstName,
                                'lastName' : lastName,
                                'phoneNumber' : phoneNumber,
                            }
                            //Updating the user information in the All Users table
                            var fireRef = firebase.database().ref('AllUsers').child(firebaseUser.uid);
                            fireRef.push();
                            fireRef.set(userInfoJSON).then(function(){
                                window.location.reload();
                            })
                        }		
                    });
                })
            })
        }
        else {
            //In case user is not authenticated, redirect to login page
            window.location = "index.html";
        }
    })
};