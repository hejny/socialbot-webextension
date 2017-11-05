let running = false;
let interval = null;

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

browser.runtime.onMessage.addListener(function (message) {
    if (message === 'colorize') {
        if (running === false) {
            running = true;
            const els = document.querySelectorAll("body *");
            interval = setInterval(() => {
                let el = els[Math.floor(Math.random() * els.length)];
            el.style.backgroundColor = getRandomColor();
            el.style.color = getRandomColor();
        }, 100);
        } else {
            running = false;
            clearInterval(interval);
        }
    }
});