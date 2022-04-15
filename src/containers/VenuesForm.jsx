import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import RichTextEditor from "react-rte";
import { Button } from "reactstrap";
import {
  addUser,
  updateUser,
  getUserById,
} from "../backend/services/usersService";
import moment from "moment";
import { firebase } from "../backend/firebase";
import '../scss/style.scss'
import { imageResizeFileUri } from "../static/_imageUtils";
import { v4 as uuidv4 } from "uuid";
import SnackBar from "../components/SnackBar";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {
  getEvents,
} from "../backend/services/eventService";
import Select from "react-select";
import "react-select/dist/react-select.css";
import { TextField } from "@material-ui/core";
import { addVenue,updateVenue } from "../backend/services/VenueServices";
export default class VenuesForm extends React.Component {
  constructor(props) {
    const editVenue = localStorage.getItem("venue")!=''?JSON.parse(localStorage.getItem("venue")):'';
    console.log("editvenue",editVenue)
    let location = window.location.href
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
        Images:editVenue.Images?editVenue.Images:[]
      },
      restaurants:editVenue.Restaurants?editVenue.Restaurants:'',
      indooractivity:editVenue.IndoorActivities?editVenue.IndoorActivities:"",
      outdooractivity:editVenue.OutdoorActivities?editVenue.OutdoorActivities:"",
      resId:1,
      indoorId:1,
      outdoorId:1,
      upcomingEvents: [],
      pastEvents: [],
      image: "",
      Cimage:editVenue.Images?editVenue.Images:[],
      Dimage:editVenue.Image?editVenue.Image:'',
      Dfile:editVenue.Image?editVenue.Image:'',
      Cfile: editVenue.Images?editVenue.Images:[],
      userId: "",
      description: RichTextEditor.createEmptyValue(),
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.postUser = this.postUser.bind(this);
    console.log("venue",this.state.venue)
  }
  uploadImage (evt) {
    return new  Promise((resolve,reject)=>{
      console.log(evt);
      var storage = firebase.storage().ref(`/Venues/`+evt.name);
      const storageRef=storage.put(evt);
      storageRef.on("state_changed" , async()=>{
        let downloadUrl = await storage.getDownloadURL();
       // this.setState({venue:venue})
        console.log('hamzaimage',downloadUrl);
        resolve(downloadUrl)        
    })
  
    })
}
uploadCImage = (evt)=>{
  return new  Promise((resolve,reject)=>{
  var storage = firebase.storage().ref(`/Venues`);
    const storageRef=storage.put(evt);
    storageRef.on("state_changed" , async()=>{
      let downloadUrl = await storage.getDownloadURL();
      console.log('hamzaimage',evt);
      resolve(downloadUrl)  
  });
})
}

  fetchEvent = () => {
    this.setState({ loading: true });
    getEvents()
      .then((response) => {
        this.setState({
          events: response,
          loading: false,
          responseMessage: "No Events Found",
        });

        const upcoming = response.filter((element) => {
          let date = moment(new Date(element.date.seconds * 1000));
          let curentDate = new Date();
          console.log(
            `${element.name} minutes up:`,
            date.diff(curentDate, "minutes")
          );
          return date.diff(curentDate, "minutes") > 0 && element.status == true;
        });
        const past = response.filter((element) => {
          let date = moment(new Date(element.date.seconds * 1000));
          let curentDate = new Date();
          // console.log(
          //   `${element.name} minutes past:`,
          //   date.diff(curentDate, "minutes")
          // );

          return date.diff(curentDate, "minutes") < 0 || !element.status;
        });

        upcoming.sort((a, b) => {
          var nameA = moment(new Date(a.date.seconds * 1000));
          // var nameA = a.item_name.charAt(0).toUpperCase();
          var nameB = moment(new Date(b.date.seconds * 1000));
          if (nameA.diff(nameB, "minutes") < 0) {
            return -1;
          }
          if (nameA.diff(nameB, "minutes") > 0) {
            return 1;
          }
          // names must be equal
          return 0;
        });

        past.sort((a, b) => {
          var nameA = moment(new Date(a.date.seconds * 1000));
          // var nameA = a.item_name.charAt(0).toUpperCase();
          var nameB = moment(new Date(b.date.seconds * 1000));

          if (nameA.diff(nameB, "minutes") > 0) {
            return -1;
          }
          if (nameA.diff(nameB, "minutes") < 0) {
            return 1;
          }
          // names must be equal
          return 0;
        });

        this.setState({ upcomingEvents: upcoming, pastEvents: past });
           getUserById(this.props.match.params.userId)
        .then((response) => {
          console.log("user:", response);
          this.setState({
            user: response,
          });
        })
        .catch((err) => {
          window.alert("ERROR!");
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          responseMessage: "No Events Found...",
        });
      });
  };

  componentDidMount() {
    const { match } = this.props;
    console.log("this.props", this.props);
    if (match.params.userId)
   
        this.fetchEvent()
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { venue } = this.state;
    venue[name] = value;
    this.setState({ venue });
  }
  handleEditVenue=async(addvenue)=>{
    let Images=[]

    if(addvenue.Image==='')
    {
    const imageUrl=await this.uploadImage(this.state.Dimage);
    addvenue.Image=imageUrl;
    }
    else if(addvenue.Images==='')
    {
    
    const multipleFiles=this.state.Cimage;
    console.log("multiplefiles",multipleFiles)
    for (let i =0;i<multipleFiles.length;i++)
    {
      const imges=await this.uploadImage(multipleFiles[i])
      Images.push(imges)
    }
   
    addvenue.Images=Images;
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
handleAddVenue=async(addvenue)=>{
  
  let Images=[]
  const imageUrl=await this.uploadImage(this.state.Dimage);
  addvenue.Image=imageUrl;
  const multipleFiles=this.state.Cimage;
  for (let i =0;i<multipleFiles.length;i++)
  {
    const imges=await this.uploadImage(multipleFiles[i])
    Images.push(imges)
  }
 
  addvenue.Images=Images;
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
  postUser = async (event) => {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, user, image } = this.state;
    user.name = user.fname + " " + user.lname;
    if (!loading) {
      this.setState({ loading: true });

      let imageFile = image;

      let downloadUrl;
      let imageUri;

      if (imageFile) {
        imageUri = await imageResizeFileUri({ file: imageFile });

        const storageRef = firebase
          .storage()
          .ref()
          .child("Users")
          .child(`${uuidv4()}.jpeg`);

        if (imageUri) {
          await storageRef.putString(imageUri, "data_url");
          downloadUrl = await storageRef.getDownloadURL();
        }
        user.profileImage = downloadUrl;
      }

      if (match.params.userId) {
        let cloneObject = Object.assign({}, user);
        if(cloneObject.credit)
        {
         
        }
        else
        { cloneObject.credit = 0;

        }
        updateUser(match.params.userId, cloneObject)
          .then((response) => {
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "User updated successfully",
              snackBarVariant: "success",
            });
          })
          .catch((err) => {
            console.log("Error:", err);
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Error updating user",
              snackBarVariant: "error",
            });
          });
      } else {
        addUser(user)
          .then((response) => {
            console.log("response:", response);
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "User saved successfully",
              snackBarVariant: "success",
            });
          })
          .catch((err) => {
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Error creating user",
              snackBarVariant: "error",
            });
          });
      }
    }
  };

  handleDisplayImage = (event) => {
  var img = [{}]
  var cimg = [{}]
  for(let i=0;i<event.target.files.length;i++)
  {
    const newimage=event.target.files[i]
    newimage["id"] = Math.random()
    cimg.push(URL.createObjectURL(event.target.files[i]))
    img.push(newimage)
  }
  cimg.splice(0,1)
  this.state.Cfile=cimg
    img.splice(0,1)
    this.state.Cimage=img
    console.log('targetCimage',this.state.Cimage)
    this.state.venue.Images=""
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
        let venue = this.state.venue;
        var restaurants=[{}];
        var resid=1
        let value = Array.from(e.target.selectedOptions, option => option.value);
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
        this.setState(venue)
        console.log("This is the restaurants",venue.Restaurants,value,restaurants)
       
      }
  }

  handleChangeOutdoorActivities = (e) =>{
    let venue = this.state.venue;
    var restaurants=[{}];
    var resid=1
    let value = Array.from(e.target.selectedOptions, option => option.value);
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

  handleChangeStatus = (e) => {
    let venue = this.state.venue;
    var restaurants=[{}];
    var resid=1
    let value = Array.from(e.target.selectedOptions, option => option.value);
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


  render() {
    console.log(this.state);
    const {
      venue,
      showSnackBar,
      snackBarMessage,
      snackBarVariant,
      Cimage,
      Cfile,
      Dimage,
      Dfile,
      restaurants,
      indooractivity,
      outdooractivity
    } = this.state;
    var {indoorId,outdoorId,resId} =this.state
    const { match, history } = this.props;
    const isEdit = !!match.params.userId;
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
                        Display Image
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
                        Carousel Image
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
                        <Slider style={{width:"100px"}} arrows={false} infinite={true} adaptiveHeight={true} autoplaySpeed={2000} autoplay={true}  touchMove={true} dots={true}>
                          {Cfile&&Cfile.map((cimage)=>{
                          return(
                          <img src={cimage} class="d-block w-100" alt="Wild Landscape"/>

                          )
                          })}
                          </Slider>
                        </div>
                      </div>
                       ) 
                        : null}
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                         Name
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

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Total Time
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="totalTime"
                          className="form-control"
                          //value={venue.totalTime}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div> */}
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
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="Address"
                          className="form-control"
                          value={venue.Address}
                          onChange={this.handleInputChange}
                        />
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
                      {/* <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="Description"
                          className="form-control"
                          value={venue.Description}
                          onChange={this.handleInputChange}
                        />
                      </div> */}
                    </div>

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Location
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="location"
                          className="form-control"
                          //value={user.handicap}
                         // onChange={this.handleInputChange}
                        />
                      </div>
                    </div> */}

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Type of restaurants
                      </label>
                      <div className="col-md-6 col-sm-6">
                      <select
                          name="restaurants"
                          style={{ marginTop: 8 }}
                          //value={venue.restaurants}
                          onChange={this.handleChange}
                          multiple
                        >
                          {
                            restaurants&&restaurants.map((res)=>{
                              return(
                              <option selected disabled >{res.name}</option>
                              )  })
                          }
                          <option name="Italian" >Italian</option>
                          <option name="American">American</option>
                          <option name="Chinese">Chinese</option>
                          <option name="Greek">Greek</option>
                          <option name="Desi">Desi</option>
                          <option name="British">British</option>
                          <option name="Jewish">Jewish</option>
                          <option name="Mexican">Mexican</option>
                          <option name="African">African</option>
                          <option name="Latvian">Latvian</option>
                          <option name="Polish">Polish</option>
                          <option name="Polish">Russian</option>
                          <option name="Sweedish">Sweedish</option>
                          <option name="Peruvian">Peruvian</option>
                          <option name="Hawaiian">Hawaiian</option>
                          <option name="Brazilian">Brazilian</option>
                          <option name="Salvadorian">Salvadorian</option>
                          <option name="Thai">Thai</option>
                          <option name="French">French</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Indoor Activities
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="IndoorActivities"
                          style={{ marginTop: 8 }}
                          //value={venue.IndoorActivities}
                          onChange={this.handleChangeStatus}
                          multiple
                        >
                          {
                            indooractivity&&indooractivity.map((indooractivity)=>{
                              return(
                              <option selected disabled >{indooractivity.name}</option>
                              )  })
                          }
                          <option name="Cinema"  >Cinema</option>
                          <option name="Theatre" >Theatre</option>
                          <option name="Indoor Golf" >Indoor Golf</option>
                          <option name="Swimming" >Swimming</option>
                          <option name="Gym" >Gym</option>
                          <option name="Spa" >Spa</option>
                          <option name="Shuffle Board" >Shuffle Board</option>
                          <option name="Arcade" >Arcade</option>
                          <option name="Ping Pong" >Ping Pong</option>
                          <option name="Darts" >Darts</option>
                          <option name="Escape Room" >Escape Room</option>
                          <option name="Tennis" >Tennis</option>
                          <option name="Virtual Reality" >Virtual Reality</option>
                          <option name="Planet Jump" >Planet Jump</option>
                          <option name="Laser Tag" >Laser Tag</option>
                          <option name="Cooking Class" >Cooking Class</option>
                          <option name="Poetry Night" >Poetry Night</option>
                          <option name="Open Mic" >Open Mic</option>
                          <option name="Pottery" >Pottery</option>
                          <option name="Painting" >Painting</option>
                          <option name="Museum" >Museum</option>
                        </select>
                      </div>
                      
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Outdoor Activities
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="OutdoorActivities"
                          style={{ marginTop: 8 }}
                          //value={venue.OutdoorActivities}
                          onChange={this.handleChangeOutdoorActivities}
                          multiple
                        >
                          {
                            outdooractivity&&outdooractivity.map((outdooractivity)=>{
                              return(
                              <option selected disabled >{outdooractivity.name}</option>
                              )  })
                          }
                          <option name="Hiking" >Hiking</option>
                          <option name="Cycling">Cycling</option>
                          <option name="Rock Climbing">Rock Climbing</option>
                          <option name="Fishing">Fishing</option>
                          <option name="Outdoor Golf">Outdoor Golf</option>
                          <option name="Amusement Park">Amusement Park</option>
                          <option name="Picnic">Picnic</option>
                          <option name="Drive in Movie">Drive in Movie</option>
                          <option name="Outdoor Concert">Outdoor Concert</option>
                          <option name="Winery">Winery</option>
                          <option name="Zoo Park">Zoo Park</option>
                          <option name="Go Ape">Go Ape</option>
                          <option name="Boat Ride">Boat Ride</option>
                          <option name="Sightseeing">Sightseeing</option>
                          <option name="Whitewater Rafting">Whitewater Rafting</option>
                          <option name="Camping">Camping</option>
                          <option name="Paddleboarding">Paddleboarding</option>
                          <option name="Rockpooling">Rockpooling</option>
                          <option name="Farmers Market">Farmers Market</option>
                          <option name="Stargazing">Stargazing</option>
                          <option name="Horseback Riding">Horseback Riding</option>
                        </select>
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

                            if(this.state.venue.Name&&this.state.venue.Address&&this.state.Dimage&&
                              this.state.Cimage!=""){
                           if(window.location.href.includes("AddVenue"))
                           {
                             this.state.loading=true
                             this.setState({loading:true})
                             this.handleAddVenue(this.state.venue)
                           }
                          else if(window.location.href.includes('EditVenue'))
                          {
                             this.state.loading=true
                             this.setState({loading:true})
                             this.handleEditVenue(this.state.venue)
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
                          onClick={() => history.push('/Venues')}
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

