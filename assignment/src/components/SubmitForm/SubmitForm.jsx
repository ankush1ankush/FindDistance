/* eslint-disable */
import React, { useRef, useState } from 'react'
import "./SubmitForm.css"
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import CircularProgress from '@mui/joy/CircularProgress';
import { useJsApiLoader, GoogleMap, MarkerF, Autocomplete, DirectionsRenderer } from '@react-google-maps/api'
import { duration } from '@mui/material';
import Stop from '../Stop/Stop';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
const libraries = (process.env.REACT_APP_GOOGLE_LIBRARIES || '').split(',')
function SubmitForm() {
    const center = { lat: 48.8584, lng: 2.2945 }
    const { isLoaded = true } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyDtK4eWhcQoi3n8O9wMKRkqIXZdshs1Ee4",
        libraries: ["places"]
    })
    
    const [directionsResponse, setDirectionResponse] = useState(null)
    const [distance, setDistance] = useState(null)
    const [duaration, setDuration] = useState(null)
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [waypoints,setwaypoint] = useState([]);
    const [stopInput,setStopInput] = useState([]);
    const handleIncrease = ()=>{
        setStopInput([...stopInput,<Stop isLoaded={isLoaded} setwaypoint={setwaypoint}/>])
    }
    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef()
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destiantionRef = useRef()
    /** @type React.MutableRefObject<HTMLInputElement> */
    const stopRef = useRef()
    if (!isLoaded) {
        return <div className="progressDiv"></div>
    }
    function findWaypoint(){
       const waypointsArray= stopRef.current.value ? [{ location: stopRef.current.value }] : [];
       for(let i=0;i<waypoints.length;i++)
       {  
           const point = {
                 location: waypoints[i]
            }
            waypointsArray.push(point);
       }
       return waypointsArray
    } 
    async function calculateRoute() {
        if (originRef.current.value === '' || destiantionRef.current.value === '') {
            return
        }

        const directionsService = new google.maps.DirectionsService()
        console.log(stopRef.current.value)
        
        const results = await directionsService.route({
            origin: originRef.current.value,
            destination: destiantionRef.current.value,
            waypoints: findWaypoint(),
            travelMode: google.maps.TravelMode.DRIVING,
        })
        console.log(waypoints)

        setDirectionResponse(results)
        const legs=results.routes[0].legs || [];
        console.log(legs)
        let distanceInKm = 0;
        let etaHH = 0;
        for( let i=0;i<legs.length;i++)
        {
            distanceInKm = distanceInKm+legs[i].distance.value
            etaHH= etaHH+legs[i].duration.value
        }
        const originCity = originRef.current.value.split(",")[0]
        const destinationCity = destiantionRef.current.value.split(",")[0]
        setOrigin(originCity)
        setDestination(destinationCity)
        setDistance(distanceInKm/1000)
        setDuration(etaHH / 3600)
    }
    return (
        <div className='container' >
            <div className='heading'>Let's calculate <p className="headerBold">distance</p> from Google maps</div>
            <div className="submitForm">

                <div className="submitContainer">

                    <div className='formContainer'>
                        <div className="InputForm">

                            <div className="Input">
                                <label >Origin</label>

                                <div className="inputField" type='text'><div className='originIcon'></div> <Autocomplete  ><input name="origin" placeholder="Origin" ref={originRef}></input></Autocomplete></div>
                            </div>

                            <div className="Input" >
                                <label>Stop</label>
                                <div className="inputField" type='text'><div className='stopIcon' ></div> <Autocomplete ><input name="stop" placeholder="Stop" ref={stopRef} ></input></Autocomplete></div>
                            </div>
                            { 
                               stopInput.map((item,idex)=>{
                                      return item;
                               })
 
                            }
                              <div className='Addbutton' onClick={handleIncrease}> <AddCircleOutlineIcon/><div className="addContent">Add another stop</div></div>
                            
                            <div className="Input" >
                                <label>Destination</label>
                                <div className="inputField" type='text'><FmdGoodIcon />  <Autocomplete><input name="destination" placeholder="Destination" ref={destiantionRef}></input></Autocomplete></div>
                            </div>
                            
                        </div>
                        <div className="buttonContainer">
                        <button className="submitButton" onClick={calculateRoute}>Calculate</button>
                        </div>
                    </div>
                    {distance && duration &&
                        <div className="calculation">
                            <div className='distance'>
                                <div className='distanceText'>
                                    Distance
                                </div>
                                <div className='distanceValue'>
                                    {Number(distance).toFixed(2)} kms
                                </div>
                            </div>
                            <div className='message'>The distance between <p className='cityName' >{origin} </p> and <p className='cityName'> {destination}</p> via the selected route is {Number(distance).toFixed(2)} kms and ETA is {Number(duaration).toFixed(2)} hours </div>
                        </div>}
                </div>
                <div className="mapContainer">

                    {!isLoaded ? (<div className="progressDiv">
                        <CircularProgress />
                    </div>) : (<GoogleMap center={center} zoom={10} mapContainerStyle={{ width: '100%', height: '100%' }} options={{ zoomControl: false, streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}>
                        <MarkerF position={center} />
                        {
                            directionsResponse && <DirectionsRenderer directions={directionsResponse} />
                        }
                    </GoogleMap>)}

                </div>
            </div>
        </div>
    )
}

export default SubmitForm