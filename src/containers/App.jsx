import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import axios from "axios";
import Cookie from "js-cookie";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";
import { Container } from "reactstrap";
import * as types from "../static/_types";
import { firebase } from "../backend/firebase";
import { getSignedInUser } from "../backend/services/authService";
import { RootContext } from "../../src/backend/Context";
import VenuesForm from "./VenuesForm";
import Promotions from "./Promotions"
import SubscriberVenue from "./SubscriberVenue"
import PromotionForm from './PromotionForm'
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      user: null,
      displayLoading: true,
      displayApp: false,
      displayMessage: "Loading User Data...",
    };
  }

  async componentDidMount() {
    const { dispatch, history } = this.props;
    const token = Cookie.get("sneakerlog_access_token");

    await firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.props.dispatch({
          type: types.SET_USER_FROM_TOKEN,
          payload: user,
        });
      }
    });

    if (token) {
      this.setState({ loading: false });
    } else {
      history.push("/login");
    }
  }
  componentDidMount()
  {
    const script = document.createElement("script");
        script.src =
            "https://maps.googleapis.com/maps/api/js?key=AIzaSyAY-S1OMvpOMhUrXgmtAiJ-jDTAX0jJzSU&libraries=places";
        script.async = true;
        document.body.appendChild(script);
  }
  render() {
    
    return (
      <RootContext>
        <div className="app">
          <Header />
          <div className="app-body">
            <Sidebar {...this.props} user={this.state.user} />
            <main className="main">
              <Breadcrumb />
              <Container fluid>
                <Switch>
                  {/* <Route exact={true} path='/' component={Stats}/>      */}

                   
                     <Route
                        exact={true}
                        path="/Venue"
                        component={SubscriberVenue}
                    />
                   <Route
                    exact={true}
                    path="/Promotions"
                    component={Promotions}
                  />
                
                  <Route
                    exact={true}
                    path="/Venue/AddVenue"
                    component={VenuesForm}
                  />
                   
                   <Route
                    exact={true}
                    path="/Venue/EditVenue"
                    component={VenuesForm}
                  />
                  <Route
                    exact={true}
                    path="/Venue/AddPromotion"
                    component={PromotionForm}
                  />
               
                  <Redirect to={"/Venue"} from="/" />
                </Switch>
              </Container>
            </main>
          </div>
          <Footer />
        </div>
      </RootContext>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  user: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default withRouter(connect(mapStateToProps)(App));
