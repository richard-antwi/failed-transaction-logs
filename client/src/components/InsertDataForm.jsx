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
 
  
  const handleInsertData = async () => {
    try {
      const response = await axios.post('/api/insert', {id, point_of_failure, posted_by, activity_type, error_code, error_message,source_ip, mac_address, request_method, request_url, request_parameters});
      console.log('Data inserted successfully:', response.data);
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };

  return (
    <div>
        
      <input type="text" placeholder="Transaction Log ID" value={id} onChange={(e) => setid(e.target.value)} />
      <input type="text" placeholder="Point Of Failure" value={point_of_failure} onChange={(e) => setpoint_of_failure(e.target.value)} />
      <input type="text" placeholder="Posted By" value={posted_by} onChange={(e) => setposted_by(e.target.value)} />
      <input type="text" placeholder="Activity Type" value={activity_type} onChange={(e) => setactivity_type(e.target.value)} />
      <input type="text" placeholder="Error Code" value={error_code} onChange={(e) => seterror_code(e.target.value)} />
      <input type="text" placeholder="Error Message" value={error_message} onChange={(e) => seterror_message(e.target.value)} />
      <input type="text" placeholder="Source Ip" value={source_ip} onChange={(e) => setsource_ip(e.target.value)} />
      <input type="text" placeholder="Mac Address" value={mac_address} onChange={(e) => setmac_address(e.target.value)} />
      <input type="text" placeholder="Request Method" value={request_method} onChange={(e) => setrequest_method(e.target.value)} />
      <input type="text" placeholder="Request Url" value={request_url} onChange={(e) => setrequest_url(e.target.value)} />
      <input type="text" placeholder="RequestParameters" value={request_parameters} onChange={(e) => setrequest_parameters(e.target.value)} />

      <button onClick={handleInsertData}>Insert Data</button>
    </div>
  );
};

export default InsertDataForm;
