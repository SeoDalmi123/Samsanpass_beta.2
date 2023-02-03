const container = document.querySelector(".container"),
pwShowHide = document.querySelectorAll(".showHidePw"),
pwFields = document.querySelectorAll(".password"),
signUp = document.querySelector(".signup-link"),
login = document.querySelector(".login-link");

//   js code to show/hide password and change icon
pwShowHide.forEach(eyeIcon =>{
  eyeIcon.addEventListener("click", ()=>{
      pwFields.forEach(pwField =>{
          if(pwField.type ==="password"){
              pwField.type = "text";

              pwShowHide.forEach(icon =>{
                  icon.classList.replace("uil-eye-slash", "uil-eye");
              })
          }else{
              pwField.type = "password";

              pwShowHide.forEach(icon =>{
                  icon.classList.replace("uil-eye", "uil-eye-slash");
              })
          }
      }) 
  })
})

// js code to appear signup and login form
signUp.addEventListener("click", ( )=>{
  container.classList.add("active");
});
login.addEventListener("click", ( )=>{
  container.classList.remove("active");
});

// REMEMBER ME FUNCTION

window.onload = function() {
    var email = localStorage.getItem("email");
    var rememberMe = localStorage.getItem("rememberMe");
    var salt = localStorage.getItem("salt");
    var iv = localStorage.getItem("iv");
    const lock = "11111111111111111111111111111111"
    const decryptionKey = CryptoJS.PBKDF2(lock, salt, { keySize: 256/8, iterations: 1000 }).toString();
    let decryptedDataforEmail = CryptoJS.AES.decrypt(email, decryptionKey, { iv:iv });
    let decryptedEmail = decryptedDataforEmail.toString(CryptoJS.enc.Utf8)
    if(email) {
        document.getElementById("log-email").value = decryptedEmail;
    }
    if(rememberMe == "checked"){
      document.getElementById("logCheck").checked = true;
    }
  };