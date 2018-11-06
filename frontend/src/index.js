import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
// import { Provider } from 'react-redux';
import rootReducer from './reducers'
// import { createStore } from 'redux'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import { Provider } from 'unstated';


// const store = createStore(rootReducer)

ReactDOM.render(

    <Provider>
        <App />
    </Provider>,
 document.getElementById('root')
);
registerServiceWorker();
