import React from 'react';
import { Link } from "react-router-dom";
import { Tooltip } from "@material-ui/core";
export default class Blogs extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div class="container my-4" style={{overflow:"auto"}} >
      <div className="row space-1">
                  <div className="col-sm-8">
                    <h3>List of Blogs</h3>
                  </div>
                  {/* <div className="col-sm-4"></div> */}
                  <div className="col-sm-2 pull-right mobile-space">
                    <Link to="/Blogs/BlogsForm">
                      <button type="button" className="btn btn-success">
                        Add new Blogs
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
      <table id="dtBasicExample" class="table table-striped table-bordered" cellspacing="0" width="100%">
        <thead>
          <tr>
            <th class="th-sm">Title
            </th>
            <th class="th-sm">Description
            </th>
            <th class="th-sm">Display Image
            </th>
            <th class="th-sm">Carousel Image
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
            <div id="carouselExampleControls" class="carousel slide" data-mdb-ride="carousel">
            <div class="carousel-inner">
            <div class="carousel-item active">
            <img src="https://mdbcdn.b-cdn.net/img/new/slides/041.webp" class="d-block w-100"  height={100} alt="Wild Landscape"/>
            </div>
            <div class="carousel-item">
            <img src="https://mdbcdn.b-cdn.net/img/new/slides/042.webp" class="d-block w-100" alt="Camera"/>
            </div>
            <div class="carousel-item">
            <img src="https://mdbcdn.b-cdn.net/img/new/slides/043.webp" class="d-block w-100" alt="Exotic Fruits"/>
            </div>
            </div>
            <button class="carousel-control-prev" type="button" data-mdb-target="#carouselExampleControls" data-mdb-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-mdb-target="#carouselExampleControls" data-mdb-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
            </button>
            </div>
            </td>
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
