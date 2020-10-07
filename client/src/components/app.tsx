import React, { useEffect, useState } from "react";
import socketIoClient from "socket.io-client";

import "./app.css";

// @ts-ignore
import faviconOnline from "../assets/favicon-online.png";
// @ts-ignore
import faviconOffline from "../assets/favicon-offline.png";

// const setStatus = (status: string) => {
//   @ts-ignore
//   document.getElementById("status").innerText = status;
// };
//
// const toggle = (online: boolean) => {
//   const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
//   if (!link) {
//     throw new Error("Link element was not found.");
//   }
//
//   link.setAttribute("href", online ? faviconOnline : faviconOffline);
// };
//
// let lastData: string | undefined;
//
// /**
//  * @type {string}
//  */
// const title = document.title;
//
//
//   document.addEventListener("DOMContentLoaded", () => {
//     const poll = async (nopoll = false) => {
//       toggle(true);
//
//       let response;
//       try {
//         response = await fetch("/data", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(nopoll ? { nopoll: true } : {}),
//         });
//       } catch (e) {
//         toggle(false);
//         setStatus("🛑 Disconnected!");
//
//         if (!(e instanceof TypeError)) {
//           console.error(e);
//         }
//
//         retryFail();
//         return;
//       }
//
//       if (!response.ok) {
//         toggle(false);
//         setStatus("🛑 Received non-OK response!");
//
//         console.error("Response not ok!");
//
//         retryFail();
//         return;
//       }
//
//       setStatus(`💡 Alive`);
//
//       const jsonResponse = await response.json();
//
//       if (jsonResponse.data) {
//         const { data } = jsonResponse;
//         if (lastData !== data) {
//           lastData = data;
//
//           const previousScript = document.getElementById("playground-script");
//           if (previousScript) {
//             previousScript.remove();
//           }
//
//           // @ts-ignore
//           document.getElementById("markup").innerHTML = data;
//           // @ts-ignore
//           document.getElementById("playground").innerHTML =
//             `
//               <template data-testing-playground data-height="500">
//                 <script type="text/html"><div>${data}</div><` +
//             `/script>
//
//                 <script type="text/javascript">screen.getByRole('button')<` +
//             `/script>
//               </template>
//             `;
//
//           // @ts-ignore
//           document.querySelector("head").appendChild(
//             (() => {
//               const script = document.createElement("script");
//               script.id = "playground-script";
//               script.async = true;
//               script.src = "https://testing-playground.com/embed.js";
//
//               return script;
//             })()
//           );
//         }
//       }
//
//       poll();
//     };
//
//     const retryFail = () => {
//       setTimeout(() => {
//         poll(true);
//       }, 5000);
//     };
//
//     poll(true);
//   });

enum ConnectionState {
  OFFLINE,
  ONLINE,
}

const App: React.FC = () => {
  const [connectionState, setConnectionState] = useState(
    ConnectionState.OFFLINE
  );

  const [markup, setMarkup] = useState("");

  useEffect(() => {
    const socket = socketIoClient();

    socket.on("connect", () => setConnectionState(ConnectionState.ONLINE));
    socket.on("disconnect", () => setConnectionState(ConnectionState.OFFLINE));

    // TODO: Extract spy:message somewhere, and type the message
    socket.on("spy:message", (message: string) => {
      console.log("Received message", message);
      setMarkup(message);
    });

    return () => {
      socket.close();
    };
  }, [setConnectionState, setMarkup]);

  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      throw new Error("Could not find favicon element");
    }

    link.href =
      connectionState === ConnectionState.ONLINE
        ? faviconOnline
        : faviconOffline;
  }, [connectionState]);

  return (
    <>
      <div id="status">
        {connectionState === ConnectionState.ONLINE ? (
          <>💡 Alive</>
        ) : (
          <>💤 Offline</>
        )}
      </div>
      <div id="markup" dangerouslySetInnerHTML={{ __html: markup }} />
      <div id="playground" />
    </>
  );
};

export default App;
