import React, {useState, useEffect, useCallback} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {Calendar,  momentLocalizer} from "react-big-calendar";
import moment from 'moment';
import localization from 'moment/locale/fr';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { addUser, getAll, suppUser , getById, updateUser} from "../../dist/modele/utilisateurs";
import {Button, FormText, Modal, ModalBody, ModalFooter} from "reactstrap";

moment.updateLocale('fr', localization);
const localizer = momentLocalizer(moment);
const defaultDate = new Date();

const show ={
display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center" ,
    border: '1px solid black',
    paddingTop: '30px',
}
const styles = {
    container: {
        width: "80wh",
        height: "60vh",
        margin: "2em"
    }
};

const buttonStyle = {
    backgroundColor: "green",
    marginLeft: "50%",
    borderRadius: "5px",
}


function Next() {
    const [events, setEvents] = useState([]);
    const [oneEvent, setOneEvent] = useState([]);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [eventId, setEventId] = React.useState(0);
    const [modal1Open, setModal1Open] = React.useState(false);
    const [updateEvent, setUpdateEvent] = React.useState(false);


useEffect(() => {
    getAll().then(res => {
        let mesEvents = [];
        res.map(event => {
            let monEvent = {
                id: event.id,
                title: event.title,
                start: event.start,
                end: event.end,
                description: event.description,
                categorie: event.categorie,
                transparence: event.transparence,
                location: event.location,
                statut: event.statut,
                nbMaj: event.nbMaj,
            }
            mesEvents.push(monEvent);
        }
        )
        setEvents(mesEvents)
    }
    )
}, []);

useEffect(() => {
    if(setModalOpen && eventId){
        let Event = [];
    getById(eventId).then(res => {
        Event = {
            id: res[0].id,
            title: res[0].title,
            start: res[0].start,
            end: res[0].end,
            description: res[0].description,
            categorie: res[0].categorie,
            location: res[0].location,
            statut: res[0].statut,
            nbMaj: res[0].nbMaj,
            transparence: res[0].transparence,
        }
            setOneEvent(Event)
    }
    )
    }
}, [modalOpen,eventId]);


const handleSubmit = (e) => {
    e.preventDefault();
    let title = e.target.title.value;
    let start = e.target.start.value || oneEvent.start;
    let end = (e.target.end && e.target.end.value) || oneEvent.end;
    let description = e.target.description.value;
    let categorie = e.target.categorie.value;
    let location = e.target.location.value;
    let statut = e.target.statut.value;
    let transparence = e.target.transparence.value;
    let nbMaj = e.target.nbMaj.value;
    let id = oneEvent.id;
    console.log(id, title, location, statut, transparence, new Date(start), new Date(end), description, categorie);
    updateUser(id, title, description, categorie,location,statut,transparence,nbMaj, new Date(start), new Date(end)).then(res => {
            console.log(res);
            setModalOpen(false);
            setUpdateEvent(false);
            setEventId(0);
            setOneEvent({});
            getAll().then(res => {
                let mesEvents = [];
                res.map(event => {
                    let monEvent = {
                        id: event.id,
                        title: event.title,
                        start: event.start,
                        end: event.end,
                        description: event.description,
                        categorie: event.categorie,
                        transparence: event.transparence,
                        location: event.location,
                        statut: event.statut,
                        nbMaj: event.nbMaj,
                    }
                    mesEvents.push(monEvent);
                }
                )
                setEvents(mesEvents)
            }
            )
        }
        )
}

const handleSubmitCreate = (e) => {
    e.preventDefault();
    let title = e.target.title.value;
    let start = e.target.start.value || oneEvent.start;
    let end = (e.target.end && e.target.end.value) || oneEvent.end;
    let description = e.target.description.value;
    let categorie = e.target.categorie.value;
    let location = e.target.location.value;
    let statut = e.target.statut.value;
    let transparence = e.target.transparence.value;
    let nbMaj = e.target.nbMaj.value;
    console.log( title, new Date(start), new Date(end), description, categorie);
    addUser( title, description, categorie,location,statut,transparence,nbMaj, new Date(start), new Date(end)).then(res => {
               setModal1Open(false);

                getAll().then(res => {
                    let mesEvents = [];
                    res.map(event => {
                        let monEvent = {
                            id: event.id,
                            title: event.title,
                            start: event.start,
                            end: event.end,
                            description: event.description,
                            categorie: event.categorie,
                            transparence: event.transparence,
                            location: event.location,
                            statut: event.statut,
                            nbMaj: event.nbMaj,
                        }
                        mesEvents.push(monEvent);
                    }
                    )
                    setEvents(mesEvents)
                }
            )
        }
    )
}

const handleDelete = useCallback(e => {
    suppUser(eventId).then(res => {
        setModalOpen(false);
        setEventId(0);
        setOneEvent({});
        getAll().then(res => {
            let mesEvents = [];
            res.map(event => {
                let monEvent = {
                    id: event.id,
                    title: event.title,
                    start: event.start,
                    end: event.end,
                }
                mesEvents.push(monEvent);
            }
            )
            setEvents(mesEvents)
        }
        )
    }
    )
}
, [eventId]);



    // console.log(events);
  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-javascript)</title>
      </Head>
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ -
          <Link href="/home">
            <a>Go to home page</a>
          </Link>
        </p>
      </div>
        <div style={styles.container}>
            <Button  onClick={() => setModal1Open(true)} style={buttonStyle} >Ajouter un evenement</Button>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                onSelectEvent={(e) => {setModalOpen(true) ; setEventId(e.id)}}
                views={ ["month"]}
                endAccessor="end"
                defaultDate={defaultDate}
                />
            <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
                <div className=" modal-header">
                    <button
                        aria-label="Close"
                        className=" close"
                        type="button"
                        onClick={() => setModalOpen(!modalOpen)}
                    >
                        <div aria-hidden={true}>Close modal X</div>
                    </button>
                    <Button onClick={(e) => handleDelete(e)}>Delete event</Button>
                </div>
                <div style={show} >
                    <span>Titre: {oneEvent.title}</span><br/>
                    <span>Description: {oneEvent.description}</span><br/>
                    <span>Categorie: {oneEvent.categorie}</span><br/>
                    <span>Location: {oneEvent.location}</span><br/>
                    <span>Statut: {oneEvent.statut}</span><br/>
                    <span>Transparence: {oneEvent.transparence}</span><br/>
                    <span>Nombre de modification: {oneEvent.nbMaj}</span><br/>
                </div>
                <form  onSubmit={(e) => handleSubmit(e)} method="post">
                    <label htmlFor="title">Title</label><br/>
                    <input type="text" id="title" name="title"   required /><br/>
                    <label htmlFor="description">Description</label><br/>
                    <input type="text" id="description" name="description"  /><br/>
                    <label htmlFor="categorie">Categorie</label><br/>
                    <input type="text" id="categorie" name="categorie"  /><br/>
                    <label htmlFor="location">Location</label><br/>
                    <input type="text" id="location" name="location"  /><br/>
                    <label htmlFor="statut">statut</label><br/>
                    <input type="text" id="statut" name="statut"  /><br/>
                    <label htmlFor="transparence">Transparence</label><br/>
                    <input type="text" id="transparence" name="transparence"  /><br/>
                    <label htmlFor="nbMaj">Nombre de modification</label><br/>
                    <input type="number" id="nbMaj" name="nbMaj"  /><br/>
                    <label htmlFor="start">Start:</label><br/>
                    <input type="date" id="start" name="start"  /><br/>
                    <label htmlFor="end">End:</label><br/>
                    <input type="date" id="end" name="end"  /><br/>
                    <button type="submit">Submit</button>
                </form>
            </Modal>

            <Modal toggle={() => setModal1Open(!modal1Open)} isOpen={modal1Open}>
                <div className=" modal-header">
                    <h5 className=" modal-title" id="exampleModalLabel">
                        {oneEvent.title}
                    </h5>
                    <button
                        aria-label="Close"
                        className=" close"
                        type="button"
                        onClick={() => setModal1Open(!modal1Open)}
                    >
                        <div aria-hidden={true}>Close modal X</div>
                    </button>
                </div>
                <form onSubmit={(e) => handleSubmitCreate(e)} method="post">
                    <label htmlFor="title">Title</label><br/>
                    <input type="text" id="title" name="title"   required /><br/>
                    <label htmlFor="description">Description</label><br/>
                    <input type="text" id="description" name="description"  /><br/>
                    <label htmlFor="categorie">Categorie</label><br/>
                    <input type="text" id="categorie" name="categorie"  /><br/>
                    <label htmlFor="location">Location</label><br/>
                    <input type="text" id="location" name="location"  /><br/>
                    <label htmlFor="statut">statut</label><br/>
                    <input type="text" id="statut" name="statut"  /><br/>
                    <label htmlFor="transparence">Transparence</label><br/>
                    <input type="text" id="transparence" name="transparence"  /><br/>
                    <label htmlFor="nbMaj">Nombre de modification</label><br/>
                    <input type="number" id="nbMaj" name="nbMaj"  /><br/>
                    <label htmlFor="start">Start</label><br/>
                    <input type="date" id="start" name="start"  /><br/>
                    <label htmlFor="end">End</label><br/>
                    <input type="date" id="end" name="end"  /><br/>
                    <button type="submit">Submit</button>
                </form>
            </Modal>
        </div>
    </React.Fragment>
    )
}


export default Next;
