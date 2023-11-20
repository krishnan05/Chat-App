import React from 'react'
import styled from 'styled-components'

export default function Welcome({currentUser}) {
  
  return (
    <Container>
    <h1>
        Welcome, <span>{currentUser.username}!</span>
    </h1>
    <h3>Please select a chat to start Messaging.</h3>
</Container>
      

       
  
  )
}

const Container = styled.div
`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
color: rgb(0, 9, 28);
img{
    height: 20rem;
}
span{
    color: #4e00ff;
    text-transform: capitalize;
}
`;