import React from 'react';
import ReactDOM from 'react-dom/client';
import 'animate.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import configureAxios from './utils/axiosConfig';

// Configure Axios before rendering the app
(async () => {
  await configureAxios();
  
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
})();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
