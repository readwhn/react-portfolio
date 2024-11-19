import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import RepoModal from '../components/RepoModal';
import './RepoPage.css'; // Import custom CSS

const RepositoriesPage = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('create'); // 'create' or 'update'
  const [selectedRepo, setSelectedRepo] = useState(null); // Repo to be updated
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10); // Items per page for pagination
  const [filter, setFilter] = useState('');

  const fetchRepos = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.github.com/user/repos', {
        headers: {
          Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
        },
        params: {
          q: searchTerm,
          per_page: perPage,
          page: currentPage,
        },
      });
      setRepos(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, [searchTerm, currentPage, filter]);

  const handleCreateRepoClick = () => {
    setMode('create');
    setShowModal(true);
  };

  const handleUpdateRepoClick = (repo) => {
    setMode('update');
    setSelectedRepo(repo);
    setShowModal(true);
  };

  const handleRepoUpdated = () => {
    fetchRepos(); // Refresh the list after creation or update
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRepos();
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div className="repo-page-container">
      <h1>My GitHub Repositories</h1>

      {/* Search Bar */}
      <Form onSubmit={handleSearch} className="search-form">
        <Form.Control
          type="text"
          placeholder="Search Repos"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="primary" type="submit" className="search-btn">
          Search
        </Button>
      </Form>

      {/* Filter */}
      <Form.Control as="select" onChange={handleFilterChange} className="filter-dropdown">
        <option value="">Filter by Visibility</option>
        <option value="private">Private</option>
        <option value="public">Public</option>
      </Form.Control>

      {/* Create New Repo Button */}
      <Button variant="primary" onClick={handleCreateRepoClick} className="create-repo-btn">
        Create New Repo
      </Button>

      {/* Repository List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {repos.map((repo) => (
            <li key={repo.id}>
              <a href={`/repositories/${repo.name}`} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
              <Button variant="secondary" onClick={() => handleUpdateRepoClick(repo)}>
                Update
              </Button>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination Buttons */}
      <div className="pagination-buttons">
        <Button
          variant="secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>

      {/* Modal for creating/updating repo */}
      <RepoModal
        show={showModal}
        onHide={() => setShowModal(false)}
        mode={mode}
        repo={selectedRepo}
        onRepoUpdated={handleRepoUpdated}
      />
    </div>
  );
};

export default RepositoriesPage;
