import React, { useRef,useState } from "react";
import axios from "axios";
import RichTextEditor from "react-rte";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonToggle,
  Alert,
} from "reactstrap";
import {
  addEvent,
  updateEvent,
  getEventById,
  deleteEventDivisions,
  updateEventParticipants,
  updateEventDivisions,
  updateOtherResults,
  updateEventGroups,
  deleteEventGroup,
  deleteEventParticipant,
} from "../backend/services/eventService";
import {
  getUsers,
  deleteUser,
  blockUser,
} from "../backend/services/usersService";
import { addNotification } from "../backend/services/eventService";
import Swal from "sweetalert2";
import { Nav, NavItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Typeahead } from "react-bootstrap-typeahead"; // ES2015

import { toolbarConfig } from "../static/_textEditor";
import { firebase } from "../backend/firebase";
import { imageResizeFileUri } from "../static/_imageUtils";
import { v4 as uuidv4 } from "uuid";
import SnackBar from "../components/SnackBar";
import { API_END_POINT } from "../config";
import TimePicker from "../components/TimePicker";
import moment from "moment";
import { SingleDatePicker } from "react-dates";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";
import { Tooltip, Avatar } from "@material-ui/core";
import { result } from "lodash";
import classnames from "classnames";
import { th, te, tr, el } from "date-fns/locale";
import { Multiselect } from "multiselect-react-dropdown";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { CSVLink } from "react-csv";

var subtitle;

