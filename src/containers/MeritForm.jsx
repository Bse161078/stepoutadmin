import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import {signUp} from "../backend/services/authService";
import {updateMerit,getMerit} from "../backend/services/adminService"
import SnackBar from "../components/SnackBar";
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class MeritForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      admin: {
        merit:''
      },
      description: RichTextEditor.createEmptyValue(),
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success"
    };
  }

  componentDidMount() {
    this.getTheMerit()
  }

  setDescription(description) {
    const { admin } = this.state;
    admin.description = description.toString('html');
    this.setState({
      admin,
      description,
    });
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;

    const { admin } = this.state;
    admin[name] = value;
    this.setState({ admin });
  }

  // postAdmin = async (event) => {
  //   event.preventDefault();
  //   const { match, history } = this.props;
  //   const { loading, admin } = this.state;
  //   if (!loading ) {
  //     const fd =new FormData();
  //     this.setState({ loading: true });
  //     if (match.params.memberId) {
  //       axios.put(`${API_END_POINT}/api/v1/admin/${match.params.memberId}`, fd)
  //         .then((response) => {
  //           if (response.data && response.data.status && response.status === 200) {
  //             window.alert("Updated !");
  //             this.setState({ loading: false });
  //           } else {
  //             window.alert('ERROR UPDATING !')
  //             this.setState({ loading: false });
  //           }
  //         })
  //         .catch((err) => {
  //           window.alert('ERROR UPDATING !')
  //           this.setState({ loading: false });
  //         })
  //     }
  //     else {
  //     if(admin.password === admin.confirmPassword) {
  //       signUp(admin.email, admin.password)
  //         .then((response) => {
          
  //         })
  //         .catch((err) => {
  //           this.setState({
  //             loading: false,
  //             showSnackBar: true,
  //             snackBarMessage: err,
  //             snackBarVariant: "error",
  //           });
  //         })
  //     }
  //     else {
  //       this.setState({
  //         loading: false,
  //         showSnackBar: true,
  //         snackBarMessage: "Password does not match!",
  //         snackBarVariant: "error",
  //       });
  //     }
  //   }
  //   }
  // }

  getTheMerit = async ()=>{
    let merit = await getMerit() 
    const { admin } = this.state;
    admin["merit"] = merit.merit;
    this.setState({ admin });
    console.log("This is the fee",merit)
  }
  postMerit = async (event)=>{
    event.preventDefault();
    const { admin } = this.state;
    updateMerit(admin) 
    .then(() => { //double then beacuase adding data to admin document in firebase
      this.setState({
        loading: false,
        showSnackBar: true,
        snackBarMessage: "Merit Link Updated successfully",
        snackBarVariant: "success",
      });
    })
  }

  closeSnackBar = () => {
    const { history } = this.props;
    this.setState({ showSnackBar: false })
    if(this.state.snackBarVariant === "success") {
      // history.goBack();
    }
  }

  render() {
    console.log(this.state);
    const {
      loading,
      admin,
      description,
      showSnackBar,
      snackBarMessage,
      snackBarVariant
    } = this.state;
    const { history } = this.props;
    console.log("THis isthe merit",admin)
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
                  <h2>Enter Merit Link</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postMerit}
                  >

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >
                        Merit Link
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="merit"
                          className="form-control"
                          value={admin.merit}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="ln_solid" />
                    <div className="form-group row">
                      <div className="col-md-6 col-sm-6 offset-md-3">
                        <Button className={`btn btn-success btn-lg ${this.state.loading ? 'disabled' : ''}`}>
                          <i className={`fa fa-spinner fa-pulse ${this.state.loading ? '' : 'd-none'}`} /> Submit
                        </Button>
                        <Button
                          onClick={() => history.goBack()}
                          className={`mx-3 btn btn-danger btn-lg`}>
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

