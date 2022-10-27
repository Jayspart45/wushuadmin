import { useEffect, useRef, useState } from "react";
import "./App.css";
import { getDocument, setDocument } from "./firebase/fireStore";
import { deleteFile, fileUpload } from "./firebase/storage";
import Popup from "./components/popup/Popup";
function App() {
  const [event, setEvent] = useState({ Status: false, Data: [] });
  const [pressed, setPressed] = useState(false);
  const [popupIndex,setPopupIndex] = useState(-1);
  const [deletedTitles, setDeletedTitles] = useState([]);
  const [popup,setPopup]=useState(false);
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      initEvent();
    } else {
    }
  }, [pressed]);
  const initEvent = async () => {
    setEvent(await getDocument("list"));
  };
  const saveEvent = async (dh:any) => {
    console.log();
    deletedTitles.forEach((d) => {
      deleteFile("achivement", d["Title"]);
      deleteFile("brochure", d["Title"]);
    });
    alert("saved");

    await setDocument(dh,"list");
  };
  const remove = (i: number) => {
    const data = event.Data;
    const deletedData = data[i];
    const dataList = deletedTitles;
    dataList.push(deletedData);
    setDeletedTitles(dataList);
    data.splice(i, 1);
    setEvent({ Status: true, Data: data });
  };
  const add = async () => {
    const title = document.getElementById("title")?.value,
      discription = document.getElementById("discription")?.value,
      image = document.getElementById("image")?.files[0],
      brochure = document.getElementById("brochure")?.files[0];
      if(title=='' || discription=='' || !image || !brochure){
        alert("fill all the fields to add an event");
        return;
      }
      const random = Math.floor((Math.random() * 10000) + 1)
    console.log(await fileUpload(image, "event", title+"_"+random));
    console.log(await fileUpload(brochure, "brochure", title+"_"+random));
    
    const data = event.Data;
    const js = {
      Title: title,
      Discription: discription,
      ImageUrl:
        "https://firebasestorage.googleapis.com/v0/b/priortizer.appspot.com/o/event%2F" +
        title+"_"+random+
        "?alt=media",
      brochure:
        "https://firebasestorage.googleapis.com/v0/b/priortizer.appspot.com/o/brochure%2F" +
        title+"_"+random+
        "?alt=media",
    };
    data.unshift(js);
    setEvent({ Status: true, Data: data });
    document.getElementById("add-event")?.remove();
    setPressed(true);
    saveEvent(event)
  };
  const moveBack = (i: number, change: number) => {
    const data = event.Data;
    const temp = data[i];
    data.splice(i, 1);
    console.log(
      i + change > event.Data.length ? event.Data.length : i + change
    );

    data.splice(
      i + change > event.Data.length ? event.Data.length : i + change,
      0,
      temp
    );
    setEvent({ Status: true, Data: data });
    console.log(event);
  };
  const moveFront = (i: number, change: number) => {
    const data = event.Data;
    const temp = data[i];
    data.splice(i, 1);
    console.log(i - change <= 0 ? 0 : i - change);

    data.splice(i - change <= 0 ? 0 : i - change, 0, temp);
    setEvent({ Status: true, Data: data });
    console.log(event);
  };
  const createInput = (
    title: string,
    onChange: any,
    id: string,
    type: string
  ) => {
    const input = document.createElement("input");
    input.type = type;
    input.placeholder = title;
    input.onchange = onChange;
    input.id = id;
    input.value = "";
    return input;
  };
  const addEvent = () => {
    const div = document.createElement("div");
    div.className = "card";
    div.id = "add-event";
    div.appendChild(createInput("Title", () => { }, "title", "text"));
    div.appendChild(
      createInput("Discription", () => { }, "discription", "text")
    );
    div.appendChild(document.createElement('br'));
    const imageLabel = document.createElement("label");
    imageLabel.innerText = "Image:";
    div.appendChild(imageLabel);
    div.appendChild(createInput("Image", () => { }, "image", "file"));
    const brochureLabel = document.createElement("label");
    brochureLabel.innerText = "Brochure";
    div.appendChild(brochureLabel);
    div.appendChild(createInput("brochure", () => { }, "brochure", "file"));
    const button = document.createElement("button");
    button.textContent = "add event";
    button.onclick = () => {
      console.log("button click");
      add();
    };
    div.appendChild(button);
    document.getElementById("row")?.prepend(div);
  };
  const eventlog =()=>{
    console.log(event);
    
    return <></>
  }
  return (<>
    <div className="App">
      <h1>Events</h1>
      <div className="achivement">
        <div className="row" id="row">
        {eventlog()}
          {event.Data
            ? event.Data.map((d, i) => {
              return (
                <>
                  <div className="card">
                    <img src={d["ImageUrl"]} className="card-img-top img-fluid" alt="..."/>
                    
                    <div className="card-body">
                      <h3 className="card-title text-center">
                        {(i+1)}. { d["Title"]}
                      </h3>
                      <div className="buttons">
                      <button className="btn btn-primary" onClick={() => remove(i)} >remove</button>
                      <button className="btn btn-primary" onClick={() => {setPopupIndex(i);setPopup(true)}}>edit</button>
                      <button className="btn btn-primary" onClick={() => moveFront(i, 1)} >movefront</button>
                      <button className="btn btn-primary" onClick={() => moveBack(i, 1)}>moveback</button>
                      </div>
                    </div>
                  </div>
                </>
              );
            })
            : ""}
        </div>
            <Popup reRender = {true} trigger={popup} event = {event} setEvent = {setEvent} index = {popupIndex} setIndex ={setPopupIndex} setPopup ={setPopup} save= {saveEvent}  isDiscribed ={true}/>
      </div>
      <div className="bottom-btns">
        <button onClick={() => {addEvent();}}>addevent</button>
        <button onClick={() => saveEvent(event.Data)}>save</button>
      </div>
     
    </div>
    </>
  );
}

export default App;
