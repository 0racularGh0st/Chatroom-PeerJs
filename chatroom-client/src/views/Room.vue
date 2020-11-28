<template>
  <div>
    <div class="room">
    </div> 
    <ChatWindow class="chat-window-main" :sendMessage="sendMessage"/>
    <div v-show="isValidRoom">
      <div class="room-id">Room Id 
          <div class="room-id-value">
            {{ roomId }}
          </div>
          <div class="button-copy" @click="copyRoomId()">
            <div class="button-text">Copy Room Id</div>
          </div>
      </div>
      <div id="video-grid"></div>
    </div>
    <div v-show="!isValidRoom">Room Not Found</div>
    <div v-if="!nameExists">
        <div class="create-room-modal" v-show="!nameExists">
      <div class="create-room-card">
        <div class="form-content">
          <div class="form-label">
            Nickname:
            <input type="text" v-model="name" placeholder="Enter a Nickname" />
          </div>
          <div>
            <div class="button-main" @click="setNickName()" v-if="name !== ''">
            <div class="button-text">Join</div>
             </div>
              <div class="button-main disabled" v-if="name === ''">
                <div class="button-text">Join</div>
              </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import config from "../config";
import ChatWindow from './ChatWindow';
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
let conn = {};
let peerToVideoId={};
export default {
  name: "Room",
  created() {},
  async mounted() {
    
    if(localStorage.getItem('peer-vue-chatroom-user')!==null){
      this.name = localStorage.getItem('peer-vue-chatroom-user');
      this.nameExists = true;
    }
    this.isValidRoom = await config.ROOM_PATTERN.test(this.roomId);
    let self = this;
    if (this.isValidRoom && this.nameExists) {
      await self.getStarted();
    }
  },
  methods: {
    setNickName: function(){
        localStorage.setItem('peer-vue-chatroom-user',this.name);
        this.nameExists = true;
        if (this.isValidRoom && this.nameExists) {
        this.getStarted();
        }
    },
    copyRoomId: function(){
      var theRoomId = document.createElement("textarea");
      document.body.appendChild(theRoomId);
      theRoomId.value = this.roomId;
      theRoomId.select();
      theRoomId.setSelectionRange(0, 99999);
      document.execCommand("copy");
      document.body.removeChild(theRoomId);
    },
    getStarted: async function(){
      console.log("Username", localStorage.getItem('peer-vue-chatroom-user'));
        let self = this;
        socket = io.connect(config.SIGNALLING_SERVER, connectionOptions);
        videoGrid = document.getElementById("video-grid");
        myPeer = new Peer(undefined, {
          host: config.PEER_SERVER,
          secure: true,
          port: 443,
          debug: 0,
        });
        myVideo = document.createElement("video");
        myVideo.muted = true;
        myVideo.setAttribute("autoplay", "");
        myVideo.setAttribute("muted", "");
        myVideo.setAttribute("playsinline", "");
        myVideo.setAttribute("webkit-playsinline", "");
        myVideo.setAttribute(
          "style",
          "max-height: 45vw; max-width: 45vw; display: inline-block; margin: 2px;"
        );
       

        navigator.mediaDevices
          .getUserMedia({
            video: {
              height: 480,
              width: 640,
              facingMode: "user",
              frameRate: {
                ideal: 30,
                min: 10,
              },
            },
            audio: true,
          })
          .then((stream) => {
             self.streamId= stream.id;
            self.addVideoStream(myVideo, stream);
            myPeer.on("call", async (call) => {
              await call.answer(stream);
              const video = document.createElement("video");
              video.setAttribute("autoplay", "");
              video.setAttribute("playsinline", "");
              video.setAttribute("webkit-playsinline", "");
              video.setAttribute(
                "style",
                "max-height: 45vw; max-width: 45vw; display: inline-block; margin: 2px;"
              );
              console.log("Me here->",myPeer);
              if ("srcObject" in video) {
                video.srcObject = stream;
              } else {
                // Avoid using this in new browsers, as it is going away.
                video.src = window.URL.createObjectURL(stream);
              }
              call.on("stream", async (userVideoStream) => {
                console.log("Me here on stream->",myPeer);
                video.setAttribute("id",userVideoStream.id);
                await self.addVideoStream(video, userVideoStream);
              });
            });
            socket.on("user-connected", async (userId) => {
              console.log("user connected->", userId);
              await self.connectToNewUser(userId, stream);
            });

            myPeer.on("connection", function (rConn) {
              console.log(rConn);
              if (!peers[rConn.peer])
                {
                  conn[rConn.peer] = myPeer.connect(rConn.peer, {
                  metadata: { name: self.name, videoId: self.streamId},
                  serialization: "json",
                });
                  peerToVideoId[rConn.peer]=rConn.metadata.videoId;
                  self.notifyJoined(rConn.peer);
                }
              // Receive messages
              //conn = rConn;
              rConn.on("data", function (data) {
                //console.log("Received", data);
                self.emitter.emit('received',data);
              });
            });
          })
          .catch(function (err) {
            alert(err.name + ": " + err.message);
          });
        socket.on("user-disconnected", (userId) => {
          console.log("user disconnected->", userId);
          if (peers[userId]) {
            peers[userId].close();
          }
           if(peerToVideoId[userId] && document.getElementById(peerToVideoId[userId])){
              document.getElementById(peerToVideoId[userId]).remove();
           }
        });
        myPeer.on("open", (id) => {
          socket.emit("join-room", this.roomId, id);
        });
    },
    addVideoStream: function (video, stream) {
      console.log("called add stream for ",stream);
      if ("srcObject" in video) {
        video.srcObject = stream;
      } else {
        // Avoid using this in new browsers, as it is going away.
        video.src = window.URL.createObjectURL(stream);
      }
      video.onloadedmetadata = async () => {
        await video.play();
      };
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
      call.on("stream", async (userVideoStream) => {
         video.setAttribute("id",userVideoStream.id);
        await this.addVideoStream(video, userVideoStream);
      });
      call.on("close", () => {
        video.remove();
      });
      peers[userId] = call;
      console.log("connecting to user: ", userId);
      conn[userId] = myPeer.connect(userId, {
        metadata: { name: this.name, videoId: this.streamId},
        serialization: "json",
      });
    },
    sendMessage: function (msgContent) {
      let self = this;
      for (const userId in conn) {
        conn[userId].send({msgType:"normal",sender:self.name, msg:msgContent});
      }
    },
    notifyJoined: function(userId) {
        let self= this;
        console.log("notify called");
        conn[userId].on('open',function(){
          conn[userId].send({msgType:"notify",msg:`${self.name} joined!`});
        });
    }
  },
  data() {
    return {
      roomId: this.$route.params.roomId,
      isValidRoom: false,
      name: "",
      streamId: null,
      nameExists: false
    };
  },
  components: {
    ChatWindow
  }
};
</script>
<style lang="scss" scoped>
#video-grid {
  display: block;
  margin-top: 2rem;
}

