import React from 'react';
import '../css/DateTable.scss';

const DateTable = () => {
  const apartments = ['Ap 1', 'Ap 2', 'Ap 3'];
  const dates = ['01/01', '02/01', '03/01', '04/01', '05/01', '06/01', '07/01'];

  return (
    <div className="date-table">
      <table>
        <thead>
          <tr>
            <th></th>
            {dates.map((date, index) => (
              <th key={index}>{date}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {apartments.map((apartment, index) => (
            <tr key={index}>
              <td>{apartment}</td>
              {dates.map((date, i) => (
                <td key={i}>
                  {/* Aquí se puede agregar lógica para mostrar reservas */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DateTable;
