import React, { useState,useEffect } from "react";
import ReactDOM from "react-dom";
import MultiSelect from "react-multi-select-component";

const SelectOutdoorActivities = (props) => {
    const options = [
    {label:"Horseback Riding",value:"Horseback Riding"},
     {value:'Stargazing',label:"Stargazing"},
     {value:'Farmers Market',label:"Farmers Market"},
     {value:'Rockpooling',label:'Rockpooling'},
     {value:'Paddleboarding',label:'Paddleboarding'},
     {value:'Camping',label:"Camping"},
     {value:'Whitewater Rafting',label:'Whitewater Rafting'},
     {value:'Sightseeing',label:'Sightseeing'},
     {value:'Boat Ride',label:'Boat Ride'},
     {value:'Go Ape',label:'Go Ape'},
     {value:'Zoo Park',label:'Zoo Park'},
     {value:'Winery',label:'Winery'},
     {value:'Outdoor Concert',label:'Outdoor Concert'},
     {value:'Drive in Movie',label:'Drive in Movie'},
     {value:'Picnic',label:"Picnic"},
     {value:'Amusement Park',label:'Amusement Park'},
     {value:'Outdoor Golf',label:'Outdoor Golf'},
     {value:'Fishing',label:'Fishing'},
     {value:'Rock Climbing',label:"Rock Climbing"},
     {value:'Cycling',label:'Cycling'},
     {value:'Hiking',label:'Hiking'},
   ];

   const value=props.selected?props.selected.map((val)=>val.name):''
   const [selected, setSelected] = useState(value?value:[]);  useEffect(()=>
  {
    props.onSelectOutdoorActivity(selected)
  },[selected])

  return (
    <div>
      <MultiSelect
        options={options}
        selected={selected}
        onChange={setSelected}
        labelledBy={"Select Indoor Activities"}
      />
    </div>
  );
};

export default SelectOutdoorActivities;
