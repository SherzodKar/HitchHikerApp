# HitchHikerApp

## Description
HitchHikerApp is a web application for people to be able to move around places, offer rides and request rides from drivers offering them.

## Usage
The application is hosted at the following URL: https://hitchhickerapp.firebaseapp.com/.
Anyone can follow the link, make an account, login and use all of the functionalities the application has to offer.
In order to run the web application on localhost, please go to the directory /HitchHikerApp/public/ and open index.html with any browser (works on Google Chrome and Firefox for sure)

## Code Structure
``` 
   HitchHikerApp
      firebase.json
      public --->
        * js --->
          ** addPost.js	//linked to addPost.html
          ** adLogin.js	//linked to index.html
          ** profile.js		//linked to profile.html
          ** register.js	//linked to register.html
          ** script.js		//linked to home.html
        * media --->
          ** images
        * css --->
          ** style.css		//linked to all main pages
          ** Theme.css	//linked to login, register and profile pages
        * addPost.html
        * home.html 		//the main page to view the retrieved posts
        * index.html 		//login page
        * profile.html
        * register.html
        * 404.html 			//For not found page
        * map-with-route-from-a-to-b -->
          ** demo.css  
          ** demo.details  
          ** demo.html  
          ** demo.js  
          ** img  --->
             *** arrows.png
          ** LICENSE  
          ** README.md  
          ** styles.css
          
  HitchHikerFunctions
      firebase.json
      functions --->
        * index.js  
        * node_modules  //folder contains all of the modules needed for Cloud Function
        * package.json  
        * package-lock.json

``` 

## Contributing
If anyone wants to take the code, make changes to it and use it for any personal purposes, feel free to do so.

