import React from "react";
import { Button } from "reactstrap";
import { addNotification } from "../backend/services/eventService";
import {
  getUsers,
} from "../backend/services/usersService";
import SnackBar from "../components/SnackBar";

import moment from "moment";

export default class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      notification: {
        title: "",
        message: "",
      },
      user:[],
      executive: [],
      members: [],
      guests: [],
      unknown: [],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.postNotification = this.postNotification.bind(this);
    this.fetchUsers = this.fetchUsers.bind(this)
  }

  fetchUsers = () => {
    getUsers()
      .then((response) => {
        console.log("############", response);
         var user=this.state.user
        this.setState({
          user:response,
          // pages: Math.ceil(response.data.length/10),
          loading: false,
          responseMessage: "No Users Found",
        });
      })
      .catch((err) => {
        console.log("#######err#####", err);
        this.setState({
          loading: false,
          responseMessage: "No Users Found...",
        });
      });
  };

  handleNotificationCheckboxChange = (event)=> {
    const { checked, name } = event.target;

    const { notification } = this.state;
    notification[name] = checked;
    this.setState({ notification });
  }
  componentDidMount() {
    const { match } = this.props;
    this.fetchUsers()
    // if (match.params.eventId) {
    //   getEventById(match.params.eventId).then((response) => {
    //     this.setState({
    //       appEvent: response,
    //       startDate: moment(new Date(response.date.seconds * 1000)),
    //       time: response.time,
    //       startTime: new Date(response.time.startTime * 1000),
    //       endTime: new Date(response.time.endTime * 1000),
    //       description: RichTextEditor.createValueFromString(
    //         response.about,
    //         "html"
    //       ),
    //     });
    //   });
    // }
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { notification } = this.state;
    notification[name] = value;
    console.log("this is the",notification)
    this.setState({ notification });
  }

  // postNotification = async (event) => {
  //   event.preventDefault();
  //   const { match, history } = this.props;
  //   const { loading, notification, image } = this.state;
  //   if (!loading) {
  //     this.setState({ loading: true });

  //     addNotification(notification)
  //       .then((response) => {
  //         this.setState({
  //           loading: false,
  //           showSnackBar: true,
  //           snackBarMessage: "Notification sent successfully",
  //           snackBarVariant: "success",
  //         });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         this.setState({
  //           loading: false,
  //           showSnackBar: true,
  //           snackBarMessage: "Error creating Notification",
  //           snackBarVariant: "error",
  //         });
  //       });
  //   }
  // };

  postNotification = async (event,tok) => {
    var TokenArray = [];
   // TokenArray.push
    // paidParticipants,
    // unPaidParticipants,
    // withdrawnParticipants,
    // paidWaitingParticipants,
    // unPaidWaitingParticipants
    var executive = [];
    var members = [];
    var guests = [];
    var unknown = [];
    // if(this.state.notification.executive)
    // {
    //   this.state.executive.map(
    //     (item)=>{
    //       TokenArray.push(item.fcmToken)
    //     }
    //   )
    // }
    // if(this.state.notification.members)
    // {
    //   this.state.members.map(
    //     (item)=>{
    //       TokenArray.push(item.fcmToken)
    //     }
    //   )
    // }
    // if(this.state.notification.guests)
    // {
    //   this.state.guests.map(
    //     (item)=>{
    //       TokenArray.push(item.fcmToken)
    //     }
    //   )
    // }
    // if(this.state.notification.unknown)
    // {
    //   this.state.unknown.map(
    //     (item)=>{
    //       TokenArray.push(item.fcmToken)
    //     }
    //   )
    // }
    // if(TokenArray.length<=0)
    // {
    //   TokenArray;
    //   return
    // }

    
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, notification, image } = this.state;
    if (!loading) {
      this.setState({ loading: true });
      notification.TokenArray = JSON.stringify( TokenArray);
      console.log("THis is the notification being created ",notification)
      addNotification(notification)
        .then((response) => {
          this.setState({
            loading: false,
            showSnackBar: true,
            snackBarMessage: "Notification sent successfully",
            snackBarVariant: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            loading: false,
            showSnackBar: true,
            snackBarMessage: "Error creating Notification",
            snackBarVariant: "error",
          });
        });
    }
  };

  closeSnackBar = () => {
    const { history } = this.props;
    this.setState({ showSnackBar: false });
    if (this.state.snackBarVariant === "success") {
      history.goBack();
    }
  };

  render() {
    console.log(this.state);
    const { notification, showSnackBar, snackBarMessage, snackBarVariant } =
      this.state;

    const { match, history } = this.props;
    const isEdit = !!match.params.eventId;

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
                  <h2>Send Notification</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postNotification}
                  >
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Title
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="title"
                          className="form-control"
                          value={notification.title}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Message
                      </label>
                      <div className="col-md-6 col-sm-6">
                      <textarea name="message" id="message" rows="15" cols="80"
                      value={notification.message}
                      onChange={this.handleInputChange}>
                        Write stuff here...
                        </textarea>

                        {/* <input
                          required
                          type="text"
                          name="message"
                          rows="25" cols="80"
                          className="form-control"
                          value={notification.message}
                          onChange={this.handleInputChange}
                        /> */}
                      </div>
                    </div>
 

                    <div className="ln_solid" />
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
                          {" Submit"}
                        </Button>
                        <Button
                          onClick={() => history.goBack()}
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
