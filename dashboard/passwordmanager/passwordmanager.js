//Pop-up Box
const addPass = document.querySelector(".addPass"),
popUp = document.querySelector(".popup-box-add"),
closeBtn = popUp.querySelector(".form-header i");
siteInput = popUp.querySelector("#site");
usernameInput = popUp.querySelector("#username");
passwordInput = popUp.querySelector("#addPasswordForm");
//Add new password pop-up
addPass.addEventListener('click', ()=> {
popUp.classList.add("show");
document.querySelector("body").style.overflow = "hidden";
});
//Close pop up form
closeBtn.addEventListener('click', ()=> {
popUp.classList.remove("show");
document.querySelector("body").style.overflow = "auto";
siteInput.value = usernameInput.value = passwordInput.value = "";
})


        
















/*
window.addEventListener('load', initialize)
function initialize(){
    document.getElementById('formSubmit').addEventListener('submit', onsubmitdo) // click submit button
   
    function onsubmitdo(e){ // submit function
        e.preventDefault();
        
        //Form Error message for blank fields
        //get user input value
        let a = document.forms["Form"]["answer_a"].value;
        let b = document.forms["Form"]["answer_b"].value;
        let c = document.forms["Form"]["answer_c"].value;
    if(a == null || a == "", b == null || b == "", c == null || c == "")  {
        let error = document.getElementById("error-message");
        setTimeout(showError, 5);
        setTimeout(closeError,5000);
        function showError(){
            error.classList.add("active")
        }
        function closeError(){
            error.classList.remove("active")
        }

        //if no error proceed below
    } else{
        //get user input value
        var site = document.getElementById('site').value;
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;

        var allvaluesinarray = [];
        let error = document.getElementById("error-message");
        error.classList.remove("active");
        keeper = {
            keepsite: site,
            keepusername: username,
            keeppassword: password
        }
        if(localStorage.getItem('hold')== null) {
            allvaluesinarray.push(keeper);
            JSON.stringify(allvaluesinarray)
            localStorage.setItem('hold', JSON.stringify(allvaluesinarray))
        }else{
            allstoredvaluesinArrayForm = JSON.parse(localStorage.getItem('hold'));
            allstoredvaluesinArrayForm.push(keeper);
            localStorage.setItem('hold', JSON.stringify(allstoredvaluesinArrayForm))
        }

        document.getElementById('site').value = '';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        FetchAllValuesDisplayTable();
        closeBtn();
        }
    }
}
/*
function FetchAllValuesDisplayTable() {
        let arrayFormatted = [];
        let output = '';
        let tableNum = 0;
        arrayFormatted = JSON.parse(window.localStorage.getItem('hold'));
        for(var i=0; i<arrayFormatted.length; i++) {
            tableNum += 1;
            output += `
            <tr>
            <td>`+tableNum+`. `+ arrayFormatted[i].keepsite.link() +`</td>
            <td>
            <div class="cell-content">
                <input class="datainput" type="text" value="`+ arrayFormatted[i].keepusername +`" disabled>
                </input>
                <div class="action-options">
                    <button id="copyuserB">
                        <span class="material-symbols-outlined">
                            content_copy
                        </span>
                    </button>
                </div>
            </div>
            </td>
            <td>
                <div class="cell-content">
                    <input class="datainput" id="password" type="password" value="`+ arrayFormatted[i].keeppassword +`" disabled>
                    </input>
                    <div class="action-options"> 
                        <button id="showPass">   
                            <span class="material-symbols-outlined" >
                                visibility
                            </span> 
                        </button>
                        <button id="hidePass">
                            <span class="material-symbols-outlined">
                                visibility_off
                            </span>
                        </button>
                        <button id="copypassB">
                            <span class="material-symbols-outlined">
                                content_copy
                            </span>
                        </button>
                    </div> 
                    
                </div>  
            </td>
            <td>---------- </td>
            <td><span class="material-symbols-outlined">
                delete
                </span></td>
        </tr>            
            ` 
        }
        document.getElementById("table-content").innerHTML = output;
}

//SHOW/HIDE/
const password = document.getElementById("password").value;

let hideBtn = document.querySelector("hide");
let hideText = document.createTextNode("_off");

document.getElementById("showPass").addEventListener('click', ()=> {
    if (password.type === "password") {
        password.setAttribute("type", "text");
        showBtn.appendChild(hideText);
        console.log("hi")
    } else {
        password.setAttribute('type', "password");
    }
});
//CopyToClipBoard//
const copyPassButton = document.querySelector("#copypassB");
const passData = document.getElementById("copyPass").value;

copyPassButton.addEventListener("click", () =>{
    passData.exectCommand("Copy");
});
*/
