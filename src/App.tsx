import { IonApp, IonButton, IonContent, IonPage, IonText, IonToast } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { IonRouterOutlet } from "@ionic/react";
import { Route, useHistory, useLocation } from "react-router-dom";
import { lazy, Suspense, useCallback } from "react";
import type { ReactNode } from "react";
import { useGame } from "./hooks/useGame";

const HomeScreen = lazy(() => import("./screens/HomeScreen").then((m) => ({ default: m.HomeScreen })));
const GameLobbyScreen = lazy(() =>
  import("./screens/GameLobbyScreen").then((m) => ({ default: m.GameLobbyScreen }))
);
const RoomScreen = lazy(() => import("./screens/RoomScreen").then((m) => ({ default: m.RoomScreen })));
const RaceScreen = lazy(() => import("./screens/RaceScreen").then((m) => ({ default: m.RaceScreen })));
const ResultScreen = lazy(() =>
  import("./screens/ResultScreen").then((m) => ({ default: m.ResultScreen }))
);
const TugWarScreen = lazy(() =>
  import("./screens/TugWarScreen").then((m) => ({ default: m.TugWarScreen }))
);
const TugWarResultScreen = lazy(() =>
  import("./screens/TugWarResultScreen").then((m) => ({ default: m.TugWarResultScreen }))
);

const IonReactRouterWithChildren = IonReactRouter as unknown as (props: { children?: ReactNode }) => JSX.Element;

export default function App() {
  return (
    <IonApp>
      <IonReactRouterWithChildren>
        <AppRoutes />
      </IonReactRouterWithChildren>
    </IonApp>
  );
}

function AppContent({ game }: { game: ReturnType<typeof useGame> }) {
  const showReconnectToast = game.isReconnecting && game.phase !== "home";

  // Disconnected overlay
  if (game.socketState === "disconnected" && game.phase !== "home" && game.phase !== "game-lobby") {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-6 px-6">
        <IonToast
          isOpen={showReconnectToast}
          position="top"
          color="warning"
          message={`Reconnecting to room... attempt ${game.reconnectAttempt}`}
        />
        <IonToast
          isOpen={Boolean(game.error)}
          position="top"
          color="danger"
          message={game.error ?? ""}
          onDidDismiss={game.clearError}
        />
        <div className="text-6xl">😵</div>
        <IonText color="light" className="text-2xl font-bold">
          <h2>Disconnected</h2>
        </IonText>
        <IonText color="medium" className="text-center text-base">
          Connection lost. Go back to home and rejoin.
        </IonText>
        <IonButton
          onClick={game.leaveRoom}
          color="medium"
          fill="solid"
          className="px-8"
        >
          Back to Home
        </IonButton>
      </div>
    );
  }

  return (
    <>
      <IonToast
        isOpen={showReconnectToast}
        position="top"
        color="warning"
        message={`Reconnecting to room... attempt ${game.reconnectAttempt}`}
      />
      <IonToast
        isOpen={Boolean(game.error)}
        position="top"
        color="danger"
        message={game.error ?? ""}
        onDidDismiss={game.clearError}
      />

      <Suspense fallback={<RouteGuard title="Loading" message="Preparing screen..." actionLabel="Back to Home" onAction={game.backToHome} />}>
      <IonRouterOutlet>
        <Route exact path="/" render={() => <HomeScreen onSelectGame={game.selectGame} />} />

        <Route
          exact
          path="/lobby"
          render={() => (
            <GameLobbyScreen
              gameType={game.gameType}
              availableRooms={game.availableRooms}
              onCreateRoom={game.createRoom}
              onJoinRoom={game.joinRoom}
              onBack={game.backToHome}
            />
          )}
        />

        <Route
          exact
          path="/room/:roomId"
          render={() =>
            game.room ? (
              <RoomScreen
                room={game.room}
                playerId={game.playerId}
                onReady={game.setReady}
                onStart={game.startGame}
                onLeave={game.leaveRoom}
              />
            ) : (
              <RouteGuard
                title="Room Not Active"
                message="You are not connected to a room yet."
                actionLabel="Go to Lobby"
                onAction={game.backToHome}
              />
            )
          }
        />

        <Route
          exact
          path="/race"
          render={() =>
            game.room && game.room.gameType === "tap-race" ? (
              <RaceScreen
                room={game.room}
                playerId={game.playerId}
                countdown={game.countdown}
                raceProgress={game.raceProgress}
                phase={game.phase}
                onTap={game.tap}
              />
            ) : (
              <RouteGuard
                title="Race Unavailable"
                message="Join a Tap Race room first to access this route."
                actionLabel="Back to Home"
                onAction={game.backToHome}
              />
            )
          }
        />

        <Route
          exact
          path="/tug"
          render={() =>
            game.room && game.room.gameType === "tug-war" ? (
              <TugWarScreen
                room={game.room}
                playerId={game.playerId}
                countdown={game.countdown}
                tugState={game.tugState}
                phase={game.phase}
                onTap={game.tugTap}
              />
            ) : (
              <RouteGuard
                title="Tug Match Unavailable"
                message="Join a Tug of War room first to access this route."
                actionLabel="Back to Home"
                onAction={game.backToHome}
              />
            )
          }
        />

        <Route
          exact
          path="/result"
          render={() =>
            game.rankings.length > 0 ? (
              <ResultScreen
                rankings={game.rankings}
                playerId={game.playerId}
                onLeave={game.leaveRoom}
              />
            ) : (
              <RouteGuard
                title="No Race Results"
                message="Finish a race to see results here."
                actionLabel="Back to Home"
                onAction={game.backToHome}
              />
            )
          }
        />

        <Route
          exact
          path="/tug-result"
          render={() =>
            game.tugResult ? (
              <TugWarResultScreen
                result={game.tugResult}
                playerId={game.playerId}
                onLeave={game.leaveRoom}
              />
            ) : (
              <RouteGuard
                title="No Tug Results"
                message="Finish a tug match to see results here."
                actionLabel="Back to Home"
                onAction={game.backToHome}
              />
            )
          }
        />

        <Route
          render={() => (
            <RouteGuard
              title="Page Not Found"
              message="The route you requested does not exist."
              actionLabel="Back to Home"
              onAction={game.backToHome}
            />
          )}
        />
      </IonRouterOutlet>
      </Suspense>
    </>
  );
}

function RouteGuard({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="h-full flex flex-col items-center justify-center px-6 text-center gap-4">
          <IonText color="light">
            <h2 className="text-2xl font-bold">{title}</h2>
          </IonText>
          <IonText color="medium">
            <p>{message}</p>
          </IonText>
          <IonButton onClick={onAction} color="primary" fill="solid">
            {actionLabel}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}

function AppRoutes() {
  const history = useHistory();
  const location = useLocation();
  const navigate = useCallback(
    (path: string) => {
      history.replace(path);
    },
    [history]
  );

  const game = useGame({ navigate, pathname: location.pathname });

  return <AppContent game={game} />;
}
