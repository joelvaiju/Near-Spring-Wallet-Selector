import React from 'react';
import PropTypes from 'prop-types';

export default function Messages({ messages }) {
  console.log(messages)
  return (
    <>
      <h2>Messages</h2>

      {messages.map((message, i) =>
       
        // TODO: format as cards, add timestamp
        <div id ="card" key={i} className={message.premium ? 'is-premium' : 'not-premium'}>
          <strong>Signer : {" "}{message.sender}</strong><br/>
          
          Messege  : <span className="message">{" "}{message.text}</span>  <br/>        
          Donation : {" "}{message.donation ? message.donation/10**24 : '0'} <span title="NEAR Tokens">Ⓝ</span> <br/>   
           <span className="datetime">Signed on : {" "}{(new Date(parseInt(message.datetime)/1000000)).toString()}</span>
        </div>
      )}
    </>
  );
}

Messages.propTypes = {
  messages: PropTypes.array
};
