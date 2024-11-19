import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RepositoriesPage from './pages/repositoriespage';
import SingleRepoPage from './pages/SingleRepoPage';
import ErrorBoundary from './ErrorBoundary';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<RepositoriesPage />} />
          <Route path="/repositories/:repoName" element={<SingleRepoPage />} />
          
          {/* 404 Route for undefined paths */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
