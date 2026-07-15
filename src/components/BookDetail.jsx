import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../App.css';

export default function BookDetail() {
  const { bookKey } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `https://openlibrary.org/works/${bookKey}.json`
        );
        const data = await response.json();
        console.log(data);
        setBook(data);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    fetchBook();
  }, [bookKey]);

  if (!book) {
    return (
      <div className="App">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <Link to="/" className="back-link">
        ← Back to Dashboard
      </Link>
      <h1>{book.title}</h1>
      {book.description && (
        <p className="book-description">
          {typeof book.description === 'string'
            ? book.description
            : book.description.value}
        </p>
      )}
      {book.subjects && (
        <div className="subjects">
          <h3>Subjects</h3>
          <p>{book.subjects.slice(0, 8).join(' · ')}</p>
        </div>
      )}
      {book.first_publish_date && (
        <p>
          <strong>First published:</strong> {book.first_publish_date}
        </p>
      )}
    </div>
  );
}
