import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  CardGroup,
  Card,
  CardBody,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import Cookie from "js-cookie";
import axios from "axios/index";
import Formsy from "formsy-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { API_END_POINT } from "../config";
import { signInWithEmail } from "../backend/services/authService";
import sneaker from "../public/img/logo.png";
import golf from "../public/img/golf.png";
import firebase from "firebase";

const style = {
  logoWrapper: {
    width: "70%",
    margin: "15px auto 0",
    height: 100 + "px",
  },
  svg: {
    width: "100%",
    fill: "#ffffff",
  },
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      email: "",
      password: "",
      loading: false,
    };
  }

  componentDidMount() {
    let token = Cookie.get("sneakerlog_access_token");
    if (token) {
      this.props.history.push("/");
    }
  }

  submit = async () => {
    const { email, password } = this.state;
    this.props.history.push("/");

    if (!this.state.loading) {
      this.setState({ loading: true });

      // untill the backend gets ready
      // Cookie.set('sneakerlog_access_token', { expires: 14 })
      // this.props.history.push("/");

      const signInResult = await signInWithEmail(
        email,
        password,
        this.onSigninSuccess
      );

      // if (!!signInResult) {
      //   console.log("signInResult:", signInResult);
      //   Cookie.set("sneakerlog_access_token", { expires: 14 });
      //   this.props.history.push("/events");
      // } else {
      //   this.setState({ loading: false });
      // }
      // .then(response => {
      //       Cookie.set('sneakerlog_access_token', `${token}`, { expires: 14 })
      //       this.props.history.push("/");
      // })
      // .catch(error => {
      //   this.setState({ loading: false });
      // });
    }
  };

  onSigninSuccess = (userId) => {
    if (userId) {
      firebase
        .firestore()
        .collection("Admins")
        .doc(userId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            // console.log("Document data:", doc.data());
             console.log("signInResult:", userId);
            Cookie.set("sneakerlog_access_token", { expires: 14 });
            this.props.history.push("/events");
          } else {
            // doc.data() will be undefined in this case
            Cookie.set("sneakerlog_access_token", { expires: 14 });
            this.props.history.push("/events");
            // console.log("No such document!");
            // this.setState({ loading: false });
            // alert("You are not authorized to access");
          }
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    }
  };

  render() {
    return (
      <div className="app flex-row align-items-center animated fadeIn login">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <div className="loginLogo-container d-flex d-lg-none">
                      <img className={`companyLogo`} src={sneaker} />
                      <img className={`companyLogo`} src={golf} />
                    </div>
                    <h1>Login</h1>
                    <p className="text-muted py-2">Sign In to your account</p>
                    <Formsy onValidSubmit={this.submit.bind(this)}>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="email"
                          placeholder="Email"
                          required
                          ref={(input) => (this.email = input)}
                          onChange={(e) =>
                            this.setState({ email: e.target.value })
                          }
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password"
                          required
                          ref={(input) => (this.password = input)}
                          onChange={(e) =>
                            this.setState({ password: e.target.value })
                          }
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button
                            color="green"
                            className={`px-4 ${
                              this.state.loading ? "disabled" : ""
                            }`}
                          >
                            <i
                              className={`fa fa-spinner fa-pulse ${
                                this.state.loading ? "" : "d-none"
                              }`}
                            />{" "}
                            Login
                          </Button>
                        </Col>
                        {/*<Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>*/}
                      </Row>
                    </Formsy>
                  </CardBody>
                </Card>
                <Card
                  className="text-white d-md-down-none login-background-image"
                  style={{ width: 44 + "%" }}
                >
                  <CardBody className="text-center">
                    <div>
                      <div style={style.logoWrapper} className={`svg-logo`}>
                        <img className={`companyLogo`} src={sneaker} />
                      </div>
                      {/* <div className={`text-center`} style={{ fontSize: '20px', paddingTop: "10px", fontWeight: "bold" }}>Sneaker Log Dashboard</div> */}
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default withRouter(connect()(Login));
