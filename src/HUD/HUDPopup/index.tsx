import React from "react";
import "./index.scss";

const Event = ({title, content}: {title: string, content: string}) => {
  return <div className="event">
    <h5>{title}</h5>
    <div>{content}</div>
  </div>;
}

const HUDPopup = ({events, show} : {events: {title: string, content: string}[], show: boolean}) => {
  if (!show) return <div></div>;

  return <div className="hud-popup-panel"> 
    {events.map(x => <Event title={x.title} content={x.content}/>)}
  </div>;
}

export default HUDPopup;