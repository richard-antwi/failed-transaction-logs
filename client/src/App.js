import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'; // Import socket.io-client
import './App.css';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/test')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("There was an error fetching data from the API", error));
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:3001'); // Connect to your server
  
    socket.on('databaseUpdate', (data) => {
      setData(data); // Update state with the new data
    });
  
    return () => socket.disconnect(); // Cleanup on component unmount
  }, []);
  
  // Helper function to format the creation date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <h1>Test Data</h1>
      {data ? (
        <div>
          <p><strong>Point of Failure:</strong> {data.point_of_failure}</p>
          <p><strong>Activity Type:</strong> {data.activity_type}</p>
          <p><strong>Error Code:</strong> {data.error_code}</p>
          <p><strong>Error Message:</strong> {data.error_message}</p>
          <p><strong>Source IP:</strong> {data.source_ip}</p>
          <p><strong>MAC Address:</strong> {data.mac_address}</p>
          <p><strong>Posted By:</strong> {data.posted_by || 'N/A'}</p>
          <p><strong>Created At:</strong> {formatDate(data.created_at)}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
