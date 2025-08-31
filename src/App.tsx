import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './home/views/Home';

function About() {
  return <h2>Acerca de</h2>;
}

function App() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh' }}>
    <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
    </Router>
    </div>
  );
}

export default App;