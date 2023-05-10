import { ApexLegendsState, Squad } from "apexlegendsgsi/types/apexlegends";
import React from "react";
import { v4 } from "uuid";
import { Match } from "../../api/interfaces";
import { actions, ApexLegends, configs } from "../../App";
import FullScreenScoreboard from "../FullScreenScoreboard";
import HUDPopup, { ApexEvent, EventTypes } from "../HUDPopup";
import ObservedTeam from "../ObservedTeam";
import TeamComparison from "../TeamComparison";
import TeamDetails from "../TeamDetails";
import TopbarScoreboard from "../TopbarScoreboard";
import { Logo } from "../Logo";

interface Props {
  game: ApexLegendsState;
  match: Match | null;
}
interface State {
  showFullScreenScoreboard: boolean;
  showTeamComparison: boolean;
  showTeamDetails: boolean;
  currentlyShownLeaderboardPart: number;
  events: ApexEvent[];
  leaderBoardTeams: Squad[];
  event: ApexEvent | null;
  showEvent: boolean,
  leaderBoardMode: "top3" | "continous";
}

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

const TOPBAR_LEADERBOARD_TIME_DISPLAYING = 4;

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
      event: null,
      leaderBoardTeams: [],
      showEvent: false,
      leaderBoardMode: "top3",
    };
  }
  componentDidMount() {
    let loop: NodeJS.Timeout | null = null;


    const toggleLeaderBoardMode = () => {
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
          }, TOPBAR_LEADERBOARD_TIME_DISPLAYING*1000);
        }
      });
    };


    const onData = (data: any) => {
      if(!data || !data.general) return;
      const newTopboardMode =  data.general.topboard_mode || 'top3';
      if(this.state.leaderBoardMode === newTopboardMode) return;

      toggleLeaderBoardMode();
    }


    configs.onChange(onData);
    onData(configs.data);

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

    const showNextEvent = async () => {
      if(this.state.showEvent || this.state.event) return;

      const nextEvent = this.state.events[0];
      if(!nextEvent) return;

      this.setState({ showEvent: true, event: nextEvent });
      
      await wait(4500);

      this.setState({ showEvent: false }, async () => {
        await wait(550);
        this.setState({ events: this.state.events.filter(ev => ev !== nextEvent), event: null }, () => {
          showNextEvent();
        })
      });

    }

    const addEvent = (content: string, type: EventTypes, icon?: React.ReactNode) => {
      const id = v4();
      const newEvent = { content, id, type, icon }
      console.log(`NEW EVENT`, newEvent);
      this.setState({
        events: [...this.state.events, newEvent],
      }, () => {
          showNextEvent();
      });

    };
    ApexLegends.on("ringStartClosing", () => {
      addEvent(
        'Ring closing',
        'ringStartClosing',
      )
    });
    ApexLegends.on("ringFinishedClosing", () => {
      addEvent(
        'Ring closed',
        'ringFinishedClosing',
      )
    });
    ApexLegends.on("squadEliminated", async (event: any) => {
      const squad = this.props.game.squads.find(sq => sq.players.some(player => player.name === event.players[0].name));
      if(!squad) return;
      const amountOfSquadsRemainings = this.props.game.squads.filter(squad => squad.name !== "Spectator" && squad.players.length > 0 && squad.players.some(player => player.type === "playing" && player.hp > 0)).length;
      addEvent(
        `${squad.teamExtension ? squad.teamExtension.name : squad.name} eliminated`,
        "squadEliminated",
        <Logo squad={squad} />
      );
      if(![3, 5, 10, 15].includes(amountOfSquadsRemainings)){
        return;
      }
      await wait(100);
      addEvent(
        `${amountOfSquadsRemainings}`,
        'squadsRemaining',

      );
    });
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
          order={!observedSquad ? 0 : sortedSquads.indexOf(observedSquad)+1}
        />
        <HUDPopup show={this.state.showEvent} events={this.state.event ? [this.state.event] : []} />
      </div>
    );
  }
}
