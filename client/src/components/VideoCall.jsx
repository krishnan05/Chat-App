// import React, { useEffect, useRef, useState } from 'react';
// import 'webrtc-adapter';

// function Videocall({ currentChat, currentUser, socket }) {
//   const [callInProgress, setCallInProgress] = useState(false);
//   const localStream = useRef(null);
//   const remoteStream = useRef(null);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const pc = useRef(null);

//   useEffect(() => {
//     socket.current.emit('add-user', currentUser._id);

//     // Handle incoming offer
//     socket.current.on('offer', async ({ offer, from }) => {
//       console.log('Received offer:', offer);
//       if (!pc.current) {
//         createPeerConnection();
//       }
//       await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
//       const answer = await pc.current.createAnswer();
//       await pc.current.setLocalDescription(answer);
//       socket.current.emit('answer', { answer, to: from });
//     });

//     // Handle incoming answer
//     socket.current.on('answer', async (answer) => {
//       console.log('Received answer:', answer);
//       await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
//     });

//     // Handle incoming ICE candidate
//     socket.current.on('ice-candidate', async (candidate) => {
//       console.log('Received ICE candidate:', candidate);
//       if (candidate) {
//         // Check if pc.current has remote description set
//         if (pc.current.remoteDescription) {
//           await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
//         } else {
//           console.warn('ICE candidate received but remote description is not set yet.');
//         }
//       }
//     });

//     // Clean up event listeners on component unmount
//     return () => {
//       socket.current.off('offer');
//       socket.current.off('answer');
//       socket.current.off('ice-candidate');
//     };
//   }, [socket, currentUser._id]);

//   const createPeerConnection = () => {
//     pc.current = new RTCPeerConnection({
//       iceServers: [
//         { urls: 'stun:stun.l.google.com:19302' },
//         { urls: 'stun:stun1.l.google.com:19302' },
//       ],
//     });

//     pc.current.onicecandidate = (event) => {
//       if (event.candidate) {
//         console.log('Sending ICE candidate:', event.candidate);
//         socket.current.emit('ice-candidate', { candidate: event.candidate, to: currentChat._id });
//       }
//     };

//     pc.current.ontrack = (event) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//     };

//     if (localStream.current) {
//       localStream.current.getTracks().forEach((track) => {
//         pc.current.addTrack(track, localStream.current);
//       });
//     }
//   };

//   const startCall = async () => {
//     try {
//       setCallInProgress(true);
//       createPeerConnection();

//       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       localStream.current = stream;
//       localVideoRef.current.srcObject = stream;

//       stream.getTracks().forEach((track) => {
//         pc.current.addTrack(track, stream);
//       });

//       const offer = await pc.current.createOffer();
//       await pc.current.setLocalDescription(offer);

//       console.log('Sending offer:', offer);
//       socket.current.emit('offer', { offer, to: currentChat._id });
//     } catch (error) {
//       console.error('Error starting call:', error);
//     }
//   };

//   return (
//     <div className="App">
//       <h1>Video Call</h1>
//       {callInProgress ? (
//         <div>
//           <div>
//             <video ref={localVideoRef} autoPlay muted />
//           </div>
//           <div>
//             <video ref={remoteVideoRef} autoPlay />
//           </div>
//         </div>
//       ) : (
//         <button onClick={startCall}>Call</button>
//       )}
//     </div>
//   );
// }

// export default Videocall;
import React, { useEffect, useRef, useState } from 'react';
import 'webrtc-adapter';

function Videocall({ currentChat, currentUser, socket }) {
  const [callInProgress, setCallInProgress] = useState(false);
  const localStream = useRef(null);
  const remoteStream = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pc = useRef(null);

  useEffect(() => {
    socket.current.emit('add-user', currentUser._id);

    // Handle incoming offer
    socket.current.on('offer', async ({ offer, from }) => {
      console.log('Received offer:', offer);
      if (!pc.current) {
        createPeerConnection();
      }
      await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      socket.current.emit('answer', { answer, to: from });
    });

    // Handle incoming answer
    socket.current.on('answer', async (answer) => {
      console.log('Received answer:', answer);
      await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    // Handle incoming ICE candidate
    socket.current.on('ice-candidate', async (candidate) => {
      console.log('Received ICE candidate:', candidate);
      if (candidate) {
        // Check if pc.current has remote description set
        if (pc.current.remoteDescription) {
          await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          console.warn('ICE candidate received but remote description is not set yet.');
        }
      }
    });

    // Clean up event listeners on component unmount
    return () => {
      socket.current.off('offer');
      socket.current.off('answer');
      socket.current.off('ice-candidate');
    };
  }, [socket, currentUser._id]);

  const createPeerConnection = () => {
    pc.current = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });

    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate:', event.candidate);
        socket.current.emit('ice-candidate', { candidate: event.candidate, to: currentChat._id });
      }
    };

    pc.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        pc.current.addTrack(track, localStream.current);
      });
    }
  };

  const startCall = async () => {
    try {
      setCallInProgress(true);
      createPeerConnection();

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStream.current = stream;
      localVideoRef.current.srcObject = stream;

      stream.getTracks().forEach((track) => {
        pc.current.addTrack(track, stream);
      });

      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);

      console.log('Sending offer:', offer);
      socket.current.emit('offer', { offer, to: currentChat._id });
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  return (
    <div className="App">
      <h1>Video Call</h1>
      {callInProgress ? (
        <div>
          <div>
            <video ref={localVideoRef} autoPlay muted />
          </div>
          <div>
            <video ref={remoteVideoRef} autoPlay />
          </div>
        </div>
      ) : (
        <button onClick={startCall}>Call</button>
      )}
    </div>
  );
}

export default Videocall;
