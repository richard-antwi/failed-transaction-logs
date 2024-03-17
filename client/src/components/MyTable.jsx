import React, { useState, useMemo, useEffect } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const MyTable = ({ data, columns }) => {
  const [searchQuery, setSearchQuery,setData] = useState('');

  // Connect to the Socket.io server
const socket = io();

// Listen for the 'databaseUpdate' event
socket.on('databaseUpdate', (data) => {
    // Update the frontend UI with the new data
    console.log('New data received:', data);
    // Update the UI as per your requirements
});


  const filteredData = useMemo(() =>
    data.filter(row =>
      Object.values(row).some(value =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
  ), [data, searchQuery]);

  useEffect(() => {
    const newSocket = io('http://localhost:3001'); // Replace with your Socket.IO server URL
  
    newSocket.on('newData', (newEntry) => {
      console.log('New data received:', newEntry);
      // Update table data with the new entry
      setData(prevData => [...prevData, newEntry]);
    });
  
    return () => {
      newSocket.disconnect();
    };
  }, [setData]);
  

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

 

  // Styles to match the uploaded datatable image
  const headerStyle = {
    boxShadow: '0.2rem 0.2rem 0.2rem #00008B',
    backgroundColor: '#f8f9fa', // Light grey background
    color: '#343a40', // Dark grey text for contrast
    fontWeight: 'bold',
    fontSize: '1.2em',
    padding: '1em 1em',
    textAlign: 'left',
    position: 'sticky',
    top:'0',
    index: '1', /* Ensures the header is above other content */
    
  };

  

  return (
    <div className="container-fluid custom-container mt-5" style={{ maxWidth: '90rem' }}>
      <div className="card">
        <div className="card-header text-white" style={{ backgroundColor: '#004085' }}>
          <div className ="row">
            <div className ="col-4 text-left">
              <select className="form-control" value={pageSize}onChange={e => setPageSize(Number(e.target.value))}style={{ width: 'auto' }} // Added marginRight: 'auto' to push everything else to the right
                >
                  {[10, 20, 30, 40, 50].map(size => (
                    <option key={size} value={size}>{size} per page</option>
                ))}
              </select>
              </div>
            <div className="col-4 mr-3 text-center" style={{fontWeight: 'bold',fontSize: '1.2em'}}>
              <h3>Failed Transaction Logs</h3>
            </div>
          <div className="col-4 d-flex justify-content-end">
            <input
             id="datatable-search"
              type="search"
               placeholder='Search' 
               value= {searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)} 
               className="form-control "style={{ width: '15vw' }}/>
                   
             
        
        </div>
        </div>
      </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table {...getTableProps()} className="table table-bordered mb-0">
              <thead style={headerStyle}>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th className="text-nowrap"{...column.getHeaderProps(column.getSortByToggleProps())}>
                        {column.render('Header')}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? ' 🔽'
                              : ' 🔼'
                            : ''}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
  {page.map((row, index) => {
    prepareRow(row);
    return (
      <tr {...row.getRowProps()}>
        <td>{index + 1}</td> {/* Generate a unique ID for each row */}
        {row.cells.map(cell => (
          <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
        ))}
      </tr>
    );
  })}
</tbody>

              
            </table>
            {console.log(searchQuery)}
            {console.log(filteredData)}
          </div>
          <div className="pagination d-flex justify-content-between align-items-center p-3">
            <button className="btn btn-primary" onClick={() => previousPage()} disabled={!canPreviousPage}>
              {'< Previous'}
            </button>
            <div>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </div>
            <button className="btn btn-primary" onClick={() => nextPage()} disabled={!canNextPage}>
              {'Next >'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTable;
