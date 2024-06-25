
import React ,{useRef}from 'react'
import {  Autocomplete } from '@react-google-maps/api'
function Stop({isLoaded, setwaypoint}) {
    /** @type React.MutableRefObject<HTMLInputElement> */
    const stopRef = useRef()
    return (
        <div className="Input" >
            <div className="inputField" type='text'><div className='stopIcon' ></div>{isLoaded && <Autocomplete onPlaceChanged={()=>{
             setwaypoint((preState)=>{
                 return [...preState,stopRef.current.value];
              })
            }}><input name="stop" placeholder="Stop" ref={stopRef}  ></input></Autocomplete>}</div>
        </div>
    )
}

export default Stop;