import React, { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import { detect, detectVideo } from "../shared/detect";
import ButtonHandler from "./BtnHandler";

const ContentContainer = styled("div")(({ theme }) => ({
  position: "relative",
  // height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  paddingTop: "50px",
  [`& > .header`]: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "50px",
    [`& > h1`]: {
      margin: "0 auto",
    },
  },
  [`& > div.btn-container`]: {
    [`& > button`]: { margin: "0 8px" },
  },
  [`& > div.content`]: {
    position: "relative",
    paddingTop: "50px",
    [`& > img`]: {
      display: "none",
      width: "100%",
      maxWidth: "720px",
      maxHeight: "500px",
    },
    [`& > video`]: {
      display: "none",
      width: "100%",
      maxWidth: "720px",
      maxHeight: "500px",
    },
    [`& > canvas`]: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
  },
}));

function ContentsBox({ modelJSON, modelUrl, url }) {
  const [model, setModel] = useState({
    net: null,
    inputShape: [1, 0, 0, 3],
  });
  const imageRef = useRef(null);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  console.log(modelUrl);
  useEffect(() => {
    tf.ready().then(async () => {
      const yolov8 = await tf.loadGraphModel(
        { modelJSON },
        {
          onProgress: (fractions) => {},
          weightUrlConverter: (n) => {
            return url[n];
          },
        }
      );

      const dummyInput = tf.ones(yolov8.inputs[0].shape);
      const warmupResults = yolov8.execute(dummyInput);

      setModel({
        net: yolov8,
        inputShape: yolov8.inputs[0].shape,
      });
      canvasRef.width = yolov8.inputs[0].shape[1];
      canvasRef.height = yolov8.inputs[0].shape[2];
      tf.dispose([warmupResults, dummyInput]);
    });
  }, []);

  return (
    <ContentContainer>
      <div className="header">
        <h1>📷 YOLOv8 Live Detection App</h1>
      </div>
      <ButtonHandler
        imageRef={imageRef}
        cameraRef={cameraRef}
        videoRef={videoRef}
      />
      <div className="content">
        <img
          src="#"
          alt=""
          ref={imageRef}
          onLoad={() => detect(imageRef.current, model, canvasRef.current)}
        />
        <video
          autoPlay
          muted
          ref={cameraRef}
          onPlay={() =>
            detectVideo(cameraRef.current, model, canvasRef.current)
          }
        />
        <video
          autoPlay
          muted
          ref={videoRef}
          onPlay={() => detectVideo(videoRef.current, model, canvasRef.current)}
        />
        <canvas
          // width={model.inputShape[1]}
          // height={model.inputShape[2]}
          width={canvasRef.width}
          height={canvasRef.height}
          ref={canvasRef}
        />
      </div>
    </ContentContainer>
  );
}

export default ContentsBox;
