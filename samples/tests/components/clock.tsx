import React, { useEffect, useState } from "react";

export const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <>
      <h1>Very fancy clock</h1>
      <p>Current time is: {time.toISOString()}</p>
    </>
  );
};
