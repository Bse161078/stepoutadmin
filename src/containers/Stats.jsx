import React from 'react';
import { Link } from 'react-router-dom';

import {getTrips} from "../backend/services/TripsService"
import {getBlogs} from "../backend/services/BlogsService"
import {getUsers} from "../backend/services/usersService"
import {getVenues} from "../backend/services/VenueServices"
import {getSneakersReleaseDates} from "../backend/services/sneakerReleaseService"
import { DatePicker } from '@material-ui/pickers';

// import {Pagination} from 'react-bootstrap';
// import LineChart from '../components/LineChart'
// import PieChart from '../components/PieChart'
// import BarChart from '../components/BarChart'
// import Doughnut from '../components/Doughnut'

export default class Area extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      trips: [],
      blogs: [],
      users: [],
      venues: []
    }
    console.log("blogs",this.state.blogs,"trips",this.state.trips)
  }
  componentWillMount() {
      getUsers()
      .then(response => {
        this.setState({
          users: response,
        })
      })
      getTrips()
      .then(response => {
        this.setState({
          trips: response,
        })
      })
      getBlogs()
      .then(response => {
        this.setState({
          blogs: response,
        })
      })
      getVenues()
      .then(response => {
        this.setState({
          venues: response,
        })
      })
  }

  render() {
    const { users, trips, blogs, venues } = this.state;
    return (
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-sm-4">
            </div>
            <div className="col-sm-4 pull-right mobile-space">
            </div>
          </div>
          <div className="text-center space-2">
          </div>
            <div className = 'row space-1'>
              <div className='col-sm-6 my-3'>
                <h3 className='space-1'>Total Users</h3>
                <h5>{users.length ? users.length : "Fetching users..."}</h5>
              </div>
              {/* <div className='col-sm-6 my-3'>
                <h3 className='space-1'>Total Brands</h3>
                <h5>{brands.length ? brands.length : "Fetching brands..."}</h5>
              </div> */}
             <div className='col-sm-6 my-3'>
                <h3 className='space-1'>Total Trips</h3>
                <h5>{trips.length ? trips.length : "Fetching trips..."}</h5>
              </div>
              <div className='col-sm-6 my-3'>
                <h3 className='space-1'>Total Blogs</h3>
                <h5>{blogs.length ? blogs.length : "Fetching blogs..."}</h5>
              </div>
              <div className='col-sm-6 my-3'>
                <h3 className='space-1'>Total Venues</h3>
                <h5>{venues.length ? venues.length:"Fetching venues..."}</h5>
              </div>
              <div>
                
              </div>
              {/* <div className='col-sm-6 my-3'>
                <h3 className='space-1'>Un Paid Users</h3>
                <h5>{brands.length ? brands.length : "Fetching brands..."}</h5>
              </div> */}
              
              {/* <div className='col-sm-6 my-3'>
                <h3 className='space-1'>Past Events</h3>
                <h5>{brands.length ? brands.length : "Fetching brands..."}</h5>
              </div> */}
              {/* <div className='col-sm-6 my-3'>
                <h3 className='space-1'>Total Products</h3>
                <h5>0</h5>
              </div>
              <div className='col-sm-6 my-3'>
                <h3 className='space-1'>Sneaker Releases</h3>
                <h5>{releaseDates.length ? releaseDates.length : "Fetching elease dates..."}</h5>
              </div> */}
             </div>
        </div>
      </div>
    );
  }
}
