import { Pure, ImPure } from "@design-express/fabrica";
import "@tensorflow/tfjs-backend-webgl";
import { open } from "#extension:rc_dock";

import ContentsBox from "../components/ContentsBox";
import modelUrl from "../model/model.json?url";
import shard1of4 from "../model/group1-shard1of4.bin?url";
import shard2of4 from "../model/group1-shard2of4.bin?url";
import shard3of4 from "../model/group1-shard3of4.bin?url";
import shard4of4 from "../model/group1-shard4of4.bin?url";

const url = {
  "group1-shard1of4.bin": shard1of4,
  "group1-shard2of4.bin": shard2of4,
  "group1-shard3of4.bin": shard3of4,
  "group1-shard4of4.bin": shard4of4,
};

export class YOLOv8NXV extends Pure {
  static path = "YOLOv8";
  static title = "YOLOv8 NXV";
  static description = "Object Detection using YOLOv8 and Tensorflow.js";

  constructor() {
    super();
    this.addInput("Models", "");
    this.addInput("BinFile", "");
    this.addInput("Canvas", "");
    this.addOutput("Results", "jsx");

    // this.component = <ContentsBox url={url} modelUrl={modelUrl} />;
    this.component = <ContentsBox />;
    this.widget = this.addWidget("button", "Execute", null, () => {
      open(undefined, {
        id: "::tmp::test",
        title: "YOLOv8 Detect",
        content: this.component,
      });
    });
  }

  async onExecute() {
    const modelJSON = this.getInputData(1);
    console.log(typeof modelJSON);
    console.log(typeof modelUrl, modelUrl);

    this.component = (
      <ContentsBox modelJSON={modelJSON} modelUrl={modelUrl} url={url} />
    );
  }

  onAction(action, param) {
    if (action === "play") this.triggerSlot(1, param);
  }
}
