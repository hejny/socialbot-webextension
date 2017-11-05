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



            const elements = document.querySelectorAll("body *");

            function findBlocks(parentNode,basicNodes){
                for(let childNode of parentNode.childNodes){
                    if(Math.random()>0.05){
                        basicNodes.push(childNode);
                    }else{
                        findBlocks(childNode,basicNodes);
                    }
                }
            }


            const basicNodes = [];
            findBlocks(document.body,basicNodes);

            console.log(basicNodes);
            for(let node of basicNodes){

                console.log(node);
                node.style.border = '1px dotted red';
            }







        } else {
            running = false;
        }
    }
});