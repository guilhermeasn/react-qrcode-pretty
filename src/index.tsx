import React from 'react';
import ReactDOM from 'react-dom/client';
// import QrCodeCss from './QrCodeCss';
import QrCodeCanvas from './QrCodeCanvas';
import reportWebVitals from './reportWebVitals';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>

        {/* <QrCodeCss
            value='react-qrcode-pretty'
        />

        <br /> */}

        <QrCodeCanvas
            value='react-qrcode-pretty'
            size={ 350 }
            padding={ 20 }
            margin={ 10 }
            image='./scanme.png'
            color={{
                eye: '#404',
                body: '#707'
            }}
            variant={{
                eye: 'gravity',
                body: 'fluid'
            }}
            bgColor='#def'
            bgRounded
            divider
        />

    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
