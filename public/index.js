const mapImage = new Image();
mapImage.src = './tileset.png';

const santaImage = new Image();
santaImage.src = './santa.png';

const canvasEl = document.getElementById('canvas');
canvasEl.width = window.innerWidth;
canvasEl.height = window.innerHeight; 
const canvas = canvasEl.getContext("2d");

console.log(canvasEl)
const socket = io('ws://localhost:5000');
let groundMap = [[]];
let decalMap = [[]];
let players = [];
let snowballs = [];
const TILE_SIZE = 32;


socket.on("connect", () => {
    console.log("connected");
    console.log(socket.id);
});

socket.on('map', (loadedMap)=>{
    groundMap = loadedMap.ground;
    decalMap = loadedMap.decals;
});

socket.on('players', (serverPlayers) => {
    players = serverPlayers;

})
socket.on('snowballs', (serverSnowballs) => {
    snowballs = serverSnowballs;

})

const inputs = {
    up: false,
    down: false,
    left: false,
    right: false,
}
window.addEventListener('keydown', (e) =>{
    console.log(e);
    if(e.key === 'w'){
        inputs["up"] = true;
    }else if(e.key === 's'){
        inputs["down"] = true;
    }else if(e.key === 'a'){
        inputs["left"] = true;
    }else if(e.key === 'd'){
        inputs["right"] = true;
    }
    socket.emit("inputs", inputs);
});
window.addEventListener('keyup', (e) =>{
    console.log(e);
    if(e.key === 'w'){
        inputs["up"] = false;
    }else if(e.key === 's'){
        inputs["down"] = false;
    }else if(e.key === 'a'){
        inputs["left"] = false;
    }else if(e.key === 'd'){
        inputs["right"] = false;
    }
    socket.emit("inputs", inputs);
});
window.addEventListener('click', (e) =>{
    const angle = Math.atan2(e.clientY - canvasEl.height/2, e.clientX - canvasEl.width/2);
    socket.emit('snowball', angle)
})
function loop(){
    
    canvas.clearRect(0,0,canvasEl.width, canvasEl.height);

    const myPlayer = players.find((player) => player.id === socket.id);
    console.log(myPlayer);
    let cameraX = 0;
    let cameraY = 0;
    if(myPlayer){
        cameraX = parseInt(myPlayer.x - canvasEl.width / 2);
        cameraY = parseInt(myPlayer.y - canvasEl.height /2);
    }else{
        console.log('none');
    }
    

    const TILES_IN_ROW = 8;
    for (let row = 0; row < groundMap.length; row++) {
        for (let col = 0; col < groundMap[0].length; col++) {
          let { id } = groundMap[row][col];
          const imageRow = parseInt(id / TILES_IN_ROW);
          const imageCol = id % TILES_IN_ROW;
          canvas.drawImage(
            mapImage,
            imageCol * TILE_SIZE,
            imageRow * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE,
            col * TILE_SIZE - cameraX,
            row * TILE_SIZE - cameraY,
            TILE_SIZE,
            TILE_SIZE
          );
        }
      }
    
      // decals
      for (let row = 0; row < decalMap.length; row++) {
        for (let col = 0; col < decalMap[0].length; col++) {
          let { id } = decalMap[row][col] ?? { id: undefined };
          const imageRow = parseInt(id / TILES_IN_ROW);
          const imageCol = id % TILES_IN_ROW;
    
          canvas.drawImage(
            mapImage,
            imageCol * TILE_SIZE,
            imageRow * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE,
            col * TILE_SIZE - cameraX,
            row * TILE_SIZE - cameraY,
            TILE_SIZE,
            TILE_SIZE
          );
        }
      }
    for(const player of players){
        canvas.drawImage(santaImage, player.x - cameraX, player.y - cameraY);
    }


    for(const snowball of snowballs){
        canvas.fillStyle = "#FFFFFF";
        canvas.beginPath();
        canvas.arc(
        snowball.x - cameraX,
        snowball.y - cameraY,
        3,
        0,
        2 * Math.PI
        );
        canvas.fill();
    }

    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);