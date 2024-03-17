import React, { useState } from 'react';
import axios from 'axios';

const InsertDataForm = () => {
  const [id, setid] = useState('');
  const [point_of_failure, setpoint_of_failure] = useState('');
  const [posted_by, setposted_by] = useState('');
  const [activity_type, setactivity_type] = useState('');
  const [error_code, seterror_code] = useState('');
  const [error_message, seterror_message] = useState('');
  const [source_ip, setsource_ip] = useState('');
  const [mac_address, setmac_address] = useState('');
  const [request_method, setrequest_method] = useState('');
  const [request_url, setrequest_url] = useState('');
  const [request_parameters, setrequest_parameters] = useState('');

  const handleInsertData = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios.post('/api/insert', {
        id,
        point_of_failure,
        posted_by,
        activity_type,
        error_code,
        error_message,
        source_ip,
        mac_address,
        request_method,
        request_url,
        request_parameters
      });
      console.log('Data inserted successfully:', response.data);
      // Clear form fields after successful insertion
      setid('');
      setpoint_of_failure('');
      setposted_by('');
      setactivity_type('');
      seterror_code('');
      seterror_message('');
      setsource_ip('');
      setmac_address('');
      setrequest_method('');
      setrequest_url('');
      setrequest_parameters('');
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleInsertData}>
        <input type="text" placeholder="Transaction Log ID" value={id} onChange={(e) => setid(e.target.value)} />
        {/* Add input fields for other form data */}
        <button type="submit">Insert Data</button>
      </form>
    </div>
  );
};

export default InsertDataForm;
