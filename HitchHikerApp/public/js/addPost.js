window.onload = function() {
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

    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser){
            /*document.getElementById('signout').addEventListener('click', e => {
                firebase.auth().signOut().then(function() {
                    window.location = "index.html";
                }).catch(function(error) {
                    // An error happened.
                });          
            });*/
        //addSidebar()
        
        $('#datetimepicker1').datetimepicker();
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
        
        submit.addEventListener('click', e => {
            firebase.database().ref('AllUsers').child(firebase.auth().currentUser.uid).child('posted_trips').once('value', e => {
                var allPostIDs = e.val()
                var allIDs = []
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
                var tripID = randomFixedInteger(12)
            
                userFire.push();
                allIDs.push(tripID)
                userFire.set(allIDs);
                
                var fire = firebase.database().ref('AllPosts').child(tripID);
                fire.push();
                fire.set(JSON_Firebase).then(() => {
                    location.reload()
                });
            })
        })
    }
    else {
        window.location = "index.html";
    }
    });
};


function addSidebar()
{
    var height = window.innerHeight,
        x = 0, y = height/2,
        curveX = 10,
        curveY = 0,
        targetX = 0,
        xitteration = 0,
        yitteration = 0,
        menuExpanded = false;
        
        blob = $('#blob'),
        blobPath = $('#blob-path'),

        hamburger = $('.hamburger');
        $(this).on('mousemove', function(e){
            x = e.pageX;
            
            y = e.pageY;
        });

        $('.hamburger, .menu-inner').on('mouseenter', function(){
            $(this).parent().addClass('expanded');
            menuExpanded = true;
        });

        $('.menu-inner').on('mouseleave', function(){
            menuExpanded = false;
            $(this).parent().removeClass('expanded');
        });

        function easeOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
            return changeInValue * (-Math.pow(2, -10 * currentIteration / totalIterations) + 1) + startValue;
        }

        var hoverZone = 150;
        var expandAmount = 20;
        
        function svgCurve() {
            if ((curveX > x-1) && (curveX < x+1)) {
                xitteration = 0;
            } else {
                if (menuExpanded) {
                    targetX = 0;
                } else {
                    xitteration = 0;
                    if (x > hoverZone) {
                        targetX = 0;
                    } else {
                        targetX = -(((60+expandAmount)/100)*(x-hoverZone));
                    }			
                }
                xitteration++;
            }

            if ((curveY > y-1) && (curveY < y+1)) {
                yitteration = 0;
            } else {
                yitteration = 0;
                yitteration++;	
            }

            curveX = easeOutExpo(xitteration, curveX, targetX-curveX, 100);
            curveY = easeOutExpo(yitteration, curveY, y-curveY, 100);

            var anchorDistance = 200;
            var curviness = anchorDistance - 40;

            var newCurve2 = "M60,"+height+"H0V0h60v"+(curveY-anchorDistance)+"c0,"+curviness+","+curveX+","+curviness+","+curveX+","+anchorDistance+"S60,"+(curveY)+",60,"+(curveY+(anchorDistance*2))+"V"+height+"z";

            blobPath.attr('d', newCurve2);

            blob.width(curveX+60);

            hamburger.css('transform', 'translate('+curveX+'px, '+curveY+'px)');
        
        $('h2').css('transform', 'translateY('+curveY+'px)');
            window.requestAnimationFrame(svgCurve);
        }

        window.requestAnimationFrame(svgCurve);

}

var randomFixedInteger = function (length) {
    return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
}
