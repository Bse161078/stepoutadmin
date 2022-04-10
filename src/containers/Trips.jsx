import React from 'react';
import { Link } from "react-router-dom";
import { Tooltip } from "@material-ui/core";
import { getTrips,deleteTrip } from '../backend/services/TripsService';
import '../scss/style.scss'
import Swal from "sweetalert2";
import SnackBar from '../components/SnackBar';
export default class Trips extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      users: [],
      allTrips: [],
      pages: 1,
      q: "",
      loading: true,
      responseMessage: "Loading Users...",
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success",
      search:''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  componentDidMount(){
    this.fetchTrips()
  }
  removeTrip(tripId, index) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.value) {
        deleteTrip(tripId)
          .then((response) => {
            console.log("deleteuser",response)
            const trips = [...this.state.allTrips]; 
             this.state.allTrips.slice();
            let selectedIndex = null;
            trips.forEach((venue, index) => {
              if (venue.id === tripId) {
                selectedIndex = index;
              }
            });
            if (selectedIndex) {
              trips.splice(selectedIndex, 1);
            }

            this.setState({
              users: [...trips],
              allTrips:[...trips],
              showSnackBar: true,
              snackBarMessage: "Trip deleted successfully",
              snackBarVariant: "success",
            });
            this.fetchTrips();
          })
          .catch((e) => {
            console.log("deleteuser",e)
            this.setState({
              showSnackBar: true,
              snackBarMessage: "Error deleting Trip",
              snackBarVariant: "error",
            });
          });
      }
    });
  }

  fetchTrips = () => {
    getTrips()
      .then((response) => {
        console.log("############", response);
        var keepIndex = [
          207, 208, 209, 210, 212, 216, 220, 221, 222, 223, 224, 225, 257, 258,
          259, 274, 275, 337, 357, 368, 369, 370, 373, 379, 380, 393, 394, 395,
          408, 409, 417, 418, 512, 513, 592, 644, 646, 718, 800, 884, 885, 957,
          958, 1025, 1026, 1027, 1189, 1271, 1275, 1286, 1440, 1480, 1495, 1510,
          1593, 1594, 1599, 1600, 1613, 1631, 1686, 1981, 2006, 2040, 2094,
          2121, 2274, 2403, 2868, 2880, 3230, 3330, 3331, 3332, 3337, 3338,
          3339, 3340, 3341, 3343, 3344, 3346, 3348, 3349, 3350, 3351, 3352,
          3353, 3359, 3360, 3361, 3365, 3372, 3373, 3378, 3396, 3412, 3425,
          3427, 3437, 3443, 3444, 3446, 3854, 3855, 3882, 3883, 3937, 3939,
          3948, 3949, 4009, 4167, 4278, 4279, 4281, 4297, 4300, 4301, 4452,
        ];
          this.setState({
          users: response,
          allTrips: response,
          loading:false
        });
        console.log('allvenue',this.state.allTrips)
      })
      .catch((err) => {
        console.log("#######err#####", err);
        this.setState({
          loading: false,
          responseMessage: "No Users Found...",
        });
      });
  };
  closeSnackBar = () => {
    this.setState({ showSnackBar: false });
  };
  handleInputChange(event) {
    const { value, name } = event.target;
    this.setState({
      search:value
    })
  }
  render() {
    const {
      loading,
      showSnackBar,
      snackBarMessage,
      snackBarVariant,
    } = this.state;
    return (
      <div class="container my-4"  style={{overflow:"auto"}} >
         {this.state.loading===true&&
          <div class="loader"></div>
        }
        {this.state.showSnackBar&&<SnackBar
            open={showSnackBar}
            message={snackBarMessage}
            variant={snackBarVariant}
            onClose={() => this.closeSnackBar()}
          />}
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
                        placeholder="Enter trips name"
                        onChange={this.handleInputChange}
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
      <table width={1000} style={{tableLayout:'auto'}} class="table table-striped table-bordered" >
        <thead>
          <tr>
            <th class="th-sm   ">Name
            </th>
            <th class="th-sm   ">Ratings
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
            <th class="th-sm">Review
            </th>
            <th class="th-sm">Restaurants
            </th>
            <th class="th-sm">Indoor Activities
            </th>
            <th class="th-sm">Outdoor Activities
            </th>
            <th class="th-sm">Edit
            </th>
            <th class="th-sm">Delete
            </th>
          </tr>
        </thead>
        <tbody>
        {this.state.allTrips&&this.state.allTrips.filter((trip)=>(trip.Name).toLowerCase().includes((this.state.search).toLowerCase())).map((trip) => {
          return(
        <tr>
          <td>{trip.Name}</td>
          <td>{trip.Rating}</td>
          <td><img src={trip.Image} class="d-block w-100"  alt="Your Image"/></td>
          <td>
          <td>
          {trip.Venues&&trip.Venues.map((venue)=>{
            return(
            <li>Name : {venue.Name}
            <li>
            Address : {venue.Address}
            </li>
            <img src= {venue.Image} height="50%" class="d-block w-100"/>
            
            </li>
                    )
                              })}
            
            </td>
            </td>
            <td>
             {trip.startTime}
            </td>
            <td>
            {trip.endTime}
            </td>
            <td>
            {trip.endTime}
            </td>
            <td> {trip.Reviews.map((review)=>{
            return(
            <li>
                Review : {review.Review}
                <li>
                Rating : {review.Rating}
                </li>
            </li>
              
            )
                 })}</td>
                 <td> {trip.restaurants&&trip.restaurants.map((res)=>{
            return(
                    <p>{res.name}</p>  
              
                  )
                 })}</td>
                 <td> {trip.IndoorActivities&&trip.IndoorActivities.map((res)=>{
            return(
                     <p>{res.name}</p> 
                )
                 })}</td>
                 <td> {trip.OutdoorActivities&&trip.OutdoorActivities.map((res)=>{
            return(
                     <p>{res.name}</p> 
              
                 )
                 })}</td>
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
              {
                this.removeTrip(trip.id)
              }
            }
          ></span>
          </Tooltip>
          </td>
        </tr>
          )
        })}
        </tbody>
       
      </table>
  
  
  
  
  
    </div>
    );
  }
}
