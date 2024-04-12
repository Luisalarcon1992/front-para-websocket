import { Manager, Socket } from "socket.io-client"

const uri = "http://localhost:3000/socket.io/socket.io.js"

// Creamos el socket por fuera del conectToServer para poder acceder a el en otros lugares
// Con esto logramos que el socket no se cree cada vez que se llama a conectToServer y podemos remover los listeners anteriores o los que necesitemos
let socket: Socket; 

export const conectToServer = ( token: string) => {

    // Creamos el manager con la uri y los headers necesarios, en este caso el token de autenticación que se pasa por parámetro
    const manager = new Manager(uri, {
        extraHeaders: {
            authentication: token,
        }
    });

    socket?.removeAllListeners( ) // Removemos todos los listeners anteriores
    socket = manager.socket("/");

    addListeners();


}

// Agregamos los listeners al socket que se pasa por parámetro 
// En este caso, se agregan los listeners para los eventos connect, disconnect, clients-updated, client-message y server-message
const addListeners = () => {

    const serverStatus = document.querySelector<HTMLSpanElement>("#socketInfo");    
    const clientUld = document.querySelector<HTMLUListElement>("#list-clients");
    const messageForm =  document.querySelector<HTMLFormElement>("#clientForm");
    const messageInput = document.querySelector<HTMLFormElement>("#clientMessage");
    const messageUl = document.querySelector<HTMLUListElement>("#message-ul");


    // Agregamos los listeners al socket que se pasa por parámetro 
    // Al escuchar el evento "connect", cambiamos el texto y la clase del span #socketInfo
    socket.on("connect", () => {
        serverStatus!.innerText = "online";
        serverStatus!.className = "online";
    });

    // Al escuchar el evento "disconnect", cambiamos el texto y la clase del span #socketInfo
    socket.on("disconnect", () => {
        serverStatus!.innerText = "disconnected";
        serverStatus!.className = "disconnected";   
    });

    // Al escuchar el evento "clients-updated", actualizamos la lista de clientes conectados
    socket.on("clients-updated", (clients: string[]) => {
        let clientsHtml = '';

        clients.forEach(client => {
            clientsHtml += `<li>${client}</li>`;
        });

        clientUld!.innerHTML = clientsHtml;
    })

    // Al escuchar el evento "server-message", agregamos el mensaje al ul #message-ul

    messageForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        
        if ( !messageInput?.value ) return alert("Please, enter a message");
        
        const message = messageInput?.value;
        
        socket.emit("client-message", message);

        messageInput.value = '';
    });


    socket.on("server-message", (payload: {fullName: string, message: string}) => {

        const newMessage = `<li>${payload.fullName}: ${payload.message}</li>`;

        const li = document.createElement("li");

        li.innerHTML = newMessage;
        messageUl!.appendChild(li);



    });
}