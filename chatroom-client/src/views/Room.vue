<template>
  <div class="room">
    <div v-show="isValidRoom">
      <div>Room Id = {{ roomId }}</div>
      <div id="video-grid"></div>
    </div>
    <div v-show="!isValidRoom">Room Not Found</div>
  </div>
</template>

<script>
import io from "socket.io-client";
import config from "../config";
const Peer = window.Peer;
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
  timeout: 2000, //before connect_error and connect_timeout are emitted.
  transports: ["websocket"],
  config: {
    sdpSemantics: "unified-plan",
  },
};
let socket;
let videoGrid;
let myPeer;
let myVideo;
let peers = {};
export default {
  name: "Room",
  created() {},
  async mounted() {
    this.isValidRoom = await config.ROOM_PATTERN.test(this.roomId);
    let self = this;
    if (this.isValidRoom) {
      window.onload = function () {
        socket = io.connect(config.SIGNALLING_SERVER, connectionOptions);
        videoGrid = document.getElementById("video-grid");
        myPeer = new Peer(undefined, {
          host: config.PEER_SERVER,
          secure: true,
          port: 443,
          debug: 3,
        });
        myVideo = document.createElement("video");
        myVideo.muted = true;
        myVideo.setAttribute("autoplay", "");
        myVideo.setAttribute("muted", "");
        myVideo.setAttribute("playsinline", "");
        myVideo.setAttribute("webkit-playsinline", "");
        myVideo.setAttribute(
          "style",
          "max-height: 45vw; max-width: 45vw; display: inline-block;"
        );

        navigator.mediaDevices
          .getUserMedia({
            video: {
              height: { min: 150, ideal: 300 },
              width: { min: 150, ideal: 300 },
              facingMode: "user",
              frameRate: {
                ideal: 30,
                min: 10,
              },
            },
            audio: true,
          })
          .then((stream) => {
            self.addVideoStream(myVideo, stream);
            myPeer.on("call", async (call) => {
              await call.answer(stream);
              const video = document.createElement("video");
              video.setAttribute("autoplay", "");
              video.setAttribute("playsinline", "");
              video.setAttribute("webkit-playsinline", "");
              video.setAttribute(
                "style",
                "max-height: 45vw; max-width: 45vw; display: inline-block; margin: 1px;"
              );
              if ("srcObject" in video) {
                video.srcObject = stream;
              } else {
                // Avoid using this in new browsers, as it is going away.
                video.src = window.URL.createObjectURL(stream);
              }
              call.on("stream", async (userVideoStream) => {
                await self.addVideoStream(video, userVideoStream);
              });
            });
            socket.on("user-connected", async (userId) => {
              await self.connectToNewUser(userId, stream);
            });
          })
          .catch(function (err) {
            alert(err.name + ": " + err.message);
          });
        socket.on("user-disconnected", (userId) => {
          if (peers[userId]) peers[userId].close();
        });
        myPeer.on("open", (id) => {
          socket.emit("join-room", this.roomId, id);
        });
      };
    }
  },
  methods: {
    addVideoStream: function (video, stream) {
      console.log("called add stream")
      if ("srcObject" in video) {
        video.srcObject = stream;
      } else {
        // Avoid using this in new browsers, as it is going away.
        video.src = window.URL.createObjectURL(stream);
      }
      console.log("Ready state ",video.readyState);
      video.onloadedmetadata = async()=> {
        await video.play();

      }
      videoGrid.append(video);
    },
    connectToNewUser: function (userId, stream) {
      console.log("called");
      const call = myPeer.call(userId, stream);
      const video = document.createElement("video");
      video.setAttribute("autoplay", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.setAttribute(
        "style",
        "max-height: 45vw; max-width: 45vw; display: inline-block; margin: 2px;"
      );
      if ("srcObject" in video) {
        video.srcObject = stream;
      } else {
        // Avoid using this in new browsers, as it is going away.
        video.src = window.URL.createObjectURL(stream);
      }
      console.log("Ready state ",video.readyState);
      call.on("stream", async (userVideoStream) => {
        await this.addVideoStream(video, userVideoStream);
      });
      call.on("close", () => {
        video.remove();
      });
      peers[userId] = call;
    }
  },
  data() {
    return {
      roomId: this.$route.params.roomId,
      isValidRoom: false,
    };
  },
};
</script>
<style scoped>
#video-grid {
  display: block;
}

video {
  object-fit: cover;
}
</style>