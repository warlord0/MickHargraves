import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { useHistory, useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';

function SearchPage() {
  const location = useLocation();
  const history = useHistory();
  const { siteConfig } = useDocusaurusContext();
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Parse the query parameter when the page loads
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    setSearchTerm(query);
    
    if (query) {
      performSearch(query);
    }
  }, [location.search]);
  
  // Update the URL when the search term changes
  const handleSearch = (e) => {
    e.preventDefault();
    const newUrl = searchTerm 
      ? `${location.pathname}?q=${encodeURIComponent(searchTerm)}` 
      : location.pathname;
    history.push(newUrl);
    
    if (searchTerm) {
      performSearch(searchTerm);
    } else {
      setResults([]);
    }
  };
  
  // Perform the actual search
  const performSearch = async (query) => {
    setIsSearching(true);
    
    try {
      // This is where we'll integrate with the search index
      // For now, we'll use a placeholder search implementation
      
      // In a real implementation, this would use lunr.js or a similar search library
      if (window.__DOCUSAURUS_LUNR_SEARCH_INDEX) {
        const lunrIndex = window.__DOCUSAURUS_LUNR_SEARCH_INDEX;
        const lunrResults = lunrIndex.search(query);
        
        setResults(lunrResults.map(result => ({
          title: result.title,
          url: result.url,
          preview: result.preview || 'No preview available',
          score: result.score
        })));
      } else {
        // Placeholder for when the search index isn't loaded yet
        setResults([
          {
            title: 'Search index is loading...',
            url: '#',
            preview: 'Please try again in a moment when the search index has been fully loaded.',
            score: 1
          }
        ]);
        
        // Check again in a second
        setTimeout(() => performSearch(query), 1000);
      }
    } catch (error) {
      console.error('Error performing search:', error);
      setResults([
        {
          title: 'Error performing search',
          url: '#',
          preview: 'There was an error with the search functionality. Please try again later.',
          score: 0
        }
      ]);
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <Layout title="Search" description="Search the Black Eyes & Broken Souls lore">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>Search</h1>
            
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search the lore..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="search-button">
                  Search
                </button>
              </div>
            </form>
            
            {isSearching ? (
              <div className="search-loading">
                <p>Searching...</p>
              </div>
            ) : (
              <>
                {searchTerm && (
                  <div className="search-info">
                    <p>
                      {results.length === 0
                        ? 'No results found'
                        : `Found ${results.length} result${results.length === 1 ? '' : 's'}`}
                    </p>
                  </div>
                )}
                
                <div className="search-results">
                  {results.map((result, i) => (
                    <div key={i} className="search-result">
                      <h2 className="search-result-title">
                        <Link to={result.url}>{result.title}</Link>
                      </h2>
                      <p className="search-result-preview">{result.preview}</p>
                      <div className="search-result-url">
                        <Link to={result.url}>{result.url}</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default SearchPage;