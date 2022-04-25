import React, { useState,useEffect } from "react";
import ReactDOM from "react-dom";
import MultiSelect from "react-multi-select-component";

const SelectIndoorActivities = (props) => {
   
    const options = [
    {label:"Cinema",value:"Cinema"},
     {value:'Museum',label:"Museum"},
     {value:'Painting',label:"Painting"},
     {value:'Pottery',label:'Pottery'},
     {value:'Open Mic',label:'Open Mic'},
     {value:'Poetry Night',label:"Poetry Night"},
     {value:'Cooking Class',label:'Cooking Class'},
     {value:'Laser Tag',label:'Laser Tag'},
     {value:'Planet Jump',label:'Planet Jump'},
     {value:'Virtual Reality',label:'Virtual Reality'},
     {value:'Tennis',label:'Tennis'},
     {value:'Escape Room',label:'Escape Room'},
     {value:'Darts',label:'Darts'},
     {value:'Ping Pong',label:'Ping Pong'},
     {value:'Arcade',label:"Arcade"},
     {value:'Shuffle Board',label:'Shuffle Board'},
     {value:'Spa',label:'Spa'},
     {value:'Gym',label:'Gym'},
     {value:'Swimming',label:"Swimming"},
     {value:'Indoor Golf',label:'Indoor Golf'},
     {value:'Theatre',label:'Theatre'},
   ];
   const value=props.selected?props.selected.map((val)=>val.name):''
  const [selected, setSelected] = useState(value?value:[]);

  useEffect(()=>
  {
    props.onSelectIndoorActivity(selected)
  },[selected])
console.log('selected',selected)
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

export default SelectIndoorActivities;
