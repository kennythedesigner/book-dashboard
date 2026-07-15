import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import BookDetail from './components/BookDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/book/:bookKey" element={<BookDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
