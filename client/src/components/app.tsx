import React, { useEffect, useState } from "react";
import socketIoClient from "socket.io-client";

import {
  ClientServerMessageName,
  ClientServerMessageType,
} from "../../../server/src/types";

import StaticMarkup from "./staticMarkup";
import PlaygroundMarkup from "./playgroundMarkup";

import faviconOnline from "../assets/favicon-online.png";
import faviconOffline from "../assets/favicon-offline.png";

import "./app.scss";

enum ConnectionState {
  OFFLINE,
  ONLINE,
}

enum RenderSetting {
  PLAYGROUND = "playground",
  STATIC = "static",
}

const App: React.FC = () => {
  const [connectionState, setConnectionState] = useState(
    ConnectionState.OFFLINE
  );

  const [markup, setMarkup] = useState("");

  const [renderSetting, setRenderSetting] = useState<RenderSetting | undefined>(
    undefined
  );

  useEffect(() => {
    const LOCAL_STORAGE_KEY = "testing-library-spy-render-setting";
    if (renderSetting === undefined) {
      const savedRenderSetting = window.localStorage.getItem(LOCAL_STORAGE_KEY);

      if (
        savedRenderSetting &&
        Object.values(RenderSetting).includes(
          savedRenderSetting as RenderSetting
        )
      ) {
        setRenderSetting(savedRenderSetting as RenderSetting);
      } else {
        setRenderSetting(RenderSetting.PLAYGROUND);
      }
    } else {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, renderSetting);
    }
  }, [renderSetting, setRenderSetting]);

  useEffect(() => {
    const socket = socketIoClient();

    socket.on("connect", () => setConnectionState(ConnectionState.ONLINE));
    socket.on("disconnect", () => setConnectionState(ConnectionState.OFFLINE));

    socket.on(ClientServerMessageName, (message: ClientServerMessageType) => {
      // console.log("Received message", message);
      setMarkup(message);
    });

    return () => {
      socket.close();
    };
  }, [setConnectionState, setMarkup]);

  useEffect(() => {
    const link = document.head.querySelector<HTMLLinkElement>(
      'link[rel="icon"]'
    );
    if (!link) {
      throw new Error("Could not find favicon element");
    }

    link.href =
      connectionState === ConnectionState.ONLINE
        ? faviconOnline
        : faviconOffline;
  }, [connectionState]);

  const handleRenderSettingClick: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setRenderSetting(e.currentTarget.value as RenderSetting);
  };

  return (
    <>
      <header>
        <h1>
          <a href=".">Testing Library Spy</a>
        </h1>
        <ul>
          <li className="app__preview__connection-state">
            {connectionState === ConnectionState.ONLINE ? (
              <>💡 Alive</>
            ) : (
              <>💤 Offline</>
            )}
          </li>
          <li className="app__preview__selection">
            <span>Render in:</span>
            <label>
              <input
                type="radio"
                name="render"
                value={RenderSetting.PLAYGROUND}
                checked={renderSetting === RenderSetting.PLAYGROUND}
                onChange={handleRenderSettingClick}
              />
              Testing Playground
            </label>
            <label>
              <input
                type="radio"
                name="render"
                value={RenderSetting.STATIC}
                checked={renderSetting === RenderSetting.STATIC}
                onChange={handleRenderSettingClick}
              />
              Offline
            </label>
          </li>
          <li>
            <a
              href="https://github.com/michal-kocarek/testing-library-spy"
              target="_blank"
            >
              Documentation
            </a>
          </li>
        </ul>
      </header>
      <section className="app__markup">
        {renderSetting === RenderSetting.PLAYGROUND ? (
          <PlaygroundMarkup markup={markup} />
        ) : (
          <StaticMarkup markup={markup} />
        )}
      </section>
    </>
  );
};

export default App;
