import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
// import { Pagination } from "react-bootstrap";
import classnames from "classnames";
import firebase from "firebase";
import {
  getUsers,
  deleteUser,
  blockUser,
  updateMemberShipUser,
  updateMemberShipPaymentStatusUser,
} from "../backend/services/usersService";
import moment from "moment";
import { getEvents } from "../backend/services/eventService";
import SnackBar from "../components/SnackBar";
import { RootConsumer } from "../backend/Context";
import Swal from "sweetalert2";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { Nav, NavItem, NavLink } from "reactstrap";

import  {API_END_POINT}  from "../config";
import Cookie from "js-cookie";
import { Tooltip } from "@material-ui/core";
import '../scss/style.scss'
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
      Restaurants:[],
      pages: 1,
      search:'',
      q: "",
      loading: true,
      responseMessage: "Loading Users...",
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  // handlePageChange = (pageNumber) => {
  //   const { activePage, allusers } = this.state;
  //   const indexOfLastTodo = (activePage + 1) * 10;
  //   const indexOfFirstTodo = indexOfLastTodo - 10;
  //   const currentTodos = allusers.slice(indexOfFirstTodo, indexOfLastTodo);

  //   console.log(`active page is ${pageNumber}`);
  //   this.setState({ activePage: pageNumber, users: currentTodos });
  // };

   useEffect=()=>{
    this.fetchUsers()
    localStorage.setItem("user","")
  }
  componentDidMount(){
    this.fetchUsers()
    localStorage.setItem("user","")
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
          responseMessage: "No Users Found...",
        });
      });
  };

  fetchUsers = () => {
    getUsers()
      .then((response) => {
        console.log("############", response);
        var keepIndex = [
          207, 208, 209, 210, 212, 216, 220, 221, 222, 223, 224, 225, 257, 258,
          259, 274, 275, 337, 357, 368, 369, 370, 373, 379, 380, 393, 394, 395,
          408, 409, 417, 418, 512, 513, 592, 644, 646, 718, 800, 884, 885, 957,
          958, 1025, 1026, 1027, 1189, 1271, 1275, 1286, 1440, 1480, 1495, 1510,
          1593, 1594, 1599, 1600, 1613, 1631, 1686, 1981, 2006, 2040, 2094,
          2121, 2274, 2403, 2868, 2880, 3230, 3330, 3331, 3332, 3337, 3338,
          3339, 3340, 3341, 3343, 3344, 3346, 3348, 3349, 3350, 3351, 3352,
          3353, 3359, 3360, 3361, 3365, 3372, 3373, 3378, 3396, 3412, 3425,
          3427, 3437, 3443, 3444, 3446, 3854, 3855, 3882, 3883, 3937, 3939,
          3948, 3949, 4009, 4167, 4278, 4279, 4281, 4297, 4300, 4301, 4452,
        ];

        const sortedUsers = response.sort((a, b) => {
          var nameA = a.lastname.toUpperCase();
          var nameB = b.lastname.toUpperCase();

          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        });

        this.setState({
          users: sortedUsers,
          allusers: sortedUsers,
          loading:false
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
            console.log("deleteuser",response)
            const users = [...this.state.allusers]; 
             this.state.allusers.slice();
            let selectedIndex = null;
            users.forEach((user, index) => {
              if (user.id === userId) {
                selectedIndex = index;
              }
            });
            if (selectedIndex) {
              users.splice(selectedIndex, 1);
            }

            this.setState({
              users: [...users],
              allusers:[...users],
              showSnackBar: true,
              snackBarMessage: "User deleted successfully",
              snackBarVariant: "success",
            });
            this.fetchUsers();
          })
          .catch((e) => {
            console.log("deleteuser",e)
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
        console.log("dddd", this.state.selected);
        this.state.selected.map((userId, index) => {
          deleteUser(userId)
            .then((response) => {
              //deleting user from authentication
              // await admin.auth().deleteUser(userId)
              //   .then(function () {
              //     console.log("Successfully deleted user");
              //   })
              //   .catch(function (error) {
              //     console.log("Error deleting user:", error);
              //   })
              const users = this.state.users.slice();
              users.splice(index, 1);
              this.setState({
                users,
                showSnackBar: true,
                snackBarMessage: "User deleted successfully",
                snackBarVariant: "success",
              });
              this.fetchUsers();
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

  isRegisteredForFutureEvent = (id) => {};

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
              this.fetchUsers();
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
          console.log("usersupdate",userId)
            .then((response) => {
              this.setState({
                users,
                showSnackBar: true,
                snackBarMessage: "Menbership changed successfully",
                snackBarVariant: "success",
              });
              this.fetchUsers();
              this.state.selectedIndex.length=0
              this.setState({
                selectedIndex: [],
                selected: [],
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
    console.log(this.state.selected,"user in event page");

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
              this.state.selectedIndex.length=0
    this.setState({
      selectedIndex: [],
      selected: [],
    });
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
            this.fetchUsers();
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
  handleInputChange(event) {
    let search = this.state.search
    const { value, name } = event.target;
    this.setState({
      search:value
    })
  }

  render() {
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
      <div class="container my-4" style={{overflow:"auto"}} >
         {this.state.loading===true&&
          <div class="loader"></div>
        }
        {this.state.showSnackBar&&<SnackBar
            open={showSnackBar}
            message={snackBarMessage}
            variant={snackBarVariant}
            onClose={() => this.closeSnackBar()}
          />}
      <div className="row space-1">
                  <div className="col-sm-8">
                    <h3>List of Users</h3>
                  </div>
                  {/* <div className="col-sm-4"></div> */}
                  <div className="col-sm-2 pull-right mobile-space">
                    <Link to="User/AddUser">
                      <button type="button" className="btn btn-success"
                      >
                        Add new Users
                      </button>
                    </Link>
                  </div>
                </div>
                  <div className="row space-1">
                  <div className="col-sm-4"></div>
                  <div className="col-sm-4">
                    <div className="input-group">
                      <input className="form-control"
                        type="text"
                        name="search"
                        placeholder="Enter users name"
                        onChange={this.handleInputChange}
                        // onChange={(event) => }q: event.target.value })}
                      />
                      <span className="input-group-btn">
                        <button
                          type="button"
                         
                        >
                          Search
                        </button>
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-4"></div>
                </div>
      <table id="dtBasicExample" class="table table-striped table-bordered"  width={1000} style={{tableLayout:'auto'}} >
        <thead>
          <tr>
            <th class="th-sm">First Name
            </th>
            <th class="th-sm">Last Name
            </th>
            <th class="th-sm">Gender
            </th>
            <th class="th-sm">Occupation
            </th>
            <th class="th-sm">Trip Location
            </th>
            <th class="th-sm">DOB
            </th>
            <th class="th-sm">IndoorActivities
            </th>
            <th class="th-sm">OutdoorActivities
            </th>
            <th class="th-sm">Restaurants
            </th>
            <th class="th-sm">Edit
            </th>
            <th class="th-sm">Delete
            </th>
          </tr>
        </thead>
        <tbody>
        {this.state.allusers.filter((user)=>(user.firstname+" "+user.lastname).toLowerCase().includes((this.state.search).toLowerCase())).map((users) => {
          return(
        <tr>
            <td>{users.firstname} </td>
            <td>{users.lastname}</td>
            <td>{users.gender}</td>
            <td>{users.occupation}</td>
            <td>{users.updatedTripLocation}</td>
            <td>{users.dob}</td>
            <td>{users.IndoorActivities&&users.IndoorActivities.map((activity)=>{
              return(
                activity.selected===true&&
                <li>
                {activity.name}
                </li>
              )
            })}</td>
            <td>{users.OutdoorActivities&&users.OutdoorActivities.map((activity)=>{
              return(
                activity.selected===true&&
                <li>
                {activity.name}
                </li>
              )
            })}</td>
            <td>{users.Restaurants&&users.Restaurants.map((activity)=>{
              return(
                activity.selected===true&&
                <li>
              {activity.name}
              </li>
              )
            })}</td>
            <td>
          <Link to={`/User/EditUser`}>
          <Tooltip title="Edit" aria-label="edit"
          onClick={()=>{
            localStorage.setItem("user",JSON.stringify(users))
          }}
          >
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
              {
                this.removeUser(users.id)
              }
            }
          ></span>
          </Tooltip>
          </td>
        </tr>
          )
  })
  }
        </tbody>
       
      </table>
  
  
  
  
  
    </div>
    );
  }
}
