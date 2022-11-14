import React, { useEffect, useRef, useState } from "react";
import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons";
import styles from "./index.module.less";

type ISOTimeStampNS = number;

interface IProps {
  // 当前进度
  currentTime: ISOTimeStampNS;
  // 起止时间戳
  start?: ISOTimeStampNS;
  end?: ISOTimeStampNS;
  handlePlay?: () => void;
  handleEnd?: () => void;
  handleClick?: (progress: number) => void;
  handleKeydown?: () => void;
}
enum EPlayStatus {
  Stop = "stop",
  Play = "play",
  Pause = "pause",
}

export function PlayerControl(props: IProps) {
  const [playStatus, setPlayStatus] = useState<EPlayStatus>(EPlayStatus.Stop);
  const playerControlRef = useRef<any>();
  const progressLengthRef = useRef<number>(0);

  const [currentMarkerData, setCurrentMarkerData] = useState({
    pos: -1,
    currentTime: 0,
  });

  function handlePlay() {
    setPlayStatus(EPlayStatus.Play);
    props.handlePlay && props.handlePlay();
  }

  function handlePause() {
    setPlayStatus(EPlayStatus.Pause);
    props.handleEnd && props.handleEnd();
  }

  useEffect(() => {
    // 结束播放
    if (props.currentTime === props.end) {
      handlePause();
    }
  }, [props.currentTime]);

  function handleClick(e: any) {
    const sliderRect = e.target.getBoundingClientRect();
    if (!props.end || !props.start) {
      return;
    }
    const currentProgress =
      (e.clientX - sliderRect.left) / progressLengthRef.current;
    const currentTime =
      (props.end - props.start) * currentProgress + props.start;
    // console.log("===当前进度", currentTime);
    props.handleClick && props.handleClick(currentTime);
  }

  function handleMouseMove(e: any) {
    if (!props.end || !props.start) {
      return;
    }
    const sliderRect = e.target.getBoundingClientRect();
    const currentProgress =
      (e.clientX - sliderRect.left) / progressLengthRef.current;
    const currentTime =
      (props.end - props.start) * currentProgress + props.start;
    setCurrentMarkerData({
      pos: currentProgress,
      currentTime,
    });
  }

  function handleMouseLeave() {
    setCurrentMarkerData({
      pos: -1,
      currentTime: 0,
    });
  }

  const progress =
    props.end && props.start && props.currentTime
      ? (props.currentTime - props.start) / (props.end - props.start)
      : 0;

  useEffect(() => {
    const getProgressLengthRef = () => {
      progressLengthRef.current =
        playerControlRef.current.getBoundingClientRect().width;
    };
    getProgressLengthRef();
    window.addEventListener("resize", getProgressLengthRef);
    return () => {
      window.removeEventListener("resize", getProgressLengthRef);
    };
  }, []);

  return (
    <div className={styles["container"]}>
      {playStatus !== EPlayStatus.Play ? (
        <CaretRightOutlined
          className={styles["player-icon"]}
          onClick={handlePlay}
        />
      ) : (
        <PauseOutlined
          className={styles["player-icon"]}
          onClick={handlePause}
        />
      )}
      <div
        className={styles["slider"]}
        ref={playerControlRef}
        onMouseDown={(e) => handleClick(e)}
        onMouseMove={(e) => handleMouseMove(e)}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles["slider-progress"]}></div>
        <div
          className={styles["slider-pointer"]}
          style={{
            transform: `translate(${
              progressLengthRef.current * progress
            }px, -50%)`,
          }}
        ></div>
        <div
          className={styles["slider-marker"]}
          style={{
            transform: `translate(${
              progressLengthRef.current * currentMarkerData.pos
            }px, -50%)`,
            visibility: currentMarkerData.pos === -1 ? "hidden" : "visible",
          }}
        >
          <div className={styles["top"]}></div>
          <div className={styles["bottom"]}></div>
          <div className={styles["tooltip"]}>
            ROS: {currentMarkerData.currentTime}
          </div>
        </div>
      </div>
      <div className={styles["summary"]}>
        {props.currentTime ? props.currentTime : 0} /{" "}
        {props.end ? props.end : 0}
      </div>
    </div>
  );
}
