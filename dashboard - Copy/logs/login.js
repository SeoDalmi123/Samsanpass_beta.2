//---------------------------- INITIALIZE FIREBASE ----------------------------------------//  
        // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
        import { getDatabase } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
        import { getAuth, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
        import { getFirestore, collection, collectionGroup ,getDocs, onSnapshot, doc, setDoc, addDoc, getDoc, query, where,deleteDoc, updateDoc} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";


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

//---------------------------- LOGIN ----------------------------------------//  
    // GET USER'S DATA FROM DATABASE
    export async function GetAllDataOnceForLogs(){
        const user = auth.currentUser; 
        const q = query(collection(db, "users", user.uid, "userLogins"));
        const querySnapshot = await getDocs(q);
        var logsData = [];
        querySnapshot.forEach((doc) => {
            logsData.push(doc.data());
        });
        AddAllLogsToTheTable(logsData);
    }

    // GET USER'S DATA FROM DATABASE VIA SNAPSHOT FOR REALTIME CHANGES
    export async function GetAllDataRealtimeForLogs(){
        const user = auth.currentUser; 
        const q = query(collection(db, "users", user.uid, "userLogins"));
        const unsubscribe = onSnapshot(q,(querySnapshot) => {
        var logsData = [];
            querySnapshot.forEach((doc)=>{
                logsData.push(doc.data());
            });      
            AddAllLogsToTheTable(logsData);

            //clear logs button
            const getClearButton = document.getElementById("clearAll");
            getClearButton.addEventListener("click", () => {
                
                const user = auth.currentUser;
                const table = document.getElementById("logsTable").children;
                for(let i =0; i < table.length; i++) {
                const tableElement = table[i];
                const timeRecord = tableElement.children[2].innerHTML;
                deleteDoc(doc(db, "users", user.uid, "userLogins", timeRecord))
                }
            });
        })
    }
//----------------------------SHOW DATA TO TABLE-----------------------------------------------//
var logNo = 0;
var tbody = document.getElementById("logsTable");
function AddloggedToTable(date, locationName, time){
    var trow = document.createElement("tr");
  
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");
    var td4 = document.createElement("td");
    td1.innerHTML = ++logNo + ".";
    td2.innerHTML = date
    td3.innerHTML = time
    td4.innerHTML = locationName
    trow.setAttribute("class", "loginRow");
    td1.setAttribute("class", "loginNumber");
    td2.setAttribute("class", "loginDate");
    td3.setAttribute("class", "loginTime");
    td4.setAttribute("class", "loginLocation");
    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    tbody.appendChild(trow);
}
function AddAllLogsToTheTable(loglist){
    logNo= 0;
    tbody.innerHTML = "";
    loglist.forEach(loguser => {
        AddloggedToTable(loguser.date, loguser.locationName, loguser.time)
    })
}
//---------------------------- LOGIN ----------------------------------------//  

