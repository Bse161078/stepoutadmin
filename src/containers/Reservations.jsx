import React, { Component } from 'react'
import { Scheduler } from "@aldabil/react-scheduler";
import {getReservation} from '../backend/services/reservationService'
import SnackBar from '../components/SnackBar';
import { getUsers } from "../backend/services/usersService"
import { getTrips } from "../backend/services/TripsService"
import moment from 'moment';

export default class CalendarReservation extends Component {
    constructor(props) {
        super(props);
          this.state = {
          reservations: [],
          allBlogs: [],
          users: [],
          trips: [],
          loading: true,
          responseMessage: "Loading Users...",
          showSnackBar: false,
          snackBarMessage: "",
          search:'',
          snackBarVariant: "success",
        };
       // this.handleInputChange = this.handleInputChange.bind(this);
      }
formateReservation(response)
{
    const reservations=(response).map((reservation,index)=>{
        return{
                      event_id: index,
                      title: "Reservation # "+(++index),
                      start: new Date(moment(reservation.start).format("YYYY/M/D 01:00")),
                      end: new Date( moment(reservation.start).format("YYYY/M/D 24:00")),
        }
    });
    
    this.setState({reservations})
}

fetchTrip = () => {
  getTrips()
 .then((response) => {
   console.log("############trips", response);
   this.setState({
       loading:false,
       trips:response,
      })
      })
   .catch((err) => {
       this.setState({
           loading:false,
           snackBarMessage:"Fetching trip reservation error",
           snackBarVariant:'error',
           showSnackBar:true
       })
   
      })
   }
fetchUser = () => {
  getUsers()
 .then((response) => {
   console.log("############users", response);
   this.setState({
       loading:false,
       users:response,
      })
      })
   .catch((err) => {
       this.setState({
           loading:false,
           snackBarMessage:"Fetching trip reservation error",
           snackBarVariant:'error',
           showSnackBar:true
       })
   
      })
   }

    fetchReservation = () => {
        getReservation()
      .then((response) => {
        console.log("############", response);
        this.setState({
            loading:false,

        })
        this.formateReservation(response);
           })
        .catch((err) => {
            this.setState({
                loading:false,
                snackBarMessage:"Fetching reservation error",
                snackBarVariant:'error',
                showSnackBar:true
            })
        
           })
        }
        closeSnackBar()
   {
     this.setState({
       showSnackBar:false
     })
    
   }
   formatMonth()
{
    const month = { 
        weekDays: [0, 1, 2, 3, 4, 5,6], 
        weekStartOn: 0, 
        startHour: 9, 
        endHour: 17,
        step: 60
            }
            return month;
}
formatWeek()
{
    const week = { 
        weekDays: [0, 1, 2, 3, 4, 5,6], 
        weekStartOn: 0, 
        startHour: 0, 
        endHour: 24,
        step: 60
            }
            return week;
}
formatDay()
{
  const day=  {
        startHour: 0, 
        endHour: 24, 
        step: 24
         }  
         return day;
}
Field()
{
    const {users,trips} = this.state
    const useropt = users.map((user,index)=>{
        return{
        userID:user.id,
        text:user.firstname+" "+user.lastname,
        value:user.id
    }
    })

 const tripopt = trips.map((trip,index)=>{
        return{
        tripID:trip.id,
        text:trip.Name,
        value:trip.id
    }
 })
   const res =  [
        {
          name: "user_id",
          type: "select",
          // Should provide options with type:"select"
          options: useropt,
          config: { label: "User", required: true, errMsg: "Plz Select User" }
        },
        {
          name: "venue_id",
          type: "select",
          // Should provide options with type:"select"
          options: tripopt,
          config: { label: "Trip", required: true, errMsg: "Plz Select Trip" }
        }
    ]   
    return res;
}
    componentDidMount()
    {
        this.fetchReservation()
        this.fetchUser()
        this.fetchTrip()
    }
    
  render() {
      console.log("reservations = ",this.state.reservations);
      const {
          showSnackBar,
          snackBarMessage,
          snackBarVariant,
          reservations
      }=  this.state
    return (
      <div>
             {this.state.loading===true&&
          <div class="loader"></div>
        }
        {
            this.state.showSnackBar&&
            <SnackBar
            open={showSnackBar}
            message={snackBarMessage}
            variant={snackBarVariant}
            onClose={() =>
            this.closeSnackBar()}
          />}
          <div className="x_title">
          <h2>Reservations</h2>
          </div>
              {
                <Scheduler
                view="month"
                month= {this.formatMonth()}
                week={this.formatWeek()}
                day= {this.formatWeek()}
                fields={this.Field()}
                events={reservations}
                />
              }
               
          </div>
    )
  }
}
