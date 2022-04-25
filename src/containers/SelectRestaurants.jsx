import React, { useState,useEffect } from "react";
import ReactDOM from "react-dom";
import MultiSelect from "react-multi-select-component";

const SelectRestaurants = (props) => {
  const options = [
    {label:"Italian",value:"Italian"},
     {value:'American',label:"American"},
     {value:'Greek',label:"Greek"},
     {value:'Desi',label:'Desi'},
     {value:'Polish',label:'Polish'},
     {value:'Russian',label:"Russian"},
     {value:'Jewish',label:'Jewish'},
     {value:'African',label:'African'},
     {value:'British',label:'British'},
     {value:'Peruvian',label:'Peruvian'},
     {value:'French',label:'French'},
     {value:'Hawaiian',label:'Hawaiian'},
     {value:'German',label:'German'},
     {value:'Salvadorian',label:'Salvadorian'},
     {value:'Thai',label:"Thai"},
     {value:'Latvian',label:'Latvian'},
     {value:'Mexican',label:'Mexican'},
     {value:'Sweedish',label:'Sweedish'}
   ];
   console.log("options",options)
   const value=props.selected?props.selected.map((val)=>val.name):''
   const [selected, setSelected] = useState(value?value:[]);  useEffect(()=>
  {
    props.onSelectRestaurants(selected)
  },[selected])

  return (
    <div>
      <MultiSelect
        options={options}
        selected={selected}
        onChange={setSelected}
        labelledBy={"Select"}
      />
    </div>
  );
};

export default SelectRestaurants;
