import React from 'react'
import { useNavigate } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import BlogsDetails from './BlogsDetails/Details'
import Box from '@mui/material/Box';
function Details() {
const navigate=useNavigate()
const [value, setValue] = React.useState(1);
const handleChange = (event, newValue) => {
    setValue(newValue);
};
function TabPanels(value){
    console.log('blogs',value.value)
 if(value===1)
 {

 }   
 else if(value.value===2)
 {
  <BlogsDetails/>
  
 } 
 else if(value===3)
 {

 }
}
  return (
    <Box>
         <Box sx={{ borderBottom: 1, borderColor: 'divider',ml:2 }}>
         <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
         <Tab label="Things To Do" style={{color:'white'}} />
          <Tab label="Blogs" style={{color:'white'}} />
          <Tab label="Trips" style={{color:'white'}} />
         </Tabs>
         </Box>
         <TabPanels value={1} >
            
         </TabPanels>
         <TabPanels value={2} >
        
         </TabPanels>
         <TabPanels value={3} >
        
         </TabPanels>
    </Box>
  )
}

export default Details