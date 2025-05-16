import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch countries data from API
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://countries-search-data-prod-812920491762.asia-south1.run.app/countries');
        const data = await response.json();

        // Handle different possible API response structures
        let countriesData = [];
        if (data && data.value && Array.isArray(data.value)) {
          // If data has a value property that is an array
          countriesData = data.value;
        } else if (Array.isArray(data)) {
          // If data itself is an array
          countriesData = data;
        } else if (data && typeof data === 'object') {
          // If data is an object with unknown structure, try to extract countries
          const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            // Use the largest array found
            countriesData = possibleArrays.reduce((a, b) => a.length > b.length ? a : b, []);
          }
        }

        setCountries(countriesData);
        setFilteredCountries(countriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setLoading(false);
        // Set empty arrays on error
        setCountries([]);
        setFilteredCountries([]);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    // Filter countries based on search term
    if (!countries || searchTerm.trim() === '') {
      setFilteredCountries(countries || []);
    } else {
      const filtered = countries.filter(country =>
        country && country.common &&
        country.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [searchTerm, countries]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container">
      <h1>Country Search App</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a country..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <div className="loading">Loading countries...</div>
      ) : (
        <div className="countries-grid">
          {filteredCountries && filteredCountries.length > 0 ? (
            filteredCountries.map((country, index) => (
              <div key={country.common || index} className="countryCard">
                <img
                  src={country.png || 'https://via.placeholder.com/320x213?text=Flag+Not+Available'}
                  alt={`${country.common || 'Country'} flag`}
                />
                <h2>{country.common || 'Unknown Country'}</h2>
              </div>
            ))
          ) : (
            <div className="no-results">No countries found matching your search.</div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
