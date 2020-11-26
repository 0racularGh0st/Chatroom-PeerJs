<template>
    <div>
        <div class="chat-window">
            <div class="chat-bar">
                <img :src="chat_icon" alt="chat icon" class="chat-icon">
            </div>
            <div class="chat-content">

            </div>
            <div>
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
    position: absolute;
    width: 320px;
    height: 100vh;
    right: 0;
    background: #e0e0e0;
}
.chat-icon{
    height: 30px;
    width: 30px;
    padding-left: 16px;
}
.chat-bar{
    background: linear-gradient(90deg, #020024 0%, #56556f 50%, #829ac5 100%);
    display: flex;
    height: 40px;
    align-items: center;
}
.button-send{
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
 .new-message{
    bottom: 0;
    position: fixed;
    display: flex;
    padding: 0.5rem;
  }
</style>