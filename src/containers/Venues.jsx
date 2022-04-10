import React from 'react';
import { Link } from "react-router-dom";
import { Tooltip } from "@material-ui/core";
import { getVenues,deleteVenue } from '../backend/services/VenueServices';
import SnackBar from "../components/SnackBar";
import Swal from "sweetalert2";
import '../scss/style.scss'
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
let searchbyname=""
export default class Venues extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      users: [],
      allVenue: [],
      pages: 1,
      q: "",
      count:0,
      loading: true,
      responseMessage: "Loading Users...",
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success",
      search:""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }
  
  componentDidMount(){
    this.fetchVenue()

  }
  handleInputChange(event) {
    const { value, name } = event.target;
    this.setState({
      search:value
    })
  }
  fetchVenue = () => {
    getVenues()
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
          allVenue: response,
          loading:false
        });
        console.log('allvenuebynamee',this.state.allVenue)
      })
      .catch((err) => {
        console.log("#######err#####", err);
        this.setState({
          loading: false,
          responseMessage: "No Users Found...",
        });
      });
  };
  removeVenue(venueId, index) {
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
        deleteVenue(venueId)
          .then((response) => {
            console.log("deleteuser",response)
            const venues = [...this.state.allVenue]; 
             this.state.allVenue.slice();
            let selectedIndex = null;
            venues.forEach((venue, index) => {
              if (venue.id === venueId) {
                selectedIndex = index;
              }
            });
            if (selectedIndex) {
              venues.splice(selectedIndex, 1);
            }

            this.setState({
              users: [...venues],
              allusers:[...venues],
              showSnackBar: true,
              snackBarMessage: "Venue deleted successfully",
              snackBarVariant: "success",
            });
            this.fetchVenue();
          })
          .catch((e) => {
            console.log("deleteuser",e)
            this.setState({
              showSnackBar: true,
              snackBarMessage: "Error deleting venue",
              snackBarVariant: "error",
            });
          });
      }
    });
  }
   closeSnackBar()
   {
     this.setState({
       showSnackBar:false
     })
   }

   handleSearchVenue()
   {
     console.log('venuesearching',this.state.allVenue)
     if(this.state.allVenue.length>0)
     {
       
     let searchvenue=[]
     let venues = this.state.allVenue
     let search = this.state.search
     if(search!="")
     {
     venues.map((ven)=>{
        if(search=ven.Name)
        {
          searchvenue.push(ven)
        }
     })
     searchvenue.splice(0,1)
     venues=searchvenue
     }
     else{
       this.fetchVenue()
     }
    
   }
  }

  render() {
    console.log("searchvenue",this.state)
    return (
      <div class="container my-4"  style={{overflowX:"auto",overflowY:'hidden'}}  >
         {this.state.loading===true&&
          <div class="loader"></div>
        }
  {   this.state.showSnackBar&&
        <SnackBar
            open={this.state.showSnackBar}
            message={this.state.snackBarMessage}
            variant={this.state.snackBarVariant}
            onClose={() => this.closeSnackBar()}
          />
     }   <div className="row space-1">
                  <div className="col-sm-8">
                    <h3>List of Venues</h3>
                  </div>
                  {/* <div className="col-sm-4"></div> */}
                  <div className="col-sm-2 pull-right mobile-space">
                    <Link to="/Venues/AddVenue">
                      <button type="button" className="btn btn-success">
                        Add new Venue
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
                        placeholder="Enter venues name"
                        onChange={this.handleInputChange}
                         //onChange={(event) => q: event.target.value }
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
      <table  width={1000} style={{tableLayout:'auto'}} class="table table-striped table-bordered"  >
        <thead>
          <tr>
            <th class="th-sm" >Address
            </th>
            <th class="th-sm">Description
            </th>
            <th class="th-sm">Display Image
            </th>
            <th class="th-sm">Carousel Image
            </th>
            <th class="th-sm">Name
            </th>
            <th class="th-sm">Opening time
            </th>
            <th class="th-sm">Closing time
            </th>
            {/* <th class="th-sm">Ratings
            </th> */}
            <th class="th-sm">Indoor Activities
            </th>
            <th class="th-sm">Type of restaurant
            </th>
            <th class="th-sm">Outdoor Activities
            </th>
            <th class="th-sm">Edit
            </th>
            <th class="th-sm">Delete
            </th>
          </tr>
        </thead>
        <tbody 
         >
           
        {this.state.allVenue&&this.state.allVenue
        .filter((venue)=>(venue.Name).toLowerCase().includes((this.state.search).toLowerCase()))
        .map((venue) => {
          return(
        <tr >
          <td>{venue.Address}</td>

          <td 
          >{venue.Description}</td>
          <td><img src={venue.Image} class="d-block w-100" alt="Your Image"/></td>
          <td>
            
          <Slider style={{width:"100px"}} arrows={false} infinite={true} adaptiveHeight={true} autoplaySpeed={2000} autoplay={true}  touchMove={true} dots={true}>
            {venue.Images&&venue.Images.map((cimage)=>{
            return(
            <img src={cimage} class="d-block w-100" alt="Wild Landscape"/>
            
             )
            })}
            </Slider>
            </td>
          <td>{venue.Name}</td>
          <td>{venue.Time}</td>
          <td>{venue.endTime}</td>
          {/* <td>{venue.Rating}</td> */}
          <td>{venue.IndoorActivities&&venue.IndoorActivities.map((res)=>{
            return(
              <li>{res.name}</li>
            )
          })}</td>
          <td>{venue.Restaurants&&venue.Restaurants.map((res)=>{
            return(
              <li>{res.name}</li>
            )
          })}</td>
           <td>{venue.OutdoorActivities&&venue.OutdoorActivities.map((res)=>{
            return(
              <li>{res.name}</li>
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
                this.removeVenue(venue.id)
              }
            }
          ></span>
          </Tooltip>
          </td>
        </tr>
          )})}
        </tbody>
       
      </table>
     
  
  
  
    </div>
    );
  }
}

