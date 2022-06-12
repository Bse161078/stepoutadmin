import React from 'react';
import { Link } from "react-router-dom";
import { Tooltip } from "@material-ui/core";
import { getVenue,updateSVenue,removePromotion } from '../backend/services/subscriberVenueService';
import SnackBar from "../components/SnackBar";
import '../scss/style.scss'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import firebase from 'firebase';
import FormPage from './FormPage';
export default class PromotionNotification extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      Sid:localStorage.getItem("Sid"),
      users: [],
      allVenue:{
          Promotion:[]
      },
      Promotion:'',
      pages: 1,
      q: "",
      count:0,
      loading: true,
      responseMessage: "Loading Users...",
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success",
      promotion:""
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
  fetchVenue = () => {
    getVenue(this.state.Sid)
      .then((response) => {
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
        
      })
      .catch((err) => {
        this.setState({
          loading: false,
          responseMessage: "No Users Found...",
        });
      });
  };
 
 
   closeSnackBar()
   {
     this.setState({
       showSnackBar:false
     })
   }
   handleRemovePromotion = async (id) =>
   {
    try
    {
        const res = await removePromotion(id,0)
        console.log("removePROMOTION")
        this.setState({
           loading:false,
           showSnackBar:true,
           snackBarMessage:"Promotion removed succesfully",
           snackBarVariant:'success'
        })
        this.fetchVenue()
    }
    catch(e)
    {
        console.log("removePROMOTIONerror")
        this.setState({
            loading:false,
            showSnackBar:true,
            snackBarMessage:"Promotion removed error",
            snackBarVariant:'error'
         })
    }
   }
   handlePromotion = (event) =>
   {
     const { value, name } = event.target;
     const {promotion} = this.state;
     promotion=value
     this.setState({promotion})
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
updatePromotion (venue)
{
    venue.Promotion.push(["asd"])
    try
    {
        const res = updateSVenue(venue.id,venue)
    }
    catch(e)
    {
        console.log("updatePromotionerror",e)
    }
}
  render() {
    const {allVenue} = this.state
    console.log("searchvenue",allVenue)
    return (
      <div class="container my-4"  style={{overflowX:"auto",overflowY:'hidden'}}  >        
         {this.state.loading===true&&
          <div class="loader"></div>
        }
        {this.state.showSnackBar&&
        <SnackBar
            open={this.state.showSnackBar}
            message={this.state.snackBarMessage}
            variant={this.state.snackBarVariant}
            onClose={() => this.closeSnackBar()}
            autoHideDuration={2000}
          />
     }  
      <div className="row space-1">
                  <div className="col-sm-8">
                    <h3>List of Promotions</h3>
                  </div>
                  {/* <div className="col-sm-4"></div> */}
                  <div className="col-sm-2 pull-right mobile-space">
                    <Link to="Venue/AddPromotion">
                      <button type="button" className="btn btn-success"
                        onClick={()=>{
                            localStorage.setItem("venue",JSON.stringify(allVenue))
                        }}                    
                      >
                        Add new Promotions
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
                        name="promotion"
                        placeholder="Enter promotion"
                        onChange={this.handleInputChange}
                      />
                      <span className="input-group-btn" style={{marginRight:10,marginTop:5}} >
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
          <th class="th-sm">Buisness Name
            </th>
           <th>
               Promotion
           </th>
           <th>
               Delete
           </th>
          </tr>
        </thead>
       {allVenue&&
        <tbody>
    
       
        {allVenue.Promotion&&allVenue.Promotion.map((promotion)=>{
                 return(
                    <tr>
                    <td>{allVenue.Name}</td>
                    <td>{promotion}</td>
                    <td>
                    <Tooltip title="Delete" aria-label="delte">
                    <span
                      className="fa fa-trash"
                      style={{ cursor: "pointer" }}
                      aria-hidden="true"
                      onClick={() =>
                        {
                            this.state.loading=true
                            this.setState({
                                loading:true
                            })
                          this.handleRemovePromotion(allVenue.id)
                        }
                      }
                    ></span>
                    </Tooltip>
                    </td>
                    </tr>
                 )})}
           
          
           </tbody>}
       
      </table>
     
  
  
  
    </div>
    );
  }
}

