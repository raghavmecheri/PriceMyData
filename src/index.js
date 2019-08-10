import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App"
import {GlobalStyle} from "./injectGlobal"

const Index = () => {
    return (
        <div>
            <GlobalStyle />
            <App />
        </div>
    );
}
ReactDOM.render(<Index />, document.getElementById('root'));