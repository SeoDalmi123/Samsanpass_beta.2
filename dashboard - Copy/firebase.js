//---------------------------- INITIALIZE FIREBASE ----------------------------------------//  
        // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
        import { getDatabase } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
        import { getAuth, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
        import { getFirestore, collection, collectionGroup ,getDocs, onSnapshot, doc, setDoc, addDoc, getDoc, query, where,deleteDoc, updateDoc} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
        import { GetAllDataOnceForArchive, GetAllDataRealtimeForArchive } from './archives/archives.js';
        import {GetAllDataOnceForLogs, GetAllDataRealtimeForLogs} from './logs/login.js';
        import {GetAllDataOnceForLogOut, GetAllDataRealtimeForLogout} from './logs/logout.js';

        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyD1PYkwF7pLWhZ25f9bXysb3N3K3E_oQyY",
            authDomain: "users-44276.firebaseapp.com",
            databaseURL: "https://users-44276-default-rtdb.firebaseio.com",
            projectId: "users-44276",
            storageBucket: "users-44276.appspot.com",
            messagingSenderId: "587941897485",
            appId: "1:587941897485:web:5a5115a8ee1c7444107c44"
        };

        // Initialize Firebase (connect to firebase features)
        const app = initializeApp(firebaseConfig);
        const db = getFirestore();
        const auth = getAuth();
        const database = getDatabase();
