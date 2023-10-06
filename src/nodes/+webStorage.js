import { Pure } from "@design-express/fabrica";

export class Web3Storage extends Pure {
  static path = "YOLOv8";
  static title = "Web3 Storage";

  constructor() {
    super();
    this.addInput("CID", "string");
    this.addOutput("JSON", "");
  }

  async onExecute() {
    const cid = this.getInputData(1) || null;
    console.log(`cid: ${cid}`);

    await fetch(`https://${cid}.ipfs.w3s.link/model.json`, { method: "GET" })
      .then((res) => res.json())
      .then((res) => {
        if (res !== null) {
          this.setOutputData(1, res);
        } else {
          alert("등록을 실패하였습니다.");
        }
      });
  }

  onAction(action, param) {
    if (action === "play") this.triggerSlot(1, param);
  }
}
