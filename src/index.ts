import ui from './ui';
import UIDataModel from './ui/UIDataModel';
//import * as $ from 'jquery';
//import {observe} from 'mobx';


//console.log($('button'));


const uiDataModel = new UIDataModel;


ui(uiDataModel);

function random(min: number, max: number) {
    return min + Math.random() * (max - min);
}


function tickFollow() {
    //console.groupCollapsed('tick');
    let follewed = 0;
    const list = document.body.querySelectorAll('button');
    for (var i = 0, l = list.length; i < l; i++) {
        const buttonElement: HTMLButtonElement = list[i];
        if (buttonElement.innerText === 'Follow') {
            //console.log(buttonElement);
            buttonElement.click();
            scrollParent(buttonElement, buttonElement.clientHeight*2);
            follewed++;

            break;
        }
    }
    console.log(`Followed ${follewed} people.`);
    //console.groupEnd();
}


function scrollParent(element: HTMLElement, height: number) {
    if (window.getComputedStyle(element).overflowY === 'scroll') {

        element.scrollTop += height;

    } else {
        if(element.parentElement){
            scrollParent(element.parentElement, height);
        }

    }
}

/*function tickScroll() {
    //console.groupCollapsed('tick');
    let scrolled = 0;
    const list = document.body.querySelectorAll('div');
    for (var i = 0, l = list.length; i < l; i++) {
        const divElement: HTMLDivElement = list[i];
        if (window.getComputedStyle(divElement).overflowY === 'scroll') {
            //console.log(divElement);


            divElement.scrollTop += 100;
            scrolled++;

            //break;
        }
    }
    console.log(`Scrolled ${scrolled} divs.`);
    //console.groupEnd();
}*/


function clock(tickCb: () => void, delayCb: () => number) {
    setTimeout(() => {
        if (uiDataModel.started) {
            tickCb();
        }
        clock(tickCb, delayCb);
    }, delayCb())
}


clock(tickFollow, () => random(28, 36) * 1000);


/*try {
    }catch(exeption){
        console.warn(exeption);
    }*/

/*
observe(uiDataModel, 'started', () => {

//alert(uiDataModel.started);


if (uiDataModel.started) {

    try {
        String(window);
        console.log("window is alive");
    }
    catch (e) {
        console.log("window is likely dead");
    }




    }


});
*/

/*$('button').each((element: HTMLElement)=>{



});*/
