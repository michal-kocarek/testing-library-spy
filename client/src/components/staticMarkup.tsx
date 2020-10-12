import React from "react";

import "./staticMarkup.scss";

type Props = {
  markup: string;
};

const StaticMarkup: React.FC<Props> = ({ markup }) => {
  if (!markup) {
    return (
      <div className="static-markup__no-markup">
        <p>
          No data has been sent from Testing Library Spy server yet. Make sure:
        </p>
        <ul>
          <li>server is running,</li>
          <li>Spy has been initialized,</li>
          <li>something has been rendered using React Testing Library</li>
        </ul>
        <p>
          If all steps happened, try advancing few lines of code with a
          debugger.
        </p>
      </div>
    );
  }

  return (
    <>
      <h2 className="static-markup__heading">Rendered markup:</h2>
      <section
        className="static-markup__markup"
        onClick={(e) => {
          e.preventDefault();
        }}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </>
  );
};

export default StaticMarkup;
