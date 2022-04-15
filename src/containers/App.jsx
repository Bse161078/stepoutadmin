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

import Collections from "./Collections";
import CollectionForm from "./CollectionForm";

import Admins from "./Admins";
import AdminForm from "./AdminForm";

import Brands from "./Brands";
import BrandForm from "./BrandForm";

import News from "./News";
import NewsForm from "./NewsForm";

import Events from "./Events";
import Golfcourses from "./Golfcourses";
import GolfcoursesForm from "./GolfcoursesForm";
import GolfcoursesDetails from "./GolfcoursesDetails";
import EventForm from "./EventForm";
import EventDetails from "./EventDetails";

import PrivacyPolicy from "./PrivacyPolicy";
import PrivacyPolicyForm from "./PrivacyPolicyForm";

import TermsService from "./TermsService";
import TermsServiceForm from "./TermsServiceForm";

import Notifications from "./Notifications";

import AboutForm from "./AboutForm";
import FAQForm from "./FAQForm";

import Sneakers from "./Sneakers";
import SneakersForm from "./SneakersForm";

import * as types from "../static/_types";
import { firebase } from "../backend/firebase";
import { getSignedInUser } from "../backend/services/authService";
import { RootContext } from "../../src/backend/Context";

import MembershipFee from "./MembershipFee";
import MembershipFeeForm from "./MembershipFeeForm";
import MeritForm from "./MeritForm";
import Venues from "./Venues";
import Blogs from "./Blogs";
import Trips from "./Trips";
import TripsForm from "./TripsForm";
import VenuesForm from "./VenuesForm";
import Reservations from "./Reservations"
import TripReservation from "./TripReservation"
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
                        path="/Blogs/AddBlogs"
                        component={BlogsForm}
                    />
                     <Route
                        exact={true}
                        path="/Blogs/EditBlogs"
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
                    path="/Venues/EditVenue"
                    component={VenuesForm}
                  />
                  <Route
                    exact={true}
                    path="/users"
                    component={Users}
                  />
                   <Route
                    exact={true}
                    path="/User/AddUser"
                    component={UserForm}
                  />
                    <Route
                    exact={true}
                    path="/User/EditUser"
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

                  <Route exact={true} path="/brands" component={Brands} />
                  <Route
                    exact={true}
                    path="/brands/brand-form"
                    component={BrandForm}
                  />
                  <Route
                    exact={true}
                    path="/brands/edit-brand/:brandId"
                    component={BrandForm}
                  />

                  <Route
                    exact={true}
                    path="/collection"
                    component={Collections}
                  />
                  <Route
                    exact={true}
                    path="/collection/collection-form"
                    component={CollectionForm}
                  />
                  <Route
                    exact={true}
                    path="/collection/edit-collection/:exerciseId"
                    component={CollectionForm}
                  />

                  <Route exact={true} path="/news" component={News} />
                  <Route
                    exact={true}
                    path="/news/news-form"
                    component={NewsForm}
                  />
                  <Route
                    exact={true}
                    path="/news/edit-news/:newsId"
                    component={NewsForm}
                  />

                  <Route exact={true} path="/events" component={Events} />
                  <Route exact={true} path="/golfcourses" component={Golfcourses} />
                  <Route
                    exact={true}
                    path="/events/event-form"
                    component={EventForm}
                  />

                  <Route exact={true} path="/membership-fee" component={MembershipFee} />
                  <Route exact={true} path="/membership-fee-form" component={MembershipFeeForm} />
                  <Route exact={true} path="/merit-form" component={MeritForm} />


                  

                    <Route
                    exact={true}
                    path="/golfcourses/golfcourses-form"
                    component={GolfcoursesForm}
                  />
                      <Route
                    exact={true}
                    path="/golfcourses/edit-golfcourses/:golfCoursesId"
                    component={GolfcoursesForm}
                  />
                  <Route
                    exact={true}
                    path="/golfcourses/golfcourses-details/:golfCoursesId"
                    component={GolfcoursesDetails}
                  />
                  <Route
                    exact={true}
                    path="/events/event-details/:eventId"
                    component={EventDetails}
                  />
                  <Route
                    exact={true}
                    path="/events/edit-event/:eventId"
                    component={EventForm}
                  />

                  <Route exact={true} path="/sneakers" component={Sneakers} />
                  <Route
                    exact={true}
                    path="/sneakers/sneakers-form"
                    component={SneakersForm}
                  />
                  <Route
                    exact={true}
                    path="/sneakers/edit-sneakers/:sneakersId"
                    component={SneakersForm}
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
                  {/* <Route exact={true} path="/terms-service/terms-service-form" component={TermsServiceForm}/> */}
                  {/* <Route exact={true} path="/terms-service/edit-terms-service/:eventId" component={TermsServiceForm}/> */}

                  <Route exact={true} path="/about" component={AboutForm} />

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
