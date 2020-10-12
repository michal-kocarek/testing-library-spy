import React, { useEffect, useRef, useState } from "react";

import "./playgroundMarkup.scss";

type Props = {
  markup: string;
};

const PlaygroundMarkup: React.FC<Props> = ({ markup }) => {
  const [isReady, setIsReady] = useState(false);

  const iframeWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const SCRIPT_ELEMENT_ID = "testing-playground-script";
    // https://github.com/testing-library/testing-playground#embedding
    const script = document.createElement("script");
    script.src = "https://testing-playground.com/embed.js";
    script.id = SCRIPT_ELEMENT_ID;

    document.head.appendChild(script);

    return () => {
      const testingPlaygroundScript = document.head.querySelector(
        `#${SCRIPT_ELEMENT_ID}`
      );
      if (testingPlaygroundScript) {
        document.head.removeChild(testingPlaygroundScript);
      }
    };
  }, []);

  useEffect(() => {
    const onMessageHandler = (e: MessageEvent) => {
      const iframe = iframeWrapper.current?.querySelector("iframe");

      if (e.data.source !== "embedded-testing-playground") {
        return;
      }

      if (!iframe?.contentWindow || e.source !== iframe.contentWindow) {
        return;
      }

      if (e.data.type === "READY") {
        setIsReady(true);
      }
    };

    window.addEventListener("message", onMessageHandler);

    return () => {
      window.removeEventListener("message", onMessageHandler);
    };
  }, [setIsReady]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const iframe = iframeWrapper.current?.querySelector("iframe");

    if (!iframe || !iframe.contentWindow) {
      return;
    }

    iframe.contentWindow.postMessage(
      { type: "UPDATE_DATA", markup },
      "https://testing-playground.com/"
    );
  }, [isReady, markup]);

  return (
    <div
      className="playground-markup__iframe-wrapper"
      ref={iframeWrapper}
      dangerouslySetInnerHTML={{
        __html: `
            <template data-testing-playground data-height="100%">
              <script type="text/html">
                Will be loaded by Testing Library Spy...
              </script>
            
              <script type="text/javascript">
                screen.getByRole('button');
              </script>
            </template>
          `,
      }}
    />
  );
};

export default PlaygroundMarkup;
