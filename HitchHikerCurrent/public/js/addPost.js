/*
	addPost.js
	version 1.0, Sherzod

	This file is designed to process and handle add post page.
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

    //Checking, if user is authenticated (loged in) by verifying authentication token
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser){
            //Adding an event listener to the 'Sign Out' button 
            document.getElementById('signout').addEventListener('click', e => {
                //Whenever user clicks sign out, he/she is being redirected to the Login Page
                //Authentication Token is being disabled
                firebase.auth().signOut().then(function() {
                    window.location = "index.html";
                }).catch(function(error) {
                    // An error happened.
                });          
            });
        //Adding a listener to the 'Hamburger' sign on Home Page to expand and collapse the sidebar
        $('.hamburger, .menu-inner').on('mouseenter', function(){
            $(this).parent().addClass('expanded');
            menuExpanded = true;
        });

        $('.menu-inner').on('mouseleave', function(){
            menuExpanded = false;
            $(this).parent().removeClass('expanded');
        });
        $('#datetimepicker1').datetimepicker();
        //Adding Google Places API, Maps JavaScript API and Geolocation API for identifying the locations, establishments, cities and etc.
        //Based on the input of the user as the user types
        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(-33.8902, 151.1759),
            new google.maps.LatLng(-33.8474, 151.2631));
        
        var departure = document.getElementById('departure');
        var options = {
            bounds: defaultBounds,
            regions: ['establishment', 'address', 'locality', 'country', 'sublocality', 'postal_code', 'administrative_area1', 'administrative_area2'],
            componentRestrictions: {country: 'us'}
        };

        autocomplete = new google.maps.places.Autocomplete(departure, options);

        var destination = document.getElementById('destination');

        autocomplete = new google.maps.places.Autocomplete(destination, options);

        var submit = document.getElementById('submit')
        var datetime = document.getElementById('datetime')
        
        //Adding an event listener to the submit button
        submit.addEventListener('click', e => {
            //Firebase .child(key_value) is used to retrieve the corresponding information from the database using .once('value') function
            firebase.database().ref('AllUsers').child(firebase.auth().currentUser.uid).child('posted_trips').once('value', e => {
                var allPostIDs = e.val()
                var allIDs = []
                //Checks, if there are any posts made by the current user
                if(allPostIDs != undefined)
                    allIDs = allPostIDs
                
                var message = $("#message").val()
                let JSON_Firebase = {
                    'DEPARTURE' : departure.value,
                    'DESTINATION' : destination.value,
                    'DATE_TIME' : datetime.value,
                    'MESSAGE' : message
                }
                var user = firebase.auth().currentUser;
                var userFire = firebase.database().ref('AllUsers').child(user.uid).child('posted_trips');
                var tripID = randomFixedInteger(12) //generate a random post ID of length 12 (random)
            
                userFire.push();
                allIDs.push(tripID) //add the current post
                userFire.set(allIDs); //save the post ID in the database as a seperate entry for the current user
                //See the bottom part of script.js file for database structure formats 
                
                var fire = firebase.database().ref('AllPosts').child(tripID);
                fire.push(); //Push current post to All Posts table
                fire.set(JSON_Firebase).then(() => {
                    location.reload() //as soon as new post is added, reload the page, if user wants to make another post
                });
            })
        })
    }
    else {
        //If user is not authenticated, redirect to Login Page
        window.location = "index.html";
    }
    });
};

//Random number generator based on the given length
var randomFixedInteger = function (length) {
    return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
}
