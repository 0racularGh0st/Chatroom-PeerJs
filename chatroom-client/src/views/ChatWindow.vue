<template>
    <div>
        <div class="chat-window">
            <div class="chat-bar-container">
                <div class="chat-bar">
                <img :src="chat_icon" alt="chat icon" class="chat-icon">
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
                        <div class="button-text">Send</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import chat_icon from '../assets/chat.svg';
export default {
    data(){
        return{
            chat_icon : chat_icon
        }
    }
}
</script>
<style lang="scss" scoped>
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
}
.chat-bar-container{
    position: fixed;
    display: block;
    width: 320px;
}
.chat-bar{
    background: linear-gradient(90deg, #020024 0%, #56556f 50%, #829ac5 100%);
    display: flex;
    height: 40px;
    align-items: center;
    z-index: 4;
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
  }
  .self-message{
    max-width: 240px;
    float: right;
    background: #1f1c58ad;
    padding: 5px;
    margin: 10px;
    display: inline-block;
    border-radius: 10px;
      .self-text{
          color: white;
      }
  }
  .peer-message{
    max-width: 240px;
    float: left;
    margin: 10px;
    display: inline-block;
    border-radius: 10px;
    padding: 5px;
    background: #a7b5d0;
      .peer-text{

      }
  }
  .notification{
    width: 280px;
    display: inline-block;
    border-top: 1px solid #b7b3b3;
    padding: 5px 0;
    border-bottom: 1px solid #b7b3b3;
  }
</style>