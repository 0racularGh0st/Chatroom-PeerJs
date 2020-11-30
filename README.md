# Chatroom-PeerJs
This is a Video/Audio/Chatting application that basically does that, Video Call + Chat & Audio Call + Chat. 
You can try it out at https://peer-vue.web.app/  (Hosted in Firebase)

This Project has 3 integral parts. 
1. The Signalling server (NodeJS, Express, Socket.io, PeerJS)
2. The Peer Server (NodeJS) (https://github.com/0racularGh0st/peer-server) (If you want to go beyond just running it locally and want it deployed on some server)
3. The Client (Vue 3, PeerJS, Socket.io)

Credits to https://github.com/WebDevSimplified for the basic functionality. Link to his repo-> https://github.com/WebDevSimplified/Zoom-Clone-With-WebRTC

# Some of the Features I Added

1. Create/Join Video Room.
2. Create/Join Audio Room.
3. Room Id Validation. 
4. Cross Origin Interactions (If you wish to deploy the services seperately).
5. Live Chat with Audio/Video Call.
6. Make the client installable on all devices as a PWA(Progressive Web App).

# How To Run (Locally)(tested with Node 10+)

1. Start the signalling server(port 3002):
```
cd chatroom-signalling-server
npm install
npm run devStart
```

2. Start the Peer server(port 3001):
```
npm install -g peer
peerjs --port 3001
```
3. Start the client(port 8080): 
```
cd chatroom-client
npm install 
npm run serve
```
# Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- |
| last 4 versions| last 4 versions| 12.1+

