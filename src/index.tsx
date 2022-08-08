import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import QrCodeCanvas from './QrCodeCanvas';
// import QrCodeCss from './QrCodeCss';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        {/* <QrCodeCss value='guilhermeasn@yahoo.com.br' /> */}
        <br />

        <QrCodeCanvas
            value='guilhermeasn@yahoo.com.br'
            size={ 500 }
            margin={ 30 }
            color='#707'
            variant={{
                eye: 'gravity',
                body: 'fluid'
            }}
            divider
        />

    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
