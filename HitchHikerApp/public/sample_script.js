(function() {
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser){
            document.getElementById('signout').addEventListener('click', e => {
                firebase.auth().signOut().then(function() {
                    window.location = "index.html";
                }).catch(function(error) {
                    // An error happened.
                });          
            });

            const table = document.getElementById('table');
            const generateCode = document.getElementById('generateCode');
            const upload = document.getElementById('upload');
            const addUser = document.getElementById('addUser');
            generateCode.disabled = true
            upload.disabled = true
            loadUsers()
            addUser.addEventListener('click', e => {
                var lastUserID = document.getElementById('lastID').innerHTML
                var lastIDInt = parseInt(lastUserID.substr(1, lastUserID.length-1))
                var digits = 1
                var tmp = lastIDInt
                while(lastIDInt / 10 > 1)
                {
                    digits++;
                    tmp /= 10
                }         
                lastIDInt++;
                var userID = 'U'
                for(var i = 0; i < 6 - digits; i++)
                    userID += '0'
                
                userID += lastIDInt
                let row = document.createElement('div');
                row.className = "row";
                let colID = document.createElement('div');
                colID.className = "col-xs-2";
                let spanID = document.createElement('span');
                spanID.innerHTML = userID;
                colID.appendChild(spanID);
                row.appendChild(colID);
                let colInput = document.createElement('div');
                colInput.className = "col-xs-10";
                let input = document.createElement('input');
                input.type = 'text';
                input.id = 'MTERKID';
                input.placeholder = " Please, input your MTERK ID here and click 'Generate MD5 Code': ";
                colInput.appendChild(input);
                row.appendChild(colInput);
                let hr = document.createElement('hr');
                table.appendChild(row);
                table.appendChild(hr);

                addUser.disabled = true
                generateCode.disabled = false

                generateCode.addEventListener('click', e => {
                    let mterk = input.value;
                    var today = new Date()
                    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                    var hash = md5(userID + date + mterk) 
                    row.removeChild(colInput);
                    let colMTERK = document.createElement('div')
                    colMTERK.className = 'col-xs-2'
                    let spanMTERK = document.createElement('span')
                    spanMTERK.innerHTML = mterk
                    let colCode = document.createElement('div')
                    colCode.className = 'col-xs-2'
                    colCode.style.fontSize = '17px'
                    let spanCode = document.createElement('span')
                    spanCode.innerHTML = hash.substr(0, 10) + '...'
                    colMTERK.appendChild(spanMTERK)
                    colCode.appendChild(spanCode)
                    row.appendChild(colMTERK)
                    row.appendChild(colCode)

                    generateCode.disabled = true
                    upload.disabled = false

                    upload.addEventListener('click', e => {
                        let colAccessed = document.createElement('div')
                        colAccessed.className = 'col-xs-2'
                        let spanAccessed = document.createElement('span')
                        spanAccessed.innerHTML = 'NO'
                        colAccessed.appendChild(spanAccessed)
                        
                        let colDate = document.createElement('div')
                        colDate.className = 'col-xs-2'
                        let spanDate = document.createElement('span')
                        spanDate.innerHTML = date
                        colDate.appendChild(spanDate)
                        let colAccessedDate = document.createElement('div')
                        colAccessedDate.className = "col-xs-2"
                        let spanAccessedDate = document.createElement('span')
                        spanAccessedDate.innerHTML = '-'
                        colAccessedDate.appendChild(spanAccessedDate)
                        row.appendChild(colDate)
                        row.appendChild(colAccessedDate)
                        row.appendChild(colAccessed)
                        upload.disabled = true
                           
                        var JSON_Send = {
                            'MTERK_ID' : mterk,
                            'MD5_Code' : hash,
                            'Created_DATE' : date,
                            'ACCESSED' : 'NO',
                            'Accessed_Date' : 'N/A'
                        }

                        var fire = firebase.database().ref('AllUsers').child(userID)
                        fire.push();
                        fire.set(JSON_Send).then(e => {
                            location.reload()
                        });
                    }, true)
                });
            })
        }
        else {
            window.location = "index.html";
        }
    });
}());


function loadUsers()
{
    firebase.database().ref('AllUsers').once('value', e => {
        var allUsers = Object.values(e.val()) 
        var allUserIDs = Object.keys(e.val())
            for(var i = 0; i < allUsers.length; i++)
            {
                let row = document.createElement('div');
                row.className = "row";
                let colID = document.createElement('div');
                colID.className = "col-xs-2";
                let spanID = document.createElement('span');
                if(i == allUserIDs.length - 1)
                    spanID.id = 'lastID'
                spanID.innerHTML = allUserIDs[i];
                colID.appendChild(spanID);
                row.appendChild(colID);
                let hr = document.createElement('hr');
                let colMTERK = document.createElement('div')
                colMTERK.className = 'col-xs-2'
                let spanMTERK = document.createElement('span')
                spanMTERK.innerHTML = allUsers[i]['MTERK_ID']
                let colCode = document.createElement('div')
                colCode.className = 'col-xs-2'
                let spanCode = document.createElement('span')
                /*let divToolTip = document.createElement('div')
                divToolTip.className = 'tooltip'
                divToolTip.innerHTML = allUsers[i]['MD5_Code'].substr(0, 12) + '...'
                spanCode.className = allUsers[i]['MD5_Code']*/
                spanCode.innerHTML = allUsers[i]['MD5_Code'].substr(0, 12) + '...'
                //divToolTip.appendChild(spanCode)
                colCode.style.fontSize = '17px'
                colMTERK.appendChild(spanMTERK)
                colCode.appendChild(spanCode)
                let colAccessed = document.createElement('div')
                colAccessed.className = 'col-xs-2'
                let spanAccessed = document.createElement('span')
                spanAccessed.innerHTML = allUsers[i]['ACCESSED']
                colAccessed.appendChild(spanAccessed)
                let colDate = document.createElement('div')
                colDate.className = 'col-xs-2'
                let spanDate = document.createElement('span')
                spanDate.innerHTML = allUsers[i]['Created_DATE']
                let fullCode = allUsers[i]['MD5_Code']
                $(spanCode).hover(function() {
                    $(this).text(fullCode);
                    $(spanDate).css('display', 'none');
                  }, function() {
                    $(this).text(fullCode.substr(0, 12) + '...');
                    $(spanDate).css('display', 'block');
                  }
                );
                let colAccessedDate = document.createElement('div')
                colAccessedDate.className = "col-xs-2"
                let spanAccessedDate = document.createElement('span')
                spanAccessedDate.innerHTML = allUsers[i]['Accessed_Date']
                colAccessedDate.appendChild(spanAccessedDate)
                colDate.appendChild(spanDate)
                row.appendChild(colMTERK)
                row.appendChild(colCode)
                row.appendChild(colDate)
                row.appendChild(colAccessedDate)
                row.appendChild(colAccessed)            
                table.appendChild(row);
                table.appendChild(hr);
            }
    })
}


var randomFixedInteger = function (length) {
    return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
}
