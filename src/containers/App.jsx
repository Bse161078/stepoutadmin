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
import Stats from "../containers/Stats";
import { Container } from "reactstrap";
import BlogsForm from "./BlogsForm";
import Users from "../containers/Users";
import UserForm from "../containers/UserForm";
import Admins from "./Admins";
import AdminForm from "./AdminForm";
import PrivacyPolicy from "./PrivacyPolicy";
import PrivacyPolicyForm from "./PrivacyPolicyForm";
import TermsService from "./TermsService";
import TermsServiceForm from "./TermsServiceForm";
import Notifications from "./Notifications";
import FAQForm from "./FAQForm";
import * as types from "../static/_types";
import { firebase } from "../backend/firebase";
import { getSignedInUser } from "../backend/services/authService";
import { RootContext } from "../../src/backend/Context";
import Venues from "./Venues";
import Blogs from "./Blogs";
import Trips from "./Trips";
import TripsForm from "./TripsForm";
import VenuesForm from "./VenuesForm";
import Reservations from "./Reservations"
import TripReservation from "./TripReservation"
import SubscriberVenue from "./SubscriberVenue"
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

                  <Route exact={true} path="/users" component={Users} />
                    <Route
                        exact={true}
                        path="/Venues"
                        component={Venues}
                    />
                     <Route
                        exact={true}
                        path="/Venue"
                        component={SubscriberVenue}
                    />
                    <Route
                        exact={true}
                        path="/Blogs"
                        component={Blogs}
                    />
                    <Route
                        exact={true}
                        path="/Trips"
                        component={Trips}
                    />
                    <Route
                        exact={true}
                        path="/Blogs/AddBlog"
                        component={BlogsForm}
                    />
                     <Route
                        exact={true}
                        path="/Blogs/EditBlog"
                        component={BlogsForm}
                    />
                    <Route
                        exact={true}
                        path="/Trips/AddTrip"
                        component={TripsForm}
                    />
                    <Route
                        exact={true}
                        path="/Trips/EditTrip"
                        component={TripsForm}
                    />
                  <Route
                    exact={true}
                    path="/Venues/AddVenue"
                    component={VenuesForm}
                  />
                  <Route
                    exact={true}
                    path="/Venue/AddVenue"
                    component={VenuesForm}
                  />
                    <Route
                    exact={true}
                    path="/Venues/EditVenue"
                    component={VenuesForm}
                  />
                   <Route
                    exact={true}
                    path="/Venue/EditVenue"
                    component={VenuesForm}
                  />
                  <Route
                    exact={true}
                    path="/Users"
                    component={Users}
                  />
                   <Route
                    exact={true}
                    path="/Users/AddUser"
                    component={UserForm}
                  />
                    <Route
                    exact={true}
                    path="/Users/EditUser"
                    component={UserForm}
                  />
                  <Route exact={true} path="/admin" component={Admins} />
                  <Route
                    exact={true}
                    path="/admin/admin-form"
                    component={AdminForm}
                  />
                  <Route
                    exact={true}
                    path="/admin/edit-admin/:adminId"
                    component={AdminForm}
                  />

                  <Route
                    exact={true}
                    path="/notifications"
                    component={Notifications}
                  />
                  <Route
                    exact={true}
                    path="/Stats"
                    component={Stats}
                  />
                  <Route
                    exact={true}
                    path="/privacy-policy"
                    component={PrivacyPolicyForm}
                  />
                  <Route
                    exact={true}
                    path="/reservations"
                    component={Reservations}
                  />
                  <Route
                    exact={true}
                    path="/trip-reservations"
                    component={TripReservation}
                  />
                  {/* <Route exact={true} path="/privacy-policy/privacy-policy-form" component={PrivacyPolicyForm}/> */}
                  {/* <Route exact={true} path="/privacy-policy/edit-privacy-policy/:privacyPolicyId" component={PrivacyPolicyForm}/> */}

                  <Route
                    exact={true}
                    path="/terms-service"
                    component={TermsServiceForm}
                  />

                  <Route exact={true} path="/faq" component={FAQForm} />
                  <Redirect to={"/Venues"} from="/" />
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
