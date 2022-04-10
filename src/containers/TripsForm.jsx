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
import { imageResizeFileUri } from "../static/_imageUtils";
import { v4 as uuidv4 } from "uuid";
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
      loading: false,
      user: {
        uuid: "",
        name: "",
        fname: "",
        lname: "",
        email: "",
        phone: "",
        handicap: "",
        profileImage: "",
        credit:"",
        card_number: "",
        user_card_cvv:"",
        user_card_month:'',
        user_card_year:'',
        timestampRegister: new Date(),
        isActive: true,
        membership: "Unknown",
        membership_fee_status:""
      },
      upcomingEvents: [],
      pastEvents: [],
      image: "",
      file: "",
      userId: "",
      description: RichTextEditor.createEmptyValue(),
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success",
    };

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

    const { user } = this.state;
    user[name] = value;
    this.setState({ user });
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
    console.log("This is the value",e.target.value)
    if(this.isRegisteredForFutureEvent(this.state.user)===false)
    {
    let user = this.state.user;
 
    user.membership = e.target.value;
    this.setState({ user });
    }
  };

  handleChangeStatus = (e) => {
    let user = this.state.user;
    user.membership_fee_status = e.target.value;
    this.setState({ user });
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
                    ) : user.profileImage && user.profileImage.length ? (
                      <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                          <img
                            style={{ marginRight: "5px" }}
                            width="100"
                            className="img-fluid"
                            src={`${user.profileImage}`}
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
                          name="name"
                          className="form-control"
                          value={user.fname}
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
                          name="description"
                          className="form-control"
                          value={user.lname}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                     <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Venues
                      </label>
                      <div className="col-md-6 col-sm-6">
                      <select data-placeholder="Begin typing a name to filter..." multiple class="chosen-select" name="test">
                        <option>Blue Swan Palace</option>
                        <option>Boulevard Hall</option>
                        <option>Bridgewater Manor</option>
                        <option>Cityplace Events</option>
                        <option>Creative Affairs</option>
                        <option>Paradise Point Resort</option>
                        <option>Gateway Center</option>
                        <option>Elite Bookings</option>
                    </select>
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
                          name="start time"
                          className="form-control"
                          value={user.phone}
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
                          name="End Time"
                          className="form-control"
                          value={user.credit}
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
                          type="time"
                          name="total time"
                          className="form-control"
                          value={user.handicap}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Add Tags
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          style={{ marginTop: 8 }}
                          value={user.membership_fee_status}
                          onChange={this.handleChangeStatus}
                        >
                          <option name="none">None</option>
                          <option name="indoor">Indoor</option>
                          <option name="outdoor">Outdoor</option>
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