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
        freeze:editVenue.freeze?editVenue.freeze:'Unfreeze',
        Promotion:editVenue.Promotion?editVenue.Promotion:'',
        pending:editVenue.pending?editVenue.pending:'',
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
      description: RichTextEditor.createEmptyValue(),
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    console.log("venue",this.state.venue)
  }
  
  uploadImage (evt) {
    return new  Promise((resolve,reject)=>{
      console.log(evt,'uploadimage');
      var storage = firebase.storage().ref(`/Venues/`+evt.name);
      const storageRef=storage.put(evt);
      storageRef.on("state_changed" , async()=>{
        let downloadUrl = await storage.getDownloadURL();
       // this.setState({venue:venue})
        console.log('hamzaimage',downloadUrl,storage,evt);
        resolve(downloadUrl)        
    })
  
    })
}

 
  componentDidMount() {
    const { match } = this.props;
    console.log("this.props", this.props);
  }

 
  handleEditVenue=async(addvenue)=>{
    let Images=[]
    let Videos=[]
    console.log("addvenue",addvenue,this.state.Videos)
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
     const res = await updateVenue( addvenue.id,addvenue)
      
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
handleAddVenue=async(addvenue)=>{
  
  let Images=[]
  let Videos=[]
  if(this.state.Cimage||this.state.Videos)
  {
  const imageUrl=await this.uploadImage(this.state.Dimage);
  addvenue.Image=imageUrl;
  const multipleFiles=this.state.Cimage;
  for (let i =0;i<multipleFiles.length;i++)
  {
    const imges=await this.uploadImage(multipleFiles[i])
    Images.push(imges)
  }
  for (let i =0;i<this.state.Videos.length;i++)
  {
    const vid=await this.uploadImage(this.state.Videos[i])
    Videos.push(vid)
  }
}
  addvenue.Images=Images
  addvenue.Videos=Videos;
  this.setState({loading:true})
  console.log("venue",addvenue)
  try{
    const { history } = this.props;
   const res = await addVenue(addvenue)
 //this.state.navigate('/users')
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
handleSAddVenue=async(addvenue)=>{
  
  let Images=[]
  let Videos=[]
  if(this.state.Cimage||this.state.Videos)
  {
  const imageUrl=await this.uploadImage(this.state.Dimage);
  addvenue.Image=imageUrl;
  const multipleFiles=this.state.Cimage;
  for (let i =0;i<multipleFiles.length;i++)
  {
    const imges=await this.uploadImage(multipleFiles[i])
    Images.push(imges)
  }
  for (let i =0;i<this.state.Videos.length;i++)
  {
    const vid=await this.uploadImage(this.state.Videos[i])
    Videos.push(vid)
  }
}
  addvenue.Images=Images
  addvenue.Videos=Videos;
  this.setState({loading:true})
  console.log("venue",addvenue)
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

  handleDisplayImage = (event) => {
  var img = [{}]
  var cimg = [{}]
  var vid = [{}]
  var cVid = [{}]
  for(let i=0;i<event.target.files.length;i++)
  {
    if(event.target.files[i].type.includes("video"))
    {
      const newvid=event.target.files[i]
      newvid["id"] = Math.random()
      cVid.push(URL.createObjectURL(event.target.files[i]))
      vid.push(newvid)
    }
    else{
    const newimage=event.target.files[i]
    newimage["id"] = Math.random()
    cimg.push(URL.createObjectURL(event.target.files[i]))
    img.push(newimage)
  }
}
  cimg.splice(0,1)
  cVid.splice(0,1)
  this.state.cVideoFile=cVid
   this.state.cImageFile=cimg
   vid.splice(0,1)
   this.state.Videos=vid
    img.splice(0,1)
    this.state.Cimage=img
    console.log('targetCimage',this.state.Cimage)
    this.state.venue.Images=""
    this.state.venue.Videos=''
    this.setState(prevState => ({
      venue:{
        ...prevState.venue,
        Images:''
      }
    })
     )
    console.log("cimage",this.state.venue,this.state.Cimage)
  };
  handleCarouselImage = (event) => {
    this.state.Dimage=event.target.files[0]
    this.setState({
      Dfile: URL.createObjectURL(event.target.files[0]),
    });
    this.state.venue.Image=""
    this.setState(prevState => ({
      venue:{
        ...prevState.venue,
        Image:''
      }
    })
     )
     console.log("dimage",this.state.venue)
    console.log("target",event.target.files[0],"targetachieve",this.state.Dimage)
  };


  closeSnackBar = () => {
    const { history } = this.props;
    this.setState({ showSnackBar: false });
    if (this.state.snackBarVariant === "success") {
      history.goBack();
    }
  };

  isRegisteredForFutureEvent= (user)=>{
    if(this.state.upcomingEvents)
    {
      console.log("THese are upcoming events",this.state.upcomingEvents)
      this.state.upcomingEvents.map(
        (event)=>{
          event.participants.map(
            (participants)=>{
              if(participants.userId===user.uuid){
                var message = "Membership of "+user.name+" can not be changed he is participant of future events";
                alert(message)
                return true;
              }
            }
          )
        }
      )
    }
    return false
  }

  handleChange = (e) => {
    if(this.isRegisteredForFutureEvent(this.state.venue)===false)
      {
      this.state.venue.Restaurants=e
        let venue = this.state.venue;
        var restaurants=[{}];
        var resid=1
        let value = Array.from(e, option => option);
       value.map((val)=>{
        const res={
          id:resid,
          name:val,
          selected:true
        }
        restaurants.push(res)
        this.resid+=1
       })
       restaurants.splice(0,1)
       venue.Restaurants=restaurants
       this.state.restaurants=''
        this.setState({venue})
        console.log("This is the restaurants",venue.Restaurants,value,restaurants)
       
      }
  }

  handleChangeOutdoorActivities = (e) =>{
    let venue = this.state.venue;
    var restaurants=[{}];
    var resid=1
    let value = Array.from(e, option => option);
   value.map((val)=>{
    const res={
      id:resid,
      name:val,
      selected:true
    }
    restaurants.push(res)
    resid+=1
   })
   restaurants.splice(0,1)
   venue.OutdoorActivities=restaurants
   this.state.outdooractivity=''
    this.setState(venue)
    console.log("This is the outdooractivities",venue.OutdoorActivities,value,restaurants) 
  }

   handleAddressChange = async (address)=>{
    
    this.setState({address:address})

  }
     handleSelect = async (address) => {
    console.log("This is the dares", address);
    this.state.venue.Address=address
      this.setState({address:address})
  };
  handleChangeStatus = (e) => {
    let venue = this.state.venue;
    var restaurants=[{}];
    var resid=1
    console.log("selected",e)
    
    let value = Array.from(e, option => option);
   value.map((val)=>{
    const res={
      id:resid,
      name:val,
      selected:true
    }
    restaurants.push(res)
    resid+=1
   })
   restaurants.splice(0,1)
   venue.IndoorActivities=restaurants
   this.state.indooractivity=''
    this.setState(venue)
    console.log("This is the indooractivities",venue.IndoorActivities,value,restaurants)
  };
  
   handlePlayVideo = () => {
    this.state.vidRef.current.play();
  }
  videoPlay=(video)=>
  {return(
    <CarouselVideo source={video}/>
  )}
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
   
    console.log("subscriberVenue",subscribervenue)

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
                  <h2>Enter Venue Details</h2>
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
                      Main Display Image
                      </label>
                        <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="Dimage/*"
                          name="profileImage"
                          className="form-control"
                          onChange={this.handleCarouselImage}
                        />
                      </div>
                      </div>
                      {Dimage ? (
                      <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                          <img
                            style={{ marginRight: "5px" }}
                            width="100"
                            className="img-fluid"
                            src={Dfile}
                            alt="profileImage"
                          />
                        </div>
                      </div>
                       ) 
                        : null}
                     <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                      Quality Carousel Images and Videos. 
                      </label>
                        <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="Cimage/*"
                          name="Cimage"
                          multiple
                          className="form-control"
                          onChange={this.handleDisplayImage}
                        />
                      </div>
                      </div>
                      {Cimage ? (
                      <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                        <Slider style={{width:"100px"}}
                         arrows={false} infinite={true} adaptiveHeight={true}
                          autoplaySpeed={2000} autoplay={true}  
                          touchMove={true} dots={true}>
                          {cImageFile&&cImageFile.map((cimage,index)=>{
                          return(
                           
                          <img src={cimage} class="d-block w-100" alt="Wild Landscape"/>

                          )
                          })}
                          {cVideoFile&&cVideoFile.map((cimage,index)=>{
                          return(
                           
                          <video src={cimage} class="d-block w-100" alt="Wild Landscape" //ref={vidRef}
                        onClick={()=><ReactPlayer url={cimage}/>}
                          />

                          )
                          })}
                          </Slider>
                        </div>
                      </div>
                       ) 
                        : null}
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Buisness Name
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="Name"
                          className="form-control"
                          value={venue.Name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Opening Time
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="time"
                          name="Time"
                          className="form-control"
                          value={venue.Time}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Closing Time
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="time"
                          name="endTime"
                          className="form-control"
                          value={venue.endTime}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Address
                      </label>
                      <div className="col-md-6 col-sm-6" >
                          <AddressSuggestion address={address} handleSelect={this.handleSelect} 
                          handleAddressChange={this.handleAddressChange} />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Description 
                      </label>
                      <div className="col-md-6 col-sm-6">
                      <textarea  required
                          type="text"
                          name="Description"
                          className="form-control"
                          value={venue.Description}
                          rows="8"
                          onChange={this.handleInputChange}>
                        Write stuff here...
                        </textarea>
                        </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Type of restaurants
                      </label>
                      <div className="col-md-6 col-sm-6" >
                     <SelectRestaurants onSelectRestaurants={this.handleChange} 
                     selected={venue.Restaurants}
                     />
                        
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Indoor Activities
                      </label>
                      <div className="col-md-6 col-sm-6 " >
                        <SelectIndoorActivities onSelectIndoorActivity={this.handleChangeStatus}
                        selected={venue.IndoorActivities}
                        />
                         
                         
                        
                      </div>
                      
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Outdoor Activities
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <SelectOutdoorActivities onSelectOutdoorActivity={this.handleChangeOutdoorActivities}
                        selected={venue.OutdoorActivities}
                        />
                      </div>
                    </div>
                    {(window.location.href.includes('Venue/EditVenue')||window.location.href.includes('Venue/AddVenue'))&&
                     <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3">
                        Venue Status
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input type="radio" id="freeze" name="freeze" checked={venue.freeze==='Freeze'?true:false} value={"Freeze"}

                         onChange={this.handleInputChange}
                      />
                        <label for="male">Freeze</label>
                        <input type="radio" id="unfreeze" name="freeze" checked={venue.freeze==='Unfreeze'?true:false}  value={"Unfreeze"}
                       onChange={this.handleInputChange}
                      />
                        <label for="female">UnFreeze</label>
                      </div>
                    </div>
                    }
                    {(window.location.href.includes('Venue/EditVenue')||window.location.href.includes('Venue/AddVenue'))&&
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
                          value={venue.Promotion}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>}
                    {window.location.href.includes('Venues')&&venue.Promotion&&
                     <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3">
                        Pending Venues
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input type="radio" id="pending" 
                      name="pending" checked={venue.pending==='Approve'?true:false} value={"Approve"}

                         onChange={this.handleInputChange}
                      />
                        <label for="male">Approve</label>
                        <input type="radio" id="pending" name="pending" 
                      checked={venue.pending==='Disapprove'?true:false}  value={"Disapprove"}
                       onChange={this.handleInputChange}
                      />
                        <label for="female">Disapprove</label>
                      </div>
                    </div>}
                    <div className="ln_solid"></div>
                    <div className="form-group row">
                      <div className="col-md-6 col-sm-6 offset-md-3">
                        <Button
                          className={`btn btn-success btn-lg ${
                            this.state.loading ? "disabled" : ""
                          }`}
                          onClick={()=>{

                            if(this.state.venue.Name&&this.state.venue.Address&&this.state.Dimage!=""){
                           if(window.location.href.includes("Venues/AddVenue"))
                           {
                             
                             this.state.loading=true
                             this.setState({loading:true})
                             this.handleAddVenue(this.state.venue)
                           }
                           else  if(window.location.href.includes("Venue/AddVenue"))
                           {
                             this.state.loading=true
                             this.setState({loading:true})
                             this.handleSAddVenue(this.state.venue)
                           }
                          else if(window.location.href.includes('Venues/EditVenue'))
                          {
                             this.state.loading=true
                             this.setState({loading:true})
                             
                             if(venue.Promotion)
                             this.handleSEditVenue(venue)
                             else
                             this.handleEditVenue(this.state.venue)
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
                            if(window.location.href.includes('Venues'))
                            history.push('/Venues')
                            else
                            history.push('/Venue')
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

