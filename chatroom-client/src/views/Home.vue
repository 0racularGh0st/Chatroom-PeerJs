<template>
  <div>
    <div class="home">
      <Particles
        id="tsparticles"
        class="tsparticles"
        :options="{
          background: {
            color: {
              value: 'transparent',
            },
          },
          fpsLimit: 40,
          interactivity: {
            detectsOn: 'window',
            events: {
              onClick: {
                enable: false,
                mode: 'push',
              },
              onHover: {
                enable: false,
                mode: 'grab',
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 2,
              },
              grab: {
                distance: 150,
              },
            },
          },
          particles: {
            color: {
              value: '#ffffff',
            },
            links: {
              color: 'rgb(106, 228, 230)',
              distance: 80,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: 'none',
              enable: true,
              outMode: 'bounce',
              random: false,
              speed: 3,
              straight: false,
            },
            number: {
              density: {
                enable: false,
                value_area: 0,
              },
              value: 30,
            },
            opacity: {
              value: 0.4,
            },
            shape: {
              type: 'circle',
            },
            size: {
              random: true,
              value: 4,
            },
            twinkle: {
              particles: {
                enable: true,
                frequency: 0.05,
                opacity: 1,
              },
            },
          },
          detectRetina: false,
        }"
      />
    </div>
    <div class="content">
      <h1>Welcome to Peer-Vue Chatroom!</h1>
      <h2>To get started, create a room or join one.</h2>
      <div class="horizontal-line"></div>
      <h3>Video Room</h3>
      <div class="video-room">
        <div class="button-main" @click="showModal('createVRoom')">
          <div class="button-text">Create Video Room</div>
        </div>
        <p>or</p>
        <div class="button-main" @click="showModal('joinVRoom')">
          <div class="button-text">Join Video Room</div>
        </div>
      </div>
      <div class="horizontal-line"></div>
      <h3>Audio Room</h3>
      <div class="audio-room">
        <div class="button-main" @click="showModal('createARoom')">
          <div class="button-text">Create Audio Room</div>
        </div>
        <p>or</p>
        <div class="button-main" @click="showModal('joinARoom')">
          <div class="button-text">Join Audio Room</div>
        </div>
      </div>
    </div>
    <div class="create-room-modal" v-show="startClicked">
      <div class="create-room-card">
        <div class="form-content">
          <div class="form-label">
            Nickname:
            <input type="text" v-model="name" placeholder="Enter a Nickname" />
          </div>
          <div class="form-label" v-if="videoRoomIdNeeded">
            Video Room Id:
            <input type="text" v-model="videoRoomId" placeholder="Enter Video Room Id"/>
          </div>
          <div class="form-label" v-if="audioRoomIdNeeded">
            Audio Room Id:
            <input type="text" v-model="audioRoomId" placeholder="Enter Audio Room Id" />
          </div>
          <div v-if="caseType==='createVRoom'">
            <div class="button-main" @click="createMyRoom()" v-if="name !== ''">
            <div class="button-text">Create Video Room</div>
             </div>
              <div class="button-main disabled" v-if="name === ''">
                <div class="button-text">Create Video Room</div>
              </div>
          </div>
          <div v-if="caseType==='createARoom'">
            <div class="button-main" @click="createMyAudioRoom()" v-if="name !== ''">
            <div class="button-text">Create Audio Room</div>
             </div>
              <div class="button-main disabled" v-if="name === ''">
                <div class="button-text">Create Audio Room</div>
              </div>
          </div>
          <div v-if="caseType==='joinVRoom'">
            <div class="button-main" @click="joinRoom()" v-if="name !== '' && videoRoomId!==''">
            <div class="button-text">Join Video Room</div>
             </div>
              <div class="button-main disabled" v-if="name === '' || videoRoomId===''">
                <div class="button-text">Join Video Room</div>
              </div>
          </div>
          <div v-if="caseType==='joinARoom'">
            <div class="button-main" @click="joinAudioRoom()" v-if="name !== '' && audioRoomId!==''">
            <div class="button-text">Join Audio Room</div>
             </div>
              <div class="button-main disabled" v-if="name === '' || audioRoomId===''">
                <div class="button-text">Join Audio Room</div>
              </div>
          </div>
          <div class="cancel" @click="cancel()">Cancel</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { createRoom } from "../utils";
