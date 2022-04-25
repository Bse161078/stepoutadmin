import React, { Component } from 'react'
import { Scheduler } from "@aldabil/react-scheduler";
import {getTripReservation,addTripReservation,
        deleteTripReservation,updateTripReservation} from '../backend/services/reservationService'
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
    const res = response.filter((fil)=>fil.status?fil.status!="cancel":'')
    console.log("responsefilterreservation",res)
    const reservations=(res).map((reservation,index)=>{
        return{
                      event_id: reservation.id,
                      title: reservation.title?reservation.title:"Trip Reservation # "+(++index),
                      start: new Date(moment(new Date(reservation.start).toString()).format("YYYY/M/D")),
                      end: new Date( moment(new Date(reservation.end).toString()).format("YYYY/M/D")),
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
        },{
          name:"status",
          type:"select",
          options:[{text:"Cancel",value:"cancel"},
                   {text:"Pending",value:"pending"},
                    {text:"Passed",value:"passed"}],
          config:{label:"Status",required:true,errMsg:"Plz Select Status"}
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
   async handleDelete(deleteId){
    this.state.loading=true

    try{
      const res = await deleteTripReservation(deleteId)
      this.setState({
        loading:false,
        snackBarMessage:"Trip Reservation Deleted Successfully",
        snackBarVariant:"success",
        showSnackBar:true
      })
      this.fetchReservation()
    }
    catch(e)
    {
      this.setState({
        loading:false,
        snackBarMessage: "Couldn't Delete Trip Reservation",
        snackBarVariant:"success",
        showSnackBar:true
      })
    }
   }

   async handleTripReservation(event,action)
   {
    this.state.loading=true
     const tempEvent = {
      ...event,
       event_id:event.event_id || Math.random(),
       start:new Date(event.start).toString(),
       end:new Date(event.end).toString(),

     }
       console.log("onconfirm",event,action)
       if(action==='create')
{
        try{
          const res = await addTripReservation(tempEvent)
            this.setState({
              loading:false,
              snackBarMessage:"Trip Reservation Created",
              snackBarVariant:"success",
              showSnackBar:true
            })
            this.fetchReservation()
        }
        catch(err)
        {
          console.log("err",err)
          this.setState({
            loading:false,
            snackBarMessage:"Trip Reservation Error",
            snackBarVariant:"error",
            showSnackBar:true
          })
        }}
        else if(action==="edit")
        {
         try{
           const res = await updateTripReservation(event.event_id,event)
             this.setState({
               loading:false,
               snackBarMessage:"Trip Reservation Updated",
               snackBarVariant:"success",
               showSnackBar:true
             })
             this.fetchReservation()
         }
         catch(err)
         {
           console.log("err",err)
           this.setState({
             loading:false,
             snackBarMessage:"Update Trip Reservation Error",
             snackBarVariant:"error",
             showSnackBar:true
           })
         }
        }
       return new Promise((res, rej) => {
        setTimeout(() => {
          res({
            ...event,
            start:new Date(event.start),
            end:new Date(event.end),
            event_id: event.event_id || Math.random()
          });
        }, 1000);
        
        
      });

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
            autoHideDuration={1000}
            onClose={() => this.closeSnackBar()}
          />}
          <div className="x_title">
          <h2>Trip Reservations</h2>
          </div>
              {
                <Scheduler
                view="month"
                month= {this.formatMonth()}
                week={this.formatWeek()}
                day= {this.formatWeek()}
                events={reservations}
                fields={this.Field()}
                onConfirm={this.handleTripReservation.bind(this)}
                onDelete={this.handleDelete.bind(this)}
                />
              }
               
          </div>
    )
  }
}
