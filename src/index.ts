import ui from './ui';
import UIDataModel from './ui/UIDataModel';
//import * as $ from 'jquery';
//import {observe} from 'mobx';

//console.log($('button'));

const uiDataModel = new UIDataModel();

ui(uiDataModel);

function random(min: number, max: number) {
    return min + Math.random() * (max - min);
}

function tickFollow() {
    //console.groupCollapsed('tick');
    let followed = 0;
    const list = document.body.querySelectorAll('button');
    for (var i = 0, l = list.length; i < l; i++) {
        const buttonElement: HTMLButtonElement = list[i];
        if (buttonElement.innerText === 'Follow') {
            //console.log(buttonElement);
            buttonElement.click();
            scrollParent(buttonElement, buttonElement.clientHeight * 2);
            followed++;

            break;
        }
    }
    console.log(`Followed ${followed} people.`);
    //console.groupEnd();
}
tickFollow;

async function tickUnfollow() {
    //await browser.storage.local.get("users");

    //console.groupCollapsed('tick');
    let unfollowed: string[] = [];
    const list = document.body.querySelectorAll('button');
    for (var i = list.length - 1; i >= 0; i--) {
        const buttonElement: HTMLButtonElement = list[i];
        if (buttonElement.innerText === 'Following') {
            //console.log(buttonElement);
            buttonElement.click();
            //scrollParent(buttonElement, buttonElement.clientHeight*2);
            unfollowed.push(findUserId(buttonElement));

            //scrollParent(buttonElement,500);

            break;
        }
    }
    console.log(`Unfollowed ${unfollowed.join(', ')}`);
    //console.groupEnd();
}

function scrollParent(element: HTMLElement, height: number) {
    if (window.getComputedStyle(element).overflowY === 'scroll') {
        element.scrollTop += height;
    } else {
        if (element.parentElement) {
            scrollParent(element.parentElement, height);
        }
    }
}

function _onlyUnique<T>(value: T, index: number, self: T[]): boolean {
    return self.indexOf(value) === index;
}

function _findUserIdOnSelfOfChildren(element: HTMLElement): string[] {
    //todo not optimalisation
    const userIds: string[] = [];
    //console.log(element.tagName);
    if (element.tagName === 'A') {
        const userId = element.getAttribute('href');
        if (typeof userId === 'string') {
            //todo regexp
            userIds.push(userId);
        }
    }
    for (let i = 0, l = element.children.length; i < l; i++) {
        const child = element.children[i];
        for (const userId of _findUserIdOnSelfOfChildren(child as HTMLElement)) {
            userIds.push(userId);
        }
    }
    return userIds.filter(_onlyUnique);
}

function findUserId(element: HTMLElement): string {
    const userIds = _findUserIdOnSelfOfChildren(element);

    if (userIds.length === 0) {
        if (element.parentElement) {
            return findUserId(element.parentElement);
        } else {
            console.log(element);
            throw new Error('Cant get any user id.');
        }
    } else if (userIds.length === 1) {
        return userIds[0];
    } else {
        console.log(element);
        throw new Error('Cant get unique user id.');
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
    }, delayCb());
}

//clock(tickUnfollow, () => random(28, 36) * 1000);
clock(tickUnfollow, () => random(12, 22) * 1000);

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
