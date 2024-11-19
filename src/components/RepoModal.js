import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const RepoModal = ({ show, onHide, mode, repo, onRepoUpdated }) => {
  const [name, setName] = useState(repo ? repo.name : '');
  const [description, setDescription] = useState(repo ? repo.description : '');
  const [privateRepo, setPrivateRepo] = useState(repo ? repo.private : false);
  const [loading, setLoading] = useState(false);
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'create') {
        // Create new repo
        await axios.post(
          'https://api.github.com/user/repos',
          {
            name,
            description,
            private: privateRepo,
          },
          {
            headers: {
              Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
            },
          }
        );
        onRepoUpdated();
      } else if (mode === 'update') {
        // Update repo details
        await axios.patch(
          `https://api.github.com/repos/${process.env.GITHUB_USERNAME}/${repo.name}`,
          {
            name,
            description,
            private: privateRepo,
          },
          {
            headers: {
              Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
            },
          }
        );
        onRepoUpdated();
      }
      onHide();
    } catch (error) {
      console.error('Error submitting the form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{mode === 'create' ? 'Create Repository' : 'Update Repository'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="repoName">
            <Form.Label>Repository Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="repoDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="repoPrivacy">
            <Form.Check
              type="checkbox"
              label="Private Repository"
              checked={privateRepo}
              onChange={(e) => setPrivateRepo(e.target.checked)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : mode === 'create' ? 'Create Repo' : 'Update Repo'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RepoModal;
