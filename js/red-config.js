// Public signaling is supplied by PeerJS. Add your TURN entry here if needed.
const RED_CONFIG={
 protocol:2,
 roomPrefix:'cabezones-amigos-v2-',
 alphabet:'ABCDEFGHJKMNPQRSTUVWXYZ23456789',
 reconnectMs:20000,
 snapshotHz:30,
 interpolationMs:80,
 peer:{secure:true,debug:0,config:{iceServers:[
  {urls:'stun:stun.l.google.com:19302'},
  {urls:'stun:stun.cloudflare.com:3478'}
  // {urls:'turn:your-server:3478',username:'user',credential:'password'}
 ]}}
};
