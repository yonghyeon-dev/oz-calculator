const operators = ["+", "-", "*", "/"];
let history = [];
let currentInput = "";
let firstNumber = null;
let operator = null;
let resultDisplayed = false;

// 숫자 입력 (소수 포함)
const appendNumber = (number) => {
  try {
    if (!/^[0-9.]$/.test(number)) throw new Error("유효한 숫자를 입력하세요.");
    if (number === "." && currentInput.includes("."))
      throw new Error("소수점은 한 번만 입력할 수 있습니다.");
    if (resultDisplayed) {
      currentInput = "";
      resultDisplayed = false;
    }

    currentInput += number;

    // 소수점 2자리 제한
    if (currentInput.includes(".")) {
      const [int, dec] = currentInput.split(".");
      if (dec.length > 2) {
        currentInput = int + "." + dec.slice(0, 2);
      }
    }

    updateDisplay(currentInput);
  } catch (error) {
    showError(error.message);
  }
};

// 연산자 클릭 시
const setOperator = (op) => {
  try {
    if (!operators.includes(op)) throw new Error("유효한 연산자를 선택하세요.");
    if (!currentInput) throw new Error("숫자를 먼저 입력하세요.");

    const temp = Number(currentInput);
    if (isNaN(temp)) throw new Error("유효한 숫자를 입력하세요.");

    // 연속 계산 처리
    if (firstNumber !== null && operator !== null) {
      calculate();
    }

    firstNumber = Number(currentInput);
    operator = op;
    currentInput = "";
    updateDisplay("0");
  } catch (error) {
    showError(error.message);
  }
};

// = 버튼 또는 연산 실행
const calculate = () => {
  const resultElement = document.getElementById("result");
  try {
    if (firstNumber === null || operator === null || !currentInput) {
      throw new Error("계산에 필요한 값이 부족합니다.");
    }

    const secondNumber = Number(currentInput);
    if (isNaN(secondNumber)) throw new Error("유효한 숫자를 입력하세요.");
    if (operator === "/" && secondNumber === 0)
      throw new Error("0으로 나눌 수 없습니다.");

    var result; // var 사용
    switch (operator) {
      case "+":
        result = firstNumber + secondNumber;
        break;
      case "-":
        result = firstNumber - secondNumber;
        break;
      case "*":
        result = firstNumber * secondNumber;
        break;
      case "/":
        result = firstNumber / secondNumber;
        break;
      default:
        throw new Error("알 수 없는 연산자입니다.");
    }

    result = Number(result.toFixed(2)); // 소수점 제한

    resultElement.classList.remove("d-none", "alert-danger");
    resultElement.classList.add("alert-info");
    resultElement.textContent = `결과: ${result}`;

    // 기록 저장
    const record = { firstNumber, operator, secondNumber, result };
    history.push(record);
    console.log("계산 기록:", JSON.stringify(history, null, 2));
    renderHistory();

    // 상태 업데이트
    currentInput = result.toString();
    firstNumber = result;
    operator = null;
    resultDisplayed = true;
    updateDisplay(currentInput);
  } catch (error) {
    showError(error.message);
  }
};

// 디스플레이 표시
const updateDisplay = (value) => {
  const display = document.getElementById("display");
  if (!display) throw new Error("디스플레이 요소를 찾을 수 없습니다.");
  display.textContent = value;
};

// 에러 출력
const showError = (message) => {
  const resultElement = document.getElementById("result");
  resultElement.classList.remove("d-none", "alert-info");
  resultElement.classList.add("alert-danger");
  resultElement.textContent = `에러: ${message}`;
};

// 초기화
const clearDisplay = () => {
  currentInput = "";
  firstNumber = null;
  operator = null;
  resultDisplayed = false;
  updateDisplay("0");
  document.getElementById("result").classList.add("d-none");
  document.getElementById("result").textContent = "";
};

// 기록 출력
const renderHistory = () => {
  const container = document.getElementById("history");

  // 기록이 없으면 안내 문구 출력
  if (history.length === 0) {
    container.innerHTML =
      "<h5>기록:</h5><div class='text-muted'>기록 없음</div>";
    return;
  }

  // 기록이 있을 때만 반복 출력
  container.innerHTML = "<h5>기록:</h5>";
  for (let i = history.length - 1; i >= 0; i--) {
    const h = history[i];
    container.innerHTML += `<div>${h.firstNumber} ${h.operator} ${h.secondNumber} = ${h.result}</div>`;
  }
};

// 백스페이스
const backspace = () => {
  currentInput = currentInput.slice(0, -1);
  updateDisplay(currentInput || "0");
};

// 키보드 입력 대응
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (/^[0-9]$/.test(key)) {
    appendNumber(key);
  } else if (key === ".") {
    appendNumber(".");
  } else if (["+", "-", "*", "/"].includes(key)) {
    setOperator(key);
  } else if (key === "Enter" || key === "=") {
    calculate();
  } else if (key.toLowerCase() === "c") {
    clearDisplay();
  } else if (key === "Backspace") {
    backspace();
  }
});

// 기록 초기화 함수
const clearHistory = () => {
  history = [];
  renderHistory(); // 기록 업데이트는 이 함수에서 처리
  console.log("기록이 초기화되었습니다.");
};
