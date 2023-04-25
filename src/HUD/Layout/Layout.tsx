import { ApexLegendsState, Squad } from "apexlegendsgsi/types/apexlegends";
import React from "react";
import { uuid } from "uuidv4";
import { Match } from "../../api/interfaces";
import { actions, ApexLegends } from "../../App";
import FullScreenScoreboard from "../FullScreenScoreboard";
import HUDPopup, { EventTypes } from "../HUDPopup";
import ObservedPlayer from "../ObservedPlayer";
import ObservedTeam from "../ObservedTeam";
import TeamComparison from "../TeamComparison";
import TeamDetails from "../TeamDetails";
import TopbarScoreboard from "../TopbarScoreboard";

interface Props {
  game: ApexLegendsState;
  match: Match | null;
}

interface State {
  showFullScreenScoreboard: boolean;
  showTeamComparison: boolean;
  showTeamDetails: boolean;
  currentlyShownLeaderboardPart: number;
  events: { title: string; content: string; id: string; type: EventTypes }[];
  leaderBoardTeams: Squad[];
  leaderBoardMode: "top3" | "continous";
}

const TOPBAR_LEADERBOARD_TIME_DISPLAYING = 6;

const ignoreSpectator = (squads: Squad[]) =>
  squads.filter((squad) => squad.name !== "Spectator");

export default class Layout extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showFullScreenScoreboard: false,
      showTeamComparison: false,
      showTeamDetails: false,
      currentlyShownLeaderboardPart: 0,
      events: [],
      leaderBoardTeams: [],
      leaderBoardMode: "top3",
    };
  }
  componentDidMount() {
    let loop: NodeJS.Timeout | null = null;

    actions.on("toggleLeaderboardMode", () => {
      if (loop) {
        clearInterval(loop);
      }

      this.setState({
        leaderBoardMode: this.state.leaderBoardMode === "top3"
          ? "continous"
          : "top3",
        currentlyShownLeaderboardPart: 0,
        leaderBoardTeams: ignoreSpectator(this.props.game.sortedSquads),
      }, () => {
        if (this.state.leaderBoardMode === "continous") {
          loop = setInterval(() => {
            let newSection = this.state.currentlyShownLeaderboardPart + 3;
            if (newSection >= this.props.game.squads.length) {
              newSection = 0;
            }

            this.setState({
              leaderBoardTeams: newSection === 0
                ? ignoreSpectator(this.props.game.sortedSquads)
                : this.state.leaderBoardTeams,
              currentlyShownLeaderboardPart: newSection,
            });
          }, TOPBAR_LEADERBOARD_TIME_DISPLAYING);
        }
      });
    });
    actions.on("toggleFullscreenScoreboard", () => {
      this.setState({
        showFullScreenScoreboard: !this.state.showFullScreenScoreboard,
      });
    });
    actions.on("toggleTeamComparison", () => {
      this.setState({ showTeamComparison: !this.state.showTeamComparison });
    });
    actions.on("toggleTeamDetails", () => {
      this.setState({ showTeamDetails: !this.state.showTeamDetails });
    });

    const addEvent = (title: string, content: string, type: EventTypes) => {
      const id = uuid();
      this.setState({
        events: [...this.state.events, { title, content, id, type }],
      });
      setTimeout(() => {
        this.setState({ events: this.state.events.filter((x) => x.id !== id) });
      }, 5000);
    };
    ApexLegends.on("playerKilled", (event) => {
      addEvent(
        "Player killed!",
        `${event.attacker.name} killed ${event.victim.name} using ${event.weapon}`,
        "playerKilled",
      );
    });
    ApexLegends.on("squadEliminated", (event) => {
      addEvent(
        "Squad eliminated!",
        `${event.players[0].teamName} was defeated!`,
        "squadEliminated",
      );
    });
    ApexLegends.on("inventoryPickUp", (event) => {
      addEvent(
        "Item picked up!",
        `${event.player.name} picked up ${event.quantity}x ${event.item}!`,
        "inventoryPickUp",
      );
    });
    console.log("apex legends sdasdaf");
  }

  render() {
    const { game } = this.props;
    const { currentlyShownLeaderboardPart, leaderBoardMode, leaderBoardTeams } =
      this.state;
    const observedPlayer = game.players.find((x) =>
      x.name === game.observedPlayer
    );
    const observedSquad = game.squads.find((x) =>
      x.players.find((p) => p.name === game.observedPlayer)
    );

    const sortedSquads = ignoreSpectator(game.sortedSquads);
    return (
      <div className="layout">
        <FullScreenScoreboard
          show={this.state.showFullScreenScoreboard}
          squads={sortedSquads}
        />
        <TopbarScoreboard
          show={true}
          squads={leaderBoardMode === "top3" ? sortedSquads : leaderBoardTeams}
          startAt={currentlyShownLeaderboardPart}
          count={3}
        />
        <TeamComparison
          squads={sortedSquads}
        />
        <TeamDetails
          squads={sortedSquads}
        />
        {/*<ObservedPlayer show={true} player={observedPlayer}/>*/}
        <ObservedTeam
          show={true}
          squad={observedSquad}
          observed={observedPlayer ? observedPlayer.name : undefined}
        />
        <HUDPopup show={true} events={this.state.events} />
      </div>
    );
  }
}
