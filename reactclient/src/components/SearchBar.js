import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchBar = ({ handleSearchResult }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`http://127.0.0.1:5000/users/search?q=${searchTerm}`);
        setSearchResults(response.data);
      } catch (error) {
        setError('Error fetching search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm.trim() !== '') {
      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  return (
    <div className="mt-3">
      <input
        type="text"
        className="form-control"
        placeholder="Search by username"
        value={searchTerm}
        onChange={handleInputChange}
      />
      {loading && <p className="mt-2">Searching...</p>}
      {error && <p className="mt-2 text-danger">{error}</p>}
      {searchResults.length > 0 ? (
        <div className="mt-2">
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((user, index) => (
                <tr key={index} onClick={() => handleSearchResult(user.id)}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        searchTerm.trim() !== '' && <p className="mt-2">No records found.</p>
      )}
    </div>
  );
};

export default SearchBar;
