<template>
  <div class="home">
   Hello
   <button @click="createMyRoom()">Create Room</button>
   Or
   <input type="text" v-model="roomId"/>
   <button @click="joinRoom()">Join Room</button>
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
    }
  }

}
</script>
