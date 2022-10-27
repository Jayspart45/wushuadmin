import React, { useEffect, useRef, useState } from "react";
import "./Popup.css";
import "../../App.css";
 const Popup = (props: any)=> {
  const [d,setD] = useState(props.event.Data[props.index])
  const [pressed, setPressed] = useState(true);
  const initialRender = useRef(props.reRender);
  const handleEdit =async ()=>{
    const event = props.event.Data;
    event[props.index] = d;
    console.log(event);
    props.setEvent({ Status: true, Data: event });
    props.setPopup(false)
  }
  useEffect(()=>{
      props.setIndex(props.index?props.index:props.index)
      setD(props.event.Data[props.index]);
      console.log(props.index);
      console.log(d);
      
    
  })
  
  return props.trigger ? (
    <div className="popup">
      
      <div className="edit-card">
      <h2>Edit</h2>
        
        
        <button className="close-btn" onClick={() => props.setPopup(false)}>
          close
        </button>
        {/* <img src={d["ImageUrl"]} className="card-img-top img-fluid" alt="..."/>*/}
        <br />
        <label>Title: </label>
        <input id="title-edit"  type='text' placeholder="Title" value={d?d.Title:""} onChange={(e)=>{setD({...d,Title:e.target.value})}}></input>
        <br />
        {props.isDiscribed?<><label>Discription: </label><input id="discription-edit"  placeholder="Dicription" type='text' onChange={(e)=>{setD({...d,Discription:e.target.value})}} value={d?d.Discription:""} ></input></>:<></>}
        <div className="buttons">
        <button  onClick={() => {handleEdit();}}>
          save
        </button>
        </div>
        </div>
      </div>
  ) : (
    <></>
  );
}

export default Popup;
