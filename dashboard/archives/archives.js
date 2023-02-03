//---------------------------- INITIALIZE FIREBASE ----------------------------------------//  
        // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
        import { getDatabase } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
        import { getAuth, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
        import { getFirestore, collection, collectionGroup ,getDocs, onSnapshot, doc, setDoc, addDoc, getDoc, query, where,deleteDoc, updateDoc} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";


        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyDxtV95lDmfhOPLkHN1C_NiJp_qBDPBHYk",
            authDomain: "samsanpasspasswordmanager.firebaseapp.com",
            projectId: "samsanpasspasswordmanager",
            storageBucket: "samsanpasspasswordmanager.appspot.com",
            messagingSenderId: "142889552932",
            appId: "1:142889552932:web:6c513f22306b5e83489cb1"
          };

        // Initialize Firebase (connect to firebase features)
        const app = initializeApp(firebaseConfig);
        const db = getFirestore();
        const auth = getAuth();
        const database = getDatabase();
//---------------------------- INITIALIZE FIREBASE ----------------------------------------//  
//---------------------------------------------------------------------------------------------//

    // GET USER'S DATA FROM DATABASE
    export async function GetAllDataOnceForArchive(){
        const user = auth.currentUser; 
        const q = query(collection(db, "users", user.uid, "archives"));
        const querySnapshot = await getDocs(q);
        var archiveData = [];
        querySnapshot.forEach((doc) => {
            archiveData.push(doc.data());
        });
        AddAllArchivedToTheTable(archiveData);
    }

    // GET USER'S DATA FROM DATABASE VIA SNAPSHOT FOR REALTIME CHANGES
    export async function GetAllDataRealtimeForArchive(){
        const user = auth.currentUser; 
        const qForArchive = query(collection(db, "users", user.uid, "archives"));
        const unsubscribeforArchive = onSnapshot(qForArchive,(querySnapshot) => {
        var archiveData = [];
            querySnapshot.forEach((doc)=>{
                archiveData.push(doc.data());
            });      
            AddAllArchivedToTheTable(archiveData);

            //deletebutton for archive
            const getDeleteButtonForArchive = document.querySelectorAll("#deleteButtonForArchive")
            for(let i = 0; i < getDeleteButtonForArchive.length; i++) {
                const deleteButtonForArchive = getDeleteButtonForArchive[i];
                deleteButtonForArchive.addEventListener('click', e => {
                    const user = auth.currentUser;
                    let websiteNameInArchives = e.target.parentNode.parentNode.parentNode.parentNode.children[1].innerHTML;
                    deleteDoc(doc(db, "users", user.uid, "archives", websiteNameInArchives))
                    let deletedArchive = document.getElementById("deletedArchive-message");
                                setTimeout(showError, 5);
                                setTimeout(closeError,1000);
                                function showError(){
                                    deletedArchive.classList.add("active")
                                }
                                function closeError(){
                                    deletedArchive.classList.remove("active")
                                }
                })
            }       
    
            const getRecoverButtonForArchive = document.querySelectorAll("#recoverButtonForArchive");
            for(let i = 0; i < getRecoverButtonForArchive.length; i++) {
                const recoverButtonForArchive = getRecoverButtonForArchive[i];
                recoverButtonForArchive.addEventListener('click', e => {
                    const archivedWebsite = e.target.parentNode.parentNode.parentNode.parentNode.children[1].innerText;
                    const archivedDescription = e.target.parentNode.parentNode.parentNode.parentNode.children[2].innerText;
                    const archivedUserId = e.target.parentNode.parentNode.parentNode.parentNode.children[3].innerText;
                    const archivedPassword = e.target.parentNode.parentNode.parentNode.parentNode.children[4].children[0].children[0].children[0].value;
                    
                    const lock = "11111111111111111111111111111111"
                    const salt = CryptoJS.lib.WordArray.random(128/8).toString();
                    const derivedKey = CryptoJS.PBKDF2(lock, salt, { keySize: 256/8, iterations: 1000 }).toString(CryptoJS.enc.Hex);
                    const encryptionKey = CryptoJS.PBKDF2(lock, salt, { keySize: 256/8, iterations: 1000 }).toString();
                    const iv = CryptoJS.lib.WordArray.random(128/8).toString();
                    const encPassword = CryptoJS.AES.encrypt(archivedPassword, encryptionKey, { iv: iv }).toString();
                    
                    const recoverData = {
                        site : archivedWebsite,                   
                        username : archivedUserId,
                        password : encPassword, 
                        description : archivedDescription,
                        iv : iv,
                        salt : salt 
                    }
                    
                    //sends data to the database
                    setDoc(doc(db, "users", user.uid, "websites", recoverData.site), recoverData)
                    .then(() => {
                        deleteDoc(doc(db, "users", user.uid, "archives", recoverData.site))
                            let recovered = document.getElementById("recovered-message");
                                setTimeout(showError, 5);
                                setTimeout(closeError,1000);
                                function showError(){
                                    recovered.classList.add("active")
                                }
                                function closeError(){
                                    recovered.classList.remove("active")
                                }
                            
                    });
                });
            }

                 //INCREMENT PASSWORD ID FOR UNIQUE ELEMENT IDS
                 const elementsForArchive = document.querySelectorAll("#passwordForArchive");
                 for (let i = 0; i < elementsForArchive.length; i++) {
                    elementsForArchive[i].id = `passwordForArchive${i + 1}`;
                     };
          

            const showPassForArchive= document.querySelectorAll("#hidePassForArchive");
            const hidePassForArchive= document.querySelectorAll("#showPassForArchive");
            for(let i=0; i < hidePassForArchive.length; i++) {
                const togglesForArchive = hidePassForArchive[i];
                const togglesBForArchive = showPassForArchive[i]
                togglesForArchive.addEventListener("click", () =>{
                    if (elementsForArchive[i].type === "password") {
                        elementsForArchive[i].setAttribute("type", "text");
                        togglesForArchive.style.opacity = "1";
                        togglesBForArchive.style.opacity = "0"
                        console.log("Show password button clicked")
                    } else {
                        elementsForArchive[i].setAttribute("type", "password");
                        togglesForArchive.style.opacity = "0";
                        togglesBForArchive.style.opacity = "1"
                        console.log("Hide password button clicked")
                    }
                })
            }



        })
    }


