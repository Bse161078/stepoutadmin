import React, {useRef} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import RichTextEditor from "react-rte";
import { Button, Carousel } from "reactstrap";
import Checkbox from '@mui/material/Checkbox';
import {
  addUser,
  updateUser,
  getUserById,
} from "../backend/services/usersService";
import { Select } from 'antd';
import 'select-pure/dist/index.js';
import moment from "moment";
import { firebase } from "../backend/firebase";
import '../scss/style.scss'
import { imageResizeFileUri } from "../static/_imageUtils";
import { v4 as uuidv4 } from "uuid";
import SnackBar from "../components/SnackBar";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import {addSVenue,updateSVenue} from "../backend/services/subscriberVenueService"
import SelectRestaurants from './SelectRestaurants'
import "react-select/dist/react-select.css";
import { TextField } from "@material-ui/core";
import { addVenue,updateVenue } from "../backend/services/VenueServices";
import { selectClasses } from "@mui/material";
import SelectIndoorActivities from "./SelectIndoorActivities"
import SelectOutdoorActivities from "./SelectOutoorActivities"
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from "@material-ui/lab/Autocomplete";
import AddressSuggestion from "./AddressSuggestion";
import CarouselVideo from "./CarouselVideo";
import ReactPlayer from 'react-player'
export default class VenuesForm extends React.Component {
  
