import React from 'react';
import { Link } from "react-router-dom";
import { Tooltip } from "@material-ui/core";
export default class Trips extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div class="container my-4"  style={{overflow:"auto"}} >
      <div className="row space-1">
                  <div className="col-sm-8">
                    <h3>List of Trips</h3>
                  </div>
                  {/* <div className="col-sm-4"></div> */}
                  <div className="col-sm-2 pull-right mobile-space" >
                    <Link to="/Trips/TripsForm">
                      <button type="button" className="btn btn-success">
                        Add new trips
                      </button>
                    </Link>
                  </div>
                </div>
                  <div className="row space-1">
                  <div className="col-sm-4"></div>
                  <div className="col-sm-4">
                    <div className="input-group">
                      <input
                        
                        className="form-control"
                        type="text"
                        name="search"
                        placeholder="Enter search keyword"
                        
                        // onChange={(event) => }q: event.target.value })}
                      />
                      <span className="input-group-btn">
                        <button
                          type="button"
                         
                        >
                          Search
                        </button>
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-4"></div>
                </div>
      <table id="dtBasicExample" class="table table-striped table-bordered" cellspacing="0" width="100%"  >
        <thead>
          <tr>
            <th class="th-sm   ">Name
            </th>
            <th class="th-sm   ">Description
            </th>
            <th class="th-sm">Display Image
            </th>
            <th class="th-sm   ">Venues
            </th>
            <th class="th-sm   ">Start Time
            </th>
            <th class="th-sm">End Time
            </th>
            <th class="th-sm">Total Time
            </th>
            <th class="th-sm">Add Tags
            </th>
            <th class="th-sm">Edit
            </th>
            <th class="th-sm">Delete
            </th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>California 378A </td>
          <td>System Architect</td>
          <td><img src="https://mdbcdn.b-cdn.net/img/new/slides/042.webp" class="d-block w-100" height={100} alt="Your Image"/></td>
          <td>
          <td>
            <li>
            Madison</li>
            <li> WaterFront</li>
            <li>Aeronaut</li>
            </td>
            </td>
            <td>
              3:15
            </td>
            <td>
              4:15
            </td>
            <td>
              5:15
            </td>
            <td>Outdoor</td>
            <td>
          <Link to={`/events/edit-event`}>
          <Tooltip title="Edit" aria-label="edit">
            <span
              className="fa fa-edit"
              aria-hidden="true"
            ></span>
          </Tooltip>
          </Link>
          </td>
          <td>
          <Tooltip title="Delete" aria-label="delete">
          <span
            className="fa fa-trash"
            style={{ cursor: "pointer" }}
            aria-hidden="true"
            onClick={() =>
              {}
            }
          ></span>
          </Tooltip>
          </td>
        </tr>
        </tbody>
       
      </table>
  
  
  
  
  
    </div>
    );
  }
}
