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
    backgroundColor: '#007bff', // Using Bootstrap primary color
    color: 'white'
  };

  return (
    <div className="container-fluid custom-container mt-5" style={{ maxWidth: '95%' }}>
      <div className="card">
        <div className="card-header text-white bg-primary">
          <h4 className="my-0">People</h4>
          <select
              className="form-control"
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}
              style={{ width: 'auto' }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
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
              <tbody {...getTableBodyProps()}>
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
