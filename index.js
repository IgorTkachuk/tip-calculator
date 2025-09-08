window.addEventListener("load", () => {
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
});
