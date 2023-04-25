import React from "react";
import "./index.scss";
import { Events } from 'apexlegendsgsi/types/events';
import { ReactComponent as SquadEliminationIcon } from './squadEliminatedIcon.svg'
export type EventTypes = keyof Events;


const formatter: { [K in EventTypes]?: (content: string) => { text: string, icon: React.ReactNode } } = {
  squadEliminated: (content) => ({ text: `${content} eliminated`, icon: <div className="event-icon"><SquadEliminationIcon height={27} width={20} /></div> }),
  ringStartClosing: () => ({ text: `RING IS CLOSING`, icon: <div className="event-icon"><div className="circle"></div></div> }),
  ringFinishedClosing: () => ({ text: `RING IS CLOSED`, icon: <div className="event-icon"><div className="circle"></div></div> })
};

const Event = ({title, content, type}: {title: string, content: string, type: EventTypes}) => {
  const eventFormatter = formatter[type];

  return <div className={`event ${type}`}>
    <div className="content">{eventFormatter ? <>{eventFormatter(content).icon } {eventFormatter(content).text}</> : ''}</div>
    <div className="border" />
  </div>;
}

const HUDPopup = ({events, show} : {events: {title: string, content: string, type: EventTypes}[], show: boolean}) => {
  if (!show) return <div></div>;

  return <div className="hud-popup-panel"> 
    {events.map(x => <Event title={x.title} content={x.content} type={x.type}/>)}
  </div>;
}

export default HUDPopup;