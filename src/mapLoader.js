
const tmx = require('tmx-parser');


module.exports = async () => {
    const map = await new Promise((resolve, reject) => {
        tmx.parseFile("./src/snow-ball-map.tmx", function(err, loadedMap){
            if(err) return reject(err);
            resolve(loadedMap);
        });
    });
    const layer = map.layers[0];
    const tiles = layer.tiles;
    console.log(tiles);
    const map2D = [];
    for(let row = 0; row < map.height; row++){
        const tileRow = [];
        for(let col = 0; col < map.width; col++){
            const tile = tiles[row * map.height + col]
            tileRow.push({id: tile.id, gid: tile.gid});
        }
        map2D.push(tileRow);
    }

    return map2D;

}
