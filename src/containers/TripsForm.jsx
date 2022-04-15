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
import {addTrip,updateTrip} from '../backend/services/TripsService'
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
    const editTrip=localStorage.getItem("trip")!=""?JSON.parse(localStorage.getItem('trip')):''
    super(props);
    this.state = {
      loading: true,
      trips: {
        id:editTrip.id?editTrip.id:'',
        Description: editTrip.Description?editTrip.Description:"",
        Name: editTrip.Name?editTrip.Name:"",
        Venues: editTrip.Venues?editTrip.Venues:[],
        startTime: editTrip.startTime?editTrip.startTime:"",
        endTime: editTrip.endTime?editTrip.endTime:"",
        totalTime: editTrip.totalTime?editTrip.totalTime:"",
        restaurants:editTrip.restaurants?editTrip.restaurants:'',
        Image:editTrip.Image?editTrip.Image:'',
        IndoorActivities:editTrip.IndoorActivities?editTrip.IndoorActivities:'',
        OutdoorActivities:editTrip.OutdoorActivities?editTrip.OutdoorActivities:''
      },
      restaurants:editTrip.restaurants?editTrip.restaurants:'',
      indooractivity:editTrip.IndoorActivities?editTrip.IndoorActivities:"",
      outdooractivity:editTrip.OutdoorActivities?editTrip.OutdoorActivities:"",
      CountTime:-1,
      upcomingEvents: [],
      pastEvents: [],
      image: "",
      Dfile: editTrip.Image?editTrip.Image:"",
      venues:[{}],
      Dimage:editTrip.Image?editTrip.Image:'',
      Cimage:'',
      userId: "",
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success",
    
    };
    console.log("trips",editTrip)
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputChanges = this.handleInputChanges.bind(this);
    this.handleInputChangess = this.handleInputChangess.bind(this);

   // this.postUser = this.postUser.bind(this);
  }
  componentDidMount(){
    this.fetchVenues()
  }
  componentWillMount()
  {
    this.fetchVenues()
  }
  onVenueStartTimeChange(e) {
    var trips=this.state.trips
    const id=e.target.id
    var  venue= this.state.trips.Venues
    var timeSplit = e.target.value.split(':'),
    hours,
    minutes,
    meridian;
  hours = timeSplit[0];
  minutes = timeSplit[1];
  if (hours > 12) {
    meridian = 'PM';
    hours -= 12;
  } else if (hours < 12) {
    meridian = 'AM';
    if (hours == 0) {
      hours = 12;
    }
  } else {
    meridian = 'PM';
  }
  venue[id].startTime=hours + ':' + minutes + ' ' + meridian
  this.setState({trips})
  console.log("startTime", venue[id],id,this.state.trips.startTime)
  }
  onVenueEndTimeChange(e) {
    var trips=this.state.trips
    const id=e.target.id
    var  venue= this.state.trips.Venues
    var timeSplit = e.target.value.split(':'),
    hours,
    minutes,
    meridian;
  hours = timeSplit[0];
  minutes = timeSplit[1];
  if (hours > 12) {
    meridian = 'PM';
    hours -= 12;
  } else if (hours < 12) {
    meridian = 'AM';
    if (hours == 0) {
      hours = 12;
    }
  } else {
    meridian = 'PM';
  }
  venue[id].endTime=hours + ':' + minutes + ' ' + meridian
  // if(id===0)
  // {
  // trips.endTime=hours + ':' + minutes + ' ' + meridian
  // }
  this.setState({trips})
  console.log("startTime", venue[id],this.state.trips.endTime)
  }
  onEndTimeChange(e){
    var trips = this.state.trips
    var timeSplit = e.target.value.split(':'),
      hours,
      minutes,
      meridian;
    hours = timeSplit[0];
    minutes = timeSplit[1];
    if (hours > 12) {
      meridian = 'PM';
      hours -= 12;
    } else if (hours < 12) {
      meridian = 'AM';
      if (hours == 0) {
        hours = 12;
      }
    } else {
      meridian = 'PM';
    }
    trips.endTime = hours + ':' + minutes + ' ' + meridian
    this.setState({
      trips
  })
  
    console.log("startTimeeee",this.state.trips.endTime)
  }
   onStartTimeChange(e) {
    var trips = this.state.trips
    var timeSplit = e.target.value.split(':'),
      hours,
      minutes,
      meridian;
    hours = timeSplit[0];
    minutes = timeSplit[1];
    if (hours > 12) {
      meridian = 'PM';
      hours -= 12;
    } else if (hours < 12) {
      meridian = 'AM';
      if (hours == 0) {
        hours = 12;
      }
    } else {
      meridian = 'PM';
    }
    trips.startTime = hours + ':' + minutes + ' ' + meridian
    this.setState({
      trips
  })
    console.log("startTimeeee",this.state.trips.startTime)
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
  handleInputChanges(event) {
    const { value, id } = event.target;
    const { trips } = this.state;
    trips.Venues[id].endTime = value;
    this.setState({ trips });
    this.differenceTripsTime()
    console.log("Venuesww",trips.Venues[id])
   
      this.state.trips.endTime=value
      this.setState({
        trips
      })
    
    console.log("tripsendtime")


  }
  handleInputChangess(event) {
    const { value, id } = event.target;
    const { trips } = this.state;
    trips.Venues[id].startTime = value;
    this.setState({ trips });
    this.differenceTripsTime()
    if(id==0)
    {
      this.state.trips.startTime=value
      this.setState({
        trips
      })
      console.log("tripsstarttime",this.state.trips.startTime,value)
    }
    console.log("Venuesww",trips.Venues[id],id)

  }
 handleEditTrip = async(trip)=>{
   if(trip.Image==='')
   {
      const img =await this.uploadImage(this.state.Dimage)
      trip.Image=img
   }
  updateTrip(trip.id,trip)
        .then((response) => {
          this.setState({
            loading: false,
            showSnackBar: true,
            snackBarMessage: "Trip Updated successfully",
            snackBarVariant: "success",
          });
        })
        .catch((err) => {
          console.log("Error:", err);
          this.setState({
            loading: false,
            showSnackBar: true,
            snackBarMessage: "Error updating trip",
            snackBarVariant: "error",
          });
        });
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
    //this.state.Dimage=event.target.files[0]
    this.setState({
      Dimage: event.target.files[0],
      Dfile: URL.createObjectURL(event.target.files[0]),
    });
    this.setState(prevState => ({
      trips:{
        ...prevState.trips,
        Image:''
      }
    })
     )
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
  
        let trip = this.state.trips;
        var venues=[{}];
        var resid=0
        let value = Array.from(e.target.selectedOptions, option => option.id);
       value.map((val)=>{
         for(let i=0;i<this.state.venues.length;i++)
         {
           if(val===this.state.venues[i].id&&this.state.venues[i].id!="")
           {
             const resvenue={
               Name:this.state.venues[i].Name,
               Address:this.state.venues[i].Address,
               Image:this.state.venues[i].Image,
               venueId:this.state.venues[i].id,
               id:resid,
               startTime:'',
               endTime:''
             }
             venues.push(resvenue)
             resid+=1
           }
         
         }
       })
       venues.splice(0,1)
       trip.Venues=venues
        this.setState(trip)
        console.log("This is the restaurants",trip.Venues,venues)
       
      
  }

  handleChangeRestaurants = (e) => {
    if(this.isRegisteredForFutureEvent(this.state.trips)===false)
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
       this.state.restaurants=''
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
      selected:true,
    }
    Selectedtrip.push(res)
    resid+=1
   })
   Selectedtrip.splice(0,1)
   trips.OutdoorActivities=Selectedtrip
   this.state.outdooractivity=''
    this.setState(trips)
    this.differenceTripsTime()
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
   this.state.indooractivity=''
    this.setState(trip)
    console.log("This is the indooractivities",trip.IndoorActivities,value,selectedIndooractivities)
  };
  parseTime(cTime)
  {
    if (cTime == '') return null;
    var d = new Date();
    var time = cTime.match(/(\d+)(:(\d\d))?\s*(p?)/);
    d.setHours( parseInt(time[1]) + ( ( parseInt(time[1]) < 12 && time[4] ) ? 12 : 0) );
    d.setMinutes( parseInt(time[3]) || 0 );
    d.setSeconds(0, 0);
    return d;
  }
  differenceTripsTime = () =>{
    var diffrencetime=0;
      this.state.trips.Venues.map((e)=>{
        if(e.startTime!=""&&e.endTime!="")
        {
          
        const startTime = this.parseTime(e.startTime)
        const endTime = this.parseTime(e.endTime)
        diffrencetime += (endTime-startTime)/(1000*60) 
        console.log("difference time",diffrencetime)
        }
      })
      this.state.trips.totalTime=diffrencetime

  }
  differenceVenuesTime = () =>{
    this.state.trips.map((e)=>{
      if(e.startTime!=""&&e.endTime!="")
      {
      const startTime = this.parseTime(e.startTime)
      const endTime = this.parseTime(e.endTime)
      const diffrencetime = (endTime-startTime)/(1000*60)
      const time = diffrencetime/60
      console.log("difference time",e.startTime,e.endTime,diffrencetime)
      }
    })
}
  render() {
    console.log(this.state,"hamza");
    
    let Container=[];
    // for(let i=0;i<){
    //   Container.push()
    // }
    
  
    const {
      trips,
      showSnackBar,
      snackBarMessage,
      snackBarVariant,
      Dimage,
      indooractivity,
      outdooractivity,
      restaurants,
      Dfile,
      editTrip,
      loading,
    } = this.state;
    let {CountTime}=this.state
    const XyxContainer=trips?.Venues?.length>0?trips.Venues.map((s)=>
    {CountTime=CountTime+1 
      console.log("VENUES",this.state.venues) 
      return(
                  <div>
                     <div className="form-group row">
                     <label className="control-label col-md-3 col-sm-3">
                      {s.Name} Start Time
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          // required
                          type="time"
                          id={CountTime}
                          name="startTime"
                          className="form-control"
                          value={s.startTime}
                          onChange={this.handleInputChangess}
                        />
                      </div>
                      </div>
                      <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                      {s.Name} End Time
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="time"
                          id={CountTime}
                          name="endTime"
                          className="form-control"
                          value={s.endTime}
                          onChange={this.handleInputChanges}
                        />
                      </div>
                      </div>
                    
    </div>)
    
    }
                      
    ):''
    console.log("tripsEdit ",trips)
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
                          value={trips.Name}
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
                          rows="8"
                          value={trips.Description}
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
                         value={trips.Description}
                          onChange={this.handleInputChange}
                        />
                      </div> */}
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
                          //value={trips.Venues}
                       >
                         {
                        trips.Venues&&trips.Venues.map((ven)=>{
                          return(
                        <option id={ven.id} selected disabled >{ven.Name}</option>
                        )})
                    }
                        {
                        this.state.venues.map((ven)=>{
                          return(
                        <option id={ven.id} >{ven.Name}</option>
                        )})
                    }
                    </select>}
                      </div>
                  
                    </div>
                   
                    { 
                     trips.Venues&&
                     XyxContainer
                      
                    }
                   
                     <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                       Trip Start Time
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          // required
                          type="time"
                          name="startTime"
                          className="form-control"
                          value={trips.startTime}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                       Trip End Time 
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="time"
                          name="endTime"
                          className="form-control"
                          value={trips.endTime}
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
                          value={trips.totalTime}
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
                         // value={trips.restaurants}
                          style={{ marginTop: 8 }}
                          onChange={this.handleChangeRestaurants}
                          multiple
                        >
                            {
                        restaurants&&restaurants.map((res)=>{
                          return(
                        <option  selected disabled >{res.name}</option>
                        )})
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
                          //value={trips.IndoorActivities}
                          onChange={this.handleChangeStatus}
                          multiple
                        >
                            {
                        indooractivity&&indooractivity.map((indoor)=>{
                          return(
                        <option  selected disabled >{indoor.name}</option>
                        )})
                    }
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
                          //value={trips.OutdoorActivities}
                          onChange={this.handleChangeOutdoorActivities}
                          multiple
                        >
                            {
                        outdooractivity&&outdooractivity.map((outdoor)=>{
                          return(
                        <option  selected disabled >{outdoor.name}</option>
                        )})
                    }
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
                              if(window.location.href.includes("AddTrip"))
                              {
                             this.state.loading=true
                             this.setState({loading:true})
                             this.handleAddTrip(trips)
                             }
                             else
                             {
                              this.state.loading=true
                              this.setState({loading:true})
                              this.handleEditTrip(trips)
                             }
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
