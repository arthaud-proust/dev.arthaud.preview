const sketchCode = window.location.pathname.split('/')[2];
const socket = io.connect(window.location.origin);


socket.on('redirect', to=>{
    window.location.href = to;
})
