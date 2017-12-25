import * as React from 'react';
import * as ReactDOM from 'react-dom';
import UIDataModel from './UIDataModel';
import Root from './components/Root';

export default function(uiDataModel: UIDataModel){


    const element = document.createElement('div');
    document.body.appendChild(element);

    ReactDOM.render(
        <Root uiDataModel={uiDataModel}/>,
        element
    );

}

