import React from "react";
import "./index.scss";
import { Events } from 'apexlegendsgsi/types/events';
import { ReactComponent as SquadEliminationIcon } from './squadEliminatedIcon.svg'
export type EventTypes = keyof Events;
export type ApexEvent = { title: string; content: string; id: string; type: EventTypes, icon?: React.ReactNode }


const formatter: { [K in EventTypes]?: (content: string) => { text: string, icon: React.ReactNode } } = {
  squadEliminated: (content) => ({ text: `${content} eliminated`, icon: <div className="event-icon"><SquadEliminationIcon height={27} width={20} /></div> }),
  ringStartClosing: () => ({ text: `RING IS CLOSING`, icon: <div className="event-icon"><div className="circle"></div></div> }),
  ringFinishedClosing: () => ({ text: `RING IS CLOSED`, icon: <div className="event-icon"><div className="circle"></div></div> }),
  playerKilled: (content) => ({ text: content, icon: null }),
  inventoryPickUp: (content) => ({ text: content, icon: null })
};

const Event = ({title, content, type, customIcon }: {title: string, content: string, type: EventTypes, customIcon?: React.ReactNode}) => {
  const eventFormatter = formatter[type];

  return <div className={`event ${type}`}>
    <div className="content">{eventFormatter ? <>{eventFormatter(content).icon } {customIcon || null} {eventFormatter(content).text}</> : ''}</div>
    <div className="border" />
  </div>;
}

const HUDPopup = ({events, show} : {events: ApexEvent[], show: boolean}) => {

  return <div className={`hud-popup-panel ${show ? 'show':''}`}> 
    {events.map(x => <Event title={x.title} content={x.content} type={x.type} customIcon={x.icon}/>)}
  </div>;
}

export default HUDPopup;