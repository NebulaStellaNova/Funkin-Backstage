const animatedElement = document.querySelector(".irisEffect");
animatedElement.addEventListener("animationend", () => {
  // DIE, DIE, DIE!!!
  animatedElement.remove();
});
