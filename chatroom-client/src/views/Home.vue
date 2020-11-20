<template>
  <div class="home">
   Hello
   <button @click="createMyRoom()">Create Video Room</button>
   Or
   <input type="text" v-model="roomId"/>
   <button @click="joinRoom()">Join Video Room</button>


   <button @click="createMyAudioRoom()">Create Audio Room</button>
   Or
   <input type="text" v-model="roomId"/>
   <button @click="joinAudioRoom()">Join Audio Room</button>
  </div>
  
</template>
<script>
import { createRoom } from '../utils';
import config from "../config";
export default {
  name: 'Home',
  data(){
    return{
      roomId : ""
    }
  },
  methods: {
    createMyRoom: async function(){
      const {data} = await createRoom();
      console.log("Room Id",data);
      window.location.href = `/room/${data.roomId}`
    },
    joinRoom: function(){
      if(this.roomId!=="" && config.ROOM_PATTERN.test(this.roomId))
      window.location.href = `/room/${this.roomId}`
      else alert("Invalid Room");
    },
    createMyAudioRoom: async function(){
      const {data} = await createRoom();
      console.log("Room Id",data);
      window.location.href = `/audio-room/${data.roomId}`
    },
    joinAudioRoom: function(){
      if(this.roomId!=="" && config.ROOM_PATTERN.test(this.roomId))
      window.location.href = `/audio-room/${this.roomId}`
      else alert("Invalid Room");
    }
  }

}
</script>
