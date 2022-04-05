import './App.css';
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Logo from './Assets/Logo.png'
import LogoImage from './Assets/Logoimage.png'
import Homepage from './Homepage/homepage'
import SignUp from './CreateAccount/signup';
import Login from './Login/login';
import Addthingstodo from './AddThingsToDo/addthingstodo';
import AddBlogs from './AddBlogs/addBlogs';
import AddTrips from './AddTrips/addTrips';
import {Routes, Route, BrowserRouter} from "react-router-dom";
import Details from './Details/Details';
import BlogsDetails from './Details/BlogsDetails/Details'
import ThingsToDo from './Details/ThingsToDoDetails/ThingsToDo'
import TripsDetails from './Details/TripsDetails/TripsDetails'
function App() {
  const [openRegister,setOpenRegister] = useState(false)
  const [openLogin,setOpenLogin] = useState(false)
  const [homepage,setHomepage] = useState(false)
  const [openAddThings,setOpenAddThings] = useState(false)
  const [openBlogs,setOpenBlogs] =useState(false)
  const [openTrips,setOpenTrips] =useState(true)
 return (
<Box >
      <Grid container>
        <Grid item xs={5} md ={5}>
        <Grid container direction="row" justify="center"></Grid>
        </Grid>
        <Grid item xs={2} md ={2}lg={5}sx={{ background:'#0AC2CC'}}>
         
              <img src={Logo}/>
                </Grid>
        <Grid item xs={5} md ={5}>
        <Grid container direction="row" justify="center"></Grid>
        </Grid>
        <Grid xs={12} md={12}>
        <BrowserRouter>
        <Routes>
           <Route exact path="/" element={ <Homepage setOpenRegister={setOpenRegister} setOpenLogin={setOpenLogin}
           setHomepage={setHomepage}/>}/>
            <Route exact path="/SignUp" element={ <SignUp setOpenRegister={setOpenRegister} setOpenLogin={setOpenLogin}
           setHomepage={setHomepage}/>}/>
            <Route exact path="/Login" element={ <Login setOpenRegister={setOpenRegister} setOpenLogin={setOpenLogin}
           setHomepage={setHomepage}/>}/>
            <Route exact path="/Addthingstodo" element={ <Addthingstodo setOpenRegister={setOpenRegister} setOpenLogin={setOpenLogin}
           setHomepage={setHomepage}/>}/>
           <Route exact path="/AddBlogs" element={ <AddBlogs setOpenRegister={setOpenRegister} setOpenLogin={setOpenLogin}
           setHomepage={setHomepage}/>}/>
           <Route exact path="/AddTrips" element={ <AddTrips setOpenRegister={setOpenRegister} setOpenLogin={setOpenLogin}
           setHomepage={setHomepage}/>}/>
           <Route exact path="/Details" element={ <Details setOpenRegister={setOpenRegister} setOpenLogin={setOpenLogin}
           setHomepage={setHomepage}/>}/>
           <Route exact path="/BlogsDetails" element={ <BlogsDetails setOpenRegister={setOpenRegister} setOpenLogin={setOpenLogin}
           setHomepage={setHomepage}/>}/>
           <Route exact path="/TripsDetails" element={ <TripsDetails setOpenRegister={setOpenRegister} setOpenLogin={setOpenLogin}
           setHomepage={setHomepage}/>}/>
           <Route exact path="/ThingsToDoDetails" element={ <ThingsToDo setOpenRegister={setOpenRegister} setOpenLogin={setOpenLogin}
           setHomepage={setHomepage}/>}/>
        </Routes>
        </BrowserRouter>  
        </Grid>
      </Grid>
</Box>       
  );
}

export default App;
