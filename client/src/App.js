import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'; // Import socket.io-client
import './App.css';
// import DataTable from './components/DataTable';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import MyTable from './components/MyTable'; 
// import InsertDataForm from './components/InsertDataForm';
function App() {
  const [data, setData] = useState([]);


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
  
 

    // Define columns for the DataTable
  const columns = React.useMemo(
    () => [
        {
            Header: 'ID',
            accessor: 'id',
        },
        
        {
          Header: 'Point of Faiure',
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
      
      
             {/* <DataTable columns={columns} data={data || []} /> */}
             <div className="App">
              
              <MyTable columns={columns} data={data || []} />

              {/* <InsertDataForm /> */}
            </div>


    </div>
   </> 
  );
}

export default App;

