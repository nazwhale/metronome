import { addSeconds, format, startOfDay } from "date-fns";
import { useEffect, useState } from "react";

type PropsT = {
  isPlaying: boolean;
};

const Timer = ({ isPlaying }: PropsT) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      // @ts-expect-error: for some reason using node types here
      clearInterval(interval as NodeJS.Timeout);
    }

    return () => clearInterval(interval as NodeJS.Timeout);
  }, [isPlaying]);

  const formatTime = (time: number) => {
    const timeDate = addSeconds(startOfDay(new Date()), time);
    return format(timeDate, "mm:ss");
  };

  return (
    <div>
      <h1 className="font-mono secondary-content">{formatTime(time)}</h1>
    </div>
  );
};

export default Timer;
