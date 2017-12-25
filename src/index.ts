import * as $ from 'jquery';


(window as any).browser.runtime.onMessage.addListener((message:any)=>{
    if (message === 'socialbot') {+

        alert('socialbot');
        alert($('button'));


        for(const element of $('button').toArray()) {

            console.log(element.innerText);
            if(element.innerText==='Follow'){
                console.log(element);
            }
        }

        /*$('button').each((element: HTMLElement)=>{



        });*/


    }
});