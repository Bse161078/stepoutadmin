import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import RichTextEditor from "react-rte";
import { Button } from "reactstrap";
import {
  addBlogs,
  updateBlogs
} from "../backend/services/BlogsService";
import moment from "moment";
import { firebase } from "../backend/firebase";
import { imageResizeFileUri } from "../static/_imageUtils";
import { v4 as uuidv4 } from "uuid";
import SnackBar from "../components/SnackBar";


import Select from "react-select";
import "react-select/dist/react-select.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { TextField } from "@material-ui/core";
export default class BlogsForm extends React.Component {
  constructor(props) {
    const editBlog=localStorage.getItem("blog")!=""?JSON.parse(localStorage.getItem('blog')):''
    console.log("editblog",editBlog)
    super(props);
    this.state = {
      loading: false,
      blog: {
        id:editBlog.id?editBlog.id:'',
        title: editBlog.title?editBlog.title:"",
        description: editBlog.description?editBlog.description:"",
        img: editBlog.img?editBlog.img:"",
        Images: editBlog.Images?editBlog.Images:"",
        Videos:editBlog.Videos?editBlog.Videos:[],
      },
      upcomingEvents: [],
      pastEvents: [],
      Cimage: "",
      Dimage:editBlog.img?editBlog.img:'',
      Dfile: editBlog.img?editBlog.img:"",
      Cimage:editBlog.Images?editBlog.Images:[],
      cImageFile:editBlog.Images?editBlog.Images:[],
      cVideoFile:editBlog.Videos?editBlog.Videos:[],
      Videos:editBlog.Videos?editBlog.Videos:[],
      userId: "",
      description: RichTextEditor.createEmptyValue(),
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
   // this.postUser = this.postUser.bind(this);
  }
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
  
  handleEditBlog=async(addvenue)=>{
    let Images=[]
    let Videos=[]
    if(addvenue.img==='')
    {
    const imageUrl=await this.uploadImage(this.state.Dimage);
    addvenue.img=imageUrl;
    }
    const upload = this.state.Cimage
    if(addvenue.Images===''||addvenue.Videos==='')
    {
    for (let i =0;i<this.state.Cimage.length;i++)
    {
      const imges=await this.uploadImage(upload[i])
      Images.push(imges)
    }
    for (let i =0;i<this.state.Videos.length;i++)
    {
      const imges=await this.uploadImage(this.state.Videos[i])
      Videos.push(imges)
    }
    addvenue.Images=Images;
    addvenue.Videos=Videos
  }

    console.log("venue",addvenue)
    try{
      const { history } = this.props;
     const res = await updateBlogs(addvenue.id,addvenue)
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

  handleAddBlogs=async(addvenue)=>{
  
    let Images=[]
     let Videos=[]
  if(this.state.Cimage||this.state.Videos)
  {
  const imageUrl=await this.uploadImage(this.state.Dimage);
  addvenue.img=imageUrl;
  const multipleFiles=this.state.Cimage;
  for (let i =0;i<multipleFiles.length;i++)
  {
    const imges=await this.uploadImage(multipleFiles[i])
    Images.push(imges)
  }
  for (let i =0;i<this.state.Videos.length;i++)
  {
    const vid=await this.uploadImage(this.state.Videos[i])
    Videos.push(vid)
  }
}
    
     addvenue.Images=Images;
     addvenue.Videos=Videos;
     this.setState({loading:true})
     console.log("venue",addvenue)
     try{
       const { history } = this.props;
      const res = await addBlogs(addvenue)
    //this.state.navigate('/users')
      this.setState({
       loading: false,
       showSnackBar: true,
       snackBarMessage: "Blogs Created!",
       snackBarVariant: "success",
     });
    }
    catch(e)
    {
     this.setState({
       loading: false,
       showSnackBar: true,
       snackBarMessage: "Error creating blogs",
       snackBarVariant: "error",
     });
     console.log("err = ",e)
    }
   }

  handleDisplayImage = (event) => {
    var img = [{}]
    var cimg = [{}]
    var vid = [{}]
    var cVid = [{}]
    for(let i=0;i<event.target.files.length;i++)
    {
      if(event.target.files[i].type.includes("video"))
    {
      const newvid=event.target.files[i]
      newvid["id"] = Math.random()
      cVid.push(URL.createObjectURL(event.target.files[i]))
      vid.push(newvid)
    }
    else{
    const newimage=event.target.files[i]
    newimage["id"] = Math.random()
    cimg.push(URL.createObjectURL(event.target.files[i]))
    img.push(newimage)
  }
    }
    cimg.splice(0,1)
    cVid.splice(0,1)
  this.state.cVideoFile=cVid
   this.state.cImageFile=cimg
   vid.splice(0,1)
   this.state.Videos=vid
    img.splice(0,1)
    this.state.Cimage=img
    this.state.blog.Images=''
    this.state.blog.Videos=''
    this.setState(prevState => ({
      venue:{
        ...prevState.venue,
        Images:'',
        Videos:''
      }
    }))
    console.log('target',img,this.state.Cimage,this.state.Cfile)
    };
    handleCarouselImage = (event) => {
      this.state.Dimage=event.target.files[0]
      this.setState({
        Dfile: URL.createObjectURL(event.target.files[0]),
      });
      this.state.blog.img=''
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
      cImageFile,
      cVideoFile,
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
                          value={blog.title}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                         Description
                      </label>
                      <div className="col-md-6 col-sm-6">
                      <textarea  required
                          type="text"
                          name="description"
                          className="form-control"
                          value={blog.description}
                          rows="8"
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                        Main Display Image
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
                    ) : null}
                      <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">
                      Quality Carousel Images and Videos
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
                      {Cimage ? (
                      <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                        <Slider style={{width:"100px"}} arrows={false} infinite={true} adaptiveHeight={true} autoplaySpeed={2000} autoplay={true}  touchMove={true} dots={true}>
                          {cImageFile&&cImageFile.map((cimage)=>{
                          return(
                          <img src={cimage} class="d-block w-100" alt="Wild Landscape"/>

                          )
                          })}
                          {cVideoFile&&cVideoFile.map((cimage)=>{
                          return(
                          <video src={cimage} class="d-block w-100" alt="Wild Landscape"/>

                          )
                          })}
                          </Slider>
                        </div>
                      </div>
                       ) 
                        : null}
                    <div className="ln_solid"></div>
                    <div className="form-group row">
                      <div className="col-md-6 col-sm-6 offset-md-3">
                        <Button
                          className={`btn btn-success btn-lg ${
                            this.state.loading ? "disabled" : ""
                          }`}
                          onClick={()=>{
                            if(this.state.blog.title&&this.state.blog.description&&this.state.Dimage!="")
                            {
                              if(window.location.href.includes("AddBlogs"))
                              {
                             this.state.loading=true
                             this.setState({loading:true})
                            this.handleAddBlogs(this.state.blog)
                              }
                              else{
                                this.state.loading=true
                             this.setState({loading:true})
                            this.handleEditBlog(this.state.blog)
                              }
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
