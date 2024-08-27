import React from 'react';
import ReactMarkdown from 'react-markdown';

const PrivacySettings = () => {
  return (
    <ReactMarkdown className='p-5 text-center'>
      {`
### Privacy Settings

This is a mock application and does not store any user data.  
This page is for demonstration purposes only.
      `}
    </ReactMarkdown>
  );
};

export default PrivacySettings;