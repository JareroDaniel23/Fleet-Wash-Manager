import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SealForm from './components/SealForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<Dashboard/>}/>

        <Route path='/security' element={<SealForm/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;