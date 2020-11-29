<template>
  <div>
    <div class="chat-window">
      <div class="chat-bar-container">
        <div class="chat-bar">
          <img
            :src="chat_icon"
            alt="chat icon"
            class="chat-icon"
          />
          <div class="hide-chat" @click="hideChat()">>></div>
        </div>
      </div>
      <div class="chat-content"></div>
      <div class="new-message-container">
        <div class="new-message">
          <div>
            <textarea
              name="message"
              id="new-message"
              v-model="msgContent"
            ></textarea>
          </div>
          <div id="button-send" class="button-send" @click="sendMsg()">
            <div class="button-text">Send</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import chat_icon from "../assets/chat.svg";
export default {
  props: ["sendMessage"],
  mounted() {
    this.emitter.on("received", (data) => {
      if (data.msgType === "normal") this.updateReceivedMessages(data);
      if (data.msgType === "notify") this.updateNotification(data);
    });
    let self = this;
    var input = document.getElementById("new-message");
    input.addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        if(self.msgContent!=="")
        self.sendMsg();
      }
    });
  },
  data() {
    return {
      chat_icon: chat_icon,
      msgContent: "",
    };
  },
  methods: {
    hideChat: function () {
      let chatWindow = document.querySelector(".chat-window-main");
      chatWindow.classList.add("hide");
    },
    sendMsg: function () {
      if (this.msgContent !== "" && this.msgContent.length>0) {
        this.sendMessage(this.msgContent);
        let chatContentEl = document.querySelector(".chat-content");
        let newMessage = document.createElement("div");
        newMessage.classList.add("self-message");
        let innerDiv = document.createElement("div");
        innerDiv.classList.add("self-text");
        innerDiv.innerHTML = this.msgContent;
        newMessage.append(innerDiv);
        chatContentEl.append(newMessage);
        document.querySelector(".chat-content").scrollIntoView(false);
        this.msgContent = "";
      }
    },
    updateReceivedMessages: function (data) {
      let chatContentEl = document.querySelector(".chat-content");
      let newMessage = document.createElement("div");
      newMessage.classList.add("peer-message");
      let innerDiv = document.createElement("div");
      innerDiv.classList.add("peer-text");
      innerDiv.innerHTML = data.msg;
      newMessage.append(innerDiv);
      chatContentEl.append(newMessage);
      if (chatContentEl.classList.contains("show"))
        document.querySelector(".chat-content").scrollIntoView(false);
    },
    updateNotification: function (data) {
      let chatContentEl = document.querySelector(".chat-content");
      let newMessage = document.createElement("div");
      newMessage.classList.add("notification");
      let innerDiv = document.createElement("div");
      innerDiv.classList.add("text");
      innerDiv.innerHTML = data.msg;
      newMessage.append(innerDiv);
      chatContentEl.append(newMessage);
      if (chatContentEl.classList.contains("show"))
        document.querySelector(".chat-content").scrollIntoView(false);
    },
  },
};
</script>
<style lang="scss">
.chat-window {
  width: 100vw;
  z-index: 4;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
}
.chat-icon {
  height: 30px;
  width: 30px;
  padding-left: 16px;
  z-index: 4;
  cursor: pointer;
}
.chat-bar-container {
  position: fixed;
  display: block;
  width: 100vw;
  transition: all 0.3s ease;
  z-index: 99;
}
.chat-bar {
  background: linear-gradient(90deg, #020024 0%, #56556f 50%, #829ac5 100%);
  display: flex;
  height: 40px;
  align-items: center;
  z-index: 4;
  justify-content: space-between;
}
.button-send {
  z-index: 4;
  padding: 0.75rem;
  background: linear-gradient(45deg, #020024 0%, #56556f 50%, #829ac5 100%);
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  width: max-content;
  display: inline-block;
  margin-left: 0.5rem;
  height: fit-content;
  margin-right: 0.5rem;
  .button-text {
    color: white;
  }
  &:hover {
    background: linear-gradient(90deg, #020024 0%, #56556f 50%, #829ac5 100%);
  }
}
.new-message-container {
  bottom: 0;
  position: fixed;
  z-index: 99;
  height: 77px;
  width: 100vw;
  transition: all 0.3s ease;
}
.new-message {
  display: flex;
  padding: 16px;
  background: #e0e0e0;
  justify-content: center;
}
.chat-content {
  z-index: 3;
  width: 100vw;
  display: inline-block;
  background: #e0e0e0;
  padding-top: 40px;
  padding-bottom: 77px;
  min-height: calc(var(--vh, 1vh) * 100 - 117px);
  transition: all 0.3s ease;
}
.self-message {
  width: 90vw;
  float: right;
  .self-text {
    color: white;
    background: #1f1c58ad;
    padding: 5px;
    margin: 10px;
    border-radius: 10px;
    width: fit-content;
    float: right;
  }
}
.peer-message {
  width: 90vw;
  float: left;
  .peer-text {
    background: #a7b5d0;
    padding: 5px;
    margin: 10px;
    border-radius: 10px;
    width: fit-content;
    float: left;
  }
}
.notification {
  width: 90vw;
  display: inline-block;
  border-top: 1px solid #b7b3b3;
  padding: 5px 0;
  border-bottom: 1px solid #b7b3b3;
}
textarea {
  resize: none;
  font-size: 16px;
  width: 70vw;
}
.hide-chat {
  color: white;
  font-size: 18px;
  margin-right: 8px;
  cursor: pointer;
}
</style>