import {useState} from 'react';
import Menu from './components/Menu/Menu.js';
import Graph3D from './components/Graph3D/Graph3D.js';
import Graph2D from './components/Graph2D/Graph2D.js';
import Calculator from './components/Calculator/Calculator.js';
import Esse from './components/Esse/Esse.js';

import './App.css';

const App = () => {
    const [page, setPage] = useState('Graph3D')
    return (
      <div>
        <Menu showPage={setPage} />
        {page === 'Graph3D' && <Graph3D />}
        {page === 'Graph2D' && <Graph2D />}
        {page === 'Calculator' && <Calculator />}
        {page === 'Esse' && <Esse />}
      </div>
    );
}

export default App;