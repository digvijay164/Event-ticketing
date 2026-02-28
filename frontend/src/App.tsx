import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { CreateEvent } from './pages/CreateEvent';
import { EventDetails } from './pages/EventDetails';
import { MyTickets } from './pages/MyTickets';
import { Organizer } from './pages/Organizer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="event/:id" element={<EventDetails />} />
          <Route path="create" element={<CreateEvent />} />
          <Route path="tickets" element={<MyTickets />} />
          <Route path="organizer" element={<Organizer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