//---------------------------- INITIALIZE FIREBASE ----------------------------------------//  
//---------------------------- USER STATUS ------------------------------------------------//
        //Get user ID from Firebase. Detects if user is logged in, inside the dashboard
        onAuthStateChanged(auth, (user) => {
            if (user) {
                //console.log user email
                const userEmail = user.email;
                console.log("User is logged in: " + userEmail);

                //print user displayName in welcome message
                const showDisplayName = document.getElementById("coverpage");
                const displaynAme = document.createElement("span")
                displaynAme.innerHTML = ": " + user.displayName;
                displaynAme.style.fontFamily = "kanit";
                displaynAme.style.color = "#2E24E7";
                showDisplayName.appendChild(displaynAme);

                //print user data in table
                GetAllDataOnce();
                GetAllDataRealtime();

                GetAllDataOnceForArchive();
                GetAllDataRealtimeForArchive();

                GetAllDataOnceForLogs();
                GetAllDataRealtimeForLogs();

                GetAllDataOnceForLogOut();
                GetAllDataRealtimeForLogout();
                
                
            } else {
                console.log("User logged out");
                window.location.href= "../login.html";
            }
        });

        // DASHBOARD LOG OUT BUTTON
        let logoutBtn = document.getElementById("logoutBtn");
        logoutBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            try {
                //GET DATE,TIME AND LOCATION
                const user = auth.currentUser;    
                const currentDate = new Date().toDateString();
                const options = {hour: '2-digit', minute:'2-digit', second:'2-digit'};
                const time = new Date().toLocaleTimeString(undefined, options); //time
                const userLogOut = {
                    date : currentDate,
                    time : time
                };
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject)
                });
                const API_KEY = '45be228952834fad854773f48f212919';
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${API_KEY}`);
                const data = await response.json();
                const locationName = data.results[0].formatted;
                userLogOut.locationName = locationName; 
        
                await setDoc(doc(db, "users" , user.uid, "userLogouts", time), userLogOut); //sends to database
        
                await signOut(auth);
        
                // Redirect the user to the dashboard page
                document.getElementById("log-error").innerHTML='User logged out!';
                window.location.href= "./dashboard/dashboard.html";
        
            } catch (error) {
                console.log("Error signing out: " + error);
            }
        });
        
//---------------------------- USER STATUS ------------------------------------------------//

//-----------------------------SUBMIT USER ------------------------------------------------//

        //SUBMIT USER DATA TO DATABASE //PASSWORD NEEDS ENCRYPTION//
        const formSubmit = document.getElementById('formSubmit');
        formSubmit.addEventListener('submit', async (e) =>{
            e.preventDefault();
            //checks if there is no input from user
            let a = document.forms["Form"]["answer_a"].value;
            let b = document.forms["Form"]["answer_b"].value;
            let c = document.forms["Form"]["answer_c"].value;
            let d = document.forms["Form"]["answer_d"].value;
            if(a == null || a == "", b == null || b == "", c == null || c == "", d == null || d == "")  {
                let error = document.getElementById("error-message");
                setTimeout(showError, 5);
                setTimeout(closeError,5000);
                function showError(){
                    error.classList.add("active")
                }
                function closeError(){
                    error.classList.remove("active")
                }

            //if no error code proceeds below
            }else {
            var site = document.getElementById('site').value;
            var username = document.getElementById('username').value;
            var password = document.getElementById('addPasswordForm').value; 
            var description = document.getElementById('description').value;
            const user = auth.currentUser;     

            // Encrypt the password using AES-256-GCM
            const lock = "11111111111111111111111111111111"
            const salt = CryptoJS.lib.WordArray.random(128/8).toString();
            const derivedKey = CryptoJS.PBKDF2(lock, salt, { keySize: 256/8, iterations: 1000 }).toString(CryptoJS.enc.Hex);
            const encryptionKey = CryptoJS.PBKDF2(lock, salt, { keySize: 256/8, iterations: 1000 }).toString();
            const iv = CryptoJS.lib.WordArray.random(128/8).toString();
            const encPassword = CryptoJS.AES.encrypt(password, encryptionKey, { iv: iv }).toString();

            const inputData = {                               
                site : site,                   
                username : username,
                password : encPassword, // from the password variable above. 
                description : description,
                iv : iv,
                salt : salt 
            }
            
            //sends data to the database
            setDoc(doc(db, "users", user.uid, "websites", inputData.site), inputData);
            //RESETS THE FORM
            document.getElementById('site').value = '';
            document.getElementById('username').value = '';
            document.getElementById('addPasswordForm').value = ''; 
            document.getElementById('description').value = ''; 
            popUp.classList.remove("show");
            document.querySelector("body").style.overflow = "auto";
            siteInput.value = usernameInput.value = passwordInput.value = "";
            let saved = document.getElementById("saved-message");
                setTimeout(showError, 0);
                setTimeout(closeError,1000);
                function showError(){
                    saved.classList.add("active")
                }
                function closeError(){
                    saved.classList.remove("active")
                }
        }
        });
//-----------------------------SUBMIT USER ------------------------------------------------//

//----------------------------GET ALL DATA FROM DATABASE ---------------------------------------//
        // GET USER'S DATA FROM DATABASE
        async function GetAllDataOnce(){
            const user = auth.currentUser; 
            const q = query(collection(db, "users", user.uid, "websites"));
            const querySnapshot = await getDocs(q);
            var inputData = [];
            querySnapshot.forEach((doc) => {
            inputData.push(doc.data());
            });
            AddAllItemsToTheTable(inputData);
        }

        // GET USER'S DATA FROM DATABASE VIA SNAPSHOT FOR REALTIME CHANGES
        async function GetAllDataRealtime(){
            const user = auth.currentUser; 
            const q = query(collection(db, "users", user.uid, "websites"));
            const unsubscribe = onSnapshot(q,(querySnapshot) => {
                var inputData = [];
                querySnapshot.forEach((doc)=>{
                    inputData.push(doc.data());
                });     
                AddAllItemsToTheTable(inputData);
                
                const tableBody = Array.from(document.getElementById("table-content").childNodes);
                tableBody.forEach((row, index) => {
                    const rows = row.childNodes; //table rows
                    const expireWebsite = rows[1].children[0].value //website text
                    const popup = rows[7].children[0] //popup box
                    const infoSymbol = rows[7].children[1] // info symbol
                    var endDate = new Date();
                    endDate.setMonth(endDate.getMonth() + 3);

                    var countDownInterval = setInterval(function(){
                        var currentTime = new Date();
                        var remainingTime = endDate - currentTime;
                    
                        if(remainingTime >=0){
                            // convert remaining time to human readable date and time
                            var date = new Date(null);
                            date.setMilliseconds(remainingTime);
                            var remainingTimeString = date.toISOString().substr(11, 8);
                            var year = endDate.getUTCFullYear();
                            var month = endDate.getUTCMonth() + 1;
                            var day = endDate.getUTCDate();
                            var dateString = month + "/" + day;
                            popup.innerHTML = "Change password by: " + ' ' + dateString + ' '+ year;
                            localStorage.setItem(expireWebsite + index, remainingTime);
                            if (remainingTime <= 604800000) { // one week in milliseconds
                                const setRowBorder = row
                                setRowBorder.style.border = ".2em solid #FFA500";
                                const setInfoColor = row.children[7].children[1]
                                setInfoColor.style.color = "#FFA500";
                            }
                        }else{
                            clearInterval(countDownInterval);
                            //deleteDoc(doc(db, "users", user.uid, "websites", expireWebsite));
                        }
                    }, 1000);
                    
                    

                    infoSymbol.addEventListener("mouseover", function() {
                        popup.style.opacity = "1";
                        popup.style.marginLeft = "-16.5em";
                        popup.style.marginTop = "-2em";
                    });
                    infoSymbol.addEventListener("mouseout", function() {
                        popup.style.opacity = "0";
                    });
                });
                
                

                //DELETE BUTTON - REMOVE DATA FROM TABLE AND DATABASE 
                const deleteButtons = document.querySelectorAll('#deleteButton');
                for (let i = 0; i < deleteButtons.length; i++) {
                    const button = deleteButtons[i];
                    button.addEventListener('click', e => {
                        const user = auth.currentUser; 
                        let td = e.target.parentNode.parentNode.parentNode.parentNode.children[1]
                        let input = td.querySelector("input");
                        var inputValue = input.value;
                        let wholeRow = e.target.parentNode.parentNode.parentNode.parentNode
                        let websiteCell = wholeRow.children[1].querySelector("input").value // facebook
                        let descriptionCell = wholeRow.children[2].querySelector("input").value
                        let useridCell = wholeRow.children[3].querySelector("input").value
                        let userpasswordCell = wholeRow.children[4].querySelector("input").value
                        let currentDateTime = new Date().toLocaleString();

                        const lock = "11111111111111111111111111111111"
                        const salt = CryptoJS.lib.WordArray.random(128/8).toString();
                        const derivedKey = CryptoJS.PBKDF2(lock, salt, { keySize: 256/8, iterations: 1000 }).toString(CryptoJS.enc.Hex);
                        const encryptionKey = CryptoJS.PBKDF2(lock, salt, { keySize: 256/8, iterations: 1000 }).toString();
                        const iv = CryptoJS.lib.WordArray.random(128/8).toString();
                        const encPassword = CryptoJS.AES.encrypt(userpasswordCell, encryptionKey, { iv: iv }).toString();

                        const archiveFiles = {
                            site : websiteCell,                   
                            username : useridCell,
                            password : encPassword,
                            description : descriptionCell,
                            iv : iv,
                            salt : salt,
                            DateDeleted : currentDateTime
                        };

                        setDoc(doc(db, "users", user.uid, "archives", websiteCell), archiveFiles)

                        .then(() => {
                            deleteDoc(doc(db, "users", user.uid, "websites", inputValue))
                            console.log("delete button clicked")
                            let deleted = document.getElementById("deleted-message");
                                setTimeout(showError, 5);
                                setTimeout(closeError,1000);
                                function showError(){
                                    deleted.classList.add("active")
                                }
                                function closeError(){
                                    deleted.classList.remove("active")
                                }
                            });
                        
                    });
                }
                
                //INCREMENT PASSWORD ID FOR UNIQUE ELEMENT IDS
                const elements = document.querySelectorAll("#password");
                for (let i = 0; i < elements.length; i++) {
                    elements[i].id = `password${i + 1}`;
                    };
         
                //SHOW/HIDE PASSWORD//
                const showPass= document.querySelectorAll("#hidePass");
                const hidePass= document.querySelectorAll("#showPass");
                for(let i=0; i < hidePass.length; i++) {
                    const toggles = hidePass[i];
                    const togglesB = showPass[i]
                    toggles.addEventListener("click", () =>{
                        if (elements[i].type === "password") {
                            elements[i].setAttribute("type", "text");
                            toggles.style.opacity = "1";
                            togglesB.style.opacity = "0"
                            console.log("Show password button clicked")
                        } else {
                            elements[i].setAttribute("type", "password");
                            toggles.style.opacity = "0";
                            togglesB.style.opacity = "1"
                            console.log("Hide password button clicked")
                        }
                    })
                }
                
                //COPY USER ID //
                const copyuserB = document.querySelectorAll("#copyuserB");
                for(let i=0; i < copyuserB.length; i++){
                    const copyUserButton = copyuserB[i]
                    copyUserButton.addEventListener("click", function() {
                    var inputTextOne = this.parentNode.parentNode.children;
                    var inputTextFinal = inputTextOne[0].value
                        navigator.clipboard.writeText(inputTextFinal).then(function() {
                            let copied = document.getElementById("copiedUser-message");
                                setTimeout(showError, 5);
                                setTimeout(closeError,1000);
                                function showError(){
                                    copied.classList.add("active")
                                }
                                function closeError(){
                                    copied.classList.remove("active")
                                }
                            console.log("Copy Button: USER ID clicked");
                            }, function(err) {
                            alert("Failed to copy text: ", err);
                        });
                    });
                }

                //COPY USER PASSWORD //
                const copypassB = document.querySelectorAll("#copypassB");
                for(let i=0; i < copypassB.length; i++){
                    const copyPassButton = copypassB[i]
                    copyPassButton.addEventListener("click", function() {
                    var inputTextOne = this.parentNode.parentNode.children;
                    var inputTextFinal = inputTextOne[0].value
                        navigator.clipboard.writeText(inputTextFinal).then(function() {
                            let copied = document.getElementById("copiedPass-message");
                                setTimeout(showError, 5);
                                setTimeout(closeError,1000);
                                function showError(){
                                    copied.classList.add("active")
                                }
                                function closeError(){
                                    copied.classList.remove("active")
                                }
                            console.log("Copy Button: PASSWORD clicked");
                            }, function(err) {
                            alert("Failed to copy text: ", err);
                        });
                    });
                }


                // EDIT BUTTON //
                const getEditButton = document.querySelectorAll("#editButton");
                for(let i=0; i < getEditButton.length; i++){
                    let editButton = getEditButton[i];
                        editButton.addEventListener("click", function() {
                            const row = this.parentNode.parentNode.parentNode
                            const rowChildren = row.children;
                            const insideTD = rowChildren
                            ///const inputWebsite = insideTD[1].children[0]
                            const inputDescription = insideTD[2].children[0]
                            const inputUsername = insideTD[3].children[0].children[0].children[0]
                            const inputPassword = insideTD[4].children[0].children[0].children[0]       
                            const displayUpdate = this.nextElementSibling  
                                 
                                
                                this.style.display = "none";
                                displayUpdate.style.display = "block";
                                //displayUpdate.style.backgroundColor = "rgb(33, 214, 72)";
                                displayUpdate.style.color = "white";
                                //inputWebsite.removeAttribute("disabled");
                                inputDescription.removeAttribute("disabled");
                                inputDescription.setAttribute("placeholder", "edit description")
                                inputDescription.style.border =".2em solid #E72B2B";
                                inputDescription.style.height = "3em";
                                inputDescription.style.transition = "0.4s";

                                inputUsername.removeAttribute("disabled");
                                inputUsername.setAttribute("placeholder", "edit username")
                                inputUsername.style.border =".2em solid #E72B2B";
                                inputUsername.style.height = "3em";
                                inputUsername.style.transition = "0.4s";

                               
                                inputPassword.removeAttribute("disabled");    
                                inputPassword.setAttribute("placeholder", "edit password")
                                inputPassword.style.border =".2em solid #E72B2B";
                                inputPassword.style.height = "3em";
                                inputPassword.style.transition = "0.4s";
                                
                                console.log("Edit Button clicked");   
                            
                        }) 
                }
                // UPDATE BUTTON //
                const getUpdateButton = document.querySelectorAll("#updateButton");
                for(let i=0; i < getUpdateButton.length; i++){
                    let updateButton = getUpdateButton[i];
                        updateButton.addEventListener("click", () => {
                            const row = updateButton.parentNode.parentNode.parentNode
                            const rowChildren = row.children;
                            const insideTD = rowChildren
                            const inputWebsite = insideTD[1].children[0]
                            const inputDescription = insideTD[2].children[0]
                            const inputUsername = insideTD[3].children[0].children[0].children[0]
                            const inputPassword = insideTD[4].children[0].children[0].children[0] 
                            const displayEdit = updateButton.previousElementSibling     
                                row.style.backgroundColor = "";
                                updateButton.style.display = "none";
                                displayEdit.style.display = "block";
                                //inputWebsite.setAttribute("disabled", "");

                                inputDescription.setAttribute("disabled", "");
                                inputDescription.style.border = ""
                                inputDescription.style.height = "";
                                inputDescription.style.transition = "0.4s";

                                inputUsername.setAttribute("disabled", "");
                                inputUsername.style.border = ""
                                inputUsername.style.height = "";
                                inputUsername.style.transition = "0.4s";

                                inputPassword.setAttribute("disabled", "");  
                                inputPassword.style.border = "" 
                                inputPassword.style.height = "";
                                inputPassword.style.transition = "0.4s";

                                // Encrypt the password using AES-256-GCM
                                const lock = "11111111111111111111111111111111"
                                const salt = CryptoJS.lib.WordArray.random(128/8).toString();
                                const derivedKey = CryptoJS.PBKDF2(lock, salt, { keySize: 256/8, iterations: 1000 }).toString(CryptoJS.enc.Hex);
                                const encryptionKey = CryptoJS.PBKDF2(lock, salt, { keySize: 256/8, iterations: 1000 }).toString();
                                const iv = CryptoJS.lib.WordArray.random(128/8).toString();
                                const encPassword = CryptoJS.AES.encrypt(inputPassword.value, encryptionKey, { iv: iv }).toString();

                                console.log("Update Button clicked"); 
                                const userInputRef = doc(db, "users", user.uid, "websites", inputWebsite.value)
                                updateDoc(userInputRef, {
                                    //site : inputWebsite.value,
                                    username : inputUsername.value,
                                    password : encPassword,
                                    description : inputDescription.value,
                                    iv : iv,
                                    salt : salt 
                                })
                                let updated = document.getElementById("updated-message");
                                setTimeout(showError, 5);
                                setTimeout(closeError,1000);
                                    function showError(){
                                        updated.classList.add("active")
                                    }
                                    function closeError(){
                                        updated.classList.remove("active")
                                    }
                        });
                }    

                    //REDIRECTING TO WEBSITE and auto fill login form
                    let inputs = document.querySelectorAll('.datainputWebsite');
                for(let i=0; i < inputs.length; i++){
                    let websiteInputs = inputs[i];
                    websiteInputs.addEventListener("click", function(){
                        const tr = websiteInputs.parentNode.parentNode
                        const usernameAutofill = tr.children[3].children[0].children[0].children[0].value
                        const passwordAutofill = tr.children[4].children[0].children[0].children[0].value
                        var search =  "https://www." + websiteInputs.value + ".com"
                        window.open(search)
                        autoFillLoginForm(search, usernameAutofill, passwordAutofill);
                    });
                }
                
                 // AUTOFILL FUNCTION //
                 /*
                async function autoFillLoginForm(search, usernameAutofill, passwordAutofill) {
                    const browser = await puppeteer.launch({ headless: false }); 
                    const page = await browser.newPage();
                    await page.goto(search); 
                    await page.waitForSelector('#username'); 
                    await page.type('#username', usernameAutofill); 
                    await page.type('#password', passwordAutofill); 
                    await page.click('#submit_button'); 
                    await page.waitForNavigation(); 
                    await browser.close();
                }
                */

                //STRENGTH CHECKER
                function Strength(password) {
                    let hasLower = /[a-z]/.test(password);
                    let hasUpper = /[A-Z]/.test(password);
                    let hasNumber = /[0-9]/.test(password);
                    let hasSpecial = /[!@#\$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
                    let length = password.length;
                
                    if (length >= 12 && hasLower && hasUpper && hasNumber && hasSpecial) {
                        return "very-strong";
                    } else if (length >= 8 && hasLower && hasUpper && hasNumber && hasSpecial) {
                        return "strong";
                    } else if (length >= 8 && (hasLower || hasUpper) && (hasNumber || hasSpecial)) {
                        return "medium";
                    } else if (length >= 6 && (hasLower || hasUpper || hasNumber || hasSpecial)) {
                        return "weak";
                    } else {
                        return "very-weak";
                    }
                }
                
                let cellContentPass = document.querySelectorAll('.meter-container');
                let inputElements = document.querySelectorAll(".datainput.passinput");
                for(let i=0; i < cellContentPass.length; i++){
                    let cellContent = cellContentPass[i];
                    let passW = inputElements[i].value;
                    let strength = Strength(passW);
                    let strengthPercentage = document.createElement('span');
                    strengthPercentage.classList.add('strength-percentage');
                    cellContent.appendChild(strengthPercentage);
                    if (strength === 'very-weak') {
                        cellContent.classList.add("very-weak");
                        strengthPercentage.textContent = '10%';
                    } else if (strength === 'weak') {
                        cellContent.classList.add("weak");
                        strengthPercentage.textContent = '25%';
                    } else if (strength === 'medium') {
                        cellContent.classList.add("medium");
                        strengthPercentage.textContent = '50%';
                    } else if (strength === 'strong') {
                        cellContent.classList.add("strong");
                        strengthPercentage.textContent = '75%';
                    } else {
                        cellContent.classList.add("very-strong");
                        strengthPercentage.textContent = '100%';
                    }
                }

 




                
            });    
        }
//----------------------------GET ALL DATA FROM DATABASE-----------------------------------------------//

//----------------------------SHOW DATA TO TABLE-----------------------------------------------//
        var accNo = 0;
        var tbody = document.getElementById("table-content");
        function AddItemToTable(site, username, decryptedPassword, description){
            var trow = document.createElement("tr");
            var td1 = document.createElement("td");
            var td2 = document.createElement("td");
            var td3 = document.createElement("td");
            var td4 = document.createElement("td");
            var td5 = document.createElement("td");
            var td6 = document.createElement("td");
            var td7 = document.createElement("td");
            var td8 = document.createElement("td");
            td1.innerHTML = ++accNo + ".";
            td2.innerHTML = `<input class="datainputWebsite" type="text" value="${site}" readonly>
            </input>`
            td3.innerHTML = `<input class="datainput description" type="text" value="${description}" disabled>
            </input>`
            //-------------------------------------------------------
            var cellContent = document.createElement("div");
            cellContent.innerHTML = `<div class="cell-content">
                                    <input class="datainput userinput" type="text" value="${username}" disabled>
                                    </input>
                                    <div class="action-options">
                                        <button id="copyuserB">
                                            <span class="material-symbols-outlined copy">
                                                content_copy
                                            </span>
                                        </button>
                                    </div>
                                </div>`
            td4.appendChild(cellContent);
            //-------------------------------------------------------- 
            var cellContent = document.createElement("div");
            cellContent.innerHTML = `<div class="cell-content password">
                                        <input class="datainput passinput" id="password" type="password" value="${decryptedPassword}" disabled>
                                        </input>
                                        <div class="action-options"> 
                                            <button id="hidePass">
                                                <span class="material-symbols-outlined visibility">
                                                    visibility
                                                </span>
                                            </button>
                                            <button id="showPass">
                                                <span class="material-symbols-outlined visibilityOff">
                                                    visibility_off
                                                </span>
                                            </button>
                                            <button id="copypassB">
                                                <span class="material-symbols-outlined copy">
                                                    content_copy
                                                </span>
                                            </button>
                                        </div> 
                                    </div>` 
            td5.appendChild(cellContent);
            //-------------------------------------------------------- 
            var strengthChecker = document.createElement("div");
            strengthChecker.setAttribute("class", "meter-container");
            strengthChecker.innerHTML = `<div class="strengthmeter"></div>`;
            td6.appendChild(strengthChecker);
            //--------------------------------------------------------
            var spanButton = document.createElement("span");
            spanButton.innerHTML = `<button id="deleteButton">
                                        <span class="material-symbols-outlined">
                                        delete
                                        </span>
                                        <span class="deleteLabel"> 
                                            DELETE 
                                        </span>
                                    </button>`

            spanButton.innerHTML += `<button id="editButton">
                                        <span class="material-symbols-outlined">
                                            edit
                                        </span>
                                        <span class="editLabel"> 
                                            EDIT 
                                        </span> 
                                    </button>`

            spanButton.innerHTML += `<button id="updateButton" type="submit">
                                        <span class="material-symbols-outlined">
                                        done_outline
                                        </span>
                                        <span class="updateLabel"> 
                                            UPDATE 
                                        </span>
                                    </button>`                                    
            spanButton.classList.add("DeleteEditButton");
            td7.appendChild(spanButton);
            //-------------------------------------------------------
            td8.innerHTML = `<div class="changePassCountDown" id="changePassCountDown">
                            </div>
                            <span class="material-symbols-outlined timer">
                            info
                            </span>
                            `
            //-------------------------------------------------------
            trow.appendChild(td1);
            trow.appendChild(td2);
            trow.appendChild(td3);
            trow.appendChild(td4);
            trow.appendChild(td5);
            trow.appendChild(td6);
            trow.appendChild(td7);
            trow.appendChild(td8);
            td1.setAttribute("class", "table-number");
            td6.setAttribute("class", "strengthCell");
            tbody.appendChild(trow);
        }
        function AddAllItemsToTheTable(UserDocsList) {
            accNo = 0;
            tbody.innerHTML = "";
            UserDocsList.forEach(element => {
                const lock = "11111111111111111111111111111111"
                const decryptionKey = CryptoJS.PBKDF2(lock, element.salt, { keySize: 256/8, iterations: 1000 }).toString();
                let decryptedData = CryptoJS.AES.decrypt(element.password, decryptionKey, { iv: element.iv });
                let decryptedPassword = decryptedData.toString(CryptoJS.enc.Utf8);
                if (decryptedPassword) {
                    AddItemToTable(element.site, element.username, decryptedPassword, element.description);
                } else {
                    console.log("Decryption failed for password manager. Please check the salt and iv.");
                }
            });
        }
      
//----------------------------SHOW DATA TO TABLE-----------------------------------------------//

