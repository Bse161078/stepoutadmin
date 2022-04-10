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
import {
  getVenues,
} from "../backend/services/VenueServices"
import {addTrip} from '../backend/services/TripsService'
import moment from "moment";
import { firebase } from "../backend/firebase";
import { imageResizeFileUri } from "../static/_imageUtils";
import { NIL, v4 as uuidv4 } from "uuid";
import SnackBar from "../components/SnackBar";

import {
  getEvents,
} from "../backend/services/eventService";
import Select from "react-select";
import "react-select/dist/react-select.css";
import { TextField } from "@material-ui/core";
export default class TripsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      trips: {
        Description: "",
        Name: "",
        Venues: "",
        startTime: "",
        endTime: "",
        Rating: "",
        totalTime: "",
        Reviews:[],
        restaurants:'',
        Image:'',
        IndoorActivities:'',
        OutdoorActivities:''
      },
      upcomingEvents: [],
      pastEvents: [],
      image: "",
      file: "",
      venues:[{}],
      Dimage:'',
      userId: "",
      description: RichTextEditor.createEmptyValue(),
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
   // this.postUser = this.postUser.bind(this);
  }
  componentDidMount(){
    this.fetchVenues()
    console.log("venue")
  }
  componentWillMount()
  {
    this.fetchVenues()
    console.log("venue")
  }
  fetchVenues = () => {
    this.setState({ loading: true });
       getVenues()
     
      .then((response) => {
        this.setState({
          venues: response,
          loading: false,
        });
        console.log("venue",response)
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
      });
  };
  uploadImage (evt) {
    return new  Promise((resolve,reject)=>{
      console.log(evt);
      var storage = firebase.storage().ref(`/Trips/`+evt.name);
      const storageRef=storage.put(evt);
      storageRef.on("state_changed" , async()=>{
        let downloadUrl = await storage.getDownloadURL();
       // this.setState({venue:venue})
        console.log('hamzaimage',downloadUrl);
        resolve(downloadUrl)        
    })
  
    })
}
  componentDidMount() {
    const { match } = this.props;
    console.log("this.props", this.props);
    if (match.params.userId)
   
        this.fetchEvent()
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { trips } = this.state;
    trips[name] = value;
    this.setState({ trips });
  }

  handleAddTrip=async(trip)=>{
    const img =await this.uploadImage(this.state.Dimage)
    trip.Image=img
    
    addTrip(trip)
          .then((response) => {
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Trip Created successfully",
              snackBarVariant: "success",
            });
          })
          .catch((err) => {
            console.log("Error:", err);
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Error creating trip",
              snackBarVariant: "error",
            });
          });
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
    this.setState({
      Dimage: event.target.files[0],
      Dile: URL.createObjectURL(event.target.files[0]),
    });
  };
  handleCarouselImage = (event) => {
    this.state.Dimage=event.target.files[0]
    this.setState({
      Cimage: event.target.files[0],
      Cfile: URL.createObjectURL(event.target.files[0]),
    });
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
    if(this.isRegisteredForFutureEvent(this.state.trips)===false)
      {
        let trip = this.state.trips;
        var venues=[{}];
        var resid=1
        let value = Array.from(e.target.selectedOptions, option => option.id);
       value.map((val)=>{
         for(let i=0;i<this.state.venues.length;i++)
         {
           if(val===this.state.venues[i].id&&this.state.venues[i].id!="")
           {
             const resvenue={
               Name:this.state.venues[i].Name,
               Address:this.state.venues[i].Address,
               Image:this.state.venues[i].Image
             }
             venues.push(resvenue)
           }
         
         }
       })
       venues.splice(0,1)
       trip.Venues=venues
        this.setState(trip)
        console.log("This is the restaurants",trip.Venues,venues)
       
      }
  }

  handleChangeRestaurants = (e) => {
    if(this.isRegisteredForFutureEvent(this.state.venue)===false)
      {
        let trip = this.state.trips;
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
       trip.restaurants=restaurants
        this.setState(trip)
        console.log("This is the restaurants",restaurants)
       
      }
  }

  // handleChange = (e) => {
  //   if(this.isRegisteredForFutureEvent(this.state.trips)===false)
  //     {
  //       let venue = this.state.trips;
  //       var venues=[{}];
  //       var resid=1
  //       let value = Array.from(e.target.selectedOptions, option => option.value);
  //      value.map((val)=>{
  //       const res={
  //         id:resid,
  //         name:val,
  //         selected:true
  //       }
  //       venues.push(res)
  //       this.resid+=1
  //      })
  //      venues.splice(0,1)
  //      venue.Venues=venues
  //       this.setState(venue)
  //       console.log("This is the restaurants",venue.Venues,venues,e.target.selectedOptions,e)
       
  //     }
  // }

  handleChangeStatus = (e) => {
    let user = this.state.user;
    user.membership_fee_status = e.target.value;
    this.setState({ user });
  };

  handleChangeOutdoorActivities = (e) =>{
    let trips = this.state.trips;
    var Selectedtrip=[{}];
    var resid=1
    let value = Array.from(e.target.selectedOptions, option => option.value);
   value.map((val)=>{
    const res={
      id:resid,
      name:val,
      selected:true
    }
    Selectedtrip.push(res)
    resid+=1
   })
   Selectedtrip.splice(0,1)
   trips.OutdoorActivities=Selectedtrip
    this.setState(trips)
    console.log("This is the outdooractivities",trips.OutdoorActivities,value,Selectedtrip) 
  }

  handleChangeStatus = (e) => {
    let trip = this.state.trips;
    var selectedIndooractivities=[{}];
    var resid=1
    let value = Array.from(e.target.selectedOptions, option => option.value);
   value.map((val)=>{
    const res={
      id:resid,
      name:val,
      selected:true
    }
    selectedIndooractivities.push(res)
    resid+=1
   })
   selectedIndooractivities.splice(0,1)
   trip.IndoorActivities=selectedIndooractivities
    this.setState(trip)
    console.log("This is the indooractivities",trip.IndoorActivities,value,selectedIndooractivities)
  };

  render() {
    console.log(this.state);
    const {
      trips,
      showSnackBar,
      snackBarMessage,
      snackBarVariant,
      Cimage,
      Cfile,
      loading,
      Dimage,
      Dfile
    } = this.state;
    const { match, history } = this.props;
    const isEdit = !!match.params.userId;
    return (
      <div className="row animated fadeIn">
        {showSnackBar && (
          <SnackBar
            open={showSnackBar}
            message={snackBarMessage}
            variant={snackBarVariant}
            onClose={() => this.closeSnackBar()}
          />
        )}
        <div className="col-12">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Trips Details</h2>
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
                          accept="Cimage/*"
                          name="profileImage"
                          className="form-control"
                          onChange={this.handleCarouselImage}
                        />
                      </div>
                      </div>
                      {Cimage ? (
                      <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                          <img
                            style={{ marginRight: "5px" }}
                            width="100"
                            className="img-fluid"
                            src={Cfile}
                            alt="profileImage"
                          />
                        </div>
                      </div>
                    ) : null}
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
                      //    value={user.fname}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Description
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="Description"
                          className="form-control"
                         // value={user.lname}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                     <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Venues
                      </label>
                      <div className="col-md-6 col-sm-6">
                      {this.state.venues&&
                          <select
                          name="Venues"
                          style={{ marginTop: 8 }}
                          onChange={this.handleChange}
                          multiple
                       >
                        {this.state.venues.map((ven)=>{
                          return(
                        <option id={ven.id} >{ven.Name}</option>
                        )})
                    }
                    </select>}
                      </div>
                    </div>
                     <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Start Time
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          // required
                          type="time"
                          name="startTime"
                          className="form-control"
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        End Time 
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="time"
                          name="endTime"
                          className="form-control"
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Total Time
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="number"
                          name="totalTime"
                          className="form-control"
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Type of restaurants
                      </label>
                      <div className="col-md-6 col-sm-6">
                      <select
                        name="restaurants"
                          style={{ marginTop: 8 }}
                          onChange={this.handleChangeRestaurants}
                          multiple
                        >
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
                          style={{ marginTop: 8 }}
                          //value={user.tags}
                          onChange={this.handleChangeStatus}
                          multiple
                        >
                          <option name="Cinema">Cinema</option>
                          <option name="Theatre">Theatre</option>
                          <option name="Indoor Golf">Indoor Golf</option>
                          <option name="Swimming">Swimming</option>
                          <option name="Gym">Gym</option>
                          <option name="Spa">Spa</option>
                          <option name="Shuffle Board">Shuffle Board</option>
                          <option name="Arcade">Arcade</option>
                          <option name="Ping Pong">Ping Pong</option>
                          <option name="Darts">Darts</option>
                          <option name="Escape Room">Escape Room</option>
                          <option name="Tennis">Tennis</option>
                          <option name="Virtual Reality">Virtual Reality</option>
                          <option name="Planet Jump">Planet Jump</option>
                          <option name="Laser Tag">Laser Tag</option>
                          <option name="Cooking Class">Cooking Class</option>
                          <option name="Poetry Night">Poetry Night</option>
                          <option name="Open Mic">Open Mic</option>
                          <option name="Pottery">Pottery</option>
                          <option name="Painting">Painting</option>
                          <option name="Museum">Museum</option>
                        </select>
                      </div>
                      
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Outdoor Activities
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          style={{ marginTop: 8 }}
                          //value={user.tags}
                          onChange={this.handleChangeOutdoorActivities}
                          multiple
                        >
                          <option name="Hiking">Hiking</option>
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
                            if(trips.Name&&trips.Venues&&
                              (trips.IndoorActivities||trips.OutdoorActivities||trips.restaurants)&&this.state.Dimage!="")
                            {
                             this.state.loading=true
                             this.setState({loading:true})
                            this.handleAddTrip(this.state.trips)
                           }
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
                          onClick={() => history.push('/Trips')}
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