video {
  object-fit: cover;
}
.room{
  z-index: -1;
  position: fixed;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(180deg, #020024 0%, #56556f 50%, #829ac5 100%);
  background-attachment: fixed;
}
.button-main {
  padding: 0.75rem;
  background: linear-gradient(45deg, #020024 0%, #56556f 50%, #829ac5 100%);
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  .button-text {
    color: white;
  }
  &:hover {
    background: linear-gradient(90deg, #020024 0%, #56556f 50%, #829ac5 100%);
  }
  &.disabled {
    background: rgba(0, 0, 0, 0.5);
  }
}
.create-room-modal {
  position: absolute;
  z-index: 4;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.65);
}
.create-room-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.form-content {
  background: white;
  padding: 2rem 1rem 2rem 1rem;
  border-radius: 5px;
}
.form-label {
  color: #56556f;
  font-weight: 600;
  margin-bottom: 2rem;
}
.room-id{
  color: white;
}
.room-id-value{
  color: #020024;
  padding: 8px;
  background: white;
  border-radius: 5px;
  display: inline-block;
  margin: 0.5rem 1rem;
}
.button-copy{
  padding: 0.75rem;
    background: linear-gradient(45deg, #020024 0%, #56556f 50%, #829ac5 100%);
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.3s ease-in-out;
    width: max-content;
    display: inline-block;
    margin-left: 1rem;
    margin-right: 1rem;
    .button-text {
    color: white;
  }
  &:hover {
    background: linear-gradient(90deg, #020024 0%, #56556f 50%, #829ac5 100%);
  }
}
.chat-window-main{
  position: absolute;
    display: flex;
    overflow-y: auto;
    right: 0;
}
</style>