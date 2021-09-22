import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  getGolfcourses,
  deleteGolfcourses,
  closeGolfcourses,
  
} from "../backend/services/GolfcoursesService";
// import {Pagination} from 'react-bootstrap';
import SnackBar from "../components/SnackBar";
import Swal from "sweetalert2";
import { withRouter } from "react-router-dom";
import { RootConsumer } from "../backend/Context";
import { API_END_POINT } from "../config";
import Cookie from "js-cookie";
import moment from "moment";
import { Tooltip } from "@material-ui/core";
import { Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
import { element } from "prop-types";
// import { indexOf } from "core-js/fn/array";

// import { from } from 'core-js/fn/array';
const token = Cookie.get("sneakerlog_access_token");

let globalContext = null;

class Events extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      originalEvents: [],
      all_golf_courses: [],
      pastEvents: [],
      selected: [],
      selectedIndex: [],
      activePage: 1,
      pages: 1,
      q: "",
      loading: false,
      responseMessage: "Loading Events...",
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success",
      activeTab: "1",
    };
  }

  componentWillMount() {
    this.fetchGolfCourses();
    // const EventTab = localStorage.getItem("EventTab");
    // if (EventTab) {
    // 	this.setState({ activeTab: EventTab });
    // 	// localStorage.clear();
    // }
  }

  toggle = (tab) => {
    if (this.state.activeTab !== tab) this.setState({ activeTab: tab });
    // localStorage.setItem("EventTab", tab);
    globalContext.handleSetEventTab(tab);
  };

  fetchGolfCourses = () => {
    this.setState({ loading: true });
    getGolfcourses()
      .then((response) => {
        console.log("this is response golf coures",response)
        this.setState({
          events: response,
          loading: false,
          responseMessage: "No Events Found",
        });

        
     

     

        this.setState({ all_golf_courses: response });
      })
      .catch(() => {
        this.setState({
          loading: false,
          responseMessage: "No Events Found...",
        });
      });
  };

  deleteEvent(eventId, index) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.value) {
        deleteGolfcourses(eventId)
          .then((response) => {
            const events = this.state.events.slice();
            events.splice(index, 1);
            this.setState({
              events,
              all_golf_courses: events,
              showSnackBar: true,
              snackBarMessage: "Golf Course deleted successfully",
              snackBarVariant: "success",
            });
          })
          .catch(() => {
            this.setState({
              showSnackBar: true,
              snackBarMessage: "Error deleting golf courses",
              snackBarVariant: "error",
            });
          });
      }
    });
  }

  CloseEvent(eventId, selectedEvent) {
    const events = this.state.events;

    const index = events.indexOf(selectedEvent);
    Swal.fire({
      title: "Are you sure?",
      text: events[index].status
        ? "You want to close this event!"
        : "You want to open this event!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: events[index].status ? "Close" : "Open",
    }).then((result) => {
      if (result.value) {
        closeGolfcourses(eventId, !events[index].status)
          .then((response) => {
            // const events = this.state.events.slice();
            events[index].status = !events[index].status;
            this.setState({
              events,
              showSnackBar: true,
              snackBarMessage: events[index].status
                ? "Golf Course opened successfully"
                : "Golf Course closed successfully",
              snackBarVariant: "success",
            });
            this.fetchGolfCourses();
          })
          .catch(() => {
            this.setState({
              showSnackBar: true,
              snackBarMessage: "Error deleting event",
              snackBarVariant: "error",
            });
          });
      }
    });
  }

  deleteEventMultiple(eventId, index) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.value) {
        this.state.selected.map((eventId, index) => {
          deleteGolfcourses(eventId)
            .then((response) => {
              const events = this.state.events.slice();
              events.splice(this.state.selectedIndex[index], 1);
              this.setState({
                events,
                originalEvents: events,
                showSnackBar: true,
                snackBarMessage: "Golf Course deleted successfully",
                snackBarVariant: "success",
              });
            })
            .catch(() => {
              this.setState({
                showSnackBar: true,
                snackBarMessage: "Error deleting event",
                snackBarVariant: "error",
              });
            });
        });
      }
    });
  }

  // CloseEventMultiple() {
  //   const events = this.state.events;

  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You want to close these events!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Close",
  //   }).then((result) => {
  //     if (result.value) {
  //       this.state.selected.map((eventId, index) => {
  //         closeEvent(eventId, false)
  //           .then((response) => {
  //             // const events = this.state.events.slice();
  //             events[index].status = false;
  //             this.setState({
  //               events,
  //               showSnackBar: true,
  //               snackBarMessage: "Golf Course closed successfully",
  //               snackBarVariant: "success",
  //             });
  //             this.fetchGolfCourses();
  //           })
  //           .catch(() => {
  //             this.setState({
  //               showSnackBar: true,
  //               snackBarMessage: "Error deleting event",
  //               snackBarVariant: "error",
  //             });
  //           });
  //       });
  //     }
  //   });
  // }

  // CloseEntryMultiple() {
  //   const events = this.state.events;
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You want to close the entries of these events!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Close",
  //   }).then((result) => {
  //     if (result.value) {
  //       this.state.selected.map((eventId, index) => {
  //         closeEntry(eventId, false)
  //           .then((response) => {
  //             // const events = this.state.events.slice();
  //             events[index].entry = false;
  //             this.setState({
  //               events,
  //               showSnackBar: true,
  //               snackBarMessage: "Golf Course entries closed successfully",
  //               snackBarVariant: "success",
  //             });
  //             this.fetchGolfCourses();
  //           })
  //           .catch(() => {
  //             this.setState({
  //               showSnackBar: true,
  //               snackBarMessage: "Error deleting event",
  //               snackBarVariant: "error",
  //             });
  //           });
  //       });
  //     }
  //   });
  // }

  // CloseEntry(eventId, selectedEvent) {
  //   const events = this.state.events;

  //   const index = events.indexOf(selectedEvent);
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: events[index].entry
  //       ? "You want to close the entries for this event!"
  //       : "You want to open the entries of this event!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: events[index].entry ? "Close" : "Open",
  //   }).then((result) => {
  //     if (result.value) {
  //       closeEntry(eventId, !events[index].entry)
  //         .then((response) => {
  //           // const events = this.state.events.slice();
  //           events[index].entry = !events[index].entry;
  //           this.setState({
  //             events,
  //             showSnackBar: true,
  //             snackBarMessage: events[index].entry
  //               ? "Golf Course entries opened successfully"
  //               : "Golf Course entries closed successfully",
  //             snackBarVariant: "success",
  //           });
  //           this.fetchGolfCourses();
  //         })
  //         .catch(() => {
  //           this.setState({
  //             showSnackBar: true,
  //             snackBarMessage: "Error deleting event",
  //             snackBarVariant: "error",
  //           });
  //         });
  //     }
  //   });
  // }

  handleSelect(page) {
    axios.get(`/api/area?offset=${(page - 1) * 10}`).then((response) => {
      this.setState({
        areas: response.data.items,
        activePage: page,
      });
    });
  }

  handleSearch() {
    const { q } = this.state;
    if (q.length) {
      this.setState({
        loading: true,
        events: [],
        responseMessage: "Loading Golfcourses...",
      });
      // if(q === "") {
      //   this.fetchGolfCourses();
      // } else {
      axios
        .get(`${API_END_POINT}/api/items/event/search`, {
          params: { searchWord: this.state.q },
          headers: { "auth-token": token },
        })
        .then((response) => {
          this.setState({
            events: response.data.searchedItems,
            loading: false,
            responseMessage: "No Events Found...",
          });
        })
        .catch(() => {
          this.setState({
            loading: false,
            responseMessage: "No Events Found...",
          });
        });
    }
  }

  closeSnackBar = () => {
    this.setState({ showSnackBar: false });
  };

  render() {
    // console.log(this.state);
    const {
      loading,
      events,
      pastEvents,
      all_golf_courses,
      activeTab,
      responseMessage,
      showSnackBar,
      snackBarMessage,
      snackBarVariant,
    } = this.state;
    return (
      <RootConsumer>
        {(context) => {
          globalContext = context;
          const eventList =
            context.eventTab == "1" ? all_golf_courses : pastEvents;

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
                <div className="row space-1">
                  <div className="col-sm-4">
                    <h3>List of Golfcourses</h3>
                  </div>
                  <div className="col-sm-4">
                    {/* <div className='input-group'>
                <input
                  className='form-control'
                  type="text"
                  name="search"
                  placeholder="Enter keyword"
                  value={this.state.q}
                  onChange={(event) => this.setState({q: event.target.value}, () => {
                    if(this.state.q === "") {
                      this.fetchGolfCourses();
                    }
                  })}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      this.handleSearch();
                    }
                  }}
                />
                <span className="input-group-btn" >
                  <button type="button" onClick={() => this.handleSearch()} className="btn btn-info search-btn">Search</button>
                </span>
              </div> */}
                  </div>

                  <div className="col-sm-4 pull-right mobile-space">
                    <Link to="/golfcourses/golfcourses-form">
                      <button type="button" className="btn btn-success">
                        Add New Golfcourses
                      </button>
                    </Link>
                  </div>
                </div>
                {this.state.selected.length > 1 && (
                  <div className="row space-1">
                    <div className="col-sm-6"></div>
                    {/* <div className="col-sm-4"></div> */}
                    <div className="col-sm-2 pull-right mobile-space">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => this.deleteEventMultiple()}
                      >
                        Delete Multiple
                      </button>
                    </div>

                    <div className="col-sm-2 pull-right mobile-space">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => this.CloseEventMultiple()}
                      >
                        Close Multiple Events
                      </button>
                    </div>
                    <div className="col-sm-2 pull-right mobile-space">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => this.CloseEntryMultiple()}
                      >
                        Close Multiple Entries
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            checked={
                              this.state.selected.length ===
                              this.state.events.length
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              console.log("This is temp");
                              if (
                                this.state.selected.length ===
                                this.state.events.length
                              ) {
                                this.setState({
                                  selected: [],
                                  selectedIndex: [],
                                });
                              } else {
                                var temp = [];
                                var tempIndex = [];
                                this.state.events.map((event, index) => {
                                  temp.push(event.uuid);
                                  tempIndex.push(index);
                                });
                                this.setState({
                                  selected: temp,
                                  selectedIndex: tempIndex,
                                });
                              }
                            }}
                          ></input>
                        </th>
                        <th>Sr. #</th>
                        <th>Title</th>
                        <th>Image</th>
                        <th>Location</th>
                        <th>Phone</th>
                        
                       
                        
                       
                      </tr>
                    </thead>
                    <tbody>
                      {eventList && eventList.length >= 1 ? (
                        eventList.map((event, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="checkbox"
                                checked={
                                  this.state.selected.includes(event.uuid)
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  console.log("This is temp");
                                  if (
                                    this.state.selected.includes(event.uuid)
                                  ) {
                                    var temp = [];
                                    var tempIndex = [];
                                    this.state.selected.map((id, index) => {
                                      if (id != event.uuid) {
                                        console.log(
                                          "This is true",
                                          event.uuid,
                                          id
                                        );
                                        temp.push(id);
                                        tempIndex.push(
                                          this.state.selectedIndex[index]
                                        );
                                      }
                                    });
                                    console.log(
                                      "This is temmp after removing",
                                      temp
                                    );
                                    this.setState({
                                      selected: temp,
                                      selectedIndex: tempIndex,
                                    });
                                  } else {
                                    var temp = this.state.selected;
                                    var tempIndex = this.state.selectedIndex;
                                    temp.push(event.uuid);
                                    tempIndex.push(index);
                                    this.setState({
                                      selected: temp,
                                      selectedIndex: tempIndex,
                                    });
                                  }
                                }}
                              ></input>
                            </td>

                            <td
                              onClick={() =>
                                this.props.history.push(
                                  // `/golfcourses/golfcourses-details/${event.uuid}`
                                )
                              }
                            >
                              {index + 1}
                            </td>
                            <td
                              onClick={() =>
                                this.props.history.push(
                                  // `/golfcourses/golfcourses-details/${event.uuid}`
                                )
                              }
                            >
                              {event.name}
                            </td>
                            <td
                              onClick={() =>
                                this.props.history.push(
                                  // `/golfcourses/golfcourses-details/${event.uuid}`
                                )
                              }
                            >
                              {
                                <img
                                  style={{ height: "50px", width: "50px" }}
                                  src={event.image}
                                />
                              }
                            </td>
                            <td
                              onClick={() =>
                                this.props.history.push(
                                  // `/golfcourses/golfcourses-details/${event.uuid}`
                                )
                              }
                            >
                              {event.location}
                            </td>
                            <td
                              onClick={() =>
                                this.props.history.push(
                                  // `/golfcourses/golfcourses-details/${event.uuid}`
                                )
                              }
                            >
                              {event.phone}
                            </td>
                           
                           
                         
                       

                            <td>
                              <Link to={`/golfcourses/edit-golfcourses/${event.uuid}`}>
                                <Tooltip title="Edit" aria-label="edit">
                                  <span
                                    className="fa fa-edit"
                                    aria-hidden="true"
                                  ></span>
                                </Tooltip>
                              </Link>
                            </td>
                            <td>
                              <Tooltip title="Delete" aria-label="delete">
                                <span
                                  className="fa fa-trash"
                                  style={{ cursor: "pointer" }}
                                  aria-hidden="true"
                                  onClick={() =>
                                    this.deleteEvent(event.uuid, index)
                                  }
                                ></span>
                              </Tooltip>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="15" className="text-center">
                            {responseMessage}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* <div className="text-center">
            <Pagination prev next items={this.state.pages} activePage={this.state.activePage} onSelect={this.handleSelect.bind(this)}> </Pagination>
          </div> */}
              </div>
            </div>
          );
        }}
      </RootConsumer>
    );
  }
}
export default withRouter(Events);
