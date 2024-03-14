// MyTable.js
import React from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const MyTable = ({ data, columns }) => {
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
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  // Styles to match the uploaded datatable image
  const headerStyle = {
    backgroundColor: '#f8f9fa', // Light grey background
    color: '#343a40', // Dark grey text for contrast
    fontWeight: 'bold',
    fontSize: '1.2em',
    padding: '1em 0.5em',
    position: 'sticky', 
    top:'0',
    index: '1', /* Ensures the header is above other content */
    // backgroundColor: '#FFF',
    // color:#99ccff;
  };
  const tbodyStyle ={
    borderCollapse: 'collapse',     
  }
  

  return (
    <div className="container-fluid custom-container mt-5" style={{ maxWidth: '95%' }}>
      <div className="card">
      <div className="card-header text-white" style={{ backgroundColor: '#004085', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
  <select 
    className="form-control" 
    value={pageSize} 
    onChange={e => setPageSize(Number(e.target.value))} 
    style={{ width: 'auto', marginRight: 'auto' }} // Added marginRight: 'auto' to push everything else to the right
  >
    {[10, 20, 30, 40, 50].map(size => (
      <option key={size} value={size}>
        {size} per page
      </option>
    ))}
  </select>

  <div className="search-container d-flex align-items-center">
  <label htmlFor="datatable-search" className="form-label text-white mr-3 mb-0" style={{ paddingRight: '8px' }}>Search: </label>
    <input
      id="datatable-search"
      type="search"
      className="form-control ml-3"
      style={{ width: 'auto' }} // Adjust width as needed
      // Add onChange handler to implement the search logic
      onChange={e => {
        // Implement your search logic here
        console.log(e.target.value); // Example placeholder
      }}
    />
  </div>
</div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table {...getTableProps()} className="table table-bordered mb-0">
              <thead style={headerStyle}>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
              <tbody style={tbodyStyle} {...getTableBodyProps()}>
                {page.map(row => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      ))}
                    </tr>
                  ); 
                })}
              </tbody>
            </table>
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
