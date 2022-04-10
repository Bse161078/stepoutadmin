import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import RichTextEditor from "react-rte";
import { Button } from "reactstrap";
import {
  addBlogs
} from "../backend/services/BlogsService";
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
export default class BlogsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      blog: {
        uuid: "",
        title: "",
        description: "",
        img: "",
        Images: "",
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
      Cimage: "",
      Dimage:'',
      file: "",
      userId: "",
      description: RichTextEditor.createEmptyValue(),
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
   // this.postUser = this.postUser.bind(this);
  }

  // fetchEvent = () => {
  //   this.setState({ loading: true });
  //   getEvents()
  //     .then((response) => {
  //       this.setState({
  //         events: response,
  //         loading: false,
  //         responseMessage: "No Events Found",
  //       });

  //       const upcoming = response.filter((element) => {
  //         let date = moment(new Date(element.date.seconds * 1000));
  //         let curentDate = new Date();
  //         console.log(
  //           `${element.name} minutes up:`,
  //           date.diff(curentDate, "minutes")
  //         );
  //         return date.diff(curentDate, "minutes") > 0 && element.status == true;
  //       });
  //       const past = response.filter((element) => {
  //         let date = moment(new Date(element.date.seconds * 1000));
  //         let curentDate = new Date();
  //         // console.log(
  //         //   `${element.name} minutes past:`,
  //         //   date.diff(curentDate, "minutes")
  //         // );

  //         return date.diff(curentDate, "minutes") < 0 || !element.status;
  //       });

  //       upcoming.sort((a, b) => {
  //         var nameA = moment(new Date(a.date.seconds * 1000));
  //         // var nameA = a.item_name.charAt(0).toUpperCase();
  //         var nameB = moment(new Date(b.date.seconds * 1000));
  //         if (nameA.diff(nameB, "minutes") < 0) {
  //           return -1;
  //         }
  //         if (nameA.diff(nameB, "minutes") > 0) {
  //           return 1;
  //         }
  //         // names must be equal
  //         return 0;
  //       });

  //       past.sort((a, b) => {
  //         var nameA = moment(new Date(a.date.seconds * 1000));
  //         // var nameA = a.item_name.charAt(0).toUpperCase();
  //         var nameB = moment(new Date(b.date.seconds * 1000));

  //         if (nameA.diff(nameB, "minutes") > 0) {
  //           return -1;
  //         }
  //         if (nameA.diff(nameB, "minutes") < 0) {
  //           return 1;
  //         }
  //         // names must be equal
  //         return 0;
  //       });

  //       this.setState({ upcomingEvents: upcoming, pastEvents: past });
  //          getUserById(this.props.match.params.userId)
  //       .then((response) => {
  //         console.log("user:", response);
  //         this.setState({
  //           user: response,
  //         });
  //       })
  //       .catch((err) => {
  //         window.alert("ERROR!");
  //       });
  //     })
  //     .catch(() => {
  //       this.setState({
  //         loading: false,
  //         responseMessage: "No Events Found...",
  //       });
  //     });
  // };

  componentDidMount() {
    const { match } = this.props;
    console.log("this.props", this.props);
    if (match.params.userId)
   
        this.fetchEvent()
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { blog } = this.state;
    blog[name] = value;
    this.setState({ blog });
  }

  // postUser = async (event) => {
  //   event.preventDefault();
  //   const { match, history } = this.props;
  //   const { loading, user, image } = this.state;
  //   user.name = user.fname + " " + user.lname;
  //   if (!loading) {
  //     this.setState({ loading: true });

  //     let imageFile = image;

  //     let downloadUrl;
  //     let imageUri;

  //     if (imageFile) {
  //       imageUri = await imageResizeFileUri({ file: imageFile });

  //       const storageRef = firebase
  //         .storage()
  //         .ref()
  //         .child("Users")
  //         .child(`${uuidv4()}.jpeg`);

  //       if (imageUri) {
  //         await storageRef.putString(imageUri, "data_url");
  //         downloadUrl = await storageRef.getDownloadURL();
  //       }
  //       user.profileImage = downloadUrl;
  //     }

  //     if (match.params.userId) {
  //       let cloneObject = Object.assign({}, user);
  //       if(cloneObject.credit)
  //       {
         
  //       }
  //       else
  //       { cloneObject.credit = 0;

  //       }
  //       updateUser(match.params.userId, cloneObject)
  //         .then((response) => {
  //           this.setState({
  //             loading: false,
  //             showSnackBar: true,
  //             snackBarMessage: "User updated successfully",
  //             snackBarVariant: "success",
  //           });
  //         })
  //         .catch((err) => {
  //           console.log("Error:", err);
  //           this.setState({
  //             loading: false,
  //             showSnackBar: true,
  //             snackBarMessage: "Error updating user",
  //             snackBarVariant: "error",
  //           });
  //         });
  //     } else {
  //       addUser(user)
  //         .then((response) => {
  //           console.log("response:", response);
  //           this.setState({
  //             loading: false,
  //             showSnackBar: true,
  //             snackBarMessage: "User saved successfully",
  //             snackBarVariant: "success",
  //           });
  //         })
  //         .catch((err) => {
  //           this.setState({
  //             loading: false,
  //             showSnackBar: true,
  //             snackBarMessage: "Error creating user",
  //             snackBarVariant: "error",
  //           });
  //         });
  //     }
  //   }
  // };

  uploadImage (evt) {
    return new  Promise((resolve,reject)=>{
      console.log(evt);
      var storage = firebase.storage().ref(`/Blogs/`+evt.name);
      const storageRef=storage.put(evt);
      storageRef.on("state_changed" , async()=>{
        let downloadUrl = await storage.getDownloadURL();
       // this.setState({venue:venue})
        console.log('hamzaimage',downloadUrl);
        resolve(downloadUrl)        
    })
  
    })
}

  handleAddBlogs=async(addvenue)=>{
  
    let Images=[]
     const imageUrl=await this.uploadImage(this.state.Dimage);
     addvenue.img=imageUrl;
     for (let i =0;i<this.state.Cimage.length;i++)
     {
       const imges=await this.uploadImage(this.state.Cimage[i])
       Images.push(imges)
     }
    
     addvenue.Images=Images;
     this.setState({loading:true})
     console.log("venue",addvenue)
     try{
       const { history } = this.props;
      const res = await addBlogs(addvenue)
    //this.state.navigate('/users')
      this.setState({
       loading: false,
       showSnackBar: true,
       snackBarMessage: "Blogs Updated!",
       snackBarVariant: "success",
     });
    }
    catch(e)
    {
     this.setState({
       loading: false,
       showSnackBar: true,
       snackBarMessage: "Error updating blogs",
       snackBarVariant: "error",
     });
     console.log("err = ",e)
    }
   }

  handleDisplayImage = (event) => {
    var img = [{}]
    for(let i=0;i<event.target.files.length;i++)
    {
      const newimage=event.target.files[i]
      newimage["id"] = Math.random()
      img.push(newimage)
    }
    img.splice(0,1)
    this.state.Cimage=img
    console.log('target',img,this.state.Cimage)
    };
    handleCarouselImage = (event) => {
      this.state.Dimage=event.target.files[0]
      this.setState({
        Dfile: URL.createObjectURL(event.target.files[0]),
      });
      console.log("target",event.target.files[0],"targetachieve",this.state.Dimage)
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
      blog,
      showSnackBar,
      snackBarMessage,
      snackBarVariant,
      Cimage,
      Cfile,
      loading,
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
            autoHideDuration={1000}
            onClose={() => this.closeSnackBar()}
          />
        )}
        <div className="col-12">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Blogs Details</h2>
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
                         Title
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="title"
                          className="form-control"
                          //value={user.fname}
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
                          //value={user.fname}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
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
                      {Dimage ? (
                      <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                          <img
                            style={{ marginRight: "5px" }}
                            width="100"
                            className="img-fluid"
                            src={Dfile}
                            alt="profileImage"
                          />
                        </div>
                      </div>
                    ) : blog.profileImage && blog.profileImage.length ? (
                      <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                          <img
                            style={{ marginRight: "5px" }}
                            width="100"
                            className="img-fluid"
                            src={`${blog.profileImage}`}
                            alt="profileImage"
                          />
                        </div>
                      </div>
                    ) : null}
                      <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Carousel Image
                      </label>
                        <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="Cimage/*"
                          name="profileImage"
                          className="form-control"
                          multiple
                          onChange={this.handleDisplayImage}
                        />
                      </div>
                      </div>
                    <div className="ln_solid"></div>
                    <div className="form-group row">
                      <div className="col-md-6 col-sm-6 offset-md-3">
                        <Button
                          className={`btn btn-success btn-lg ${
                            this.state.loading ? "disabled" : ""
                          }`}
                          onClick={()=>{
                            if(this.state.blog.title&&this.state.blog.description&&this.state.Dimage&&this.state.Cimage!="")
                            {
                             this.state.loading=true
                             this.setState({loading:true})
                            this.handleAddBlogs(this.state.blog)
                            
                           }
                           else{
                             this.setState({
                               showSnackBar:true,
                               snackBarMessage:"Please fill the form",
                               snackBarVariant: "error",
                             })
                           }
                           }}
                        >
                          <i
                            className={`fa fa-spinner fa-pulse ${
                              this.state.loading ? "" : "d-none"
                            }`}
                          />
                          {isEdit ? " Update" : " Submit"}
                        </Button>
                        <Button
                          onClick={() => history.push('/Blogs')}
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
