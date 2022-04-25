import React,{useState} from 'react'
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
  } from "react-places-autocomplete";
function AddressSuggestion(props) {
    const [address,setAddress] = useState('')
   function extractFromAdress(components, type){
        for (var i=0; i<components.length; i++)
            for (var j=0; j<components[i].types.length; j++)
                if (components[i].types[j]==type) return components[i].long_name;
        return "";
    }
//    const handleAddressChange = async (address)=>{
//         setAddress(address)
       
//         console.log('address',address)
//       }
    // const   handleSelect = async (address) => {
    //     console.log("This is the dares", address);
    // //     try{
    // //       const results = await geocodeByAddress(address);
    // //       console.log('results = ',results)
    
    // //       if(results.length>0) {
    
    // //           const addressComponents=results[0].address_components;
    // //           console.log('addressComponents = ',addressComponents)
    // //           const latLng = await getLatLng(results[0]);
    // //           var userZipCode = this.extractFromAdress(addressComponents, "postal_code");
    // //           var userCity = this.extractFromAdress(addressComponents, "locality");
    // //           var userState = this.extractFromAdress(addressComponents, "administrative_area_level_1");
    // //           //address=extractFromAdress(addressComponents, "political");
    // //           var useraddress = this.extractFromAdress(addressComponents,"description")
    // //           localStorage.setItem(
    // //               "userCurrentLocation",
    // //               JSON.stringify({latitude: latLng.lat, longitude: latLng.lng})
    // //           );
             
    // //       }
    
    
    // //   }catch (e) {
    // //       console.error("Error", e)
    // //   }
    //   setAddress(address)
    //   props.address=address
    //   };
  return (
    <div>  
   <PlacesAutocomplete
    name="Address"
    value={props.address}
    onChange={props.handleAddressChange}
    onSelect={props.handleSelect}
    >
       {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div style={{ width: "100%" }}>
          <input
            {...getInputProps({
              placeholder: "Search Location ...",
              className: "location-search-input",
            })}
            style={{width:'100%'}}
          />
          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion) => {
              console.log("suggestions",suggestion)
              const className = suggestion.active
                ? "suggestion-item--active"
                : "suggestion-item";
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: "#fafafa", cursor: "pointer" }
                : { backgroundColor: "#ffffff", cursor: "pointer" };
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                >

                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )} 
   </PlacesAutocomplete></div>
  )
}

export default AddressSuggestion