import { AbilityLog, ItemLog, Squad } from "apexlegendsgsi/types/apexlegends";
import React from "react";
import "./index.scss";

const TeamPanel = ({ squad, right }: { squad: Squad; right: boolean }) => {
  const damageDone = squad.players.reduce(
    (p, x) =>
      x.type === "playing"
        ? x.damageLog.map((x) => x.damage).reduce((pr, dam) => dam + pr, 0)
        : p,
    0,
  );
  return (
    <div>
      <div style={{ fontSize: '78px', textAlign: 'center', marginBottom: 90, textTransform: 'uppercase'}}>{squad.name}</div>
    <div
      className="player-tab team-based"
      style={right ? { float: "right" } : { float: "left" }}
    >
      <div className="top">
        {squad.players.map((x) => (
          <div className="avatar">
            {x.extension && x.extension.avatar ? <img src={x.extension.avatar} /> : null }
          </div>
        ))}
      </div>
      <div className="content">
        {/*<h3>{squad.teamExtension ? squad.teamExtension.name : squad.name}</h3>*/}
        <div className="team-players">
          {squad.players.map((x) => (
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
              {squad.players.reduce(
                (p, x) => x.type === "playing" ? x.kills + p : p,
                0,
              )}
            </span>
          </div>
          <div className="entry">
            Knockdowns:{" "}
            <span className="value">
              {squad.players.reduce(
                (p, x) => x.type === "playing" ? x.knockdowns + p : p,
                0,
              )}
            </span>
          </div>
          <div className="entry">
            Skills used:{" "}
            <span className="value">
              {squad.players.reduce(
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
              {Math.round(
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
  { show, squadLeft, squadRight }: {
    show: boolean;
    squadLeft: Squad;
    squadRight: Squad;
  },
) => {
  if (!show) return <div></div>;

  return (
    <div className="team-comparison">
      <TeamPanel right={false} squad={squadLeft} />
      <TeamPanel right={true} squad={squadRight} />
    </div>
  );
};

export default TeamComparison;
