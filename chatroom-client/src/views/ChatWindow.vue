<template>
    <div>
        <div class="chat-window">
            <div class="chat-bar-container">
                <div class="chat-bar">
                    <img :src="chat_icon" alt="chat icon" class="chat-icon" @click="showChat()">
                    <div class="hide-chat" @click="hideChat()">
                        >>
                    </div>
                </div>
            </div>
            <div class="chat-content">
                <div class="self-message">
                    <div class="self-text">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, voluptate eveniet ipsam ratione quisquam totam?
                    </div>
                </div>
                <div class="peer-message">
                    <div class="peer-text">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam dicta odit fuga molestias qui excepturi!
                    </div>
                </div>
                <div class="notification">
                    <div class="text">
                        David Joined!!!
                    </div>
                </div>
                <div class="self-message">
                    <div class="self-text">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, voluptate eveniet ipsam ratione quisquam totam?
                    </div>
                </div>
                <div class="peer-message">
                    <div class="peer-text">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam dicta odit fuga molestias qui excepturi!
                    </div>
                </div>
                <div class="self-message">
                    <div class="self-text">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, voluptate eveniet ipsam ratione quisquam totam?
                    </div>
                </div>
                <div class="peer-message">
                    <div class="peer-text">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam dicta odit fuga molestias qui excepturi!
                    </div>
                </div>
            </div>
            <div class="new-message-container">
                <div class="new-message">
                    <div>
                        <textarea name="message" id="new-message" cols="27" rows="3"></textarea>
                    </div>
                    <div class="button-send">
                        <div class="button-text" @click="sendMessage()">Send</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import chat_icon from '../assets/chat.svg';
export default {
    mounted(){

    },
    data(){
        return{
            chat_icon : chat_icon
        }
    },
    methods: {
        showChat: function(){
            let chatbarEl=document.querySelector(".chat-bar-container");
            let chatContentEl=document.querySelector(".chat-content");
            let newMessageEl = document.querySelector(".new-message-container");
            chatbarEl.classList.add("show");
            chatContentEl.classList.add("show");
            newMessageEl.classList.add("show");
        },
        hideChat: function(){
            let chatbarEl=document.querySelector(".chat-bar-container");
            let chatContentEl=document.querySelector(".chat-content");
            let newMessageEl = document.querySelector(".new-message-container");
            chatbarEl.classList.remove("show");
            chatContentEl.classList.remove("show");
            newMessageEl.classList.remove("show");
        },
        sendMessage: function(){
            let chatContentEl=document.querySelector(".chat-content");
            let newMessage = document.createElement('div');
            newMessage.classList.add("self-message");
            let innerDiv = document.createElement('div');
            innerDiv.classList.add("self-text");
            innerDiv.innerHTML = "hello";
            newMessage.append(innerDiv);
            chatContentEl.append(newMessage);
            document.querySelector(".chat-content").scrollIntoView(false);
            
        }
    }
}
</script>
<style lang="scss">
.chat-window{
    width: 320px;
    z-index: 4;
    height: 100vh;
}
.chat-icon{
    height: 30px;
    width: 30px;
    padding-left: 16px;
    z-index: 4;
    cursor: pointer;
}
.chat-bar-container{
    position: fixed;
    display: block;
    width: 320px;
    transform: translateX(260px);
    transition: all 0.3s ease;
     z-index: 99;
    &.show{
        transform: translateX(0px);
    }
}
.chat-bar{
    background: linear-gradient(90deg, #020024 0%, #56556f 50%, #829ac5 100%);
    display: flex;
    height: 40px;
    align-items: center;
    z-index: 4;
    justify-content: space-between;
}
.button-send{
    z-index: 4;
  padding: 0.75rem;
    background: linear-gradient(45deg, #020024 0%, #56556f 50%, #829ac5 100%);
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.3s ease-in-out;
    width: max-content;
    display: inline-block;
    margin-left: .5rem;
    height: fit-content;
    margin-right: .5rem;
    .button-text {
    color: white;
  }
  &:hover {
    background: linear-gradient(90deg, #020024 0%, #56556f 50%, #829ac5 100%);
  }
}
.new-message-container{
    bottom: 0;
    position: fixed;
    z-index: 99;
    height: 77px;
    width: 343px;
    transform: translateX(320px);
        transition: all 0.3s ease;
        &.show{
        transform: translateX(0px);
    }
}
 .new-message{
    display: flex;
    padding: 10px;
    background: #e0e0e0;
  }
  .chat-content{
   z-index: 1;
    display: inline-block;
    background: #e0e0e0;
    padding-top: 40px;
    padding-bottom: 77px;
    transform: translateX(320px);
    min-height: calc(100vh - 117px);
        transition: all 0.3s ease;
        &.show{
        transform: translateX(0px);
    }
  }
  .self-message{
    width: 240px;
    float: right;
      .self-text{
          color: white;
    background: #1f1c58ad;
    padding: 5px;
    margin: 10px;
    border-radius: 10px;
    width: fit-content;
    float: right;
      }
  }
  .peer-message{
    width: 240px;
    float: left;
      .peer-text{
    background:#a7b5d0;
    padding: 5px;
    margin: 10px;
    border-radius: 10px;
    width: fit-content;
    float: left;
      }
  }
  .notification{
    width: 280px;
    display: inline-block;
    border-top: 1px solid #b7b3b3;
    padding: 5px 0;
    border-bottom: 1px solid #b7b3b3;
  }
  textarea{
      resize: none;
  }
  .hide-chat{
      color: white;
    font-size: 18px;
    margin-right: 8px;
    cursor: pointer;
  }
</style>