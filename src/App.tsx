import { ErrorBoundary } from 'react-error-boundary';
import './App.css';
import { FamilyGrid } from './components/FamilyGrid';

function App() {
  return (
    <div>
      <ErrorBoundary fallback={<div>Something went wrong!</div>}>
        <h1 style={{ textAlign: 'center' }}>FamilyTS</h1>
        <FamilyGrid />
      </ErrorBoundary>
    </div>
  );
}

export default App;
