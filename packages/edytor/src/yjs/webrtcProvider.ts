// import { WebrtcProvider } from "y-webrtc";
import { Doc } from "yjs";

type WebrtcProviderOptions = {
  signaling: Array<string>;
  password: string | null;
  awareness: any;
  maxConns: number;
  filterBcConns: boolean;
  peerOpts: any;
};
export const createWebRtcProvider = (doc: Doc, room = "hello", opts: WebrtcProviderOptions) => {
  // const fakeDoc = new Doc();
  // const provider = new WebrtcProvider(room, doc, opts);
  // provider.emit("ping", ["lkeazlk"]);
  // provider.connect();
  // provider.on("ping", () => {
  //   console.log("ping");
  // });
  // provider.on("*", (event) => {
  //   console.log(event);
  // });
  // provider.on("connect", (event) => {
  //   console.log(event);
  // });
  // return provider;
};
