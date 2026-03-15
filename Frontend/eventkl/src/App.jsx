import { useState } from 'react';
import Navbar        from './components/Navbar';
import HomePage      from './pages/HomePage';
import ExplorePage   from './pages/ExplorePage';
import DetailPage    from './pages/DetailPage';
import BookingPage   from './pages/BookingPage';
import ConfirmPage   from './pages/ConfirmPage';
import MyTicketsPage from './pages/MyTicketsPage';
import './styles/globals.css';
import './styles/shared.css';

export default function App() {
  const [page, setPage] = useState('home');
  const [data, setData] = useState(null);

  const onNav = (p, d = null) => {
    setPage(p);
    setData(d);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Navbar page={page} onNav={onNav} />

      {page === 'home'      && <HomePage      onNav={onNav} />}
      {page === 'explore'   && <ExplorePage   onNav={onNav} />}
      {page === 'detail'    && <DetailPage    event={data}  onNav={onNav} />}
      {page === 'booking'   && <BookingPage   data={data}   onNav={onNav} />}
      {page === 'confirm'   && <ConfirmPage   data={data}   onNav={onNav} />}
      {page === 'mytickets' && <MyTicketsPage onNav={onNav} />}
    </>
  );
}
