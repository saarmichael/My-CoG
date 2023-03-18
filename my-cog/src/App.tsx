import './App.css';
import Tabbing from './scenes/main/Tabs';
import { ElectrodeFocusProvider } from './contexts/ElectrodeFocusContext';

function App() {
  return (
    <div>
      <ElectrodeFocusProvider>
        <Tabbing />
      </ElectrodeFocusProvider>
    </div>
  );
}

export default App;