import config from "../config";
export default {
  name: "Home",
  data() {
    return {
      videoRoomId: "",
      audioRoomId: "",
      startClicked: false,
      name: "",
      nameNeeded: true,
      videoRoomIdNeeded: false,
      audioRoomIdNeeded: false,
      caseType: ""
    };
  },
  methods: {
    showModal: function (type) {
      this.startClicked = true;
      if (type === "createVRoom") {
        this.caseType = type;
        this.nameNeeded = true;
      }
      else if(type==="joinVRoom"){
        this.caseType = type;
        this.nameNeeded = true;
        this.videoRoomIdNeeded = true;
      }
      else if(type==="createARoom"){
        this.caseType = type;
        this.nameNeeded = true;
      }
      else if(type==="joinARoom"){
        this.caseType = type;
        this.nameNeeded = true;
        this.audioRoomIdNeeded = true;
      }
    },
    cancel: function(){
        this.startClicked = false;
        this.name= '';
        this.videoRoomIdNeeded = false;
        this.audioRoomIdNeeded = false;

    },
    createMyRoom: async function () {
      const { data } = await createRoom();
      console.log("Room Id", data);
       this.setNickname();
      window.location.href = `/room/${data.roomId}`;
    },
    joinRoom: function () {
      if (this.roomId !== "" && config.ROOM_PATTERN.test(this.videoRoomId))
        {
          this.setNickname();
          window.location.href = `/room/${this.videoRoomId}`;
        }
      else alert("Invalid Room");
    },
    createMyAudioRoom: async function () {
      const { data } = await createRoom();
      this.setNickname();
      console.log("Room Id", data);
      window.location.href = `/audio-room/${data.roomId}`;
    },
    joinAudioRoom: function () {
      if (this.roomId !== "" && config.ROOM_PATTERN.test(this.audioRoomId))
        {
          this.setNickname();
          window.location.href = `/audio-room/${this.audioRoomId}`;
        }
      else alert("Invalid Room");
    },
    setNickname: function(){
      localStorage.setItem('peer-vue-chatroom-user',this.name);
    }
  },
};
</script>
<style lang="scss" scoped>
.home {
  z-index: 1;
  position: fixed;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  width: 100vw;
  background: linear-gradient(180deg, #020024 0%, #56556f 50%, #829ac5 100%);
  background-attachment: fixed;
}
.content {
  position: absolute;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 8px;
  margin-right: 8px;
  width: calc(100vw - 16px);
  height: 100%;
  margin-top: auto;
  margin-bottom: auto;
  justify-content: center;
}
h1 {
  color: white;
  margin: 0 0 0.75rem 0;
}
h2 {
  color: white;
  margin: 0;
  opacity: 0.8;
}
h3 {
  color: white;
  margin: 0.5rem 0;
  opacity: 0.8;
}
p {
  color: white;
  margin: 4px 0;
  opacity: 0.75;
}
input {
  margin-left: 8px;
  height: 24px;
  font-size: 16px;
}
.horizontal-line {
  margin: 1rem 0 0 0;
  height: 1px;
  width: 300px;
  background: #8a949c;
}
#tsparticles {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  display: block;
  position: absolute;
  z-index: 2;
  background-attachment: fixed;
}
.tsparticles {
  opacity: 0.5;
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
  top: 0;
  position: absolute;
  z-index: 4;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
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
.card-heading {
  color: black;
}
.cancel {
  color: #829ac5;
  margin-top: 1rem;
  cursor: pointer;
}
</style>