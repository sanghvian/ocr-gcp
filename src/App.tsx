import React from 'react';
import {useSelector} from 'react-redux'

function App() {
  const state = useSelector((state) => state)
  
  console.log(state)
  return (
      <div className="App">
        hi
      </div>
  );
}

export default App;
