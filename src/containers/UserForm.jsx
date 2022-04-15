import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
//import { useNavigate } from 'react-router-dom';
import RichTextEditor from "react-rte";
import { Button } from "reactstrap";
import {
  addUser,
  updateUser,
  getUserById,
} from "../backend/services/usersService";
import moment from "moment";
import { firebase } from "../backend/firebase";
import { imageResizeFileUri } from "../static/_imageUtils";
import { v4 as uuidv4 } from "uuid";
import SnackBar from "../components/SnackBar";
import '../scss/style.scss'
import {
  getEvents,
} from "../backend/services/eventService";
import Select from "react-select";
import "react-select/dist/react-select.css";
import { TextField } from "@material-ui/core";
import { add } from "lodash";
import { findRenderedDOMComponentWithClass } from "react-dom/test-utils";
import Users from "./Users";
export default class UserForm extends React.Component {
  constructor(props) {
    const editUser = localStorage.getItem("user")!=''?JSON.parse(localStorage.getItem("user")):'';
    super(props);
    this.state = {
      loading: false,
      user: {
        id :editUser.id?editUser.id:'',
        firstname: editUser.firstname?editUser.firstname:"",
        lastname: editUser.lastname?editUser.lastname:"",
        email: editUser.email?editUser.email:"",
        gender: editUser.gender?editUser.gender:"",
        occupation: editUser.occupation?editUser.occupation:"",
        signup_stage: "1",
        dob:editUser.dob?editUser.dob:"",
        Restaurants: editUser.Restaurants?editUser.Restaurants:[{id:0}],
        IndoorActivities:editUser.IndoorActivities?editUser.IndoorActivities:[{id:0}],
        OutdoorActivities:editUser.OutdoorActivities?editUser.OutdoorActivities:[{id:0}],
        updatedTripLocation:editUser.updatedTripLocation?editUser.updatedTripLocation:"",
        username:editUser.username?editUser.username:''
      },
      upcomingEvents: [],
      pastEvents: [],
        restaurant: editUser.Restaurants?editUser.Restaurants:'',
        indooractivity:editUser.IndoorActivities?editUser.IndoorActivities:'',
        outdooractivity:editUser.OutdoorActivities?editUser.OutdoorActivities:'',
      image: "",
   //   navigate:useNavigate(),
      file: "",
      id: 1,
      description: RichTextEditor.createEmptyValue(),
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success",
    };
    console.log("userobj",this.state.user)

    this.handleInputChange = this.handleInputChange.bind(this);
    this.postUser = this.postUser.bind(this);
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

    const { user } = this.state;
    user[name] = value;
    this.setState({ user });
  }
  EditUser = async (user) =>{
    
  }
  EditUser = async (user) => {
    try{
     const { history } = this.props;
    const res = await updateUser(user.id,user)
    console.log("addUser",res)
  //  this.state.navigate('/users')
    this.setState({
     loading: false,
     showSnackBar: true,
     snackBarMessage: "User Updated!",
     snackBarVariant: "success",
   });
  }
  catch(e)
  {
   this.setState({
     loading: false,
     showSnackBar: true,
     snackBarMessage: "Error updating user",
     snackBarVariant: "error",
   });
    console.log("addUsererror",e)
  }
 }
 CreateUser = async (user) => {
   try{
    const { history } = this.props;
   const res = await addUser(user)
   console.log("addUser",res)
 //  this.state.navigate('/users')
   this.setState({
    loading: false,
    showSnackBar: true,
    snackBarMessage: "User Created!",
    snackBarVariant: "success",
  });
 }
 catch(e)
 {
  this.setState({
    loading: false,
    showSnackBar: true,
    snackBarMessage: "Error creating user",
    snackBarVariant: "error",
  });
   console.log("addUsererror",e)
 }
}



