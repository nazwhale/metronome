import { addSeconds, format, startOfDay } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useInterval } from "usehooks-ts";

type PropsT = {
  isPlaying: boolean;
};

type Split = {
  seconds: number;
  isPlaying: boolean;
};

const Timer = ({ isPlaying }: PropsT) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const secondsRef = useRef(seconds); // Ref to track the current seconds value
  const [splits, setSplits] = useState<Split[]>([]);


  useInterval(
    () => {
      setSeconds(seconds + 1);
      secondsRef.current = seconds + 1; // Update the ref each second. So that we can use it in the useEffect hook
    },
    isPlaying || hasStarted ? 1000 : null, // Delay in milliseconds or null to stop it
  );

  // useEffect hook to update splits when isPlaying changes
  useEffect(() => {
    if (!hasStarted) setHasStarted(true); // Flag to indicate timer has started.
    if (secondsRef.current === 0) return // Ignore initial renders

    // Record a split whenever isPlaying changes.
    setSplits(currentSplits => [...currentSplits, { seconds: secondsRef.current, isPlaying: !isPlaying }]);
    setSeconds(0); // Reset for next split.
  }, [isPlaying]);

  const formatTime = (time: number) => {
    const timeDate = addSeconds(startOfDay(new Date()), time);
    return format(timeDate, "mm:ss");
  };

  return (
    <div>
      <h1 className="font-mono secondary-content">{formatTime(seconds)}</h1>
      {splits.map((split, i) => (
        <p key={i} className="text-sm" style={{ color: split.isPlaying ? 'green' : 'gray'}}>{formatTime(split.seconds)}</p>
      ))}
    </div>
  );
};

export default Timer;
