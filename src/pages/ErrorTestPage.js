import React from 'react';

const ErrorTestPage = () => {
  throw new Error('This is a test error to check the Error Boundary!');
};

export default ErrorTestPage;
