window.addEventListener("load", main);

function isValidNumber(str) {
  if (str === "") return true;
  return /^(0|[1-9]\d*)((\.|,)\d*)?$/.test(str);
}

function applyValidateInput() {
  const textInputs = document.querySelectorAll("form input[type='text']");

  [...textInputs].forEach((input) => {
    input.addEventListener("input", ({ target }) => {
      if (isValidNumber(target.value)) {
        target.oldValue = target.value;
        return;
      }
      target.value = target.oldValue || "";
    });
  });
}

function submitHandler(e) {
  e.preventDefault();

  formData = new FormData(e.target);
  const data = {};
  for (let [k, v] of formData.entries()) {
    data[k] = v;
  }

  resetErr();

  const errors = validate(data);
  if (!!errors.length) {
    displayErr(errors);
    return;
  }

  const btnReset = document.querySelector("button[type='reset']");
  btnReset.disabled = false;

  displayResult(calc(prepareData(data)));
}

function validate({ bill, tip, custom, numberofpeople }) {
  const errors = [];

  if (!bill) errors.push("bill");
  if (!tip && !custom) errors.push("tip");
  if (tip === "custom" && !custom) errors.push("tip");
  if (!numberofpeople) errors.push("numberofpeople");

  return errors;
}

function displayErr(errors) {
  errors.forEach((err) => {
    const field = document.querySelector(`.bglabel span + .${err}`);
    field.classList.add("error");
  });
}

function resetErr() {
  const fields = document.querySelectorAll(".bglabel span + *");

  fields.forEach((field) => field.classList.remove("error"));
}

function displayResult([tip, total]) {
  const tipElem = document.querySelector(".tip-amount-value");
  const totalElem = document.querySelector(".total-value");

  const formater = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  tipElem.innerText = formater.format(tip);
  totalElem.innerText = formater.format(total);
}

function prepareData(data) {
  const preparedData = {};
  for (let key in data) {
    preparedData[key] = parseFloat(data[key]);
  }

  return preparedData;
}

function calc({ bill, tip, custom, numberofpeople }) {
  const currentTip = tip || custom;

  const tipAmmount = (bill * (currentTip / 100)) / numberofpeople;
  const total = bill / numberofpeople + tipAmmount;

  return [tipAmmount, total];
}

function main() {
  const customTip = document.querySelector(".tip-custom input[type='text']");
  const customTipRadio = document.querySelector(
    ".tip-custom input[type='radio']"
  );

  const tipRadios = document.querySelectorAll(".tip input[type='radio']");

  customTip.addEventListener("focus", () => {
    customTipRadio.checked = true;
  });

  [...tipRadios].forEach((radio) => {
    radio.addEventListener("change", (_) => {
      customTip.value = "";
    });
  });

  const btnReset = document.querySelector("button[type='reset']");
  btnReset.addEventListener("click", (e) => {
    resetErr();
    displayResult([0, 0]);

    setTimeout(() => {
      e.target.setAttribute("disabled", "");
    });
  });

  applyValidateInput();

  const form = document.forms[0];
  form.addEventListener("submit", submitHandler);
}