export default class EventDetails extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selected: [],
        selectedIndex: [],
        events: [],
        allCheckBox:false,
        checkbox:false,
      appEvent: {
        name: "",
        date: "",
        
        time: {},
        location: "",
        about: "",
        image: "",
        pairings: "",
        ntpPlayer: [],
        longestDrivePlayer: [],
        lowestGrosePlayer: [],
       
        
      },
    
      otherResults: {
        ntp: "",
        longestDrive: "",
        lowestGrose: "",
        ntpPlayer: [],
        longestDrivePlayer: [],
        lowestGrosePlayer: [],
        otherText: "",
      },
      notification: {
        title: "",
        message: "",
        TokenArray: [],
      },
      otherDescription: RichTextEditor.createEmptyValue(),
      otherDescriptionShow: RichTextEditor.createEmptyValue(),

      ntpPlayer: [],
      longestDrivePlayer: [],
      lowestGrosePlayer: [],
      first: RichTextEditor.createEmptyValue(),
      second: RichTextEditor.createEmptyValue(),
      third: RichTextEditor.createEmptyValue(),
      division: {
        divisionName: "",
        first: "",
        second: "",
        third: "",
        player1: [],
        player2: [],
        player3: [],
      },
      group: {
        groupName: "",
        startTime: null,
        players: [],
      },
      groups: [],
      description: RichTextEditor.createEmptyValue(),

      pairings: RichTextEditor.createEmptyValue(),
      startTime: null,
      endTime: null,
      startDate: null,
      endDate: null,
      focusedInput: null,
      time: ["", ""],
      image: "",
      file: "",
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success",
      goBack: false,
      divisionPlayerList: [],
      groupPlayerList: [],

      filteredUsers: [],
      participants: [],
      paidParticipants: [],
      unPaidParticipants: [],
      paidSocialParticipants: [],
      unPaidSocialParticipants: [],
      withdrawnParticipants: [],
      paidWaitingParticipants: [],
      unPaidWaitingParticipants: [],

      updatedParticipants: [],

      divisions: [],
      activeTab: "1",
      modalIsOpen: false,
      statusModal: false,
      divsionIsOpen: false,
      otherResultModal: false,
      pairingModal: false,
      selectedDivision: {},
      selectedDivisionIndex: null,
      selectedGroupIndex: null,
      selectedUser: {},
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleNotificationInputChange =
      this.handleNotificationInputChange.bind(this);
    this.postEvent = this.postEvent.bind(this);
  }
  componentDidMount() {
    // this.fetchEventbyId();
    this.fetchAllUsers();
  }

  fetchEventbyId = () => {
    const { match } = this.props;
    if (match.params.eventId) {
      getEventById(match.params.eventId).then((response) => {
        console.log("respone:", response);
        this.setState({
          appEvent: response,
          startDate: moment(new Date(response.date.seconds * 1000)),
          time: response.time,
          startTime: new Date(response.time.startTime * 1000),
          endTime: new Date(response.time.endTime * 1000),
          description: RichTextEditor.createValueFromString(
            response.about,
            "html"
          ),
          pairings: RichTextEditor.createValueFromString(
            response.pairings,
            "html"
          ),
        });
        if (response.divisions) {
          this.setState({ divisions: response.divisions });
        }
        if (response.otherResults) {
          this.setState({
            otherResults: response.otherResults,
          });
          if (response.otherResults.otherText) {
            this.setState({
              otherDescriptionShow: RichTextEditor.createValueFromString(
                response.otherResults.otherText,
                "html"
              ),
              otherDescription: RichTextEditor.createValueFromString(
                response.otherResults.otherText,
                "html"
              ),
            });
          }
        }
        if (response.participants) {
          this.fetchUsers(response.participants);
        }
        if (response.groups) {
          this.setState({ groups: response.groups });
        }
        // if (response.ntpPlayer) {
        // 	this.state.ntpPlayer = response.ntpPlayer;
        // }
        // if (response.longestDrivePlayer) {
        // 	this.state.longestDrivePlayer = response.longestDrivePlayer;
        // }
        // if (response.lowestGrosePlayer) {
        // 	this.state.lowestGrosePlayer = response.lowestGrosePlayer;
        // }
      });
    }
  };

  getUserNameById = (id, element, participants) => {
    var element = element;
    this.state.allusers.forEach((usetItem) => {
      console.log("This is the usetItem", element);
      if (id == usetItem.uuid) {
        element.fcmToken = usetItem.fcmToken;
        element.name = usetItem.name;
        element.image = usetItem.image;
        element.handicap = usetItem.handicap;
        element.handicap = usetItem.handicap;
        return element;
      }
    });
    return element;
  };

  fetchAllUsers = () => {
    let users = [];
    let tempUsers = [];
    let filteredUsers = [];
    getUsers()
      .then((response) => {
        tempUsers = response;
        tempUsers.forEach((item) => {
          let temp = item;
          temp.waiting = item.waiting || false;
          users.push(temp);
        });

        console.log("These are sorted user", users);
        this.setState({
          users: users,
          allusers: users,
          loading: false,
          responseMessage: "No Users Found",
        });
        this.fetchEventbyId();
      })
      .catch((err) => {
        console.log("#######err#####", err);
        this.setState({
          loading: false,
          responseMessage: "No Users Found...",
        });
      });
  };

  fetchUsers = (participants) => {
    let users = [];
    let tempUsers = [];
    let filteredUsers = [];
    getUsers()
      .then((response) => {
        tempUsers = response;
        tempUsers.forEach((item) => {
          let temp = item;
          temp.waiting = item.waiting || false;
          users.push(temp);
        });

        participants.forEach((element) => {
          users.forEach((usetItem) => {
            console.log("This is the usetItem", element);
            if (element.userId == usetItem.uuid) {
              let user = usetItem;
              user.paid = element.paid || false;
              user.paid_social = element.paid_social || false;
              user.waiting_social = element.waiting_social || false;
              user.withdrawn = element.withdrawn || false;
              user.selectedFood = element.selectedFood || "";
              user.waiting = element.waiting || false;
              // user.fcmToken =  element.fcmToken;
              filteredUsers.push(user);
            }
          });
        });

        const paid = participants.filter((element) => {
          element = this.getUserNameById(element.userId, element, participants);
          console.log(
            "This is the  element",
            element,
            element.guest_first_name === "",
            !element.guest_first_name
          );
          return (
            element.paid &&
            !element.withdrawn &&
            !element.waiting &&
            !element.guest_first_name
          );
        });
        const unPaid = participants.filter((element) => {
          return (
            !element.paid &&
            !element.waiting_social &&
            !element.paid_social &&
            !element.withdrawn &&
            !element.waiting &&
            (element.guest_first_name == "" || !element.guest_first_name)
          );
        });
        const paidSocial = participants.filter((element) => {
          // element.name = element.guest_first_name +" "+element.guest_last_name;
          return (
            element.paid &&
            !element.withdrawn &&
            !element.waiting &&
            element.guest_first_name != "" &&
            element.guest_first_name != null
          );
        });
        const waitingSocial = participants.filter((element) => {
          console.log("Thsi is  watin social", element.waiting_social);
          // element.name = element.guest_first_name +" "+element.guest_last_name;
          return (
            !element.paid &&
            !element.withdrawn &&
            !element.waiting &&
            element.guest_first_name != "" &&
            element.guest_first_name != null
          );
        });
        console.log("These are paid social", paidSocial);
        console.log("These are waiting social", waitingSocial);
        console.log("These are  paid", paid);

        const withdrawn = filteredUsers.filter((element) => {
          return element.withdrawn;
        });
        const paidWaiting = filteredUsers.filter((element) => {
          return element.paid && !element.withdrawn && element.waiting;
        });
        const unPaidWaiting = filteredUsers.filter((element) => {
          return !element.paid && !element.withdrawn && element.waiting;
        });

        users.forEach((element) => {
          element.selected = false;
        });
        users = users.sort(function (x, y) {
          if (x.waiting === null) {
            x.waiting = false;
          }
          console.log("This is  x. wating", x.waiting);
          // console.log("This is time", y.fname[0] < x.fname[0]);
          return y.fname < x.fname;
        });
        console.log("These are sorted user", users);
        this.setState({
          users: users,
          allusers: users,
          participants: participants,
          filteredUsers: filteredUsers,
          paidParticipants: paid,
          unPaidParticipants: unPaid,
          withdrawnParticipants: withdrawn,
          paidWaitingParticipants: paidWaiting,
          unPaidWaitingParticipants: unPaidWaiting,
          paidSocialParticipants: paidSocial,
          unPaidSocialParticipants: waitingSocial,
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

  toggle = (tab) => {
    if (this.state.activeTab !== tab) this.setState({ activeTab: tab });
  };

  getWorkoutDays = () => {
    axios.get(`${API_END_POINT}/api/v1/workout_days`).then((response) => {
      this.setState({
        workoutDays: response.data.data,
        responseMessage: "No Workout Days Found...",
      });
    });
  };

  setDescription1st(description) {
    const { division } = this.state;
    // division[name] = description.toString("html");
    division.first = description.toString("html");
    this.setState({
      division,
      first: description,
    });
  }

  setDescription2nd(description) {
    const { division } = this.state;
    division.second = description.toString("html");
    this.setState({
      division,
      second: description,
    });
  }

  setDescription3rd(description) {
    const { division } = this.state;
    division.third = description.toString("html");
    this.setState({
      division,
      third: description,
    });
  }

  setPairings(pairings) {
    const { appEvent } = this.state;
    appEvent.pairings = pairings.toString("html");
    this.setState({
      appEvent,
      pairings,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { appEvent } = this.state;
    appEvent[name] = value;
    this.setState({ appEvent });
  }

  handleNotificationInputChange = (event) => {
    const { value, name } = event.target;

    const { notification } = this.state;
    notification[name] = value;
    this.setState({ notification });
  };

  handleNotificationCheckboxChange = (event) => {
    const { checked, name } = event.target;

    const { notification } = this.state;
    notification[name] = checked;
    this.setState({ notification });
  };

  handleOtherResultInputChange = (event) => {
    const { value, name } = event.target;

    const { otherResults } = this.state;
    otherResults[name] = value;
    this.setState({ otherResults });
  };

  handleDivisionInputChange = (event) => {
    const { value, name } = event.target;

    const { division } = this.state;

    division[name] = value;
    this.setState({ division });
  };

  handleGroupInputChange = (event) => {
    const { value, name } = event.target;

    const { group } = this.state;

    group[name] = value;
    this.setState({ group });
  };

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

        const storageRef = firebase
          .storage()
          .ref()
          .child("Events")
          .child(`${uuidv4()}.jpeg`);

        if (imageUri) {
          await storageRef.putString(imageUri, "data_url");
          downloadUrl = await storageRef.getDownloadURL();
        }
        appEvent.image = downloadUrl;
      }

      if (match.params.eventId) {
        let cloneObject = Object.assign({}, appEvent);
        updateEvent(match.params.eventId, cloneObject)
          .then((response) => {
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Event updated successfully",
              snackBarVariant: "success",
              goBack: true,
            });
            this.fetchEventbyId();
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
            this.fetchEventbyId();
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
    if (this.state.goBack) {
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

  setDescription(description) {
    const { otherResults } = this.state;
    otherResults.otherText = description.toString("html");
    this.setState({
      otherResults,
      otherDescription: description,
    });
  }

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
      //   if (result.value) {
      //     deleteEvent(eventId)
      //       .then((response) => {
      //         const events = this.state.events.slice();
      //         events.splice(index, 1);
      //         this.setState({
      //           events,
      //           originalEvents: events,
      //           showSnackBar: true,
      //           snackBarMessage: "Event deleted successfully",
      //           snackBarVariant: "success",
      //         });
      //       })
      //       .catch(() => {
      //         this.setState({
      //           showSnackBar: true,
      //           snackBarMessage: "Error deleting event",
      //           snackBarVariant: "error",
      //         });
      //       });
      //   }
    });
  }

  handleTimePicker = (label, value) => {
    const { group } = this.state;
    let time = {};
    if (label.includes("Start")) {
      time.startTime = value;
      group.startTime = value;
      this.setState({
        GroupStartTime: value / 1000,
        group,
      });
    }

    // time.startTime = value;
    // group.startTime = value;

    // appEvent["time"] = time;
    // this.setState({
    //   appEvent,
    // })
  };

  customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "red",
    },
  };

  toggleModal = () => {
    this.setState({ modalIsOpen: !this.state.modalIsOpen });
  };

  toggleStatusModal = () => {
    this.setState({ statusModal: !this.state.statusModal });
  };

  toggleDivisionModal = (index = null, item = null) => {
    const divisionPlayerList = [...this.state.filteredUsers];
    if (index != null && item != null) {
      this.setState({ division: item, selectedDivisionIndex: index });
    } else {
      this.setState({
        division: {
          divisionName: "",
          first: "",
          second: "",
          third: "",
        },
        selectedDivisionIndex: null,
        divisionPlayerList: divisionPlayerList,
      });
    }
    this.setState({ divsionIsOpen: !this.state.divsionIsOpen });
  };

  toggleOtherResultModal = () => {
    this.setState({ otherResultModal: !this.state.otherResultModal });
  };

  onpenStatusModal = (user) => {
    this.setState({ selectedUser: user });
    this.setState({ statusModal: true });
  };

  togglePairingsModal = (index = null, item = null) => {
    const groupPlayerList = [...this.state.filteredUsers];
    if (index != null && item != null) {
      this.setState({ group: item, selectedGroupIndex: index });
    } else {
      this.setState({
        group: {
          groupName: "",
          startTime: null,
          players: [],
          GroupStartTime: "",
        },
        selectedGroupIndex: null,
        groupPlayerList: groupPlayerList,
      });
    }
    this.setState({ pairingModal: !this.state.pairingModal });
  };

  onSelect = (event, selectedList) => {
    const { group } = this.state;
    // group.players = selectedList;
    const list = selectedList.map((obj) => {
      return Object.assign({}, obj);
    });
    group.players = list;

    console.log("Selected List:", list);
  };

  onRemove = (selectedList, removedItem) => {
    const { group } = this.state;
    group.players = selectedList;
  };

  onSelectDivisionPlayer1 = (event, selectedList) => {
    const { division } = this.state;
    // group.players = selectedList;
    const list = Object.assign({}, selectedList);
    // selectedList.map((obj) => {
    // 	return Object.assign({}, obj);
    // });
    division.player1 = list;
  };

  onSelectDivisionPlayer2 = (event, selectedList) => {
    const { division } = this.state;
    // group.players = selectedList;
    // const list = selectedList.map((obj) => {
    // 	return Object.assign({}, obj);
    // });
    const list = Object.assign({}, selectedList);

    division.player2 = list;
  };

  onSelectDivisionPlayer3 = (event, selectedList) => {
    const { division } = this.state;
    // group.players = selectedList;
    // const list = selectedList.map((obj) => {
    // 	return Object.assign({}, obj);
    // });
    const list = Object.assign({}, selectedList);

    division.player3 = list;
  };

  onSelectNTPPlayer = (event, selectedList) => {
    const { otherResults } = this.state;
    // group.players = selectedList;
    // const list = selectedList.map((obj) => {
    // 	return Object.assign({}, obj);
    // });
    console.log("THis isthe other result", otherResults);
    const list = Object.assign({}, selectedList);

    otherResults.ntpPlayer = list;
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

  handleInputChange = (event) => {
    const { value } = event.target;
    console.log("THis is target value", value);
    this.setState({ q: event.target.value });
    this.FilterFn(event.target.value);
  };

  onSelectLongestDrive = (event, selectedList) => {
    const { otherResults } = this.state;
    // group.players = selectedList;
    // const list = selectedList.map((obj) => {
    // 	return Object.assign({}, obj);
    // });
    const list = Object.assign({}, selectedList);

    otherResults.longestDrivePlayer = list;
  };

  onSelectLowestGross = (event, selectedList) => {
    const { otherResults } = this.state;
    // group.players = selectedList;
    // const list = selectedList.map((obj) => {
    // 	return Object.assign({}, obj);
    // });
    const list = Object.assign({}, selectedList);

    otherResults.lowestGrosePlayer = list;
  };

  onRemoveDivisionPlayer1 = (selectedList, removedItem) => {
    const { division } = this.state;
    division.player1 = selectedList;
  };
  onRemoveDivisionPlayer2 = (selectedList, removedItem) => {
    const { division } = this.state;
    division.player2 = selectedList;
  };
  onRemoveDivisionPlayer3 = (selectedList, removedItem) => {
    const { division } = this.state;
    division.player3 = selectedList;
  };

  handleChange = (e) => {
    let user = this.state.selectedUser;
    console.log("THs is the value on change", e.target.value);
    if (e.target.value == "Paid") {
      user.paid = true;
    } else if (e.target.value === "Paid (Social)") {
      user.paid_social = true;
      user.waiting_social = false;
    } else if (e.target.value === "Waiting (Social)") {
      user.waiting_social = true;
      user.paid_social = false;
    } else if (e.target.value === "Un Paid") {
      user.paid = false;
    }
    this.setState({ selectedUser: user });
  };

  handleChangeWaiting = (e) => {
    let user = this.state.selectedUser;
    console.log("user waiting ==:", user);
    if (e.target.value == "Waiting") {
      user.waiting = true;
    } else {
      user.waiting = false;
    }
    this.setState({ selectedUser: user });
  };

  selectUser = (i) => {
    const {
      users,
      paidParticipants,
      unPaidParticipants,
      withdrawnParticipants,
      updatedParticipants,
      appEvent,
      participants,
    } = this.state;
    users[i].selected = !users[i].selected;
    console.log("THis is select user ", users[i].selected);
    let temp = this.state.participants;

    let waitingStatus = false;
    if (
      appEvent.limit <=
      paidParticipants.length +
        unPaidParticipants.length +
        withdrawnParticipants.length
    ) {
      waitingStatus = true;
    }
    if (users[i].selected) {
      let newParticipant = {};
      newParticipant.userId = users[i].uuid;
      newParticipant.paid = users[i].paid ? users[i].paid : false;
      newParticipant.withdrawn = false;
      newParticipant.registerNumber = participants.length + 1;
      // console.log("slect user participants:", participants.length);

      users[i].waiting = waitingStatus;
      let exists = false;
      temp.forEach((element) => {
        if (element.userId == newParticipant.userId) {
          if (element.withdrawn) {
            element.withdrawn = false;
            exists = true;
          } else {
            exists = true;
          }
        }
      });
      if (!exists) {
        temp.push(newParticipant);
      }
    } else {
      const selectedOption = users[i];
      const index = temp.indexOf(selectedOption);
      temp.splice(index, 1);
    }
    this.setState({ users, updatedParticipants: temp });
  };

  toggleParticipantPaidStatus = (i) => {};

  postNotification = async (event, tok) => {
    var TokenArray = [];

    // paidParticipants,
    // unPaidParticipants,
    // withdrawnParticipants,
    // paidWaitingParticipants,
    // unPaidWaitingParticipants
    if (this.state.notification.paid_particiapants) {
      this.state.paidParticipants.map((item) => {
        TokenArray.push(item.fcmToken);
      });
    }
    if (this.state.notification.unpaid_particiapants) {
      this.state.unPaidParticipants.map((item) => {
        TokenArray.push(item.fcmToken);
      });
    }
    if (this.state.notification.waiting_paid_particiapants) {
      this.state.paidWaitingParticipants.map((item) => {
        TokenArray.push(item.fcmToken);
      });
    }
    if (this.state.notification.waiting_unpaid_particiapants) {
      this.state.unPaidWaitingParticipants.map((item) => {
        TokenArray.push(item.fcmToken);
      });
    }
    if (TokenArray.length <= 0) {
      alert("Please Click at least on checkbox");
      return;
    }

    event.preventDefault();
    const { match, history } = this.props;
    const { loading, notification, image } = this.state;
    if (!loading) {
      this.setState({ loading: true });
      notification.TokenArray = JSON.stringify(TokenArray);
      console.log("THis is the notification being created ", notification);
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

  saveParticiapnts = (event) => {
    let {
      updatedParticipants,
      users,
      paidParticipants,
      unPaidParticipants,
      withdrawnParticipants,
      appEvent,
    } = this.state;
    event.preventDefault();
    const { match, history } = this.props;
    console.log("THese are the updated participants", updatedParticipants);
    if (appEvent.entry) {
      updatedParticipants.forEach((element) => {
        users.forEach((user) => {
          console.log("THis ist he element", element);
          if (user.uuid == element.userId) {
            element.paid = user.paid ? user.paid : false;
            element.waiting = user.waiting ? user.waiting : false;
            element.paid_social = user.paid_social ? user.paid_social : false;
            element.waiting_social = user.waiting_social
              ? user.waiting_social
              : false;
            console.log("This is  user. wating", user);
            // element.registerNumber = updatedParticipants.length + 1;
          }
        });
      });
      console.log("This is updated participants", updatedParticipants);
      if (match.params.eventId) {
        updatedParticipants = updatedParticipants.map((item) => {
          delete item.image;
          return item;
        });
        updateEventParticipants(match.params.eventId, updatedParticipants)
          .then((response) => {
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Event updated successfully",
              snackBarVariant: "success",
            });
            this.toggleModal();
            this.fetchEventbyId();
          })
          .catch((err) => {
            console.log("err:", err);
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Error updating event",
              snackBarVariant: "error",
            });
            this.toggleModal();
          });
      }
    } else {
      this.toggleModal();
      alert("Event entry is close!");
    }
  };

  deleteParticiapnts = (userId, index) => {
    let { participants } = this.state;
    const { match, history } = this.props;
    let elementToDelete = {};
    participants.forEach((element) => {
      if (element.userId == userId) {
        element.withdrawn = true;
      }
    });

    if (match.params.eventId) {
      participants = participants.map((item) => {
        delete item.image;
        return item;
      });
      updateEventParticipants(match.params.eventId, participants)
        .then((response) => {
          this.setState({
            loading: false,
            showSnackBar: true,
            snackBarMessage: "Participant removed successfully",
            snackBarVariant: "success",
          });
          this.fetchEventbyId();
        })
        .catch((err) => {
          console.log("err:", err);
          this.setState({
            loading: false,
            showSnackBar: true,
            snackBarMessage: "Error deleting participant",
            snackBarVariant: "error",
          });
        });
    }
  };

  updateStatus = (event) => {
    let { participants, selectedUser } = this.state;
    participants.forEach((element) => {
      if (element.userId === selectedUser.uuid) {
        element.paid = selectedUser.paid;
        element.waiting = selectedUser.waiting;
        element.paid_social = selectedUser.paid_social;
        element.waiting_social = selectedUser.waiting_social;
      }
    });

    event.preventDefault();
    const { match, history } = this.props;
    if (match.params.eventId) {
      participants = participants.map((item) => {
        delete item.image;
        return item;
      });
      updateEventParticipants(match.params.eventId, participants)
        .then((response) => {
          this.setState({
            loading: false,
            showSnackBar: true,
            snackBarMessage: "Event updated successfully",
            snackBarVariant: "success",
          });
          this.toggleStatusModal();
          this.fetchEventbyId();
        })
        .catch((err) => {
          console.log("err:", err);
          this.setState({
            loading: false,
            showSnackBar: true,
            snackBarMessage: "Error updating event",
            snackBarVariant: "error",
          });
          this.toggleStatusModal();
        });
    }
  };

  addDivision = async (event) => {
    const { divisions, division, selectedDivisionIndex } = this.state;
    event.preventDefault();
    const { match, history } = this.props;

    let updatedDivisions = divisions;

    if (selectedDivisionIndex != null) {
      updatedDivisions[selectedDivisionIndex] = division;
    } else {
      updatedDivisions.push(division);
    }

    if (match.params.eventId) {
      // let cloneObject = Object.assign({}, division);
      updateEventDivisions(match.params.eventId, updatedDivisions)
        .then((response) => {
          this.setState({
            loading: false,
            showSnackBar: true,
            snackBarMessage: "Divisions updated successfully",
            snackBarVariant: "success",
            division: {
              divisionName: "",
              first: "",
              second: "",
              third: "",
            },
            selectedDivisionIndex: null,
          });
          this.toggleDivisionModal();
          this.fetchEventbyId();
        })
        .catch((err) => {
          console.log("err:", err);
          this.setState({
            loading: false,
            showSnackBar: true,
            snackBarMessage: "Error updating event",
            snackBarVariant: "error",
          });
          this.toggleDivisionModal();
        });
    }
  };

  addOtherResult = async (event) => {
    const { divisions, otherResults, selectedDivisionIndex } = this.state;
    event.preventDefault();
    const { match, history } = this.props;
    console.log("Other Results:", otherResults);
    let cloneObject = Object.assign({}, otherResults);

    if (match.params.eventId) {
      // let cloneObject = Object.assign({}, division);
      updateOtherResults(match.params.eventId, cloneObject)
        .then((response) => {
          this.setState({
            loading: false,
            showSnackBar: true,
            snackBarMessage: "Other results updated successfully",
            snackBarVariant: "success",
            otherResults: {
              ntp: "",
              longestDrive: "",
              lowestGrose: "",
              ntpPlayer: [],
              longestDrivePlayer: [],
              lowestGrosePlayer: [],
            },
            selectedDivisionIndex: null,
          });
          this.toggleOtherResultModal();
          this.fetchEventbyId();
        })
        .catch((err) => {
          console.log("err:", err);
          this.setState({
            loading: false,
            showSnackBar: true,
            snackBarMessage: "Error updating other results",
            snackBarVariant: "error",
          });
          this.toggleOtherResultModal();
        });
    }
  };

  deleteDivision = async (division) => {
    const { divisions } = this.state;
    // event.preventDefault();
    const { match, history } = this.props;

    // const updatedDivisions = divisions;
    // updatedDivisions.push(division);

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
        if (match.params.eventId) {
          // let cloneObject = Object.assign({}, division);
          deleteEventDivisions(match.params.eventId, division)
            .then((response) => {
              this.setState({
                loading: false,
                showSnackBar: true,
                snackBarMessage: "Divisions deleted successfully",
                snackBarVariant: "success",
              });
              this.fetchEventbyId();
            })
            .catch((err) => {
              console.log("err:", err);
              this.setState({
                loading: false,
                showSnackBar: true,
                snackBarMessage: "Error updating event",
                snackBarVariant: "error",
              });
            });
        }
      }
    });
  };

  addGroup = async (event) => {
    const { groups, group, selectedGroupIndex } = this.state;
    event.preventDefault();
    const { match, history } = this.props;

    let updatedGroups = groups;

    if (selectedGroupIndex != null) {
      updatedGroups[selectedGroupIndex] = group;
    } else {
      updatedGroups.push(group);
    }
    console.log("These are updated groups", updatedGroups);

    // updatedGroups.push(group);

    if (match.params.eventId) {
      // let cloneObject = Object.assign({}, division);
      updateEventGroups(match.params.eventId, updatedGroups)
        .then((response) => {
          this.setState({
            loading: false,
            showSnackBar: true,
            snackBarMessage: "Groups updated successfully",
            snackBarVariant: "success",
            group: {
              groupName: "",
              players: [],
              startTime: null,
            },
            GroupStartTime: "",
          });
          this.togglePairingsModal();
          this.fetchEventbyId();
        })
        .catch((err) => {
          console.log("err:", err);
          this.setState({
            loading: false,
            showSnackBar: true,
            snackBarMessage: "Error updating groups",
            snackBarVariant: "error",
          });
          this.togglePairingsModal();
        });
    }
  };

  deleteGroup = async (group) => {
    const { divisions } = this.state;
    // event.preventDefault();
    const { match, history } = this.props;

    // const updatedDivisions = divisions;
    // updatedDivisions.push(division);

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
        if (match.params.eventId) {
          // let cloneObject = Object.assign({}, division);
          deleteEventGroup(match.params.eventId, group)
            .then((response) => {
              this.setState({
                loading: false,
                showSnackBar: true,
                snackBarMessage: "Group deleted successfully",
                snackBarVariant: "success",
              });
              this.fetchEventbyId();
            })
            .catch((err) => {
              console.log("err:", err);
              this.setState({
                loading: false,
                showSnackBar: true,
                snackBarMessage: "Error updating event",
                snackBarVariant: "error",
              });
            });
        }
      }
    });
  };

  render() {
    console.log("THis is notification", this.state.notification);
    const {
      appEvent,
      divisions,
      otherResults,
      GroupStartTime,
      division,
      groups,
      group,
      description,
      pairings,
      startTime,
      endTime,
      participants,
      focusedInput,
      selectedDate,
      showSnackBar,
      snackBarMessage,
      snackBarVariant,
      image,
      file,
      activeTab,
      paidParticipants,
      unPaidParticipants,
      withdrawnParticipants,
      paidWaitingParticipants,
      unPaidWaitingParticipants,
      paidSocialParticipants,
      unPaidSocialParticipants,
      selected: [],
        selectedIndex: [],
        events: [],
      
    } = this.state;
    const participantstList =
      activeTab == "1"
        ? paidParticipants
        : activeTab == "2"
        ? unPaidParticipants
        : activeTab == "3"
        ? withdrawnParticipants
        : activeTab == "4"
        ? paidWaitingParticipants
        : activeTab == "5"
        ? unPaidWaitingParticipants
        : activeTab == "6"
        ? paidSocialParticipants
        : unPaidSocialParticipants;

    const { match, history } = this.props;
    const isEdit = !!match.params.eventId;
    const TokenArray = [];

    var header = ["Sr. #", "Name", "Paid", "FoodItem", "Handicap Index"];
    var downloadData = [];
    participantstList.map((item, index) => {
      console.log("This is the great token", item.email);
      TokenArray.push(item.fcmToken);
      downloadData.push([
        index + 1,
        item.name,
        item.paid,
        item.selectedFood,
        item.handicap,
      ]);
    });
    //  const [count,setCount] = useState(0)
    console.log("allcheckbox",this.state.participants,this.state.selectedIndex,this.state.selected)
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
                  <h2>Event Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postEvent}
                  >
                    {appEvent.image && appEvent.image.length ? (
                      <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3">
                          Image
                        </label>
                        <div className="col-md-6 col-sm-6">
                          <img
                            style={{ marginRight: "5px" }}
                            width="100%"
                            className="img-fluid"
                            src={`${appEvent.image}`}
                            alt="profileImage"
                          />
                        </div>
                      </div>
                    ) : null}

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Name of Event
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          disabled
                          required
                          type="text"
                          name="name"
                          className="form-control"
                          value={appEvent.name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Members Entry Fee £
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          disabled
                          required
                          type="number"
                          name="fee"
                          className="form-control"
                          value={appEvent.fee}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Guests Entry Fee £
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          disabled
                          required
                          type="number"
                          name="fee"
                          className="form-control"
                          value={appEvent.guestfee}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Participants Limit
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          // disabled
                          required
                          type="number"
                          name="limit"
                          className="form-control"
                          value={appEvent.limit}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Total registered(paid + not paid) members
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          disabled
                          required
                          type="number"
                          name="limit"
                          className="form-control"
                          value={
                            paidParticipants.length + unPaidParticipants.length
                          }
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Date
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          disabled
                          value={moment(new Date(this.state.startDate)).format(
                            "ll"
                          )} // momentPropTypes.momentObj or null
                          required
                          type="text"
                          name="fee"
                          className="form-control"
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Start Time
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          disabled
                          value={moment(new Date(startTime)).format("LT")} // momentPropTypes.momentObj or null
                          required
                          type="text"
                          name="fee"
                          className="form-control"
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
                          disabled
                          value={moment(new Date(endTime)).format("LT")} // momentPropTypes.momentObj or null
                          required
                          type="text"
                          name="fee"
                          className="form-control"
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
                          disabled
                          required
                          type="text"
                          name="location"
                          className="form-control"
                          value={appEvent.location}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Website
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          disabled
                          required
                          type="text"
                          name="location"
                          className="form-control"
                          value={appEvent.website}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        About
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <RichTextEditor
                          disabled
                          className="text-editor"
                          value={description}
                          toolbarConfig={toolbarConfig}
                          // onChange={(e) => {
                          // 	this.setDescription(e);
                          // }}
                        />
                      </div>
                    </div>

                    <hr />

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3"></label>

                      <div className="col-md-6 col-sm-6">
                        <div className="row space-1">
                          <div className="col-sm-6">
                            <h3>Pairings</h3>
                          </div>
                          <div className="col-sm-2"></div>
                          <div className="col-sm-4 pull-right mobile-space">
                            <button
                              type="button"
                              className="btn btn-success"
                              onClick={this.togglePairingsModal}
                            >
                              Add Group
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {groups &&
                      groups.length > 0 &&
                      groups.map((item, index) => (
                        <div className="form-group row">
                          <div className="col-md-3 col-sm-3"></div>
                          <div className="col-md-6 col-sm-6">
                            <div className="body-row">
                              <h4>{item.groupName}</h4>
                              <div className="app-body-row">
                                <div style={{ marginRight: 16 }}>
                                  <Tooltip title="Edit" aria-label="edit">
                                    <span
                                      className="fa fa-edit"
                                      aria-hidden="true"
                                      onClick={() =>
                                        this.togglePairingsModal(index, item)
                                      }
                                    ></span>
                                  </Tooltip>
                                </div>
                                <div>
                                  <Tooltip title="Delete" aria-label="delete">
                                    <span
                                      className="fa fa-trash"
                                      style={{ cursor: "pointer" }}
                                      aria-hidden="true"
                                      onClick={() => this.deleteGroup(item)}
                                    ></span>
                                  </Tooltip>
                                </div>
                              </div>
                            </div>

                            <div className="app-body-row">
                              {item.players &&
                                item.players.map((player, index) => (
                                  <div
                                    className="app-body-column"
                                    style={{
                                      marginRight: "20px",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    <div>
                                      <h6>{player.name}</h6>
                                    </div>
                                    {/* <img width="60" height="60" borderRadius="60"  src={`${player.profileImage}`} alt="profileImage" /> */}
                                    <Avatar
                                      className="avatar-center"
                                      alt="Remy Sharp"
                                      src={`${player.profileImage}`}
                                    />
                                  </div>
                                ))}
                            </div>
                            <p>
                              <strong>Start Time : </strong>
                              {moment(new Date(item.startTime * 1000)).format(
                                "LT"
                              )}
                              {/* new Date(response.time.startTime * 1000) */}
                            </p>
                          </div>
                        </div>
                      ))}

                    <hr />

                    <div className="form-group row">
                      {/* <label className="control-label col-md-3 col-sm-3"></label> */}

                      <div className="col-md-9 col-sm-9">
                        <div className="row space-1">
                          <div className="col-sm-6">
                            <h3>List of Participants</h3>
                          </div>
                          {/* <div className="col-sm-2"></div> */}
                          {this.state.selected.length <= 1 && <div className="col-sm-2 pull-right mobile-space">
                            <button
                              type="button"
                              className="btn btn-success"
                              onClick={this.toggleModal}
                            >
                              Add New Participants
                            </button>
                          </div>}
                          <div className="col-sm-4 pull-right mobile-space">
                            {/* <ReactHTMLTableToExcel
                              id="test-table-xls-button"
                              className="btn btn-success"
                              table="table-to-xls-paid"
                              filename="Users"
                              sheet="tablexls"
                              buttonText="Download as XLS"
                              /> */}
                                           
                  {this.state.selected.length > 1 && (
                  <div className="row space-1">
                    <div className="col-sm-6"></div>
                    {/* <div className="col-sm-4"></div> */}
                    <div className="col-sm-2 pull-right mobile-space">
                      <button
                      
                        type="button"
                        className="btn btn-danger"
                        onClick={() => 
                         this.state.selected.map((userid)=>{
                         
                          
                         this.deleteParticiapnts(userid,this.state.selectedIndex.map((index)=>index))
                        
                          
                        })
                         
                        }
                      >
                        Delete Multiple Participants
                      </button>
                    </div>

                    <div className="col-sm-2 pull-left mobile-space">
                      <button
                  
                        type="button"
                        className="btn btn-danger"
                        onClick={() => this.state.selectedUser.map((user)=>{
                         
                          
                          this.onpenStatusModal(user)
                         
                           
                         })
                        
                        }
                      >
                        Update Multiple Participants
                      </button>
                    </div>
                 
                  </div>
                )}


{this.state.selected.length <= 1 &&<CSVLink
                              className="btn btn-success"
                              filename={"Participants.csv"}
                              data={downloadData}
                              headers={header}
                            >
                              Download CSV
                            </CSVLink>}
                          </div>
                        </div>

                        <Nav tabs>
                          <NavItem>
                            <NavLink
                              className={classnames({
                                active: this.state.activeTab === "1",
                              })}
                              onClick={() => {
                                this.toggle("1");
                              }}
                            >
                              Paid
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({
                                active: this.state.activeTab === "2",
                              })}
                              onClick={() => {
                                this.toggle("2");
                              }}
                            >
                              Un Paid
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({
                                active: this.state.activeTab === "3",
                              })}
                              onClick={() => {
                                this.toggle("3");
                              }}
                            >
                              Withdrawn
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({
                                active: this.state.activeTab === "4",
                              })}
                              onClick={() => {
                                this.toggle("4");
                              }}
                            >
                              Waiting(Paid)
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({
                                active: this.state.activeTab === "5",
                              })}
                              onClick={() => {
                                this.toggle("5");
                              }}
                            >
                              Waiting(Un Paid)
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({
                                active: this.state.activeTab === "6",
                              })}
                              onClick={() => {
                                this.toggle("6");
                              }}
                            >
                              Social (Paid)
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({
                                active: this.state.activeTab === "7",
                              })}
                              onClick={() => {
                                this.toggle("7");
                              }}
                            >
                              Social (Un Paid)
                            </NavLink>
                          </NavItem>
                        </Nav>

                        <div className="table-responsive">
                          <table
                            className="table table-striped"
                            id="table-to-xls-paid"
                          >
                            <thead>
                              <tr>
                             <th> <input
                            type="checkbox" 
                           
                            checked={
                              this.state.selectedIndex.length ===
                              this.state.participants.length
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              console.log("This is temp");
                              if (
                                this.state.selectedIndex.length ===
                                this.state.participants.length
                              ) {
                                this.setState({
                                  selectedIndex: [],
                                  selected: [],
                                });
                              } else {
                                var temp = [];
                                var tempIndex = [];
                                var tempuser = [];
                                this.state.participants.map((event, index) => {
                                  temp.push(event.userId);
                                  tempIndex.push(index);
                                  tempuser.push(event)
                              
                                });
                                this.setState({
                                  selectedIndex: tempIndex,
                                  selectedUser:tempuser,
                                  selected: temp,
                                });
                              }
                            }}
                        
                            /></th>
                                <th>Sr. #</th>
                                <th>Name</th>
                                <th>Image</th>
                                <th>Paid</th>
                                <th>Special Request</th>
                                <th>Handicap Index</th>
                                <th>Edit</th>
                                <th>Delete</th>
                              </tr>
                            </thead>

                            <tbody>
                              {participantstList && participantstList.length ? (
                                participantstList.map((user, index) => (

                                  <tr key={index}>
                                    <td><input
                            type="checkbox" 
                            checked={
                              this.state.selected.includes(user.userId)
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              console.log("This is temp");
                              if (
                                this.state.selected.includes(user.userId)
                              ) {
                                var temp = [];
                                var tempIndex = [];
                                this.state.selected.map((id, index) => {
                                  if (id != user.userId) {
                                    console.log(
                                      "This is true",
                                      user.userId,
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
                                var tempuser = []
                                temp.push(user.userId);
                                tempIndex.push(index);
                                tempuser.push(user)
                                this.setState({
                                  selected : temp,
                                  selectedIndex : tempIndex,
                                  selectedUser : tempuser
                                });
                              }
                            }}
                            
                            /></td>
                                    <td>{index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>
                                      {
                                        <img
                                          style={{
                                            height: "50px",
                                            width: "50px",
                                          }}
                                          src={user.profileImage}
                                        />
                                      }
                                    </td>
                                    <td>{user.paid ? "Yes" : "No"}</td>
                                    <td>{user.selectedFood}</td>
                                    <td>{user.handicap}</td>
                                  
                                    <td>
                                      <Tooltip
                                        title="Update Status"
                                        aria-label="edit"
                                      >
                                        <span
                                          className="fa fa-edit"
                                          aria-hidden="true"
                                          onClick={() =>
                                            this.onpenStatusModal(user)
                                          }
                                        ></span>
                                      </Tooltip>
                                    </td>

                                    <td>
                                      <Tooltip
                                        title="Delete"
                                        aria-label="delete"
                                      >
                                        <span
                                          className="fa fa-trash"
                                          style={{ cursor: "pointer" }}
                                          aria-hidden="true"
                                          onClick={() =>
                                            this.deleteParticiapnts(
                                              user.userId,
                                              index
                                            )
                                          }
                                        ></span>
                                      </Tooltip>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="15" className="text-center">
                                    No participants
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
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
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      this.postNotification(e, TokenArray);
                                    }}
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
                                          value={this.state.notification.title}
                                          onChange={
                                            this.handleNotificationInputChange
                                          }
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
                                          checked={
                                            this.state.notification.message
                                          }
                                          onChange={
                                            this.handleNotificationInputChange
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="form-group row">
                                      <label className="control-label col-md-3 col-sm-3">
                                        Paid Participants
                                      </label>
                                      <div className="col-md-6 col-sm-6">
                                        <input
                                          // required
                                          type="checkbox"
                                          name="paid_particiapants"
                                          maxLength="80"
                                          className="form-control"
                                          value={
                                            this.state.notification
                                              .paid_particiapants
                                          }
                                          onChange={
                                            this
                                              .handleNotificationCheckboxChange
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="form-group row">
                                      <label className="control-label col-md-3 col-sm-3">
                                        Unpaid Participants
                                      </label>
                                      <div className="col-md-6 col-sm-6">
                                        <input
                                          // required
                                          type="checkbox"
                                          name="unpaid_particiapants"
                                          maxLength="80"
                                          className="form-control"
                                          value={
                                            this.state.notification
                                              .unpaid_particiapants
                                          }
                                          onChange={
                                            this
                                              .handleNotificationCheckboxChange
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="form-group row">
                                      <label className="control-label col-md-3 col-sm-3">
                                        Waiting (paid) Participants
                                      </label>
                                      <div className="col-md-6 col-sm-6">
                                        <input
                                          // required
                                          type="checkbox"
                                          name="waiting_paid_particiapants"
                                          maxLength="80"
                                          className="form-control"
                                          value={
                                            this.state.notification
                                              .waiting_paid_particiapants
                                          }
                                          onChange={
                                            this
                                              .handleNotificationCheckboxChange
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="form-group row">
                                      <label className="control-label col-md-3 col-sm-3">
                                        Waiting (unpaid) Participants
                                      </label>
                                      <div className="col-md-6 col-sm-6">
                                        <input
                                          // required
                                          type="checkbox"
                                          name="waiting_unpaid_particiapants"
                                          maxLength="80"
                                          className="form-control"
                                          value={
                                            this.state.notification
                                              .waiting_unpaid_particiapants
                                          }
                                          onChange={
                                            this
                                              .handleNotificationCheckboxChange
                                          }
                                        />
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
                    </div>

                    <hr />

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3"></label>

                      <div className="col-md-6 col-sm-6">
                        <div className="row space-1">
                          <div className="col-sm-6">
                            <h3>Event Result</h3>
                          </div>
                          <div className="col-sm-2"></div>
                          <div className="col-sm-4 pull-right mobile-space">
                            <button
                              type="button"
                              className="btn btn-success"
                              onClick={this.toggleDivisionModal}
                            >
                              Add Division
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {divisions &&
                      divisions.length > 0 &&
                      divisions.map((item, index) => (
                        <div className="form-group row">
                          <div className="col-md-3 col-sm-3"></div>
                          <div className="col-md-6 col-sm-6">
                            <div className="body-row">
                              <h5>{item.divisionName}</h5>
                              <div className="app-body-row">
                                <div style={{ marginRight: 16 }}>
                                  <Tooltip title="Edit" aria-label="edit">
                                    <span
                                      className="fa fa-edit"
                                      aria-hidden="true"
                                      onClick={() =>
                                        this.toggleDivisionModal(index, item)
                                      }
                                    ></span>
                                  </Tooltip>
                                </div>
                                <div>
                                  <Tooltip title="Delete" aria-label="delete">
                                    <span
                                      className="fa fa-trash"
                                      style={{ cursor: "pointer" }}
                                      aria-hidden="true"
                                      onClick={() => this.deleteDivision(item)}
                                    ></span>
                                  </Tooltip>
                                </div>
                              </div>
                            </div>
                            <p>
                              <strong>1st:</strong>{" "}
                              {item.player1 && item.player1.name}
                              {"  "}
                              {item.first && `(${item.first})`}
                            </p>
                            <p>
                              <strong>2nd:</strong>{" "}
                              {item.player2 && item.player2.name}
                              {"  "}
                              {item.second && `(${item.second})`}
                            </p>
                            <p>
                              <strong>3rd:</strong>{" "}
                              {item.player3 && item.player3.name}
                              {"  "}
                              {item.third && `(${item.third})`}
                            </p>
                          </div>
                        </div>
                      ))}

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3"></label>

                      <div className="col-md-6 col-sm-6">
                        <div className="row space-1">
                          <div className="col-sm-6">
                            <h3>Other Results</h3>
                          </div>
                          <div className="col-sm-2"></div>
                          <div className="col-sm-4 pull-right mobile-space">
                            <button
                              type="button"
                              className="btn btn-success"
                              onClick={this.toggleOtherResultModal}
                            >
                              Add Other Results
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {appEvent.otherResults &&
                      appEvent.otherResults.length != 0 && (
                        <>
                          <div className="form-group row">
                            <div className="col-md-3 col-sm-3"></div>
                            <div className="col-md-6 col-sm-6">
                              <div className="body-row">
                                {/* <h5>{item.divisionName}</h5> */}
                                <div>
                                  <p>
                                    <strong>NTP:</strong>{" "}
                                    {otherResults.ntpPlayer &&
                                      otherResults.ntpPlayer.name}
                                    {"  "}
                                    {otherResults.ntp &&
                                      `(${otherResults.ntp})`}
                                  </p>
                                  <p>
                                    <strong>longestDrive:</strong>{" "}
                                    {otherResults.longestDrivePlayer &&
                                      otherResults.longestDrivePlayer.name}
                                    {"  "}
                                    {otherResults.longestDrive &&
                                      `(${otherResults.longestDrive})`}
                                  </p>
                                  <p>
                                    <strong>Lowest Gross:</strong>{" "}
                                    {otherResults.lowestGrosePlayer &&
                                      otherResults.lowestGrosePlayer.name}
                                    {"  "}
                                    {otherResults.lowestGrose &&
                                      `(${otherResults.lowestGrose})`}
                                  </p>
                                </div>
                                <div className="app-body-row">
                                  <div style={{ marginRight: 16 }}>
                                    <Tooltip title="Edit" aria-label="edit">
                                      <span
                                        className="fa fa-edit"
                                        aria-hidden="true"
                                        onClick={() =>
                                          this.toggleOtherResultModal()
                                        }
                                      ></span>
                                    </Tooltip>
                                  </div>
                                  {/* <div>
                                <Tooltip title="Delete" aria-label="delete">
                                  <span
                                    className="fa fa-trash"
                                    style={{ cursor: "pointer" }}
                                    aria-hidden="true"
                                    // onClick={() => this.delet(item)}
                                  ></span>
                                </Tooltip>
                              </div> */}
                                </div>
                              </div>
                            </div>
                          </div>
                          {otherResults.otherText ? (
                            <div className="form-group row">
                              <label className="control-label col-md-3 col-sm-3">
                                More Results
                              </label>
                              <div className="col-md-6 col-sm-6">
                                <RichTextEditor
                                  disabled
                                  className="text-editor"
                                  value={this.state.otherDescriptionShow}
                                  toolbarConfig={toolbarConfig}
                                />
                              </div>
                            </div>
                          ) : null}
                        </>
                      )}

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        NTP
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <Autocomplete
                          // multiple
                          id="tags-standard"
                          options={this.state.paidParticipants}
                          getOptionLabel={(option) => option.name}
                          // filterSelectedOptions
                          value={this.state.ntpPlayer}
                          onChange={this.onSelectNTPPlayer}
                          // defaultValue={[top100Films[13]]}

                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              // label="Multiple values"
                              placeholder="Select Player"
                            />
                          )}
                        />
                        <div className="marginTop8px" />
                        <input
                          type="text"
                          name="ntp"
                          className="form-control"
                          value={this.state.otherResults.ntp}
                          onChange={this.handleOtherResultInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Longest Drive
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <Autocomplete
                          // multiple
                          id="tags-standard"
                          options={this.state.paidParticipants}
                          getOptionLabel={(option) => option.name}
                          filterSelectedOptions
                          value={this.state.longestDrivePlayer}
                          onChange={this.onSelectLongestDrive}
                          // defaultValue={[top100Films[13]]}

                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              // label="Multiple values"
                              placeholder="Select Player"
                            />
                          )}
                        />
                        <div className="marginTop8px" />
                        <input
                          type="text"
                          name="longestDrive"
                          className="form-control"
                          value={this.state.otherResults.longestDrive}
                          onChange={this.handleOtherResultInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Lowest Gross
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <Autocomplete
                          // multiple
                          id="tags-standard"
                          options={this.state.paidParticipants}
                          getOptionLabel={(option) => option.name}
                          filterSelectedOptions
                          value={appEvent.lowestGrosePlayer}
                          onChange={this.onSelectLowestGross}
                          // defaultValue={[top100Films[13]]}

                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              // label="Multiple values"
                              placeholder="Select Player"
                            />
                          )}
                        />
                        <div className="marginTop8px" />
                        <input
                          type="text"
                          name="lowestGrose"
                          className="form-control"
                          value={this.state.otherResults.lowestGrose}
                          onChange={this.handleOtherResultInputChange}
                        />
                      </div>
                    </div> */}

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
                          {isEdit ? " Update" : " Submit"}
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

        <Modal
          isOpen={this.state.modalIsOpen}
          toggle={this.toggleModal} /* className={className} */
        >
          <ModalHeader toggle={this.toggleModal}>
            Select New Participants
          </ModalHeader>
          <ModalBody>
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
            <div className="table-responsive">
              <div style={{ maxHeight: 300, overflow: "scroll" }}>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Sr. #</th>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th></th>
                      <th>Paid</th>
                      <th>Waiting</th>
                      <th>Paid (Social)</th>
                      <th>Waiting (Social)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.users && this.state.users.length >= 1 ? (
                      this.state.users.map((user, index) => (
                        <tr key={index}>
                          <td onClick={() => this.selectUser(index)}>
                            {index + 1}
                          </td>
                          <td onClick={() => this.selectUser(index)}>
                            {
                              <img
                                style={{ height: "50px", width: "50px" }}
                                src={user.profileImage}
                              />
                            }
                          </td>
                          <td onClick={() => this.selectUser(index)}>
                            {user.name}
                          </td>
                          <td onClick={() => this.selectUser(index)}>
                            {user.phone}
                          </td>

                          <td onClick={() => this.selectUser(index)}>
                            {user.selected ? (
                              <Tooltip title="Selected" aria-label="Make  paid">
                                <span
                                  className="fa fa-check"
                                  style={{ cursor: "pointer" }}
                                  aria-hidden="true"
                                ></span>
                              </Tooltip>
                            ) : null}
                          </td>
                          <td
                            onClick={() => {
                              let allUsers = this.state.users;
                              allUsers[index].paid = !user.paid;
                              this.setState({ users: allUsers });
                              this.selectUser(index);
                            }}
                          >
                            {user.paid ? (
                              <Tooltip title="Selected" aria-label="selected">
                                <span
                                  className="fa fa-check-square-o"
                                  style={{ cursor: "pointer" }}
                                  aria-hidden="true"
                                ></span>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Selected" aria-label="selected">
                                <span
                                  className="fa fa-square-o"
                                  style={{ cursor: "pointer" }}
                                  aria-hidden="true"
                                ></span>
                              </Tooltip>
                            )}
                          </td>
                          <td
                            onClick={() => {
                              let allUsers = this.state.users;
                              allUsers[index].waiting = !user.waiting;
                              this.setState({ users: allUsers });
                            }}
                          >
                            {user.waiting ? (
                              <Tooltip title="Selected" aria-label="selected">
                                <span
                                  className="fa fa-check-square-o"
                                  style={{ cursor: "pointer" }}
                                  aria-hidden="true"
                                ></span>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Selected" aria-label="selected">
                                <span
                                  className="fa fa-square-o"
                                  style={{ cursor: "pointer" }}
                                  aria-hidden="true"
                                ></span>
                              </Tooltip>
                            )}
                          </td>

                          <td
                            onClick={() => {
                              let allUsers = this.state.users;
                              allUsers[index].paid_social = !user.paid_social;
                              allUsers[index].waiting_social = false;
                              this.setState({ users: allUsers });
                              this.selectUser(index);
                            }}
                          >
                            {user.paid_social ? (
                              <Tooltip title="Selected" aria-label="selected">
                                <span
                                  className="fa fa-check-square-o"
                                  style={{ cursor: "pointer" }}
                                  aria-hidden="true"
                                ></span>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Selected" aria-label="selected">
                                <span
                                  className="fa fa-square-o"
                                  style={{ cursor: "pointer" }}
                                  aria-hidden="true"
                                ></span>
                              </Tooltip>
                            )}
                          </td>
                          <td
                            onClick={() => {
                              let allUsers = this.state.users;
                              allUsers[index].waiting_social =
                                !user.waiting_social;
                              allUsers[index].paid_social = false;
                              this.setState({ users: allUsers });
                              this.selectUser(index);
                            }}
                          >
                            {user.waiting_social ? (
                              <Tooltip title="Selected" aria-label="selected">
                                <span
                                  className="fa fa-check-square-o"
                                  style={{ cursor: "pointer" }}
                                  aria-hidden="true"
                                ></span>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Selected" aria-label="selected">
                                <span
                                  className="fa fa-square-o"
                                  style={{ cursor: "pointer" }}
                                  aria-hidden="true"
                                ></span>
                              </Tooltip>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="15" className="text-center">
                          {this.state.responseMessage}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.saveParticiapnts}>
              Save
            </Button>
            <Button color="secondary" onClick={this.toggleModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.statusModal}
          toggle={this.toggleStatusModal} /* className={className} */
        >
          <ModalHeader toggle={this.toggleStatusModal}>
            Update Participant Status
          </ModalHeader>
          <ModalBody>
            <div className="form-group row">
              <label className="control-label col-md-3 col-sm-3">Image</label>
              <div className="col-md-6 col-sm-6">
                <img
                  style={{ marginRight: "5px" }}
                  width="100"
                  className="img-fluid"
                  src={`${
                    this.state.selectedUser &&
                    this.state.selectedUser.profileImage
                  }`}
                  alt="profileImage"
                />
              </div>
            </div>

            <div className="form-group row">
              <label className="control-label col-md-3 col-sm-3">
                Name of Participant
              </label>
              <div className="col-md-6 col-sm-6">
                <input
                  disabled
                  required
                  type="text"
                  name="name"
                  className="form-control"
                  value={
                    this.state.selectedUser && this.state.selectedUser.name
                  }
                  onChange={this.handleInputChange}
                />
              </div>
            </div>

            <div className="form-group row">
              <label className="control-label col-md-3 col-sm-3">Paid</label>
              <div className="col-md-6 col-sm-6">
                {/* <input type="select" required type="number" name="fee" className="form-control" value={appEvent.fee} onChange={this.handleInputChange} /> */}
                {/* <ButtonToggle color="primary">primary</ButtonToggle> */}
                <select
                  value={
                    this.state.selectedUser && this.state.selectedUser.paid
                      ? "Paid"
                      : this.state.selectedUser.paid_social
                      ? "Paid  Social"
                      : this.state.selectedUser.waiting_social
                      ? "Upaid Social"
                      : "Un Paid"
                  }
                  onChange={this.handleChange}
                >
                  <option name="paid">Paid</option>
                  <option name="unpaid">Un Paid</option>
                  <option name="paid_social">Paid (Social)</option>
                  <option name="waiting_social">Waiting (Social)</option>
                </select>
              </div>
            </div>

            <div className="form-group row">
              <label className="control-label col-md-3 col-sm-3">Waiting</label>
              <div className="col-md-6 col-sm-6">
                {/* <input type="select" required type="number" name="fee" className="form-control" value={appEvent.fee} onChange={this.handleInputChange} /> */}
                {/* <ButtonToggle color="primary">primary</ButtonToggle> */}
                <select
                  value={
                    this.state.selectedUser && this.state.selectedUser.waiting
                      ? "Waiting"
                      : "Active"
                  }
                  onChange={this.handleChangeWaiting}
                >
                  <option name="waiting">Waiting</option>
                  <option name="active">Active</option>
                </select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.updateStatus}>
              Save
            </Button>
            <Button color="secondary" onClick={this.toggleStatusModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.divsionIsOpen} /* className={className} */>
          <ModalHeader toggle={this.toggleDivisionModal}>
            Add New Division
          </ModalHeader>
          <ModalBody>
            <div className="form-label-left">
              <div className="form-group row">
                <label className="control-label col-md-4 col-sm-4">
                  Division Name
                </label>
                <div className="col-md-12 col-sm-12">
                  <input
                    required
                    type="text"
                    name="divisionName"
                    className="form-control"
                    value={division && division.divisionName}
                    onChange={this.handleDivisionInputChange}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="control-label col-md-4 col-sm-4">1st</label>
                <div className="col-md-12 col-sm-12">
                  <Autocomplete
                    id="tags-standard"
                    options={this.state.paidParticipants}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    defaultValue={division.player1}
                    onChange={this.onSelectDivisionPlayer1}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        placeholder="Select Player"
                      />
                    )}
                  />
                  <input
                    required
                    type="text"
                    name="first"
                    className="form-control"
                    value={division && division.first}
                    onChange={this.handleDivisionInputChange}
                    style={{ marginTop: 8 }}
                    placeholder="Comment..."
                    maxLength="30"
                  />
                </div>
              </div>

              <div className="form-group row">
                <label className="control-label col-md-4 col-sm-4">2nd</label>
                <div className="col-md-12 col-sm-12">
                  <Autocomplete
                    id="tags-standard"
                    options={this.state.paidParticipants}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    defaultValue={division.player2}
                    onChange={this.onSelectDivisionPlayer2}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        placeholder="Select Player"
                      />
                    )}
                  />
                  <input
                    required
                    type="text"
                    name="second"
                    className="form-control"
                    value={division && division.second}
                    onChange={this.handleDivisionInputChange}
                    style={{ marginTop: 8 }}
                    placeholder="Comment..."
                    maxLength="30"
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="control-label col-md-4 col-sm-4">3rd</label>
                <div className="col-md-12 col-sm-12">
                  <Autocomplete
                    id="tags-standard"
                    options={this.state.paidParticipants}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    defaultValue={division.player3}
                    onChange={this.onSelectDivisionPlayer3}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        placeholder="Select Player"
                      />
                    )}
                  />
                  <input
                    required
                    type="text"
                    name="third"
                    className="form-control"
                    value={division && division.third}
                    onChange={this.handleDivisionInputChange}
                    style={{ marginTop: 8 }}
                    placeholder="Comment..."
                    maxLength="30"
                  />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addDivision}>
              Save
            </Button>
            <Button color="secondary" onClick={this.toggleDivisionModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.otherResultModal} /* className={className} */>
          <ModalHeader toggle={this.toggleOtherResultModal}>
            Add Other Results
          </ModalHeader>
          <ModalBody>
            <div className="form-label-left">
              <div className="form-group row">
                <label className="control-label col-md-4 col-sm-4">NTP</label>
                <div className="col-md-12 col-sm-12">
                  <Autocomplete
                    // multiple
                    id="tags-standard"
                    options={this.state.paidParticipants}
                    getOptionLabel={(option) => option.name}
                    // filterSelectedOptions
                    defaultValue={this.state.otherResults.ntpPlayer}
                    onChange={this.onSelectNTPPlayer}
                    // defaultValue={[top100Films[13]]}

                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        // label="Multiple values"
                        placeholder="Select Player"
                      />
                    )}
                  />
                  <div className="marginTop8px" />

                  <input
                    type="text"
                    name="ntp"
                    className="form-control"
                    value={this.state.otherResults.ntp}
                    onChange={this.handleOtherResultInputChange}
                  />
                </div>
              </div>

              <div className="form-group row">
                <label className="control-label col-md-4 col-sm-4">
                  Longest Drive
                </label>
                <div className="col-md-12 col-sm-12">
                  <Autocomplete
                    // multiple
                    id="tags-standard"
                    options={this.state.paidParticipants}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    defaultValue={this.state.otherResults.longestDrivePlayer}
                    onChange={this.onSelectLongestDrive}
                    // defaultValue={[top100Films[13]]}

                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        // label="Multiple values"
                        placeholder="Select Player"
                      />
                    )}
                  />
                  <div className="marginTop8px" />
                  <input
                    type="text"
                    name="longestDrive"
                    className="form-control"
                    value={this.state.otherResults.longestDrive}
                    onChange={this.handleOtherResultInputChange}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="control-label col-md-4 col-sm-4">
                  Lowest Gross
                </label>
                <div className="col-md-12 col-sm-12">
                  <Autocomplete
                    // multiple
                    id="tags-standard"
                    options={this.state.paidParticipants}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    defaultValue={this.state.otherResults.lowestGrosePlayer}
                    onChange={this.onSelectLowestGross}
                    // defaultValue={[top100Films[13]]}

                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        // label="Multiple values"
                        placeholder="Select Player"
                      />
                    )}
                  />
                  <div className="marginTop8px" />
                  <input
                    type="text"
                    name="lowestGrose"
                    className="form-control"
                    value={otherResults.lowestGrose}
                    onChange={this.handleOtherResultInputChange}
                  />
                </div>
              </div>

              <div className="form-group row">
                <label className="control-label col-md-4 col-sm-4">More</label>
                <div className="col-md-12 col-sm-12">
                  <RichTextEditor
                    className="text-editor"
                    value={this.state.otherDescription}
                    toolbarConfig={toolbarConfig}
                    onChange={(e) => {
                      this.setDescription(e);
                    }}
                  />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addOtherResult}>
              Save
            </Button>
            <Button color="secondary" onClick={this.toggleOtherResultModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.pairingModal}>
          <ModalHeader toggle={this.togglePairingsModal}>
            Add New Group
          </ModalHeader>
          <ModalBody>
            <div className="form-horizontal form-label-left">
              <div className="form-group row">
                <label className="control-label col-md-4 col-sm-4">
                  Group Name
                </label>
                <div className="col-md-12 col-sm-12">
                  <input
                    required
                    type="text"
                    name="groupName"
                    className="form-control"
                    value={group && group.groupName}
                    onChange={this.handleGroupInputChange}
                  />
                </div>
              </div>

              <div className="form-group row">
                <label className="control-label col-md-4 col-sm-4">
                  Select Players
                </label>
                <div className="col-md-12 col-sm-12">
                  {/* <Multiselect
										selectionLimit={4}
										options={this.state.filteredUsers} // Options to display in the dropdown
										selectedValues={group.players} // Preselected value to persist in dropdown
										onSelect={this.onSelect} // Function will trigger on select event
										onRemove={this.onRemove} // Function will trigger on remove event
										displayValue="name" // Property name to display in the dropdown options
									/> */}
                  <Autocomplete
                    multiple
                    id="tags-standard"
                    options={this.state.paidParticipants}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    defaultValue={group.players}
                    onChange={this.onSelect}
                    // defaultValue={[top100Films[13]]}

                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        // label="Multiple values"
                        placeholder="Players"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="form-group row">
                <label className="control-label col-md-4 col-sm-4">
                  Start Time
                </label>
                <div className="col-md-12 col-sm-12" style={{ marginTop: -16 }}>
                  <TimePicker
                    label={"Start Time"}
                    value={
                      GroupStartTime
                        ? new Date(GroupStartTime * 1000)
                        : new Date(group.startTime * 1000)
                    }
                    onTimePickerClose={this.handleTimePicker}
                  />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addGroup}>
              Save
            </Button>
            <Button
              color="secondary"
              onClick={() => {
                this.setState({ GroupStartTime: "" });
                this.togglePairingsModal();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
