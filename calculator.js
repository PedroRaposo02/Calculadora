const ipc = require('electron').ipcRenderer;

const display = document.getElementById('displayNumbers');
const buttons = document.querySelectorAll('.key');
const operation = document.getElementById('operation');

let currentNumber = 0;
let currentOperation = undefined;
let bufferNumber = 0;
let equalsPressed = false;

buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
        const target = event.target;
        let value = target.innerText;
        if (target.id == 'clear') {
            currentOperation = undefined;
            currentNumber = 0;
            bufferNumber = 0;
            operation.innerHTML = '';
            display.innerText = 0;
        }
        else if (!isNaN(value)) {
            const number = parseInt(value, 10);
            if (currentNumber == 0 || equalsPressed) {
                display.innerText = number;
                currentNumber = number;
                equalsPressed = false;
            }
            else {
                display.innerText += number;
                currentNumber = parseInt(display.innerText, 10);
            }
        }
        else if (value == '.') {
            if (!display.innerText.includes('.')) {
                display.innerText = display.innerText + '.';
                currentNumber = parseFloat(display.innerText, 10);
            }
        }
        else if (value == '+') {
            if (currentOperation != undefined) {
                operation.innerHTML = '+';
                currentOperation = '+';
                return;
            }
            if (bufferNumber != 0) {
                equals();
            }
            operation.innerHTML = '+';
            currentOperation = '+';
            bufferNumber = currentNumber;
            currentNumber = 0;
        }
        else if (value == '-') {
            if (currentOperation != undefined) {
                currentOperation = '-';
            }
            if (bufferNumber != 0) {
                equals();
            }
            operation.innerHTML = '-';
            currentOperation = '-';
            bufferNumber = currentNumber;
            currentNumber = 0;
        }
        else if (value == 'x') {
            if (currentOperation != undefined) {
                currentOperation = '*';
            }
            if (bufferNumber != 0) {
                equals();
            }
            operation.innerHTML = 'x';
            currentOperation = '*';
            bufferNumber = currentNumber;
            currentNumber = 0;
        }
        else if (value == '÷') {
            if (currentOperation != undefined) {
                currentOperation = '/';
            }
            if (bufferNumber == 0) {
                display.innerText = 'Error';
            }
            if (currentNumber != 0) {
                equals();
            }
            operation.innerHTML = '÷';
            currentOperation = '/';
            bufferNumber = currentNumber;
            currentNumber = 0;
        }

        else if (value == '=') {
            equals();
        }
        else if (value == '+/-') {
            // change signal
            if (currentNumber > 0) {
                display.innerText = '-' + display.innerText;
                currentNumber = -currentNumber;
            }
            else if (currentNumber < 0) {
                display.innerText = display.innerText.slice(1);
                currentNumber = -currentNumber;
            }
        }

        console.log("Buffer, operation and current: ", bufferNumber, currentOperation, currentNumber);
    });
});

function equals() {
    equalsPressed = true;
    if (currentOperation == '+') {
        bufferNumber += currentNumber;
    }
    else if (currentOperation == '-') {
        bufferNumber -= currentNumber;
    }
    else if (currentOperation == '*') {
        bufferNumber *= currentNumber;
    }
    else if (currentOperation == '/') {
        bufferNumber /= currentNumber;
    }
    else if (currentOperation == undefined) {
        return;
    }
    display.innerText = bufferNumber;
    operation.innerHTML = '';
    currentOperation = undefined;
    currentNumber = bufferNumber;
    bufferNumber = 0;
    equalsPressed = true;
}

//  buttons code

const redButton = document.getElementById('redDot');
const yellowButton = document.getElementById('yellowDot');
const greenButton = document.getElementById('greenDot');

redButton.addEventListener('click', (e) => {
    //close electron app
    e.preventDefault();
    ipc.send('close-app');
});

yellowButton.addEventListener('click', (e) => {
    //minimize electron app
    e.preventDefault();
    ipc.send('maximize-app');
});

greenButton.addEventListener('click', (e) => {
    //maximize electron app
    e.preventDefault();
    ipc.send('minimize-app');
});

