import React from 'react';
import ReactDOM from 'react-dom';

import './styles/tailwind.css';
import App from './App';
import FirebaseContext from './context/firebase';
import { firebaseApp, FieldValue } from './lib/firebase';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

ReactDOM.render(
    <FirebaseContext.Provider value={{ firebaseApp, FieldValue }}>
        <App />
    </FirebaseContext.Provider>,
    document.getElementById('root')
);