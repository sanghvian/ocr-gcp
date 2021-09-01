import React from 'react';
import './App.css';
import { Provider } from 'react-redux'
import store from '@redux/store'  

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        hi
      </div>
    </Provider>
  );
}

export default App;
