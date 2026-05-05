const lettersPattern = /^[A-Za-z][A-Za-z0-9]*$/;

document.addEventListener("keydown", (e) => {
    let keyPress = e.key;
    console.log(e.key);
    if (keyPress.length == 1) {
        console.log(lettersPattern.test(e.key));
    }
});