  postUser = async (event) => {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, user, image } = this.state;
    if (!loading) {
      this.setState({ loading: true });

      let imageFile = image;

      let downloadUrl;
      let imageUri;

      if (match.params.userId) {
        let cloneObject = Object.assign({}, user);
        
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
    if(this.isRegisteredForFutureEvent(this.state.user)===false)
      {
        let user = this.state.user;
        var restaurants=[{}];
        let value = Array.from(e.target.selectedOptions, option => option.value);
       value.map((val)=>{
        const res={
          id:this.state.id,
          name:val,
          selected:true
        }
        restaurants.push(res)

        this.state.id+=1
       })
       restaurants.splice(0,1)
        user.Restaurants=restaurants
        this.state.restaurant=''
        this.setState(user)
        console.log("This is the restaurants",user.Restaurants,value,restaurants)
       
      }
  }
  handleChangeOutdoorActivities = (e) =>{
    let user = this.state.user;
    var restaurants=[{}];
    let value = Array.from(e.target.selectedOptions, option => option.value);
   value.map((val)=>{
    const res={
      id:this.state.id,
      name:val,
      selected:true
    }
    restaurants.push(res)

    this.state.id+=1
   })
    restaurants.splice(0,1)
    this.state.outdooractivity=''
    user.OutdoorActivities=restaurants
    this.setState(user)
    console.log("This is the indooractivities",user.OutdoorActivities,value,restaurants) 
  }

  handleChangeStatus = (e) => {
    let user = this.state.user;
    var restaurants=[{}];
    let value = Array.from(e.target.selectedOptions, option => option.value);
   value.map((val)=>{
    const res={
      id:this.state.id,
      name:val,
      selected:true
    }
    restaurants.push(res)

    this.state.id+=1
   })
    restaurants.splice(0,1)
    user.IndoorActivities=restaurants
    this.state.indooractivity=''
    this.setState({user})
    console.log("This is the indooractivities",user.IndoorActivities,value,restaurants)
  };


  render() {
    console.log(this.state);
    const {
      user,
      showSnackBar,
      snackBarMessage,
      snackBarVariant,
      Cimage,
      Cfile,
      Dimage,
      Dfile,
      outdooractivity,
      indooractivity,
      restaurant
    } = this.state;
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
                  <h2>Enter User Details</h2>
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
                        First Name
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="firstname"
                          className="form-control"
                          value={user.firstname}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Last Name
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="lastname"
                          className="form-control"
                          value={user.lastname}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        DOB
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="date"
                          name="dob"
                          className="form-control"
                          value={user.dob}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        UserName
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="username"
                          className="form-control"
                          value={user.username}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Email
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="email"
                          name="email"
                          className="form-control"
                          value={user.email}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Occupation
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                        required
                          type="text"
                          name="occupation"
                          className="form-control"
                          value={user.occupation}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Location 
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                        required
                          type="text"
                          name="updatedTripLocation"
                          className="form-control"
                          value={user.updatedTripLocation}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Gender
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input type="radio" id="male" name="gender" checked={user.gender==='Male'?true:false} value={"Male"}

                         onChange={this.handleInputChange}
                      />
                        <label for="male">Male</label>
                        <input type="radio" id="female" name="gender" checked={user.gender==='Female'?true:false}  value={"Female"}
                       onChange={this.handleInputChange}
                      />
                        <label for="female">Female</label>
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
                          //value={user.Restaurants}
                          onChange={this.handleChange}
                          multiple
                        >
                          {
                            restaurant&&restaurant.map((res)=>{
                              return(
                                <option disabled>{res.name}</option>
                              )
                            })
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
                          style={{ marginTop: 8 }}
                          //value={user.tags}
                          onChange={this.handleChangeStatus}
                          multiple
                        >
                          {
                            indooractivity&&indooractivity.map((res)=>{
                              return(
                                <option disabled>{res.name}</option>
                              )
                            })
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
                          //value={user.tags}
                          onChange={this.handleChangeOutdoorActivities}
                          multiple
                        >
                          {
                            outdooractivity&&outdooractivity.map((res)=>{
                              return(
                                <option disabled>{res.name}</option>
                              )
                            })
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
                          onClick={() =>
                            {if(this.state.user.email&&this.state.user.firstname&&
                            this.state.user.lastname&&this.state.user.gender&&this.state.user.dob!='')
                            {
                              if(window.location.href.includes("AddUser"))
                              {
                               this.CreateUser(user)
                               this.setState({
                                loading: true
                               })
                              }
                              else
                              {
                                this.EditUser(user)
                                this.setState({
                                  loading: true
                                 })
                              }
                            }
                            else
                            {
                              this.setState({
                            loading: false,
                            showSnackBar: true,
                            snackBarMessage: "Please fill the form",
                            snackBarVariant: "error",
                          })
                        }
                          }
                        }
                        >
                          <i
                            className={`fa fa-spinner fa-pulse ${
                              this.state.loading ? "" : "d-none"
                            }`}
                          />
                          {isEdit ? " Update" : " Submit"}
                        </Button>
                        <Button
                          onClick={() => history.push('/users')}
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
