import React from "react";
import { Button } from "reactstrap";
import { addNotification } from "../backend/services/eventService";
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
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.postNotification = this.postNotification.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
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

  postNotification = async (event) => {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, notification, image } = this.state;
    if (!loading) {
      this.setState({ loading: true });

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
                        <input
                          required
                          type="text"
                          name="message"
                          maxLength="80"
                          className="form-control"
                          value={notification.message}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        User Type
                      </label>
                      <div className="col-sm-2">
                        <select
                          style={{ marginTop: 8 }}
                          onChange={this.handleInputChange}
                          name="type"
                          required
                        >
                          <option name="unknown">Unknown</option>

                          <option name="executive">Executive</option>
                          <option name="member">Member</option>
                          <option name="guest">Guest</option>
                        </select>
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
