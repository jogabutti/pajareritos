import { useParams } from 'react-router-dom';
import { Home } from '../home/views/Home';
import { useBirdLists } from '../hook/useBirdLists';

const BirdSessionPage = () => {
  const { id } = useParams();
  const { getList } = useBirdLists();

  const list = id ? getList(id) : null;

  if (!list) return <div>Lista no encontrada</div>;

  return <Home listId={list.id} />;
};

export default BirdSessionPage;
