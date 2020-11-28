<template>
  <div class="room">
    <div v-show="isValidRoom">
      <div>Room Id = {{ roomId }}</div>
      <div id="audio-grid"></div>
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
let audioGrid;
let myPeer;
let myAudio;
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
        audioGrid = document.getElementById("audio-grid");
        myPeer = new Peer(undefined, {
          host: config.PEER_SERVER,
          secure: true,
          port: 443,
          debug: 3,
          config: config.ICE_SERVERS
        });
        myAudio = document.createElement("audio");
        myAudio.muted = true;
        myAudio.setAttribute("autoplay", "");
        myAudio.setAttribute("muted", "");
        myAudio.setAttribute("playsinline", "");
        myAudio.setAttribute("webkit-playsinline", "");
        myAudio.setAttribute(
          "style",
          "max-height: 45vw; max-width: 45vw; display: inline-block;"
        );

        navigator.mediaDevices
          .getUserMedia({
            video: false,
            audio: true,
          })
          .then((stream) => {
            self.addVideoStream(myAudio, stream);
            myPeer.on("call", async (call) => {
              await call.answer(stream);
              const audio = document.createElement("audio");
              audio.setAttribute("autoplay", "");
              audio.setAttribute("playsinline", "");
              audio.setAttribute("webkit-playsinline", "");
              audio.setAttribute(
                "style",
                "max-height: 45vw; max-width: 45vw; display: inline-block; margin: 1px;"
              );
              if ("srcObject" in audio) {
                audio.srcObject = stream;
              } else {
                // Avoid using this in new browsers, as it is going away.
                audio.src = window.URL.createObjectURL(stream);
              }
              call.on("stream", async (userAudioStream) => {
                await self.addVideoStream(audio, userAudioStream);
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
    addVideoStream: function (audio, stream) {
      console.log("called add stream");
      if ("srcObject" in audio) {
        audio.srcObject = stream;
      } else {
        // Avoid using this in new browsers, as it is going away.
        audio.src = window.URL.createObjectURL(stream);
      }
      console.log("Ready state ", audio.readyState);
      audio.onloadedmetadata = async () => {
        await audio.play();
      };
      audioGrid.append(audio);
    },
    connectToNewUser: function (userId, stream) {
      console.log("called");
      const call = myPeer.call(userId, stream);
      const audio = document.createElement("audio");
      audio.setAttribute("autoplay", "");
      audio.setAttribute("playsinline", "");
      audio.setAttribute("webkit-playsinline", "");
      audio.setAttribute(
        "style",
        "max-height: 45vw; max-width: 45vw; display: inline-block; margin: 2px;"
      );
      if ("srcObject" in audio) {
        audio.srcObject = stream;
      } else {
        // Avoid using this in new browsers, as it is going away.
        audio.src = window.URL.createObjectURL(stream);
      }
      console.log("Ready state ", audio.readyState);
      call.on("stream", async (userAudioStream) => {
        await this.addVideoStream(audio, userAudioStream);
      });
      call.on("close", () => {
        audio.remove();
      });
      peers[userId] = call;
    },
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
#audio-grid {
  display: block;
}

audio {
  object-fit: cover;
}
</style>