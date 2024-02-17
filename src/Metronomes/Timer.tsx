import { addSeconds, format, startOfDay } from "date-fns";
import { useState } from "react";
import { useInterval } from "usehooks-ts";

type PropsT = {
  isPlaying: boolean;
};

const Timer = ({ isPlaying }: PropsT) => {
  const [seconds, setSeconds] = useState(0);

  useInterval(
    () => setSeconds(seconds + 1),
    isPlaying ? 1000 : null, // Delay in milliseconds or null to stop it
  );

  const formatTime = (time: number) => {
    const timeDate = addSeconds(startOfDay(new Date()), time);
    return format(timeDate, "mm:ss");
  };

  return (
    <div>
      <h1 className="font-mono secondary-content">{formatTime(seconds)}</h1>
    </div>
  );
};

export default Timer;
