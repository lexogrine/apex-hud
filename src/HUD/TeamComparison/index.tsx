
import { AbilityLog, ItemLog, Squad } from "apexlegendsgsi/types/apexlegends";
import React from "react";
import "./index.scss";

const TeamPanel = ({squad, right} : {squad: Squad, right: boolean}) => {
  const damageDone = squad.players.reduce((p, x) => x.type === 'playing' ? x.damageLog.map(x => x.damage).reduce((pr, dam) => dam + pr, 0) : p, 0);
  return <div className="team-panel" style={right ? {float: 'right'} : {float: 'left'}}>
    <h3>{squad.teamExtension ? squad.teamExtension.name : squad.name}</h3>
    {squad.players.map(x => <h5>{x.extension ? x.extension.name : x.name}</h5>)}
    <h5 style={{margin: "0px"}}>Kills: {squad.players.reduce((p, x) => x.type === 'playing' ? x.kills + p : p, 0)} </h5>
    <h5 style={{margin: "0px"}}>Knockdowns: {squad.players.reduce((p, x) => x.type === 'playing' ? x.knockdowns + p : p, 0)} </h5>
    <h5 style={{margin: "0px"}}>Assists: {squad.players.reduce((p, x) => x.type === 'playing' ? x.assists + p : p, 0)} </h5>
    <h5 style={{margin: "0px"}}>Damage: {damageDone} </h5>
    <h5 style={{margin: "0px"}}>Items used:</h5>
    <h6 style={{margin: "0px"}}>Grenades: {squad.players.reduce((p, x) => x.type === 'playing' ? x.thrownGrenadesLog.length + p : p, 0)}</h6>
    {squad.players.reduce((p, x) => x.type === 'playing' ? x.usedItemLog.concat(p) : p, [] as ItemLog[]).map(
      x => x.item
    )}
    <h5 style={{margin: "0px"}}>Skills used:</h5>
    {squad.players.reduce((p, x) => x.type === 'playing' ? x.abilitiesUsedLog.concat(p) : p, [] as AbilityLog[]).map(
      x => x.ability
    )}
    <h5 style={{margin: "0px"}}>Distance run: {squad.players.reduce((p, x) => x.type === 'playing' ? x.distanceRun + p : p, 0)}</h5>
  </div>
}

const TeamComparison = ({ show, squadLeft, squadRight }: { show: boolean, squadLeft: Squad, squadRight: Squad }) => {
  if (!show) return <div></div>;

  return <div className="team-comparison">
    <TeamPanel right={false} squad={squadLeft}/>
    <TeamPanel right={true} squad={squadRight}/>
  </div>;
}

export default TeamComparison;