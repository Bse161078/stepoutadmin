import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  getEvents,
  deleteEvent,
  closeEvent,
  closeEntry,
  closeFoodEntry
} from "../backend/services/eventService";
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
      upcomingEvents: [],
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
    this.fetchEvent();
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
        deleteEvent(eventId)
          .then((response) => {
            const events = this.state.events.slice();
            events.splice(index, 1);
            this.setState({
              events,
              originalEvents: events,
              showSnackBar: true,
              snackBarMessage: "Event deleted successfully",
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
        closeEvent(eventId, !events[index].status)
          .then((response) => {
            // const events = this.state.events.slice();
            events[index].status = !events[index].status;
            this.setState({
              events,
              showSnackBar: true,
              snackBarMessage: events[index].status
                ? "Event opened successfully"
                : "Event closed successfully",
              snackBarVariant: "success",
            });
            this.fetchEvent();
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
          deleteEvent(eventId)
            .then((response) => {
              const events = this.state.events.slice();
              events.splice(this.state.selectedIndex[index], 1);
              this.setState({
                events,
                originalEvents: events,
                showSnackBar: true,
                snackBarMessage: "Event deleted successfully",
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

  CloseEventMultiple() {
    const events = this.state.events;

    Swal.fire({
      title: "Are you sure?",
      text: "You want to close these events!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Close",
    }).then((result) => {
      if (result.value) {
        this.state.selected.map((eventId, index) => {
          closeEvent(eventId, false)
            .then((response) => {
              // const events = this.state.events.slice();
              events[index].status = false;
              this.setState({
                events,
                showSnackBar: true,
                snackBarMessage: "Event closed successfully",
                snackBarVariant: "success",
              });
              this.fetchEvent();
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

  CloseEntryMultiple() {
    const events = this.state.events;
    Swal.fire({
      title: "Are you sure?",
      text: "You want to close the entries of these events!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Close",
    }).then((result) => {
      if (result.value) {
        this.state.selected.map((eventId, index) => {
          closeEntry(eventId, false)
            .then((response) => {
              // const events = this.state.events.slice();
              events[index].entry = false;
              this.setState({
                events,
                showSnackBar: true,
                snackBarMessage: "Event entries closed successfully",
                snackBarVariant: "success",
              });
              this.fetchEvent();
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

  CloseEntry(eventId, selectedEvent) {
    const events = this.state.events;

    const index = events.indexOf(selectedEvent);
    Swal.fire({
      title: "Are you sure?",
      text: events[index].entry
        ? "You want to close the entries for this event!"
        : "You want to open the entries of this event!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: events[index].entry ? "Close" : "Open",
    }).then((result) => {
      if (result.value) {
        closeEntry(eventId, !events[index].entry)
          .then((response) => {
            // const events = this.state.events.slice();
            events[index].entry = !events[index].entry;
            this.setState({
              events,
              showSnackBar: true,
              snackBarMessage: events[index].entry
                ? "Event entries opened successfully"
                : "Event entries closed successfully",
              snackBarVariant: "success",
            });
            this.fetchEvent();
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
  CloseEntryFood(eventId, selectedEvent) {
    const events = this.state.events;

    const index = events.indexOf(selectedEvent);
    Swal.fire({
      title: "Are you sure?",
      text: events[index].closeFoodEntry
        ? "You want to close food entries for this event!"
        : "You want to open food entries of this event!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: events[index].closeFoodEntry ? "Close":"Open" ,
    }).then((result) => {
      if (result.value) {
        closeFoodEntry(eventId, !events[index].closeFoodEntry)
          .then((response) => {
            // const events = this.state.events.slice();
            events[index].closeFoodEntry = !events[index].closeFoodEntry;
            this.setState({
              events,
              showSnackBar: true,
              snackBarMessage: events[index].closeFoodEntry
                ? "Event food entries closed successfully"
                : "Event food entries opened successfully",
              snackBarVariant: "success",
            });
            this.fetchEvent();
          })
          .catch(() => {
            this.setState({
              showSnackBar: true,
              snackBarMessage: "Error updating food entry for event",
              snackBarVariant: "error",
            });
          });
      }
    });
  }

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
        responseMessage: "Loading Event...",
      });
      // if(q === "") {
      //   this.fetchEvent();
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
      upcomingEvents,
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
            context.eventTab == "1" ? upcomingEvents : pastEvents;

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
                    <h3>List of Events</h3>
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
                      this.fetchEvent();
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
                    <Link to="/events/event-form">
                      <button type="button" className="btn btn-success">
                        Add New Event
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
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: context.eventTab === "1",
                      })}
                      onClick={() => {
                        this.toggle("1");
                      }}
                    >
                      Upcoming Events
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: context.eventTab === "2",
                      })}
                      onClick={() => {
                        this.toggle("2");
                      }}
                    >
                      Past Events
                    </NavLink>
                  </NavItem>
                </Nav>
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
                        <th>Golf Course</th>
                        <th>Members Fee</th>
                        <th>Executive Fee</th>
                        <th>Golf Guest Fee</th>
                        <th>Social Guest Fee</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>About</th>
                        <th>Food Item</th>
                        <th>Start Sheet Url</th>
                        <th>Result Page Url</th>
                        <th>Open</th>
                        {eventList != pastEvents ? <th>Entry</th> : null}
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
                                  `/events/event-details/${event.uuid}`
                                )
                              }
                            >
                              {index + 1}
                            </td>
                            <td
                              onClick={() =>
                                this.props.history.push(
                                  `/events/event-details/${event.uuid}`
                                )
                              }
                            >
                              {event.name}
                            </td>
                            <td
                              onClick={() =>
                                this.props.history.push(
                                  `/events/event-details/${event.uuid}`
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
                                  `/events/event-details/${event.uuid}`
                                )
                              }
                            >
                              {event.location}
                            </td>

                            <td
                              onClick={() =>
                                this.props.history.push(
                                  `/events/event-details/${event.uuid}`
                                )
                              }
                            >
                              {event.golf_course}
                            </td>                            
                            <td
                              onClick={() =>
                                this.props.history.push(
                                  `/events/event-details/${event.uuid}`
                                )
                              }
                            >
                              £{event.fee ? event.fee : 0}
                            </td>


                            <td
                              onClick={() =>
                                this.props.history.push(
                                  `/events/event-details/${event.uuid}`
                                )
                              }
                            >
                              £{event.executive_fee ? event.executive_fee : 0}
                            </td>
                            <td
                              onClick={() =>
                                this.props.history.push(
                                  `/events/event-details/${event.uuid}`
                                )
                              }
                            >
                              £{event.golf_guest_fee ? event.golf_guest_fee : 0}
                            </td>
                            <td
                              onClick={() =>
                                this.props.history.push(
                                  `/events/event-details/${event.uuid}`
                                )
                              }
                            >
                              £{event.social_guest_fee ? event.social_guest_fee : 0}
                            </td>


                            <td
                              onClick={() =>
                                this.props.history.push(
                                  `/events/event-details/${event.uuid}`
                                )
                              }
                            >
                              {moment(
                                new Date(event.date.seconds * 1000)
                              ).format("DD MMM YYYY")}
                            </td>
                            <td
                              onClick={() =>
                                this.props.history.push(
                                  `/events/event-details/${event.uuid}`
                                )
                              }
                            >
                              {!!event.time && Object.keys(event.time).length
                                ? `${moment(
                                    new Date(
                                      event.time.startTime.seconds * 1000
                                    )
                                  ).format("hh:mm A")} - ${moment(
                                    new Date(event.time.endTime.seconds * 1000)
                                  ).format("hh:mm A")}`
                                : null}
                            </td>
                            <td
                              onClick={() =>
                                this.props.history.push(
                                  `/events/event-details/${event.uuid}`
                                )
                              }
                              dangerouslySetInnerHTML={{ __html: event.about }}
                            ></td>
                        <td
                              onClick={() =>
                                this.props.history.push(
                                  `/events/event-details/${event.uuid}`
                                )
                              }
                            >
                              {event.foodItem}
                            </td>
                            <td>
                            {event.url}
                            
                            </td>
                            <td>
                            {event.score_board_url}
                            
                            </td>

                            {event.status ? (
                              <td>
                                <Tooltip title="Close Event" aria-label="open">
                                  <span
                                    className="fa fa-check"
                                    style={{
                                      cursor: "pointer",
                                      color: "green",
                                    }}
                                    aria-hidden="true"
                                    onClick={() =>
                                      this.CloseEvent(event.uuid, event)
                                    }
                                  ></span>
                                </Tooltip>
                              </td>
                            ) : (
                              <td>
                                <Tooltip title="Open Event" aria-label="close">
                                  <span
                                    className="fa fa-close"
                                    style={{ cursor: "pointer", color: "red" }}
                                    aria-hidden="true"
                                    onClick={() =>
                                      this.CloseEvent(event.uuid, event)
                                    }
                                  ></span>
                                </Tooltip>
                              </td>
                            )}

                            {eventList != pastEvents ? (
                              event.entry ? (
                                <td>
                                  <Tooltip
                                    title="Close Entry"
                                    aria-label="open"
                                  >
                                    <span
                                      className="fa fa-unlock"
                                      style={{
                                        cursor: "pointer",
                                        color: "green",
                                      }}
                                      aria-hidden="true"
                                      onClick={() =>
                                        this.CloseEntry(event.uuid, event)
                                      }
                                    ></span>
                                  </Tooltip>
                                </td>
                              ) : (
                                <td>
                                  <Tooltip
                                    title="Open Entry"
                                    aria-label="close"
                                  >
                                    <span
                                      className="fa fa-lock"
                                      style={{
                                        cursor: "pointer",
                                        color: "red",
                                      }}
                                      aria-hidden="true"
                                      onClick={() =>
                                        this.CloseEntry(event.uuid, event)
                                      }
                                    ></span>
                                  </Tooltip>
                                </td>
                              )
                            ) : null}
                            
                            {eventList != pastEvents ? (
                              event.closeFoodEntry == true? (
                                <td>
                                  <Tooltip
                                    title="Close Food Entry"
                                    aria-label="open"
                                  >
                                    <span
                                      className="fa fa-lock"
                                      style={{
                                        cursor: "pointer",
                                        color: "red",
                                      }}
                                      aria-hidden="true"
                                      onClick={() =>
                                        this.CloseEntryFood(event.uuid, event)
                                      }
                                    ></span>
                                  </Tooltip>
                                </td>
                              ) : (
                                <td>
                                  <Tooltip
                                    title="Close Entry"
                                    aria-label="close"
                                  >
                                    <span
                                      className="fa fa-unlock"
                                      style={{
                                        cursor: "pointer",
                                        color: "green",
                                      }}
                                      aria-hidden="true"
                                      onClick={() =>
                                        this.CloseEntryFood(event.uuid, event)
                                      }
                                    ></span>
                                  </Tooltip>
                                </td>
                              )
                            ) : null}

                            <td>
                              <Link to={`/events/edit-event/${event.uuid}`}>
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
