import React from 'react';
import Contacts from './Contacts'; // To Imports your Contacts component
import './App.css'; // Imports basic styling

function App() {
  return (
    <div className="App">
      <Contacts /> {/* Renders your Contacts component */}
    </div>
  );
}

export default App; // Makes App available to other files