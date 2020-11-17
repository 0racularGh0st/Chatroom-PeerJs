<template>
  <div class="room">
    <div v-show="isValidRoom">
      Room Id = {{ roomId }}
      <div id="video-grid"></div>
    </div>
    <div v-show="!isValidRoom">
        Room Not Found
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import config from "../config";
const Peer = window.Peer;
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
  timeout: 10000, //before connect_error and connect_timeout are emitted.
  transports: ["websocket"],
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
    if(this.isValidRoom){
      socket = io.connect(config.SIGNALLING_SERVER, connectionOptions);
    videoGrid = document.getElementById("video-grid");
    myPeer = new Peer(undefined, {
      host: config.PEER_SERVER,
      secure: true,
      port: 443,
    });
    myVideo = document.createElement("video");
    myVideo.muted = true;
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        this.addVideoStream(myVideo, stream);
        myPeer.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            this.addVideoStream(video, userVideoStream);
          });
        });

        socket.on("user-connected", (userId) => {
          this.connectToNewUser(userId, stream);
        });
      });
    socket.on("user-disconnected", (userId) => {
      if (peers[userId]) peers[userId].close();
    });
    myPeer.on("open", (id) => {
      socket.emit("join-room", this.roomId, id);
    });
    }
  },
  methods: {
    addVideoStream: function (video, stream) {
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
      videoGrid.append(video);
    },
    connectToNewUser: function (userId, stream) {
      const call = myPeer.call(userId, stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        this.addVideoStream(video, userVideoStream);
      });
      call.on("close", () => {
        video.remove();
      });

      peers[userId] = call;
    },
  },
  data() {
    return {
      roomId: this.$route.params.roomId,
      isValidRoom: false
    };
  },
};
</script>
<style scoped>
#video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-auto-rows: 300px;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>