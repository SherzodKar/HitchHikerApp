/*
    script.js
    version 1.1, Sherzod - added side bar navigation
	version 1.0, Sherzod

	This file is designed to make the home page function.
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
            //Retrieve all Posts in the list format
            retrieveAllPosts()
        }
        else {
            //If user is not authenticated, redirect to Login Page
            window.location = "index.html"; 
        }
    });
};


function retrieveAllPosts()
{
    var fire = firebase.database().ref(); //saving firebase database object in 'fire' variable
    //Database .on(value) function is used to get access to all of the data stored in the database
    fire.on("value", e => {
        var allPosts = e.val()['AllPosts'] //All Posts table is saved
        var allUsers = e.val()['AllUsers'] //All Users table is saved 
        document.getElementById('allPosts').innerHTML = '' //clear the div element, which is holding posts, if any 
        //Iterating over All Posts table and retrieving one by one
        Object.keys(allPosts).forEach((key, index) => {
            /*
                Each Post will be placed in the following HTML structure according to Bootstrap library 
                <article class="content-section">
                    <div class="row" id="posted">
                        <div class="col-xs-12">
                            <span>Full Name posted </span>
                        </div>
                        <div class="row" id="line1">
                            <div class="col-xs-12">
                                <span>Date and Time</span>
                            </div>
                        </div>
                         <div class="row" id="line2">
                            <div class="col-xs-6">
                                <span>Departure</span>
                            </div>
                            <div class="col-xs-6">
                                <span>Destination</span>
                            </div>
                        </div>
                        <div class="row" id="line3">
                            <div class="col-xs-12">
                                <span>Message</span>
                            </div>
                        </div>
                        <button type="button" class="btn btn-success" id="post-id">Request a ride</button>
                    </div>
                </article>
            */ 
           //Below code illustrates the above structure implementation by creating web elements
           //Assigning class names, ids, and values for each of the web elements, appending some web elements to others
           //The bottom part of the page shows the structure of the database
            var article = document.createElement('article');
            article.className = "content-section";
            var divRow0 = document.createElement('div')
            divRow0.id = 'posted'
            divRow0.className = 'row'
            var divColPosted = document.createElement('div')
            divColPosted.className = 'col-xs-12'
            var spanPosted = document.createElement('span')
            let userID = allPosts[key]['POSTED_BY'] 
            var name = allUsers[userID]['firstName'].italics() + ' ' + allUsers[userID]['lastName'].italics()
            spanPosted.innerHTML = name + ' posted'.bold().italics()

            divColPosted.appendChild(spanPosted) 
            divRow0.appendChild(divColPosted)
            
            var divRow1 = document.createElement('div')
            divRow1.className = "row"
            var divRow2 = document.createElement('div')
            divRow1.id = 'line1'
            divRow2.className = "row"
            divRow2.id = 'line2'
            var divRow3 = document.createElement('div')
            divRow3.className = "row"
            divRow3.id = 'line3'
            var divColDate = document.createElement('div')
            divColDate.className = "col-xs-12"

            var divColMessage = document.createElement('div')
            divColMessage.className = "col-xs-12"

            var divColDestination = document.createElement('div')
            divColDestination.className = "col-xs-6"

            var divColDeparture = document.createElement('div')
            divColDeparture.className = "col-xs-6"

            var spanDestination = document.createElement('span')
            var spanDeparture = document.createElement('span')
            var spanDate = document.createElement('span')
            var spanMessage = document.createElement('span')

            spanDate.innerHTML =  'Date and Time: '.bold()  + allPosts[key]['DATE_TIME']
            spanDeparture.innerHTML = 'From: '.bold()  + allPosts[key]['DEPARTURE']

            spanDestination.innerHTML = 'To: '.bold()  + allPosts[key]['DESTINATION']

            spanMessage.innerHTML = 'Message: '.bold()  + allPosts[key]['MESSAGE']
            var hr = document.createElement('hr')
            divColDate.appendChild(spanDate)
            divColDeparture.appendChild(spanDeparture)
            divColDestination.appendChild(spanDestination)
            divColMessage.appendChild(spanMessage)

            let requestBtn = document.createElement('button')
            requestBtn.type = 'button'
            requestBtn.className = 'btn btn-success'
            requestBtn.innerHTML = 'Request a ride'

            requestBtn.id = key
            let requestedTrips = []
            //Validating if requested_trips component of the user table has elements
            if(allUsers[userID]['requested_trips'] != undefined)
            {
                requestedTrips = allUsers[userID]['requested_trips'] 
            }

            //Validating if the Ride Post was not requested before and current user is not author of the post
            if(requestedTrips.includes(key) || firebase.auth().currentUser.uid == userID)
               requestBtn.disabled = true //if true disable the request button
                    
            //Adding the event listener to "Request a ride" button
            requestBtn.addEventListener('click', e => {
                //As soon as the button is clicked
                //Post is added to the requested ones for the driver and notification is sent
                var postID = requestBtn.id
                var usrfire = firebase.database().ref('AllUsers').child(userID + '/requested_trips')
                usrfire.push()
                requestedTrips.push(postID)
                usrfire.set(requestedTrips)
                alert('Your request was sent to the driver!')
                requestBtn.disabled = true
            })

            divRow1.appendChild(divColDate)
            divRow2.appendChild(divColDeparture)
            divRow2.appendChild(divColDestination)
            divRow3.appendChild(divColMessage)

            var hr2 = document.createElement('hr')
            article.appendChild(divRow0)
            article.appendChild(hr2)
            article.appendChild(divRow1)
            article.appendChild(divRow2)
            article.appendChild(hr)
            article.appendChild(divRow3)    
            var br = document.createElement('br')
            article.appendChild(br)
            article.appendChild(requestBtn) 
            
            document.getElementById('allPosts').appendChild(article)
        })
    })

}
/*
    All Posts table has the following structure

    AllPosts : {
        PostID : 
        {
            DATE_TIME : date_time,
            DEPARTURE : departure location,
            DESTINATION: destination location, 
            MESSAGE : Comment from the driver,
            POSTED_BY : user ID
        }
        PostID2 : { ... } 
        ...
    }

    All Users table has the following structure

    AllUsers : {
        UserID : 
        {
            firstName : Name,
            lastName : Name,
            phoneNumber : number,
            posted_trips: [
                0 : postID1,
                1 : postID2,
                ...
            ]
            requested_trips : [
                0 : postID1,
                1 : postID2,
                ...
            ]
        }
        UserID2 : { ... }
        ...
    }

*/ 