import React from 'react';
import { BallTriangle } from 'react-loader-spinner';

import './Loading.css'

function Loading() {
    return (
        <div className="loader-container">
            <BallTriangle
                height={100}
                width={100}
                radius={5}
                color="#D9D9D9"
                ariaLabel="ball-triangle-loading"
                visible={true}
            />
        </div>
    );
}

export default Loading;