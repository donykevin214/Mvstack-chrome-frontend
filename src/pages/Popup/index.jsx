import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { store } from '../../store';
import { PersistGate } from 'redux-persist/integration/react';

import Popup from './Popup';
import { ToastContainer } from 'react-toastify';
import './index.css';
import '../../assets/styles/tailwind.css';

const persistor = persistStore(store);
render(
<Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
        <Popup />
    </PersistGate>
</Provider>
  , window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();


