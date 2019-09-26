(function() {
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
            document.getElementById('signout').addEventListener('click', e => {
                firebase.auth().signOut().then(function() {
                    window.location = "index.html";
                }).catch(function(error) {
                    // An error happened.
                });          
            });
        }
        else {
            window.location = "index.html";
        }
    });
}());

