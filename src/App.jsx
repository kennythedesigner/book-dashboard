import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDecade, setSelectedDecade] = useState('All');

  const totalBooks = books.length;

  const averageYear =
    books.length > 0
      ? Math.round(
          books.reduce((sum, book) => sum + (book.first_publish_year || 0), 0) /
            books.length
        )
      : 0;

  const oldestYear =
    books.length > 0
      ? Math.min(...books.map((book) => book.first_publish_year || Infinity))
      : 0;

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const bookDecade = book.first_publish_year
      ? `${Math.floor(book.first_publish_year / 10) * 10}s`
      : null;
    const matchesDecade =
      selectedDecade === 'All' || bookDecade === selectedDecade;

    return matchesSearch && matchesDecade;
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          'https://openlibrary.org/search.json?q=science+fiction&limit=20'
        );
        const data = await response.json();
        console.log(data.docs);
        setBooks(data.docs);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

return (
  <div className="App">
    <h1>Book Dashboard</h1>
    <p>{books.length} books loaded</p>

    <div className="stats">
      <div className="stat-card">
        <h3>Total Books</h3>
        <p>{totalBooks}</p>
      </div>
      <div className="stat-card">
        <h3>Average Year</h3>
        <p>{averageYear}</p>
      </div>
      <div className="stat-card">
        <h3>Oldest Book</h3>
        <p>{oldestYear}</p>
      </div>
    </div>

    <input
      type="text"
      placeholder="Search by title..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="search-bar"
    />

    <div className="book-list">
      {filteredBooks.map((book) => (
        <div className="book-row" key={book.key}>
          <span className="book-title">{book.title}</span>
          <span className="book-author">
            {book.author_name ? book.author_name[0] : 'Unknown'}
          </span>
          <span className="book-year">{book.first_publish_year || 'N/A'}</span>
        </div>
      ))}
    </div>
  </div>
);
}