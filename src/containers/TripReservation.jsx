import React, { Component } from 'react'
import { Scheduler } from "@aldabil/react-scheduler";
import {getTripReservation,addTripReservation} from '../backend/services/reservationService'
import SnackBar from '../components/SnackBar';
import { getUsers } from "../backend/services/usersService"
import { getTrips } from "../backend/services/TripsService"
import moment from 'moment';
export default class TripReservation extends Component {
    constructor(props) {
        super(props);
          this.state = {
          reservations: [],
          users: [],
          trips: [],
          field:[],
          RESOURCES:[],
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
                      title: "Trip Reservation # "+(++index),
                      start: new Date(moment(reservation.start).format("YYYY/M/D 01:00")),
                      end: new Date( moment(reservation.start).format("YYYY/M/D 24:00")),
         }
    });
    
    this.setState({reservations})
}
formatResources(response)
{
     const resources = (response).map((reservation,index)=>{
        return{
                      id: ++index,
                      title: reservation.status,
                      avatar: "https://picsum.photos/200/300",
                      color: reservation.status==="passed"?"#58ab2d":"#ab2d2d"
         }
    });
   this.setState({
    RESOURCES:resources
   })
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
       getTripReservation()
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
                snackBarMessage:"Fetching trip reservation error",
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
   handleTripReservation(e)
   {
       console.log("onconfirm",e)
    // addTripReservation(trip)
    //       .then((response) => {
    //         this.setState({
    //           loading: false,
    //           showSnackBar: true,
    //           snackBarMessage: "Trip Created successfully",
    //           snackBarVariant: "success",
    //         });
    //       })
    //       .catch((err) => {
    //         console.log("Error:", err);
    //         this.setState({
    //           loading: false,
    //           showSnackBar: true,
    //           snackBarMessage: "Error creating trip",
    //           snackBarVariant: "error",
    //         });
    //       });
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
          <h2>Trip Reservations</h2>
          </div>
              {
                <Scheduler
                view="week"
                month= {this.formatMonth()}
                week={this.formatWeek()}
                day= {this.formatWeek()}
                events={reservations}
                fields={this.Field()}
                //onConfirm={this.handleTripReservation}
                />
              }
               
          </div>
    )
  }
}
