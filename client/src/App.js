import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyTable from './components/MyTable'; 
import InsertDataForm from './components/InsertDataForm';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


 

  useEffect(() => {
    setLoading(true);
    fetch('/api/test')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching data from the API", error);
        setError(error);
        setLoading(false);
      });
  }, []);
  
  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_IO_URL || 'http://localhost:3001');
  
 
  socket.on('databaseUpdate', (newRecord) => {
    setData(currentData => [...currentData, newRecord]);
  });
  
  
  
    return () => socket.disconnect();
  }, []);
  

    // Define columns for the DataTable
  const columns = React.useMemo(
    () => [
        {
            Header: 'ID',
            accessor: '',
        },
        
        {
          Header: 'Point of Failure',
          accessor: 'point_of_failure',
        },
        {
          Header: 'Posted By',
          accessor: 'posted_by',
        },
        {
          Header: 'Activity Type',
          accessor: 'activity_type',
        },
        {
          Header: 'Error Code',
          accessor: 'error_code',
        },
        {
          Header: 'Error Message',
          accessor: 'error_message',
        },
        {
          Header: 'Source IP',
          accessor: 'source_ip',
        },
        {
          Header: 'Mac Address',
          accessor: 'mac_address',
        },
        {
          Header: 'Request Method',
          accessor: 'request_method',
        },
        {
          Header: 'Request URL',
          accessor: 'request_url',
        },
        {
          Header: 'Request Parameters',
          accessor: 'request_parameters',
        },
        {
          Header: 'Created At',
          accessor: 'created_at',
        },
        // Add more columns as needed
    ],
    []
  );

  return (
    <>
      <div>
        {loading && <div>Loading...</div>}
        {error && <div>Error fetching data: {error.message}</div>}
        {!loading && !error && (
          <div className="App">
            <MyTable columns={columns} data={data || []} />
            <InsertDataForm />
          </div>
        )}
      </div>
    </>
  );
  
}

export default App;

