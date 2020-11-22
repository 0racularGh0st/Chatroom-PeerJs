<template>
  <div class="home">
    <div class="content">
      Hello
      <button @click="createMyRoom()">Create Video Room</button>
      Or
      <input type="text" v-model="roomId" />
      <button @click="joinRoom()">Join Video Room</button>

      <button @click="createMyAudioRoom()">Create Audio Room</button>
      Or
      <input type="text" v-model="roomId" />
      <button @click="joinAudioRoom()">Join Audio Room</button>
    </div>
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
</template>
<script>
import { createRoom } from "../utils";
import config from "../config";
export default {
  name: "Home",
  data() {
    return {
      roomId: "",
    };
  },
  methods: {
    createMyRoom: async function () {
      const { data } = await createRoom();
      console.log("Room Id", data);
      window.location.href = `/room/${data.roomId}`;
    },
    joinRoom: function () {
      if (this.roomId !== "" && config.ROOM_PATTERN.test(this.roomId))
        window.location.href = `/room/${this.roomId}`;
      else alert("Invalid Room");
    },
    createMyAudioRoom: async function () {
      const { data } = await createRoom();
      console.log("Room Id", data);
      window.location.href = `/audio-room/${data.roomId}`;
    },
    joinAudioRoom: function () {
      if (this.roomId !== "" && config.ROOM_PATTERN.test(this.roomId))
        window.location.href = `/audio-room/${this.roomId}`;
      else alert("Invalid Room");
    },
  },
};
</script>
<style lang="scss" scoped>
.home {
  z-index: 1;
  position: relative;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(
    180deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(0, 212, 255, 1) 100%
  );
}
.content{
  z-index: 3;
}
#tsparticles {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  display: block;
  position: absolute;
  z-index: 2;
}
.tsparticles {
  opacity: 0.5;
}
</style>