import { conectToServer } from './socket-client'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
  <h1>Web Socket - Client</h1>

  <input id="jwt" placeholder="Json Web Token" />
  <button id="btn">Connect</button>

  <span id="socketInfo">offline</span>

  <ul id="list-clients">
    <li>list of person connected on server</li>
  </ul>

  <form id="clientForm">
    <input type="text" id="clientMessage" placeholder="Enter message">
  </form>

  <h3>Messages</h3>
  <ul id="message-ul"> </ul>
  </div>
`


// conectToServer()

const jwtToken = document.querySelector<HTMLInputElement>('#jwt')!
const btn = document.querySelector<HTMLButtonElement>('#btn')!

btn.addEventListener('click', () => {
  if (!jwtToken.value) return alert('Please, enter a JWT token')

  conectToServer(jwtToken.value)
})