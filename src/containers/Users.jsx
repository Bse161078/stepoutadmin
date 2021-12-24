import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CSVLink } from "react-csv";
// import { Pagination } from "react-bootstrap";
import classnames from "classnames";
import {
  getUsers,
  deleteUser,
  blockUser,
  updateMemberShipUser,
  updateMemberShipPaymentStatusUser
} from "../backend/services/usersService";
import moment from "moment";
import {
  getEvents,
} from "../backend/services/eventService";
import SnackBar from "../components/SnackBar";
import { RootConsumer } from "../backend/Context";
import Swal from "sweetalert2";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { Nav, NavItem, NavLink } from "reactstrap";

import { API_END_POINT } from "../config";
import Cookie from "js-cookie";
import { Tooltip } from "@material-ui/core";

const token = Cookie.get("sneakerlog_access_token");

let globalContext = null;

export default class Users extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      allusers: [],
      executive: [],
      members: [],
      guests: [],
      unknown: [],
      activePage: 1,
      selected: [],
      selectedIndex: [],
      upcomingEvents: [],
      pastEvents: [],
      pages: 1,
      q: "",
      loading: false,
      responseMessage: "Loading Users...",
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success",
    };
  }

  // handlePageChange = (pageNumber) => {
  //   const { activePage, allusers } = this.state;
  //   const indexOfLastTodo = (activePage + 1) * 10;
  //   const indexOfFirstTodo = indexOfLastTodo - 10;
  //   const currentTodos = allusers.slice(indexOfFirstTodo, indexOfLastTodo);

  //   console.log(`active page is ${pageNumber}`);
  //   this.setState({ activePage: pageNumber, users: currentTodos });
  // };

  componentWillMount() {
    this.fetchUsers();
    this.fetchEvent();
  }

  fetchEvent = () => {
    this.setState({ loading: true });
    getEvents()
      .then((response) => {
        this.setState({
          events: response,
          loading: false,
          responseMessage: "No Users Found",
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

  fetchUsers = () => {
    getUsers()
      .then((response) => {
        console.log("############", response);

        const sortedUsers = response.sort((a, b) => {
          var nameA = a.lname.toUpperCase();
          var nameB = b.lname.toUpperCase();

          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        });

        // let tempUsers = [...sortedUsers];
        // const { activePage } = this.state;
        // const indexOfLastTodo = activePage * 10;
        // const indexOfFirstTodo = indexOfLastTodo - 10;
        // const currentTodos = tempUsers.slice(indexOfFirstTodo, indexOfLastTodo);
        var executive = [];
        var members = [];
        var guests = [];
        var unknown = [];
        sortedUsers.map((item) => {
          // console.log("THis is greate",item.membership.toLowerCase())
          if (
            item.membership.toLowerCase() == "executive" ||
            item.membership.toLowerCase() == "paid"
          ) {
            executive.push(item);
          } else if (
            item.membership.toLowerCase() == "member" ||
            item.membership.toLowerCase() == "unpaid"
          ) {
            members.push(item);
          } else if (
            item.membership.toLowerCase() == "Social Guest".toLowerCase() ||  item.membership.toLowerCase() == "Golf Guest".toLowerCase()
          ) {
            guests.push(item);
          } else {
            unknown.push(item);
          }
        });
        console.log("This is great", executive);
        console.log("This is members", members);
        console.log("This is guests", guests);
        console.log("This is unknown", unknown);

        this.setState({
          users: sortedUsers,
          allusers: sortedUsers,
          executive: executive,
          members: members,
          guests: guests,
          unknown: unknown,
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

  removeUser(userId, index) {
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
        deleteUser(userId)
          .then((response) => {
            const users = this.state.users.slice();
            users.splice(index, 1);
            this.setState({
              users,
              showSnackBar: true,
              snackBarMessage: "User deleted successfully",
              snackBarVariant: "success",
            });
          })
          .catch(() => {
            this.setState({
              showSnackBar: true,
              snackBarMessage: "Error deleting user",
              snackBarVariant: "error",
            });
          });
      }
    });
  }

  removeUserMultiple() {
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
        this.state.selected.map((userId, index) => {
          deleteUser(userId)
            .then((response) => {
              const users = this.state.users.slice();
              users.splice(index, 1);
              this.setState({
                users,
                showSnackBar: true,
                snackBarMessage: "User deleted successfully",
                snackBarVariant: "success",
              });
            })
            .catch(() => {
              this.setState({
                showSnackBar: true,
                snackBarMessage: "Error deleting user",
                snackBarVariant: "error",
              });
            });
        });
      }
    });
  }

  isRegisteredForFutureEvent= (id)=>{

  }

  blockUserMultiple() {
    const users = this.state.users.slice();
    Swal.fire({
      title: "Are you sure?",
      // text: users[index].isActive
      //   ? "You want to Block these user!"
      //   : "You want to Un-block this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Block",
    }).then((result) => {
      if (result.value) {
        this.state.selected.map((userId, index) => {
          blockUser(userId, false)
            .then((response) => {
              // const users = this.state.users.slice();
              users[index].isActive = false;
              this.setState({
                users,
                showSnackBar: true,
                snackBarMessage: "User blocked successfully",
                snackBarVariant: "success",
              });
            })
            .catch(() => {
              this.setState({
                showSnackBar: true,
                snackBarMessage: "Error deleting user",
                snackBarVariant: "error",
              });
            });
        });
      }
    });
  }

  changeMembershipMultiple(e) {
    console.log("This is it", e);
    const users = this.state.users.slice();
    Swal.fire({
      title: "Are you sure?",
      // text: users[index].isActive
      //   ? "You want to Block these user!"
      //   : "You want to Un-block this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Change",
    }).then((result) => {
      if (result.value) {
        this.state.selected.map((userId, index) => {
          updateMemberShipUser(userId, e)
            .then((response) => {
              this.setState({
                users,
                showSnackBar: true,
                snackBarMessage: "Menbership changed successfully",
                snackBarVariant: "success",
              });
              this.fetchUsers();
            })
            .catch(() => {
              this.setState({
                showSnackBar: true,
                snackBarMessage: "Error ",
                snackBarVariant: "error",
              });
            });
        });
      }
    });
  }

  changeMembershipStatusMultiple(e) {
    console.log("This is it", e);
    const users = this.state.users.slice();
    Swal.fire({
      title: "Are you sure?",
      // text: users[index].isActive
      //   ? "You want to Block these user!"
      //   : "You want to Un-block this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Change",
    }).then((result) => {
      if (result.value) {
        this.state.selected.map((userId, index) => {
          updateMemberShipPaymentStatusUser(userId, e)
            .then((response) => {
              this.setState({
                users,
                showSnackBar: true,
                snackBarMessage: "Menbership Stats changed successfully",
                snackBarVariant: "success",
              });
              this.fetchUsers();
            })
            .catch(() => {
              this.setState({
                showSnackBar: true,
                snackBarMessage: "Error ",
                snackBarVariant: "error",
              });
            });
        });
      }
    });
  }


  blockUser(userId, index) {
    const users = this.state.users.slice();
    console.log(index);
    Swal.fire({
      title: "Are you sure?",
      text: users[index].isActive
        ? "You want to block this user!"
        : "You want to Un-block this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: users[index].isActive ? "Block" : "Un-block",
    }).then((result) => {
      if (result.value) {
        blockUser(userId, !users[index].isActive)
          .then((response) => {
            // const users = this.state.users.slice();
            users[index].isActive = !users[index].isActive;
            this.setState({
              users,
              showSnackBar: true,
              snackBarMessage: users[index].isActive
                ? "User un-blocked successfully"
                : "User blocked successfully",
              snackBarVariant: "success",
            });
          })
          .catch(() => {
            this.setState({
              showSnackBar: true,
              snackBarMessage: "Error deleting user",
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
    axios.get(`/api/area?q=${this.state.q}`).then((response) => {
      this.setState({
        areas: response.data.items,
        activePage: 1,
        pages: Math.ceil(response.data.total / 10),
      });
    });
  }

  handleSearch() {
    const { q } = this.state;
    if (q.length) {
      this.setState({
        loading: true,
        users: [],
        responseMessage: "Loading Users...",
      });
      axios
        .get(`${API_END_POINT}/api/users/search`, {
          params: { searchWord: this.state.q },
          headers: { "auth-token": token },
        })
        .then((response) => {
          this.setState({
            users: response.data.searchedItems,
            loading: false,
            responseMessage: "No Users Found...",
          });
        })
        .catch(() => {
          this.setState({
            loading: false,
            responseMessage: "No Users Found...",
          });
        });
    }
  }

  closeSnackBar = () => {
    this.setState({ showSnackBar: false });
  };

  FilterFn = (text) => {
    if (text !== "") {
      console.log("It is coming here", text);
      let newData = this.state.allusers.filter(function (item) {
        let itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        let textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      this.setState({
        users: newData,
        isSearching: true,
      });
    } else {
      this.setState({
        users: this.state.allusers,
        isSearching: false,
      });
    }
  };
  toggle = (tab) => {
    if (this.state.activeTab !== tab) this.setState({ activeTab: tab });
    // localStorage.setItem("userTab", tab);
    globalContext.handleSetUserTab(tab);
  };
  handleInputChange = (event) => {
    const { value } = event.target;
    console.log("THis is target value", value);
    this.setState({ q: event.target.value });
    this.FilterFn(event.target.value);
  };

  render() {
    // console.log(this.state);
    const {
      loading,
      users,
      responseMessage,
      showSnackBar,
      snackBarMessage,
      snackBarVariant,
    } = this.state;
    console.log("This is", this.state.selected);
    const exportToCSV = () => {};
    var header = ["Sr. #", "Name", "Phone", "Membership", "Blocked"];
    var data = [];

    return (
      <RootConsumer>
        {(context) => {
          globalContext = context;
          console.log("This is event tab", context.userTab);

          var userList = [];
          if (context.userTab == "1") {
            this.state.allusers.map((user, index) => {
              data.push([
                index + 1,
                user.lname + "," + user.fname,
                user.phone,
                user.membership,
                user.membership_fee_status,
                user.isActive ? "Block" : "Un Block",
              ]);
            });
          } else if (context.userTab == "2") {
            this.state.executive.map((user, index) => {
              data.push([
                index + 1,
                user.lname + "," + user.fname,
                user.phone,
                user.membership,
                user.membership_fee_status,
                user.isActive ? "Block" : "Un Block",
              ]);
            });
          } else if (context.userTab == "3") {
            this.state.members.map((user, index) => {
              data.push([
                index + 1,
                user.lname + "," + user.fname,
                user.phone,
                user.membership,
                user.membership_fee_status,
                user.isActive ? "Block" : "Un Block",
              ]);
            });
          } else if (context.userTab == "4") {
            this.state.guests.map((user, index) => {
              data.push([
                index + 1,
                user.lname + "," + user.fname,
                user.phone,
                user.membership,
                user.membership_fee_status,
                user.isActive ? "Block" : "Un Block",
              ]);
            });
          } else if (context.userTab == "5") {
            this.state.unknown.map((user, index) => {
              data.push([
                index + 1,
                user.lname + "," + user.fname,
                user.phone,
                user.membership,
                user.membership_fee_status,
                user.isActive ? "Block" : "Un Block",
              ]);
            });
          }

          if (context.userTab == 1) {
            userList = this.state.allusers;
          }
          if (context.userTab == "2") {
            userList = this.state.executive;
          } else if (context.userTab == "3") {
            userList = this.state.members;
          } else if (context.userTab == "4") {
            userList = this.state.guests;
          } else if (context.userTab == "5") {
            userList = this.state.unknown;
          }
          console.log("THis is the user list", userList);
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
                  <div className="col-sm-8">
                    <h3>List of Users</h3>
                  </div>
                  {/* <div className="col-sm-4"></div> */}
                  <div className="col-sm-2 pull-right mobile-space">
                    <Link to="/users/user-form">
                      <button type="button" className="btn btn-success">
                        Add new User
                      </button>
                    </Link>
                  </div>
                  <div className="col-sm-2 pull-right mobile-space">
                    {/* <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="btn btn-success"
                        table="table-to-xls"
                        filename="Users"
                        sheet="tablexls"
                        buttonText="Download as XLS"
                      /> */}
                    <CSVLink
                      className="btn btn-success"
                      filename={"users.csv"}
                      data={data}
                      headers={header}
                    >
                      Download CSV
                    </CSVLink>
                  </div>
                </div>
                <div className="row space-1">
                  <div className="col-sm-4"></div>
                  <div className="col-sm-4">
                    <div className="input-group">
                      <input
                        value={this.state.q}
                        onChange={this.handleInputChange}
                        className="form-control"
                        type="text"
                        name="search"
                        placeholder="Enter search keyword"
                        value={this.state.q}
                        // onChange={(event) => this.setState({ q: event.target.value })}
                      />
                      <span className="input-group-btn">
                        <button
                          type="button"
                          onClick={() => this.handleSearch()}
                          className="btn btn-info search-btn"
                        >
                          Search
                        </button>
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-4"></div>
                </div>
                {this.state.selected.length > 1 && (
                  <div className="row space-1">
                    <div className="col-sm-4">
                      <h3>List of Users</h3>
                    </div>
                    {/* <div className="col-sm-4"></div> */}
                    <div className="col-sm-2 pull-right mobile-space">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => this.removeUserMultiple()}
                      >
                        Delete Multiple
                      </button>
                    </div>
                    <div className="col-sm-2 pull-right mobile-space">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => this.blockUserMultiple()}
                      >
                        Block Multiple
                      </button>
                    </div>
                    <div className="col-sm-2">
                      <p>Membership</p>
                      <select
                        style={{ marginTop: 8 }}
                        onChange={(e) =>
                          this.changeMembershipMultiple(e.target.value)
                        }
                      >
                        <option name="unknown">Unknown</option>

                        <option name="executive">Executive</option>
                        <option name="member">Member</option>
                        <option name="Social Guest">Social Guest</option>
                        <option name="Golf Guest">Golf Guest</option>
                      </select>
                    </div>

                    <div className="col-sm-2">
                    <p>Membership Payment</p>
                      <select
                        style={{ marginTop: 8 }}
                        onChange={(e) =>
                          this.changeMembershipStatusMultiple(e.target.value)
                        }
                      >
                        <option name="unknown">Unknown</option>

                        <option name="paid">Paid</option>
                        <option name="unpaid">Unpaid</option>
                      </select>
                    </div>
                  </div>
                )}
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: context.userTab === "1",
                      })}
                      onClick={() => {
                        this.toggle("1");
                      }}
                    >
                      All Users{" "}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: context.userTab === "2",
                      })}
                      onClick={() => {
                        this.toggle("2");
                      }}
                    >
                      Executive
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: context.userTab === "3",
                      })}
                      onClick={() => {
                        this.toggle("3");
                      }}
                    >
                      Member
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: context.userTab === "4",
                      })}
                      onClick={() => {
                        this.toggle("4");
                      }}
                    >
                      Guest
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: context.userTab === "5",
                      })}
                      onClick={() => {
                        this.toggle("5");
                      }}
                    >
                      Unkown
                    </NavLink>
                  </NavItem>
                </Nav>

                <table
                  className="table table-striped"
                  style={{ display: "none" }}
                  id="table-to-xls"
                >
                  <thead>
                    <tr>
                      <th>Sr. #</th>
                      {/* <th>Image</th> */}
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Membership</th>
                      <th>Membership Fee Status</th>
                      <th>Credit</th>
                      <th>Handicaps</th>

                      <th>Blocked</th>
                      <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList && userList >= 1 ? (
                      userList.map((user, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          {/* <td>
                              {
                                <img
                                  style={{ height: "50px", width: "50px" }}
                                  src={user.profileImage}
                                />
                              }
                            </td> */}
                          <td>
                            {user.lname}, {user.fname}
                          </td>
                          <td>{user.phone}</td>
                          <td style={{textTransform:"capitalize"}}>{user.membership}</td>
                          <td style={{textTransform:"capitalize"}}>{user.membership_fee_status}</td>
                          <th>{user.credit}</th>
                          <th>{user.handicap || 0}</th>
                          <td>
                            <div className="app-body-row">
                              <div style={{ marginRight: "10px" }}>
                                {user.isActive ? "No" : "Yes"}
                              </div>
                              <Tooltip
                                title={user.isActive ? "Block" : "Un Block"}
                                aria-label="block"
                              >
                                <span
                                  className="fa fa-edit"
                                  style={{ cursor: "pointer" }}
                                  aria-hidden="true"
                                  onClick={() =>
                                    this.blockUser(user.uuid, index)
                                  }
                                ></span>
                              </Tooltip>
                            </div>
                          </td>
                          <td>
                            <Link to={`/users/edit-user/${user.uuid}`}>
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
                                  this.removeUser(user.uuid, index)
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

                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <td>
                          <input
                            type="checkbox"
                            checked={
                              this.state.selected.length ===
                              this.state.users.length
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              console.log("This is temp");
                              if (
                                this.state.selected.length ===
                                this.state.users.length
                              ) {
                                this.setState({
                                  selected: [],
                                  selectedIndex: [],
                                });
                              } else {
                                var temp = [];
                                var tempIndex = [];
                                this.state.users.map((user, index) => {
                                  temp.push(user.uuid);
                                  tempIndex.push(index);
                                });
                                this.setState({
                                  selected: temp,
                                  selectedIndex: tempIndex,
                                });
                              }
                            }}
                          ></input>
                        </td>
                        <th>Sr. #</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Membership</th>
                        <th>Membership Fee Status</th>
                        <th>Credit</th>
                        <th>Handicap</th>
                        <th>Blocked</th>
                        <th>Edit</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userList && userList.length >= 1 ? (
                        userList.map((user, index) => {
                          console.log(
                            "THis is result ",
                            user
                          );
                          return (
                            <tr key={index}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={
                                    this.state.selected.includes(user.uuid)
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    console.log("This is temp");
                                    if (
                                      this.state.selected.includes(user.uuid)
                                    ) {
                                      var temp = [];
                                      var tempIndex = [];
                                      this.state.selected.map((id, index) => {
                                        if (id != user.uuid) {
                                          console.log(
                                            "This is true",
                                            user.uuid,
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
                                      temp.push(user.uuid);
                                      tempIndex.push(index);
                                      this.setState({
                                        selected: temp,
                                        selectedIndex: tempIndex,
                                      });
                                    }
                                  }}
                                ></input>
                              </td>
                              <td>{index + 1}</td>
                              <td>
                                {
                                  <img
                                    style={{ height: "50px", width: "50px" }}
                                    src={user.profileImage}
                                  />
                                }
                              </td>
                              <td>
                                {user.lname}, {user.fname}
                              </td>
                              <td>{user.phone}</td>
                              <td style={{textTransform:"capitalize"}}>{user.membership}</td>
                              <td style={{textTransform:"capitalize"}}>{user.membership_fee_status}</td>
                              <th>{user.credit || 0}</th>
                              <th>{user.handicap || 0}</th>
                              <td>
                                <div className="app-body-row">
                                  <div style={{ marginRight: "10px" }}>
                                    {user.isActive ? "No" : "Yes"}
                                  </div>
                                  <Tooltip
                                    title={user.isActive ? "Block" : "Un Block"}
                                    aria-label="block"
                                  >
                                    <span
                                      className="fa fa-edit"
                                      style={{ cursor: "pointer" }}
                                      aria-hidden="true"
                                      onClick={() =>
                                        this.blockUser(user.uuid, index)
                                      }
                                    ></span>
                                  </Tooltip>
                                </div>
                              </td>
                              <td>
                                <Link to={`/users/edit-user/${user.uuid}`}>
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
                                      this.removeUser(user.uuid, index)
                                    }
                                  ></span>
                                </Tooltip>
                              </td>
                            </tr>
                          );
                        })
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
                    <Pagination
                      prev
                      next
                      items={this.state.pages}
                      activePage={this.state.activePage}
                      onSelect={this.handleSelect.bind(this)}
                    >
                      {" "}
                    </Pagination>
                  </div> */}
                <div>
                  {/* <Pagination
                      activePage={this.state.activePage}
                      itemsCountPerPage={10}
                      totalItemsCount={this.state.allusers.length}
                      pageRangeDisplayed={5}
                      onChange={this.handlePageChange}
                    /> */}
                </div>
              </div>
            </div>
          );
        }}
      </RootConsumer>
    );
  }
}
