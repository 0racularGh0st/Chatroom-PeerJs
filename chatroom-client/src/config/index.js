module.exports = {
    SIGNALLING_SERVER : "http://localhost:3002", //or your own signalling server
    PEER_SERVER: "localhost:3001", // or your own peer server
    ROOM_PATTERN: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    ICE_SERVERS: {
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:stun1.l.google.com:19302",
              "stun:stun2.l.google.com:19302",
              "stun:stun3.l.google.com:19302"
            ],
          }
          // You can get a turn server from https://xirsys.com/ for free with limited bandwidth though. 
          // It's good enough for testing. Generate static turn credentials and fill them below
          // ,
          // {
          //   username: "replace with your turn server's  username",
          //   credential: "replace with your turn server's credential",
          //   urls: [
          //     "turn:<turn server uri>:<port>?transport=udp or tcp",
          //   ],
          // },
        ],
        sdpSemantics: "unified-plan",
      }
}