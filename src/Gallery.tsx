import { useEffect, useRef, useState } from 'react';
import './App.css';
import { getDocument, setDocument } from './firebase/fireStore';
import { deleteFile, fileUpload } from './firebase/storage';
import Popup from './components/popup/Popup';
function Gallery() {
    const [event, setEvent] = useState({ Status: false, Data: [] });
    const [pressed, setPressed] = useState(false);
    const [popupIndex, setPopupIndex] = useState(-1);
    const [deletedTitles, setDeletedTitles] = useState([]);
    const [popup, setPopup] = useState(false);
    const initialRender = useRef(true);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            initEvent();
        } else {
        }
    }, [pressed]);
    const initEvent = async () => {
        setEvent(await getDocument('gallery'));
    };
    const saveEvent = async (dh: any) => {
        console.log();
        deletedTitles.forEach((d) => {
            deleteFile('gallery', d['Title']);
        });
        alert('saved');

        await setDocument(dh, 'gallery');
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
        const title = document.getElementById('title')?.value,
            image = document.getElementById('image')?.files[0];
        if (title == '' || !image) {
            alert('fill all the fields to add an achivement');
            return;
        }
        const random = Math.floor(Math.random() * 10000 + 1);
        console.log(await fileUpload(image, 'gallery', title + '_' + random));

        const data = event.Data;
        const js = {
            Title: title,
            ImageUrl:
                'https://firebasestorage.googleapis.com/v0/b/priortizer.appspot.com/o/gallery%2F' +
                title +
                '_' +
                random +
                '?alt=media',
        };
        data.unshift(js);
        setEvent({ Status: true, Data: data });
        document.getElementById('add-event')?.remove();
        setPressed(true);
        saveEvent(data);
    };
    const moveBack = (i: number, change: number) => {
        const data = event.Data;
        const temp = data[i];
        data.splice(i, 1);
        console.log(i + change > event.Data.length ? event.Data.length : i + change);

        data.splice(i + change > event.Data.length ? event.Data.length : i + change, 0, temp);
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
    const createInput = (title: string, onChange: any, id: string, type: string) => {
        const input = document.createElement('input');
        input.type = type;
        input.placeholder = title;
        input.onchange = onChange;
        input.id = id;
        input.value = '';
        return input;
    };
    const addEvent = () => {
        const div = document.createElement('div');
        div.className = 'card';
        div.id = 'add-event';
        div.appendChild(createInput('Title', () => {}, 'title', 'text'));
        div.appendChild(document.createElement('br'));
        const imageLabel = document.createElement('label');
        imageLabel.innerText = 'Image:';
        div.appendChild(imageLabel);
        div.appendChild(createInput('Image', () => {}, 'image', 'file'));
        const button = document.createElement('button');
        button.textContent = 'add event';
        button.onclick = () => {
            console.log('button click');
            add();
        };
        div.appendChild(button);
        document.getElementById('row')?.prepend(div);
    };
    const eventlog = () => {
        console.log(event);

        return <></>;
    };
    return (
        <>
            <div className="App">
                <h1 className="text-center">Gallery</h1>
                <div className="achivement">
                    <div className="row" id="row">
                        {eventlog()}
                        {event.Data
                            ? event.Data.map((d, i) => {
                                  return (
                                      <>
                                          <div className="card">
                                              <div className="imgbox">
                                                  <img
                                                      src={d['ImageUrl']}
                                                      className="card-img-top img-fluid"
                                                      alt="..."
                                                  />
                                              </div>

                                              <div className="card-body">
                                                  <h3 className="card-title text-center">
                                                      {i + 1}. {d['Title']}
                                                  </h3>
                                                  <div className="buttons">
                                                      <button
                                                          className="btn btn-sm className="
                                                          onClick={() => remove(i)}
                                                      >
                                                          remove
                                                      </button>
                                                      <button
                                                          className="btn btn-sm className="
                                                          onClick={() => {
                                                              setPopupIndex(i);
                                                              setPopup(true);
                                                          }}
                                                      >
                                                          edit
                                                      </button>
                                                      <button
                                                          className="btn btn-sm className="
                                                          onClick={() => moveFront(i, 1)}
                                                      >
                                                          movefront
                                                      </button>
                                                      <button
                                                          className="btn btn-sm className="
                                                          onClick={() => moveBack(i, 1)}
                                                      >
                                                          moveback
                                                      </button>
                                                  </div>
                                              </div>
                                          </div>
                                      </>
                                  );
                              })
                            : ''}
                    </div>
                    <Popup
                        reRender={true}
                        trigger={popup}
                        event={event}
                        setEvent={setEvent}
                        index={popupIndex}
                        setIndex={setPopupIndex}
                        setPopup={setPopup}
                        save={saveEvent}
                        isDiscribed={false}
                    />
                </div>
                <div className="bottom-btns">
                    <button
                        className="btn"
                        onClick={() => {
                            addEvent();
                        }}
                    >
                        addevent
                    </button>
                    <button className="btn" onClick={() => saveEvent(event.Data)}>
                        save
                    </button>
                </div>
            </div>
        </>
    );
}

export default Gallery;
