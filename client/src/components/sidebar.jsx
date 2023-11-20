import React, { useState, useContext } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { SocketContext } from '../Context';

const Sidebar = ({ children }) => {
  const context = useContext(SocketContext);
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = context;
  const [idToCall, setIdToCall] = useState('');
  // Check if context values are available
  if (!context) {
    return <div>Loading...</div>; // You can customize this to show a loading message or another fallback UI
  }

 

  return (
    <div style={{ width: '600px', margin: '35px 0', padding: '10px', '@media (max-width: 600px)': { width: '80%' } }}>
      <div style={{ padding: '10px 20px', border: '2px solid black' }}>
        <form style={{ display: 'flex', flexDirection: 'column' }} noValidate autoComplete="off">
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div style={{ padding: '20px' }}>
              <h6>Account Info</h6>
              <input type="text" placeholder="Name" value={name || ''} onChange={(e) => setName(e.target.value)} />
              <CopyToClipboard text={me || ''} style={{ marginTop: '20px' }}>
                <button style={{ padding: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', cursor: 'pointer' }}>
                  Copy Your ID
                </button>
              </CopyToClipboard>
            </div>
            <div style={{ padding: '20px' }}>
              <h6>Make a call</h6>
              <input type="text" placeholder="ID to call" value={idToCall || ''} onChange={(e) => setIdToCall(e.target.value)} />
              {callAccepted && !callEnded ? (
                <button
                  style={{ padding: '10px', backgroundColor: '#f50057', color: 'white', border: 'none', cursor: 'pointer', marginTop: '20px' }}
                  onClick={leaveCall}
                >
                  Hang Up
                </button>
              ) : (
                <button
                  style={{ padding: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', cursor: 'pointer', marginTop: '20px' }}
                  onClick={() => callUser(idToCall)}
                >
                  Call
                </button>
              )}
            </div>
          </div>
        </form>
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
