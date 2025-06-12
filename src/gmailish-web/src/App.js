import './App.css';
import { useState } from 'react';
import InboxPage from './Pages/InboxPage';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      <InboxPage darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
}

export default App;
