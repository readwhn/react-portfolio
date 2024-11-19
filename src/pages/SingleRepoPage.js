import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const SingleRepoPage = () => {
  const { repoName } = useParams();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepo = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.github.com/repos/{your-username}/${repoName}`,
          {
            headers: {
              Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
            },
          }
        );
        setRepo(response.data);
      } catch (error) {
        console.error('Error fetching repository:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepo();
  }, [repoName]);

  if (loading) {
    return <p>Loading repository details...</p>;
  }

  if (!repo) {
    return <p>Repository not found!</p>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>
        &larr; Back to Repositories
      </Link>
      <h1>{repo.name}</h1>
      <p>{repo.description || 'No description available.'}</p>
      <ul>
        <li>
          <strong>Stars:</strong> {repo.stargazers_count}
        </li>
        <li>
          <strong>Forks:</strong> {repo.forks_count}
        </li>
        <li>
          <strong>Language:</strong> {repo.language || 'Not specified'}
        </li>
        <li>
          <strong>Open Issues:</strong> {repo.open_issues_count}
        </li>
      </ul>
      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          marginTop: '20px',
          padding: '10px 15px',
          background: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
        }}
      >
        View on GitHub
      </a>
    </div>
  );
};

export default SingleRepoPage;
