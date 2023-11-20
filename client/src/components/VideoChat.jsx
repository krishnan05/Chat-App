import React, { useContext } from 'react';

import { SocketContext } from '../Context';

const VideoPlayer = () => {
  const context = useContext(SocketContext);

  // Check if context values are available
  if (!context) {
    return <div>Loading...</div>; // You can customize this to show a loading message or another fallback UI
  }

  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = context;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', margin: '10px' }}>
      {stream && (
        <div style={{ padding: '10px', border: '2px solid black', margin: '10px' }}>
          <h5>{name || 'Name'}</h5>
          <video playsInline muted ref={myVideo} autoPlay style={{ width: '550px', '@media (max-width: 600px)': { width: '300px' } }} />
        </div>
      )}
      {callAccepted && !callEnded && (
        <div style={{ padding: '10px', border: '2px solid black', margin: '10px' }}>
          <h5>{call && call.name ? call.name : 'Name'}</h5>
          <video playsInline ref={userVideo} autoPlay style={{ width: '550px', '@media (max-width: 600px)': { width: '300px' } }} />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;