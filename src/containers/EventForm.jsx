import React from "react";
import axios from "axios";
import RichTextEditor from "react-rte";
import { Button } from "reactstrap";
import { addEvent, updateEvent, getEventById } from "../backend/services/eventService";
import { toolbarConfig } from "../static/_textEditor";
import { firebase } from "../backend/firebase";
import { imageResizeFileUri } from "../static/_imageUtils";
import { v4 as uuidv4 } from "uuid";
import SnackBar from "../components/SnackBar";
import { API_END_POINT } from "../config";
import TimePicker from "../components/TimePicker";

import { SingleDatePicker } from "react-dates";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";
import moment from "moment";

export default class EventForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      appEvent: {
        name: "",
        date: "",
        time: {},
        location: "",
        website: "",
        about: "",
        image: "",
        status: true,
        entry: true,
        uuid: "",
        participants:[],
        foodItem:"",
        closeFoodEntry : false
      },
      description: RichTextEditor.createEmptyValue(),
      startTime: null,
      endTime: null,
      startDate: null,
      endDate: null,
      focusedInput: null,
      time: ["", ""],
      image: "",
      file: "",
      foodItem:"",
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.postEvent = this.postEvent.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.eventId) {
      getEventById(match.params.eventId).then((response) => {
        this.setState({
          appEvent: response,
          startDate: moment(new Date(response.date.seconds * 1000)),
          time: response.time,
          startTime: new Date(response.time.startTime * 1000),
          endTime: new Date(response.time.endTime * 1000),
          description: RichTextEditor.createValueFromString(response.about, "html"),
        });
      });
    }
  }

  getWorkoutDays = () => {
    axios.get(`${API_END_POINT}/api/v1/workout_days`).then((response) => {
      this.setState({
        workoutDays: response.data.data,
        responseMessage: "No Workout Days Found...",
      });
    });
  };

  setDescription(description) {
    const { appEvent } = this.state;
    appEvent.about = description.toString("html");
    this.setState({
      appEvent,
      description,
    });
  }

  setFoodItem(foodItem) {
    const { appEvent } = this.state;
    appEvent.foodItem =foodItem;
    this.setState({
      appEvent,
      foodItem,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { appEvent } = this.state;
    appEvent[name] = value;
    this.setState({ appEvent });
  }

  handleVideoURLChange = (event, index) => {
    const { name } = event.target;
    const { appEvent } = this.state;
    appEvent[name][index] = event.target.files[0];

    this.setState({ appEvent });
  };

  handleImages = (event) => {
    const { name } = event.target;
    const { appEvent } = this.state;
    appEvent[name] = event.target.files[0];
    this.setState({ appEvent });
  };

  postEvent = async (event) => {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, appEvent, image } = this.state;
    if (!loading) {
      this.setState({ loading: true });

      let imageFile = image;

      let downloadUrl;
      let imageUri;

      if (imageFile) {
        imageUri = await imageResizeFileUri({ file: imageFile });

        const storageRef = firebase.storage().ref().child("Events").child(`${uuidv4()}.jpeg`);

        if (imageUri) {
          await storageRef.putString(imageUri, "data_url");
          downloadUrl = await storageRef.getDownloadURL();
        }
        appEvent.image = downloadUrl;
      }

      if (match.params.eventId) {
        let cloneObject = Object.assign({}, appEvent);
        console.log("THis is the lcone object",cloneObject)
        updateEvent(match.params.eventId, cloneObject)
          .then((response) => {
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Event updated successfully",
              snackBarVariant: "success",
            });
          })
          .catch((err) => {
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Error updating event",
              snackBarVariant: "error",
            });
          });
      } else {
        addEvent(appEvent)
          .then((response) => {
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Event saved successfully",
              snackBarVariant: "success",
            });
          })
          .catch((err) => {
            console.log(err);
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Error creating event",
              snackBarVariant: "error",
            });
          });
      }
    }
  };

  closeSnackBar = () => {
    const { history } = this.props;
    this.setState({ showSnackBar: false });
    if (this.state.snackBarVariant === "success") {
      history.goBack();
    }
  };

  handleImage = (event) => {
    this.setState({
      image: event.target.files[0],
      file: URL.createObjectURL(event.target.files[0]),
    });
  };

  handleDateChange = (date) => {
    const { appEvent } = this.state;
    appEvent["date"] = new Date(date);
    this.setState({
      startDate: date,
      appEvent,
    });
  };

  // handleTimeChange = (value) => {
  //   const {appEvent} = this.state;
  //   appEvent["time"] = value;
  //   this.setState({
  //     time: value,
  //     appEvent
  //   })
  // }

  handleTimePicker = (label, value) => {
    const { appEvent } = this.state;

    let time = {};

    if (label.includes("Start")) {
      time.startTime = value;
      appEvent["time"].startTime = value;
      this.setState({
        startTime: value,
        appEvent,
      });
    }
    if (label.includes("End")) {
      time.endTime = value;
      appEvent["time"].endTime = value;
      this.setState({
        endTime: value,
        appEvent,
      });
    }

    // console.log("Time object", time)

    // appEvent["time"] = time;
    // this.setState({
    //   appEvent,
    // })
  };

  render() {
    console.log(this.state);
    const { appEvent, description, startTime, endTime, focusedInput, selectedDate, showSnackBar, snackBarMessage, snackBarVariant, image, file } = this.state;

    const { match, history } = this.props;
    const isEdit = !!match.params.eventId;

    return (
      <div className="row animated fadeIn">
        {showSnackBar && <SnackBar open={showSnackBar} message={snackBarMessage} variant={snackBarVariant} onClose={() => this.closeSnackBar()} />}
        <div className="col-12">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Event Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form id="demo-form2" data-parsley-validate className="form-horizontal form-label-left" onSubmit={this.postEvent}>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Image</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="image/*"
                          name="image"
                          className="form-control"
                          onChange={this.handleImage}
                          // multiple
                          // required
                        />
                      </div>
                    </div>

                    {image ? (
                      <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                          <img style={{ marginRight: "5px" }} width="100" className="img-fluid" src={file} alt="profileImage" />
                        </div>
                      </div>
                    ) : appEvent.image && appEvent.image.length ? (
                      <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                          <img style={{ marginRight: "5px" }} width="100" className="img-fluid" src={`${appEvent.image}`} alt="profileImage" />
                        </div>
                      </div>
                    ) : null}

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Name of Event</label>
                      <div className="col-md-6 col-sm-6">
                        <input required type="text" name="name" className="form-control" value={appEvent.name} onChange={this.handleInputChange} />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Members Entry Fee £</label>
                      <div className="col-md-6 col-sm-6">
                        <input required type="number" name="fee" className="form-control" value={appEvent.fee} onChange={this.handleInputChange} />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Guests Entry Fee £</label>
                      <div className="col-md-6 col-sm-6">
                        <input required type="number" name="guestfee" className="form-control" value={appEvent.guestfee} onChange={this.handleInputChange} />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Participants Limit</label>
                      <div className="col-md-6 col-sm-6">
                        <input required type="number" name="limit" className="form-control" value={appEvent.limit} onChange={this.handleInputChange} />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Date</label>
                      <div className="col-md-6 col-sm-6">
                        <SingleDatePicker
                          date={this.state.startDate} // momentPropTypes.momentObj or null
                          onDateChange={(date) => this.handleDateChange(date)} // PropTypes.func.isRequired
                          focused={this.state.focused} // PropTypes.bool
                          onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                          id="date-picker" // PropTypes.string.isRequired,
                          displayFormat={"DD-MMM-YYYY"}
                          placeholder="Select date"
                        />
                      </div>
                    </div>

                    {/* <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Time
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <TimeRangePicker
                          onChange={(value) => this.handleTimeChange(value)}
                          value={this.state.time}
                          disableClock={true}
                          maxDetail={"minute"}
                          minutePlaceholder={"mm"}
                          hourPlaceholder={"hh"}
                          amPmAriaLabel={"Select AM/PM"}
                        />
                      </div>
                    </div> */}

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3 d-flex align-items-center">Time</label>
                      <div className="col-md-6 col-sm-6">
                        <div className="row justify-content-around">
                          <TimePicker required={true} open={false} label={"Start Time"} value={startTime} onTimePickerClose={this.handleTimePicker} />

                          <TimePicker required={true} open={false} label={"End Time"} value={endTime} onTimePickerClose={this.handleTimePicker} />
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Location</label>
                      <div className="col-md-6 col-sm-6">
                        <input required type="text" name="location" className="form-control" value={appEvent.location} onChange={this.handleInputChange} />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Website</label>
                      <div className="col-md-6 col-sm-6">
                        <input required type="text" name="website" className="form-control" value={appEvent.website} onChange={this.handleInputChange} />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">About</label>
                      <div className="col-md-6 col-sm-6">
                        <RichTextEditor
                          className="text-editor"
                          value={description}
                          toolbarConfig={toolbarConfig}
                          onChange={(e) => {
                            this.setDescription(e);
                          }}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Food Menu
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          style={{ marginTop: 8 }}
                          value={this.state.foodItem}
                          onChange={
                         
                              (e)=>{
                                console.log("THis is the value",e.target.value)
                                this.setFoodItem(e.target.value)
                              }
                            
                          }
                        >
                          <option name="popcorn">Popcorn</option>

                          <option name="apples">Apples</option>
                          <option name="bananas">Bananas</option>
                          <option name="smoothie">Smoothie</option>
                          <option name="fries">Fries</option>
                        </select>
                      </div>
                    </div>

 {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Food Menu
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          style={{ marginTop: 8 }}
                          value={this.state.foodItem}
                          onChange={
                         
                              (e)=>{
                                console.log("THis is the value",e.target.value)
                                this.setFoodItem(e.target.value)
                              }
                            
                          }
                        >
                          <option name="popcorn">Popcorn</option>

                          <option name="apples">Apples</option>
                          <option name="bananas">Bananas</option>
                          <option name="smoothie">Smoothie</option>
                          <option name="fries">Fries</option>
                        </select>
                      </div>
                    </div> */}

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Workout Day</label>
                      <div className="col-md-6 col-sm-6">
                      <Select
                        onChange={(val) => this.setWorkoutDay(val)}
                        options={workoutDays}
                        placeholder="Select workout day"
                        value={workoutDay}
                        valueKey="id"
                        labelKey="name"
                        isClearable={false}
                        disabled={workoutDaySelected}
                      />
                      </div>
                    </div> */}

                    <div className="ln_solid" />
                    <div className="form-group row">
                      <div className="col-md-6 col-sm-6 offset-md-3">
                        <Button className={`btn btn-success btn-lg ${this.state.loading ? "disabled" : ""}`}>
                          <i className={`fa fa-spinner fa-pulse ${this.state.loading ? "" : "d-none"}`} />
                          {isEdit ? " Update" : " Submit"}
                        </Button>
                        <Button onClick={() => history.goBack()} className={`mx-3 btn btn-danger btn-lg`}>
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
