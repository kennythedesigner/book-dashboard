import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
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

  const decadeCounts = books.reduce((acc, book) => {
    if (book.first_publish_year) {
      const decade = `${Math.floor(book.first_publish_year / 10) * 10}s`;
      acc[decade] = (acc[decade] || 0) + 1;
    }
    return acc;
  }, {});

  const decadeChartData = Object.keys(decadeCounts)
    .sort()
    .map((decade) => ({ decade: decade, count: decadeCounts[decade] }));

  const accessCounts = books.reduce((acc, book) => {
    const access = book.ebook_access || 'unknown';
    acc[access] = (acc[access] || 0) + 1;
    return acc;
  }, {});

  const accessChartData = Object.keys(accessCounts).map((access) => ({
    name: access.replace('_', ' '),
    value: accessCounts[access],
  }));

  const PIE_COLORS = ['#5A2A27', '#7A6A55', '#C4B69C', '#3B2F26'];

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

    <div className="chart-section">
      <h2>Books by Decade</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={decadeChartData}>
          <XAxis dataKey="decade" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#5A2A27" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="chart-section">
      <h2>Ebook Availability</h2>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={accessChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >
            {accessChartData.map((entry, index) => (
              <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>

    <input
      type="text"
      placeholder="Search by title..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="search-bar"
    />

    <select
      value={selectedDecade}
      onChange={(e) => setSelectedDecade(e.target.value)}
      className="decade-filter"
    >
      <option value="All">All Decades</option>
      <option value="1940s">1940s</option>
      <option value="1950s">1950s</option>
      <option value="1960s">1960s</option>
      <option value="1970s">1970s</option>
      <option value="1980s">1980s</option>
      <option value="1990s">1990s</option>
    </select>

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