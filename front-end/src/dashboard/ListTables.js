import React from "react";

function ListTables({ tables, handleFinish }){
    return (
        <div>
          <div>
              <table className="table table-striped table-bordered">
                  <thead className="thread-dark">
                    <tr>
                      <th>Table ID</th>
                      <th>Table Name</th>
                      <th>Capacity</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tables.map((table) => (
                        <tr key={table.table_id}>
                        <td>{table.table_id}</td>
                        <td>{table.table_name}</td>
                        <td>{table.capacity}</td>
                        <td data-table-id-status={table.table_id}>
                            {table.reservation_id === null ? "free" : "occupied"}
                        </td>
                        <td>
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-table-id-finish={table.table_id}
                                onClick={() => handleFinish({table_id: table.table_id, reservation_id: table.reservation_id})}
                                
                            >
                             Finish
                            </button>
                        </td>
                        </tr>
                    ))}
                  </tbody>
              </table>
          </div>
    </div>
        
    )

}

export default ListTables;