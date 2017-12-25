import ui from './ui';
import UIDataModel from './ui/UIDataModel';
import * as $ from 'jquery';



//console.log($('button'));


const uiDataModel = new UIDataModel;


ui(uiDataModel);



for(const element of $('button').toArray()) {

    console.log(element.innerText);
    if(element.innerText==='Follow'){
        console.log(element);
    }
}

/*$('button').each((element: HTMLElement)=>{



});*/
