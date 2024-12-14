let display = document.getElementById('display');
let isOperator = /[+\-*/]/;
let lastInput = '';
let calculationDone = false; // Flag to track if the last operation resulted in a calculation

function clearDisplay() {
  display.textContent = '0';
  lastInput = '';
  calculationDone = false; // Reset the flag
}

function deleteLast() {
  display.textContent = display.textContent.slice(0, -1) || '0';
  lastInput = display.textContent.slice(-1);
}

function appendNumber(number) {
  if (calculationDone) {
    // If a calculation was just done, replace the display with the new number
    display.textContent = number;
    calculationDone = false;
  } else if (display.textContent === '0') {
    display.textContent = number;
  } else {
    display.textContent += number;
  }
  lastInput = number;
}

function appendOperator(operator) {
  if (calculationDone) {
    // Allow appending an operator after a calculation
    calculationDone = false;
  }
  if (display.textContent === '0' && operator !== '-') return;
  if (isOperator.test(lastInput)) {
    display.textContent = display.textContent.slice(0, -1) + operator;
  } else {
    display.textContent += operator;
  }
  lastInput = operator;
}

function appendDecimal() {
  const currentNumber = display.textContent.split(/[-+*/]/).pop();
  if (!currentNumber.includes('.')) {
    display.textContent += '.';
    lastInput = '.';
  }
}

function calculate() {
  try {
    if (isOperator.test(lastInput)) throw new Error('Invalid Expression');
    let result = eval(display.textContent.replace('×', '*').replace('÷', '/'));
    
    // Check for infinity or very large numbers and limit decimal places
    if (result === Infinity || result === -Infinity) {
      display.textContent = 'Error'; // Handle infinity as an error
    } else {
      // Limit the result to 4 decimal places
      result = result.toFixed(4);
      display.textContent = result;
    }
    
    lastInput = display.textContent;
    calculationDone = true; // Set the flag after a calculation
  } catch (e) {
    display.textContent = 'Error';
    calculationDone = false; // Reset the flag on error
  }
}

// Add keyboard support
document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (!isNaN(key)) {
    appendNumber(key); // If a number key is pressed
  } else if ('+-*/'.includes(key)) {
    appendOperator(key); // If an operator key is pressed
  } else if (key === 'Enter' || key === '=') {
    calculate(); // Calculate on Enter or "=" key
  } else if (key === 'Backspace') {
    deleteLast(); // Delete last character
  } else if (key === 'Escape' || key === 'c') {
    clearDisplay(); // Clear display on Esc or "c"
  } else if (key === '.') {
    appendDecimal(); // Add decimal
  }

  // Highlight the corresponding button
  const button = Array.from(document.querySelectorAll('button')).find(
    (btn) => btn.textContent === key || (key === 'Enter' && btn.textContent === '=') || (key === 'Backspace' && btn.textContent === 'DEL')
  );

  if (button) {
    button.classList.add('active');
    setTimeout(() => button.classList.remove('active'), 100); // Remove highlight after 100ms
  }
});
