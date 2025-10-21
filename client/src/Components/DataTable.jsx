import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../Styling/DataTable.css';

const DataTable = ({ title, placeholder, headers }) => {
  return (
    <div className="table-container">
      <h2>{title}</h2>
      <div className="search-bar">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input type="text" placeholder={placeholder} />
      </div>
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={headers.length} className="empty-message">
              No data available.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;