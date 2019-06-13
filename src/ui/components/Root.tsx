import * as React from 'react';
import { observer } from 'mobx-react';
import UIDataModel from '../UIDataModel';

export default observer(({ uiDataModel }: { uiDataModel: UIDataModel }) => {
    return (
        <div
            style={{
                position: 'fixed',
                zIndex: 99999,
                bottom: 10,
                right: 10,
                padding: 10,
                backgroundColor: '#e8ffe2',
                border: '2px solid #000',
            }}
        >
            <button onClick={() => (uiDataModel.started = !uiDataModel.started)}>
                {uiDataModel.started ? 'stop' : 'start'}
            </button>
        </div>
    );
});