  constructor(props) {
    const editVenue = localStorage.getItem("venue")!=''?JSON.parse(localStorage.getItem("venue")):'';
    console.log("editvenue",editVenue)
    super(props);
    this.state = {
      loading: false,
      venue: {
        id: editVenue.id?editVenue.id:'',
        Name: editVenue.Name?editVenue.Name:'',
        endTime:editVenue.endTime?editVenue.endTime:'',
        Time: editVenue.Time?editVenue.Time:"",
        Restaurants:editVenue.Restaurants?editVenue.Restaurants:'',
        Description: editVenue.Description?editVenue.Description:"",
        IndoorActivities:editVenue.IndoorActivities?editVenue.IndoorActivities:"",
        OutdoorActivities:editVenue.OutdoorActivities?editVenue.OutdoorActivities:"",
        Address:editVenue.Address?editVenue.Address:'',
        Image:editVenue.Image?editVenue.Image:'',
        Images:editVenue.Images?editVenue.Images:[],
        Videos:editVenue.Videos?editVenue.Videos:[],
        Isfreeze:false,
        Promotion:editVenue.Promotion?editVenue.Promotion:[],
        VenueStatus:editVenue.pending?editVenue.pending:"Pending",
      },
      restaurants:editVenue.Restaurants?editVenue.Restaurants:'',
      indooractivity:editVenue.IndoorActivities?editVenue.IndoorActivities:"",
      outdooractivity:editVenue.OutdoorActivities?editVenue.OutdoorActivities:"",
      resId:1,
      indoorId:1,
      outdoorId:1,
      address:editVenue.Address?editVenue.Address:'',
      subscribervenue: localStorage.getItem('subscriber'),
      pastEvents: [],
      selected:[],
      Videos:[],
      Sid:localStorage.getItem('Sid'),
      image: "",
    //  vidRef: useRef(null),
      Cimage:editVenue.Images?editVenue.Images:[],
      Dimage:editVenue.Image?editVenue.Image:'',
      Dfile:editVenue.Image?editVenue.Image:'',
      cImageFile: editVenue.Images?editVenue.Images:[],
      cVideoFile:editVenue.Videos?editVenue.Videos:[],
      userId: "",
      Promotion:'',
      description: RichTextEditor.createEmptyValue(),
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange = (event) => {
    const { value, name } = event.target;

    const { venue } = this.state;
    venue[name] = value;
    this.setState({ venue });
  }
handlePromotion = (event) =>
{
  const { value, name } = event.target;
  let {Promotion} = this.state;
  Promotion=value
  this.setState({Promotion})
}
  uploadImage (evt) {
    return new  Promise((resolve,reject)=>{
      console.log(evt,'uploadimage');
      var storage = firebase.storage().ref(`/Venues/`+evt.name);
      const storageRef=storage.put(evt);
      storageRef.on("state_changed" , async()=>{
        let downloadUrl = await storage.getDownloadURL();
       // this.setState({venue:venue})
        resolve(downloadUrl)        
    })
  
    })
}

 
  componentDidMount() {
    const { match } = this.props;
    console.log("this.props", this.props);
  }
  handleSEditVenue=async(addvenue)=>{
    let Images=[]
    let Videos=[]
    console.log('handleSedit')
    if(addvenue.Image==='')
    {
    const imageUrl=await this.uploadImage(this.state.Dimage);
    addvenue.Image=imageUrl;
    }
    else if(addvenue.Videos===''||addvenue.Images==='')
    {
    
    const multipleFiles=this.state.Cimage;
    console.log("multiplefiles",multipleFiles)
    for (let i =0;i<multipleFiles.length;i++)
    {
      const imges=await this.uploadImage(multipleFiles[i])
      Images.push(imges)
    }
    for (let i =0;i<this.state.Videos.length;i++)
    {
      const imges=await this.uploadImage(this.state.Videos[i])
      Videos.push(imges)
    }
    addvenue.Images=Images;
    addvenue.Videos=Videos;
  }
    this.setState({loading:true})
    console.log("venue",addvenue)
    try{
      const { history } = this.props;
     const res = await updateSVenue( addvenue.id,addvenue)
     this.setState({
      loading: false,
      showSnackBar: true,
      snackBarMessage: "Venue Updated!",
      snackBarVariant: "success",
    });
   }
   catch(e)
   {
    this.setState({
      loading: false,
      showSnackBar: true,
      snackBarMessage: "Error updating venue",
      snackBarVariant: "error",
    });
    console.log("err = ",e)
   }
  }

handleSAddVenue=async(addvenue)=>{
  
  this.setState({loading:true})
  console.log("venue",addvenue)
  addvenue.Promotion.push(this.state.Promotion)
  try{
    const { history } = this.props;
   const res = await addSVenue(addvenue,this.state.Sid)
   this.setState({
    loading: false,
    showSnackBar: true,
    snackBarMessage: "Venue Created!",
    snackBarVariant: "success",
  });
 }
 catch(e)
 {
  this.setState({
    loading: false,
    showSnackBar: true,
    snackBarMessage: "Error creating venue",
    snackBarVariant: "error",
  });
  console.log("err = ",e)
 }
}

 

  closeSnackBar = () => {
    const { history } = this.props;
    this.setState({ showSnackBar: false });
    if (this.state.snackBarVariant === "success") {
      history.goBack();
    }
  };

  render() {
    const { Option } = Select;
    console.log(this.state);
    const {
      venue,
      showSnackBar,
      subscribervenue,
      snackBarMessage,
      snackBarVariant,
      Cimage,
      cImageFile,
      cVideoFile,
      Dimage,
      Dfile,
      address,
      vidRef,
      indooractivity,
      outdooractivity
    } = this.state;
   
    var {indoorId,outdoorId,resId} =this.state
    const { match, history } = this.props;
    const isEdit = !!match.params.userId;
    console.log(this.state,this.state.Videos)
  
    return (
      <div className="row animated fadeIn">
        {this.state.loading===true&&
          <div class="loader"></div>
        }
        {showSnackBar && (
          <SnackBar
            open={showSnackBar}
            message={snackBarMessage}
            variant={snackBarVariant}
            autoHideDuration={1000}
            onClose={() => this.closeSnackBar()}
          />
        )}
        <div className="col-12">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Promotion</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                   // onSubmit={history.push('/Venues/AddVenue')}
                  >
                    
                   
                     <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3">
                        Promotion
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="Promotion"
                          className="form-control"
                          value={this.state.Promotion}
                          onChange={this.handlePromotion}
                        />
                      </div>
                    </div>
                    <div className="ln_solid"></div>
                    <div className="form-group row">
                      <div className="col-md-6 col-sm-6 offset-md-3">
                        <Button
                          className={`btn btn-success btn-lg ${
                            this.state.loading ? "disabled" : ""
                          }`}
                          onClick={()=>{

                            if(this.state.Promotion!=""){
                           
                            if(window.location.href.includes("Venue/AddPromotion"))
                           {
                             this.state.loading=true
                             this.setState({loading:true})
                             this.handleSAddVenue(this.state.venue)
                           }
                        
                          else if(window.location.href.includes('Venue/EditVenue'))
                          {
                             this.state.loading=true
                             this.setState({loading:true})
                             this.handleSEditVenue(this.state.venue)
                          }}
                           else{
                             this.setState({
                               showSnackBar:true,
                               snackBarMessage:"Please fill the form",
                               snackBarVariant: "error",
                             })
                           }
                           }}
                        >
                          <i
                            className={`fa fa-spinner fa-pulse ${
                              this.state.loading ? "" : "d-none"
                            }`}
                          />
                          {isEdit ? " Update" : " Submit"}
                        </Button>
                        <Button
                          onClick={() =>{
                           history.push('/Promotions')
                          }}
                          className={`mx-3 btn btn-danger btn-lg`}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

