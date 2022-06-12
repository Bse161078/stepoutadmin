import React from 'react';
import { Link } from "react-router-dom";
import { Tooltip } from "@material-ui/core";
import { getVenue,removeVenue,updateSVenue } from '../backend/services/subscriberVenueService';
import SnackBar from "../components/SnackBar";
import Swal from "sweetalert2";
import '../scss/style.scss'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { cancelSubscription,getSubscriberById } from '../backend/services/subscriberVenueService';
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
      search:"",
      showAddButton:false,
      Isfreeze:false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }
  
  componentDidMount(){
    this.fetchVenue()
    localStorage.setItem("venue","")
   
  }
  handleInputChange(event) {
    const { value, name } = event.target;
    this.setState({
      search:value
    })
  }

  handleCancelSubscription = async (sub_id) =>{
   this.setState({
     loading:true
   })
    try
    {
      const allVenue= this.state
      const response = await getSubscriberById()
      const res =await cancelSubscription(response.subscription_id)
      allVenue.status="canceled"
      this.setState({
        allVenue
      })
      const updateres = await updateSVenue( allVenue.id,allVenue)      
      this.setState({
        loading: false,
        showSnackBar: true,
        snackBarMessage: "Subscription has been Canceled!",
        snackBarVariant: "success",
      });
    }
    catch(err)
    {
      this.setState({
        loading: false,
        showSnackBar: true,
        snackBarMessage: "Subscription cancel error!",
        snackBarVariant: "error",
      });    }
      this.fetchVenue()
  }

  fetchVenue = () => {
      const sid=localStorage.getItem('Sid')
    getVenue(sid)
      .then((response) => {
          console.log('sid',sid)
        console.log("############", response)
        this.state.allVenue=response
          this.setState({
          users:response,
          allVenue: response,
          loading:false
        });
        this.state.Isfreeze=this.state.allVenue?.Isfreeze
              if(this.state.allVenue?.Name)
          {
            this.state.showAddButton=false
            this.setState({
              showAddButton:false
            })
         }
          else
          {
            this.state.showAddButton=true
            this.setState({
              showAddButton:true
            })

          }
      })
      .catch((err) => {
        this.setState({
          showAddButton:false,
          loading: false,
          responseMessage: "No Venue Found...",
        });
        console.log("#######err#####", this.state.showAddButton);

      });
  };
  updateIsfreeze=async()=>{
    this.setState({loading:true})
    this.state.allVenue.Isfreeze=this.state.Isfreeze
    console.log("addSvenue",this.state.allVenue)
    try{
     const res = await updateSVenue( this.state.allVenue.id,this.state.allVenue)
     this.setState({
      loading: false,
      showSnackBar: true,
      snackBarMessage: "Venue Status Updated!",
      snackBarVariant: "success",
    });
   }
   catch(e)
   {
    this.setState({
      loading: false,
      showSnackBar: true,
      snackBarMessage: "Error updating venue status",
      snackBarVariant: "error",
    });
    console.log("err = ",e)
   }
  }
  handleToggle = () => {
  
    this.state.Isfreeze=!(this.state.Isfreeze)
    console.log("handleToggle",this.state.Isfreeze)
    this.updateIsfreeze()

};
  handleRemoveVenue(venueId) {
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
          removeVenue(venueId)
          .then((response) => {
              console.log("venueremove",venueId)
            console.log("deleteuser",response)
            this.setState({
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
          this.fetchVenue();
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
    const {allVenue} = this.state
    console.log("searchvenue",allVenue,this.state.showAddButton)
    return (
      <div class="container my-4"  style={{overflowX:"auto",overflowY:'hidden'}}  >
        {
          this.state.allVenue?.status==='canceled'&&
          <h1 style={{display:'flex',justifyContent:'center'}} >Your Subscription has been Canceled!</h1>
        }
         {this.state.loading===true&&
          <div class="loader"></div>
        }
  {   this.state.showSnackBar&&
        <SnackBar
            open={this.state.showSnackBar}
            message={this.state.snackBarMessage}
            variant={this.state.snackBarVariant}
            onClose={() => this.closeSnackBar()}
            autoHideDuration={2000}
          />
     } {this.state.allVenue?.status!=='canceled'&&
     <div>   
     <div className="row space-1">
                  <div className="col-sm-8">
                    <h3>Your Venue</h3>
                  </div>
                  {/* <div className="col-sm-4"></div> */}
                  { this.state.showAddButton&&
                  <div className="col-sm-2 pull-right mobile-space">
                    <Link to="/Venue/AddVenue">
                      <button type="button" className="btn btn-success">
                        Add new Venue
                      </button>
                    </Link>
                  </div>
                  }
                </div>
      <table  width={1000} style={{tableLayout:'auto'}} class="table table-striped table-bordered"  >
        <thead>
          <tr>
          <th class="th-sm">Buisness Name
            </th>
            <th class="th-sm" >Address
            </th>
            <th class="th-sm">Description
            </th>
            <th class="th-sm">Main Display Image
            </th>
            <th class="th-sm"> Quality Carousel Images and Videos
            </th>
            <th class="th-sm">Opening Time
            </th>
            <th class="th-sm">Closing Time
            </th>
            {/* <th class="th-sm">Ratings
            </th> */}
            <th class="th-sm">Indoor Activities Tags
            </th>
            <th class="th-sm">Type of restaurant Tags
            </th>
            <th class="th-sm">Outdoor Activities Tags
            </th>
            <th class="th-sm">Venue Status
            </th> 
            <th class="th-sm">Promotion
            </th>
            <th class="th-sm">Website
            </th>
            <th class="th-sm">Venue Status
            </th>
            <th class="th-sm">Cancel Subscribtion
            </th>
            <th class="th-sm">Edit
            </th>
            <th class="th-sm">Delete
            </th>
          </tr>
        </thead>
        <tbody 
         >
           
        {allVenue?.Name&&
            <tr >
            <td>{allVenue.Name}</td>
            <td>{allVenue.Address}</td>
            <td>{allVenue.Description}</td>
            <td><img src={allVenue.Image} class="d-block w-100" alt="Your Image"/></td>
            <td>
                
            <Slider style={{width:"100px"}} arrows={false} infinite={true}
             adaptiveHeight={true} autoplaySpeed={2000} autoplay={true}  touchMove={true} dots={true}>
                {allVenue.Images&&allVenue.Images.map((cimage)=>{
                return(
                <img src={cimage} class="d-block w-100" alt="Wild Landscape"/>
                
                )
                })}
                {allVenue.Videos&&allVenue.Videos.map((cimage)=>{
                return(
                <video src={cimage} class="d-block w-100" alt="Wild Landscape"/>
                
                )
                })}
                </Slider>
                </td>
            <td>{allVenue.Time}</td>
            <td>{allVenue.endTime}</td>
            {/* <td>{allVenue.Rating}</td> */}
            <td>{allVenue.IndoorActivities&&allVenue.IndoorActivities.map((res)=>{
                return(
                <ul>
                    <li>{res.name}</li>
                </ul>
                )
            })}</td>
            <td>{allVenue.Restaurants&&allVenue.Restaurants.map((res)=>{
                return(
                <ul>
                <li>{res.name}</li>
                </ul>
                )
            })}</td>
            <td>{allVenue?.OutdoorActivities&&allVenue.OutdoorActivities.map((res)=>{
                return(
                <ul>
                <li>{res.name}</li>
                </ul>
                )
            })}</td>
             <td>{allVenue.VenueStatus}</td>
             <td>{allVenue.Promotion}</td>
             <td>{allVenue.Website}</td>
            <td>
               <FormControlLabel
                 control={
                 <Switch
                  checked={this.state.allVenue.Isfreeze}
                  onClick={() => this.handleToggle()}
                  value= {true}
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
              />}
                  labelPlacement={"end"}
                  label={this.state.allVenue.Isfreeze===true?"Unfreeze":"Freeze"}
              />
            </td>
           
            <td>
             <button type="button" class="btn btn-danger"
           onClick={()=>{
            this.handleCancelSubscription()
           }}
          >Cancel Subscribtion</button>
             </td>
            <td>
            <Link to={`/Venue/EditVenue`}>
            <Tooltip title="Edit" aria-label="edit"
            onClick={()=>{
                localStorage.setItem("venue",JSON.stringify(allVenue))
            }}
            >
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
                    this.handleRemoveVenue(allVenue.id)
                }
                }
            ></span>
            </Tooltip>
            </td>
            
            </tr>
             }
        </tbody>
       
      </table>
     
      </div>
  }
  
    </div>
    );
  }
}