//----------------------------SHOW DATA TO TABLE-----------------------------------------------//
var arcNo = 0;
var tbody = document.getElementById("archivesTable");
export function AddArchivedToTable(site, username, decryptedPassword, description, DateDeleted){
    var trow = document.createElement("tr");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");
    var td4 = document.createElement("td");
    var td5 = document.createElement("td");
    var td6 = document.createElement("td");
    var td7 = document.createElement("td");

    td1.innerHTML = ++arcNo + ".";
    td2.innerHTML = site
    td3.innerHTML = description
    td4.innerHTML = username
    var passwordtext = document.createElement("div");
    passwordtext.innerHTML = `<div class="passwordCellContainer">
                                    <input class="passInputFieldArchive" id="passwordForArchive" type="password" value="${decryptedPassword}" disabled></input>
                                        <div> 
                                        <div class="showHideContainer">
                                                <button id="hidePassForArchive">
                                                    <span class="material-symbols-outlined visibilityForArchive">
                                                        visibility
                                                    </span>
                                                </button>
                                                <button id="showPassForArchive">
                                                    <span class="material-symbols-outlined visibilityOffForArchive">
                                                        visibility_off
                                                    </span>
                                                </button>
                                            </div> 
                                        </div> 
                                </div>` 
    td5.appendChild(passwordtext);

    td6.innerHTML = DateDeleted
                
    var actionButtons = document.createElement("span");
    actionButtons.innerHTML = `<button id="deleteButtonForArchive">
                                <span class="material-symbols-outlined">
                                delete
                                </span>
                                <span class="deleteForArchive"> 
                                    Delete 
                                </span>
                            </button>`

    actionButtons.innerHTML += `<button id="recoverButtonForArchive">
                                <span class="material-symbols-outlined">
                                note_add
                                </span>
                                <span class="recoverForArchive"> 
                                    Recover 
                                </span> 
                            </button>`

                                    
    actionButtons.classList.add("DeleteRecoverButton");
    td7.appendChild(actionButtons);



    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);
    trow.appendChild(td6);
    trow.appendChild(td7);

    tbody.appendChild(trow);
}

function AddAllArchivedToTheTable(UserDocsList) {
    arcNo = 0;
    tbody.innerHTML = "";
    UserDocsList.forEach(element => {
        const lock = "11111111111111111111111111111111"
        const decryptionKey = CryptoJS.PBKDF2(lock, element.salt, { keySize: 256/8, iterations: 1000 }).toString();
        let decryptedData = CryptoJS.AES.decrypt(element.password, decryptionKey, { iv: element.iv });
        let decryptedPassword = decryptedData.toString(CryptoJS.enc.Utf8);
        if (decryptedPassword) {
            AddArchivedToTable(element.site, element.username, decryptedPassword, element.description, element.DateDeleted);
        } else {
            console.log("Decryption failed for recovering. Please check the salt and iv.");
        }
    });
}