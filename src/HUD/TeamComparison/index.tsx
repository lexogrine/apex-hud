import { AbilityLog, ItemLog, Squad } from "apexlegendsgsi/types/apexlegends";
import React, { useEffect, useState } from "react";
import "./index.scss";
import { configs } from "../../App";
import { Logo } from "../Logo";

const TeamPanel = ({ squad, right }: { squad?: Squad; right: boolean }) => {
  const damageDone = !squad ? 0 : squad.players.reduce(
    (p, x) =>
      x.type === "playing"
        ? x.damageLog.map((x) => x.damage).reduce((pr, dam) => dam + pr, 0)
        : p,
    0,
  );
  return (
    <div className="team-panel-heading">
      <div style={{ fontSize: '78px', textAlign: 'center', marginBottom: 90, textTransform: 'uppercase'}}><Logo squad={squad} /> {!squad ? null : (squad.teamExtension ? squad.teamExtension.name : squad.name)}</div>
    <div
      className="player-tab team-based"
      style={right ? { float: "right" } : { float: "left" }}
    >
      <div className="top">
        {!squad ? null : squad.players.map((x) => (
          <div className="avatar">
            {x.extension && x.extension.avatar ? <img src={x.extension.avatar} /> : null }
          </div>
        ))}
      </div>
      <div className="content">
        {/*<h3>{squad.teamExtension ? squad.teamExtension.name : squad.name}</h3>*/}
        <div className="team-players">
          {!squad ? null : squad.players.map((x) => (
            <div className="team-player">
              <div className="playername">
                {x.extension ? x.extension.name : x.name}
              </div>
              <div className="hero">{x.character}</div>
            </div>
          ))}
        </div>
        <div className="details">
          <div className="entry">
            Damage dealt: <span className="value">{damageDone}</span>
          </div>
          <div className="entry">
            Kills:{" "}
            <span className="value">
              {!squad ? 0 : squad.players.reduce(
                (p, x) => x.type === "playing" ? x.kills + p : p,
                0,
              )}
            </span>
          </div>
          <div className="entry">
            Knockdowns:{" "}
            <span className="value">
              {!squad ? 0 : squad.players.reduce(
                (p, x) => x.type === "playing" ? x.knockdowns + p : p,
                0,
              )}
            </span>
          </div>
          <div className="entry">
            Skills used:{" "}
            <span className="value">
              {!squad ? 0 : squad.players.reduce(
                (p, x) =>
                  x.type === "playing" ? x.abilitiesUsedLog.concat(p) : p,
                [] as AbilityLog[],
              ).map(
                (x) => x.ability,
              ).length}
            </span>
          </div>
          <div className="entry">
            Distance run:{" "}
            <span className="value">
              {!squad ? 0 : Math.round(
                squad.players.reduce((p, x) =>
                  x.type === "playing" ? x.distanceRun + p : p, 0),
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
      
      </div>
  );
};

const TeamComparison = (
  { squads }: {
    squads: Squad[];
  },
) => {
  const [ show, setShow ] = useState(false);
  const [ tname, setName ] = useState('');
  const [ leftTeamId, setLeftTeamId ] = useState('');
  const [ rightTeamId, setRightTeamId ] = useState('');
  

  useEffect(() => {
    const onData = (data: any) => {
      if(!data) return;
      if(data.general){
        setName(data.general.tournament_name || '');
      }
      if(!data || !data.team_comparison) return;
      setLeftTeamId(data.team_comparison.team_1.id || '');
      setRightTeamId(data.team_comparison.team_2.id || '');
      setShow(data.team_comparison.show);
    }
    configs.onChange(onData);
    onData(configs.data);

    return () => {
      configs.listeners = configs.listeners.filter(cfg => cfg !== onData);
    }
  }, []);

  const squadLeft = squads.find(sq => sq.teamExtension && sq.teamExtension.id === leftTeamId);
  const squadRight = squads.find(sq => sq.teamExtension && sq.teamExtension.id === rightTeamId);

  return (
    <div className={`team-comparison ${show ? 'show':''}`}>
      <div className="tournament-title-bar">{tname}</div>
      <TeamPanel right={false} squad={squadLeft} />
      <TeamPanel right={true} squad={squadRight} />
    </div>
  );
};

export default TeamComparison;
