import React from 'react'
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
function Header(props) 
{  
    const navigate = useNavigate()
    const [openDrawer,setOpenDrawer] =useState(false)
    const [selectedItem,setSelectedItem] = useState()
    const { window } = props;
    const container = window !== undefined ? () => window().document.body : undefined;
    const drawerWidth = 270;
    const addViewDetails=["Blogs","Trips","Things To Do"];
    const [list,setList]=useState(['Add Things To Do', 'Add Blogs', 'Add Trips',"View Details"]);
    const handleOnClick=(type)=>{
        if(type.includes('Add Blogs'))
        {
            navigate('/AddBlogs')
        }
        else if(type.includes('Add Things'))
        {
            navigate('/Addthingstodo')
        }
        else if(type.includes('Add Trips'))
        {
            navigate('/AddTrips')
        } 
        // else if(type.includes('View Details'))
        // {
        //     if(list.length<7){
        //  setSelectedItem("View Details");

        //  setList(list.concat(addViewDetails))
        //     }

        // }
        else if(type.includes("View Details"))
        {
            navigate('/Details')
        }
    }
    console.log(list)
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(112% - 200px)` },
          ml: { sm: `${drawerWidth}px` },backgroundColor:'transparent'
        }}
      >
        <Toolbar >
        <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2, display: { sm:'flex'} }}
          >
            <MenuIcon onClick={()=>{setOpenDrawer(true)}}  />
          </IconButton>
          <Typography variant="h6" noWrap component="div"  >
            Admin Page
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
       
        <Drawer
          variant='persistant'
          sx={{
            display: {  sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open={openDrawer}
          onClose={()=>{setOpenDrawer(false)}}
        >
            
          <Toolbar />
          <Typography variant='h6' align='center' sx={{mb:2}} >
                Admin's Name
         </Typography>
               
    <Divider />
    <List>
      {list.map((text, index) => (
        <ListItem button key={text} onClick={()=>{
            handleOnClick(text)
        }} >
          <ListItemText primary={text} style={{padding:20}} >
                {text}    
          </ListItemText>
        </ListItem>
      ))}
    </List>
    <Divider />
    <Typography variant='button' align='center' sx={{mt:19,cursor:'pointer'}}
    onClick={()=>{
        navigate('/')
    }} >
                Sign Out
         </Typography>
        </Drawer>
      </Box>
      </Box>
  )
}

export default Header