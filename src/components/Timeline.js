import { useState, useEffect, useRef } from "react";

import classes from "./Timeline.module.css";

const Timeline = () => {
  const [zoom, setZoom] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const trackWidth = 800;
  const duration = 100;
  const miniTimelineWidth = 600;
  const windowTime = duration / zoom;
  // let currentTime = 51;
  const windowNumber = Math.trunc(currentTime / windowTime) + 1;
  const numberOfTicks = 9;
  const tickInterval = windowTime / numberOfTicks;

  const miniTimelineTicks = [];
  const timelineTicks = [];

  const secondsToMinAndSecDecimal = (timeSec) => {
    const minutes = Math.floor(timeSec / 60);
    const seconds = Math.trunc(timeSec - minutes * 60);
    const decimal = (timeSec - minutes * 60 - seconds).toFixed(2);

    function str_pad_left(string, pad, length) {
      return (new Array(length + 1).join(pad) + string).slice(-length);
    }

    const finalTime =
      str_pad_left(minutes, "0", 2) +
      ":" +
      str_pad_left(seconds, "0", 2) +
      "." +
      str_pad_left(decimal, "0", 2);

    return finalTime;
  };

  for (let i = 0; i <= numberOfTicks; i++) {
    miniTimelineTicks.push(0 + (duration / numberOfTicks) * i);
  }

  for (let i = 0; i <= numberOfTicks; i++) {
    timelineTicks.push(windowTime * (windowNumber - 1) + i * tickInterval);
  }

  const timelineMinValue = timelineTicks[0];
  const timelineMaxvalue = timelineTicks[9];
  const timelineValueRange = [timelineMinValue, timelineMaxvalue];

  console.log(timelineTicks);
  console.log(timelineMinValue, timelineMaxvalue);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentTime((prevState) => prevState + 1);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  const categories = ["A", "B", "C", "D"];

  const annotations = [
    {
      id: "124t-2pk3",
      timeStartSec: 0,
      timeEndSec: 12,
      vidDurationSec: 100,
      category: "A",
      note: "",
    },
    {
      id: "144t-2pt3",
      timeStartSec: 32,
      timeEndSec: 36,
      vidDurationSec: 100,
      category: "B",
      note: "",
    },
    {
      id: "121t-2pk3",
      timeStartSec: 3,
      timeEndSec: 9,
      vidDurationSec: 100,
      category: "C",
      note: "",
    },
    {
      id: "134t-2pk3",
      timeStartSec: 72,
      timeEndSec: 84,
      vidDurationSec: 100,
      category: "D",
      note: "",
    },
    {
      id: "124t-2pk0",
      timeStartSec: 48,
      timeEndSec: 56,
      vidDurationSec: 100,
      category: "A",
      note: "",
    },
  ];

  const zoomOutHandler = () => {
    if (zoom > 1) {
      setZoom((prevState) => prevState - 0.5);
    }
  };

  const zoomInHandler = () => {
    setZoom((prevState) => prevState + 0.5);
  };

  const Bars = categories.map((category) => {
    return (
      <div
        style={{ display: "flex", alignItems: "center" }}
        // id={category}
        key={category}
      >
        <p className={classes["category-name"]}>{category}</p>
        <div className={classes["category-row"]}>
          {annotations
            .filter((annotation) => annotation.category === category)
            .filter(
              (annotation) =>
                (annotation.timeStartSec < windowNumber * windowTime &&
                  annotation.timeStartSec > (windowNumber - 1) * windowTime) ||
                (annotation.timeEndSec < windowNumber * windowTime &&
                  annotation.timeEndSec > (windowNumber - 1) * windowTime) ||
                (annotation.timeStartSec < (windowNumber - 1) * windowTime &&
                  annotation.timeEndSec > windowNumber * windowTime)
            )
            .map((annotation) => {
              const width =
                ((annotation.timeEndSec - annotation.timeStartSec) /
                  annotation.vidDurationSec) *
                trackWidth *
                zoom;
              const offsetLeft =
                ((annotation.timeStartSec - (windowNumber - 1) * windowTime) /
                  annotation.vidDurationSec) *
                trackWidth *
                zoom;

              return (
                <div
                  className={classes["annotation"]}
                  style={{
                    width: `${width}px`,
                    height: "100px",
                    left: `${offsetLeft}px`,
                    backgroundColor: "lightblue",
                  }}
                  key={annotation.id}
                ></div>
              );
            })}
        </div>
      </div>
    );
  });

  const miniTimelineValues = miniTimelineTicks.map((timeTick) => {
    return (
      <div style={{ position: "relative" }} key={timeTick}>
        <div style={{ height: "8px", borderLeft: "2px solid black" }}></div>
        <p style={{ position: "absolute" }}>
          {secondsToMinAndSecDecimal(timeTick)}
        </p>
      </div>
    );
  });

  const timelineValues = timelineTicks.map((timeTick) => {
    return (
      <div style={{ position: "relative" }} key={timeTick}>
        <div style={{ height: "8px", borderLeft: "2px solid black" }}></div>
        <p style={{ position: "absolute" }}>
          {secondsToMinAndSecDecimal(timeTick)}
        </p>
      </div>
    );
  });

  return (
    <div className={classes["main"]}>
      <div
        className={classes["mini-timeline"]}
        style={{ width: `${miniTimelineWidth}px` }}
      >
        <div style={{ borderTop: "2px solid black" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {miniTimelineValues}
          </div>
        </div>
        <div
          className={classes["zone-indicator"]}
          style={{
            left: `${(timelineMinValue / duration) * miniTimelineWidth}px`,
            width: `${
              ((timelineMaxvalue - timelineMinValue) / duration) *
              miniTimelineWidth
            }px`,
            opacity: `${zoom === 1 ? 0 : 1}`,
          }}
        ></div>
        <div
          className={classes["mini-timeline-triangle"]}
          style={{
            left: `${(currentTime / duration) * miniTimelineWidth - 8}px`,
          }}
        ></div>
      </div>
      <div style={{ textAlign: "center", marginTop: "36px" }}>
        <p>video duration: {duration} sec</p>
        <p>zoom level: {zoom}</p>
        <button onClick={zoomOutHandler}>zoom out</button>
        <button onClick={zoomInHandler}>zoom in</button>
        <div>current time: {currentTime}s</div>
        <div>time per window: {windowTime}s</div>
        <div>window number: {windowNumber}</div>
      </div>
      <div className={classes["timeline"]}>
        <div style={{ height: "24px", width: "800px" }}>
          <div style={{ borderBottom: "2px solid black" }}></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {timelineValues}
          </div>
        </div>
        <div
          className={classes["time-bar"]}
          style={{
            left: `${
              ((currentTime - timelineValueRange[0]) /
                (timelineValueRange[1] - timelineValueRange[0])) *
                800 +
              50
            }px`,
          }}
        >
          <div style={{ position: "relative" }}>
            <div className={classes["line"]}></div>
            <div className={classes["triangle"]}></div>
          </div>
        </div>
      </div>
      <div className={classes["container"]}>{Bars}</div>
    </div>
  );
};

export default Timeline;
