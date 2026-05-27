import { Route, Routes } from "react-router-dom";
import BirdsMarked from "./component/BirdsMarked";
import RegionBirds from "./home/views/RegionBirds";
import Landing from './landing/Landing';
import NuevaLista from './component/NuevaLista';
import BirdSessionPage from './component/BirdSessionPage';
import Listas from './home/views/Listas';

function About() {
  return <h2>Acerca de</h2>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path="/nueva-lista" element={<NuevaLista/>} />
      <Route path="/nueva-lista/:id" element={<BirdSessionPage />} />
      <Route path="/listas" element={<Listas/>} />
      <Route path="/region" element={<RegionBirds />} />
      {/* <Route path="/juegos" element={<Juegos />} /> */}
      <Route path="/about" element={<About />} />
      <Route path="/aves-marcadas" element={<BirdsMarked />} />
    </Routes>
  );
}

export default App;