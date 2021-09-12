import React from "react";
import axios from "axios";
import RichTextEditor from "react-rte";
import { Button } from "reactstrap";
import { addGolfcourses, updateGolfcourses, getGolfcoursesById } from "../backend/services/GolfcoursesService";
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
      appGolfCourse: {
        name: "",
        location: "",
        phone: "",
        image: "",
       
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
    this.postGolfcourses = this.postGolfcourses.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.golfCoursesId) {
      getGolfcoursesById(match.params.golfCoursesId).then((response) => {
        this.setState({
          appGolfCourse: response,
          
          
         
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
    const { appGolfCourse } = this.state;
    appGolfCourse.about = description.toString("html");
    this.setState({
      appGolfCourse,
      description,
    });
  }

  setFoodItem(foodItem) {
    const { appGolfCourse } = this.state;
    appGolfCourse.foodItem =foodItem;
    this.setState({
      appGolfCourse,
      foodItem,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;
    console.log("This is vvalud and name in handleinpu",value, name)
    const { appGolfCourse } = this.state;
    appGolfCourse[name] = value;
    this.setState({ appGolfCourse });
  }

  handleVideoURLChange = (event, index) => {
    const { name } = event.target;
    const { appGolfCourse } = this.state;
    appGolfCourse[name][index] = event.target.files[0];

    this.setState({ appGolfCourse });
  };

  handleImages = (event) => {
    const { name } = event.target;
    const { appGolfCourse } = this.state;
    appGolfCourse[name] = event.target.files[0];
    this.setState({ appGolfCourse });
  };

  postGolfcourses = async (event) => {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, appGolfCourse, image } = this.state;
    if (!loading) {
      this.setState({ loading: true });

      let imageFile = image;

      let downloadUrl;
      let imageUri;

      if (imageFile) {
        imageUri = await imageResizeFileUri({ file: imageFile });

        const storageRef = firebase.storage().ref().child("GolfCourses").child(`${uuidv4()}.jpeg`);

        if (imageUri) {
          await storageRef.putString(imageUri, "data_url");
          downloadUrl = await storageRef.getDownloadURL();
        }
        appGolfCourse.image = downloadUrl;
      }

      if (match.params.golfCoursesId) {
        let cloneObject = Object.assign({}, appGolfCourse);
        console.log("THis is the lcone object",cloneObject)
        updateGolfcourses(match.params.golfCoursesId, cloneObject)
          .then((response) => {
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Golf Courses updated successfully",
              snackBarVariant: "success",
            });
          })
          .catch((err) => {
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Error updating Golf Courses",
              snackBarVariant: "error",
            });
          });
      } else {
        addGolfcourses(appGolfCourse)
          .then((response) => {
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Golf Courses saved successfully",
              snackBarVariant: "success",
            });
          })
          .catch((err) => {
            console.log(err);
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Error creating Golf Courses",
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
    const { appGolfCourse } = this.state;
    appGolfCourse["date"] = new Date(date);
    this.setState({
      startDate: date,
      appGolfCourse,
    });
  };

  // handleTimeChange = (value) => {
  //   const {appGolfCourse} = this.state;
  //   appGolfCourse["time"] = value;
  //   this.setState({
  //     time: value,
  //     appGolfCourse
  //   })
  // }

  handleTimePicker = (label, value) => {
    const { appGolfCourse } = this.state;

    let time = {};

    if (label.includes("Start")) {
      time.startTime = value;
      appGolfCourse["time"].startTime = value;
      this.setState({
        startTime: value,
        appGolfCourse,
      });
    }
    if (label.includes("End")) {
      time.endTime = value;
      appGolfCourse["time"].endTime = value;
      this.setState({
        endTime: value,
        appGolfCourse,
      });
    }

    // console.log("Time object", time)

    // appGolfCourse["time"] = time;
    // this.setState({
    //   appGolfCourse,
    // })
  };

  render() {
    console.log(this.state);
    const { appGolfCourse, description, startTime, endTime, focusedInput, selectedDate, showSnackBar, snackBarMessage, snackBarVariant, image, file } = this.state;

    const { match, history } = this.props;
    const isEdit = !!match.params.golfCoursesId;

    return (
      <div className="row animated fadeIn">
        {showSnackBar && <SnackBar open={showSnackBar} message={snackBarMessage} variant={snackBarVariant} onClose={() => this.closeSnackBar()} />}
        <div className="col-12">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Golfcourses Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form id="demo-form2" data-parsley-validate className="form-horizontal form-label-left" onSubmit={this.postGolfcourses}>
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
                    ) : appGolfCourse.image && appGolfCourse.image.length ? (
                      <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                          <img style={{ marginRight: "5px" }} width="100" className="img-fluid" src={`${appGolfCourse.image}`} alt="profileImage" />
                        </div>
                      </div>
                    ) : null}

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Name of Golf courses</label>
                      <div className="col-md-6 col-sm-6">
                        <input required type="text" name="name" className="form-control" value={appGolfCourse.name} onChange={this.handleInputChange} />
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
                      <label className="control-label col-md-3 col-sm-3">Location</label>
                      <div className="col-md-6 col-sm-6">
                        <input required type="text" name="location" className="form-control" value={appGolfCourse.location} onChange={this.handleInputChange} />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Phone</label>
                      <div className="col-md-6 col-sm-6">
                        <input required type="text" name="phone" className="form-control" value={appGolfCourse.phone} onChange={this.handleInputChange} />
                      </div>
                    </div>

                    

 

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
