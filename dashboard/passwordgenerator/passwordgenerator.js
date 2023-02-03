const resultEl = document.getElementById('result');
const lengthEl = document.getElementById('length');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateEl = document.getElementById('generate');
const clipboard = document.getElementById('clipboard');
const hideEye = document.getElementById("hideEye");
const showEye = document.getElementById("passgen-show");

const randomFunc = {
	lower: getRandomLower,
	upper: getRandomUpper,
	number: getRandomNumber,
	symbol: getRandomSymbol
}

hideEye.addEventListener("click", () =>{
	if (resultEl.type === "password") {
		resultEl.setAttribute("type", "text");
		hideEye.style.color = " #E93333";
		console.log("Show password button clicked")
	} else {
		resultEl.setAttribute("type", "password");
		hideEye.style.color = "#27D327"
		console.log("Hide password button clicked")
	}
})

clipboard.addEventListener('click', () => {
	const textarea = document.createElement('textarea');
	const password = resultEl.value;
	if(!password) { return; }
	navigator.clipboard.writeText(password).then(function() {
		let copied = document.getElementById("copiedPassGen-message");
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


generate.addEventListener('click', () => {
	const length = +lengthEl.value;
	const hasLower = lowercaseEl.checked;
	const hasUpper = uppercaseEl.checked;
	const hasNumber = numbersEl.checked;
	const hasSymbol = symbolsEl.checked;
	resultEl.setAttribute("type", "password");
	resultEl.value = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
	
});

function generatePassword(lower, upper, number, symbol, length) {
	let generatedPassword = '';
	const typesCount = lower + upper + number + symbol;
	const typesArr = [{lower}, {upper}, {number}, {symbol}].filter(item => Object.values(item)[0]);
	
	// Doesn't have a selected type
	if(typesCount === 0) {
		return '';
	}
	
	// create a loop
	for(let i=0; i<length; i+=typesCount) {
		typesArr.forEach(type => {
			const funcName = Object.keys(type)[0];
			generatedPassword += randomFunc[funcName]();
		});
	}
	
	const finalPassword = generatedPassword.slice(0, length);
	
	return finalPassword;
}

function getRandomLower() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
	return +String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function getRandomSymbol() {
	const symbols = '!@#$%^&*(){}[]=<>/,.'
	return symbols[Math.floor(Math.random() * symbols.length)];
}






