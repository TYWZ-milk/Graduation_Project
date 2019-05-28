var groud;
//天空盒
function loadSky() {
    //add skybox
    var urlPrefix = "../textures/skybox/";
    var urls = [ urlPrefix + "px.jpg", urlPrefix + "nx.jpg",
        urlPrefix + "py.jpg", urlPrefix + "ny.jpg",
        urlPrefix + "pz.jpg", urlPrefix + "nz.jpg" ];
    var textureCube = THREE.ImageUtils.loadTextureCube( urls );
    var shader = THREE.ShaderLib["cube"];
    shader.uniforms['tCube'].value= textureCube;   // textureCube has been init before
    var material = new THREE.ShaderMaterial({
        fragmentShader    : shader.fragmentShader,
        vertexShader  : shader.vertexShader,
        uniforms  : shader.uniforms,
        depthWrite:false,
        side:THREE.BackSide
    });
    // build the skybox Mesh
    // add it to the scene
    return new THREE.Mesh(new THREE.CubeGeometry(25000, 25000, 25000), material);
}

//地面
var planevertices;
    function loadGround() {
        //add ground
    var texture2 = THREE.ImageUtils.loadTexture("../textures/terrain/farmland_dry.png");
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.set(100*50/100,100*50/100);
    var plane = new THREE.PlaneBufferGeometry(25000,25000,255,255);
    plane.rotateX(-Math.PI/2);
    planevertices = plane.attributes.position.array;
    var data = generateHeight( 256, 256 );
    for ( var i = 0, j = 0, l = planevertices.length; i < l; i ++, j += 3 ) {

        planevertices[ j + 1 ] = data[ i ] * 10;
    }
    plane.computeVertexNormals();
    groud =  new THREE.Mesh(plane, new THREE.MeshLambertMaterial({
        map: texture2
    }));
    objects.push(groud);
    return groud
}
function generateHeight( width, height ) {

    var size = width * height, data = new Uint8Array( size ),
        perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 100;

    for ( var j = 0; j < 4; j ++ ) {

        for ( var i = 0; i < size; i ++ ) {

            var x = i % width, y = ~~ ( i / width );
            data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );

        }

        quality *= 5;

    }

    return data;

}
var grasses = [];
var annie;
function loadFlower(flower,number) {
    if(flower===1)
        var grassImg = new THREE.ImageUtils.loadTexture("../textures/tree/gif.png");
    else if (flower===2)
        var grassImg = new THREE.ImageUtils.loadTexture("../textures/tree/flower2.png");
    else
        var grassImg = new THREE.ImageUtils.loadTexture("../textures/tree/flower3.png");
    var grassMat = new THREE.MeshLambertMaterial({
        map:grassImg,
        transparent:true
    });
    annie = new TextureAnimator( grassImg, 10, 1, 10, 3000 ); // texture, #horiz, #vert, #total, duration.
    var leaf_size = 20;
    var geo = new THREE.PlaneGeometry(leaf_size,leaf_size);
    var grass = new THREE.Mesh(geo,grassMat);
    grass.geometry.translate(0,leaf_size/2.0,0);
    var pos = 30;
    for(var j = 0;j<number/50;j++) {
        for (var i = 0; i < 50; i++) {
            var grassMesh = grass.clone();
            grassMesh.position.x += planevertices[pos];
            grassMesh.position.z += planevertices[pos + 2];
            grassMesh.position.y += planevertices[pos + 1];
            var rotation = Math.random()*Math.PI*4;
            var randomsize = Math.random() * 8 + 1;
            grassMesh.scale.set(randomsize,randomsize,randomsize);
            grassMesh.rotation.set(0,rotation,0);
            scene.add(grassMesh);
            grasses.push(grassMesh);
            if(i%10!==0)
                pos += 3;
            else
                pos+=3*250;
        }
        pos+=300 * Math.floor(Math.random() * 12 + 1);
    }
}
function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration)
{
    // note: texture passed by reference, will be updated by the update function.

    this.tilesHorizontal = tilesHoriz;
    this.tilesVertical = tilesVert;
    // how many images does this spritesheet contain?
    //  usually equals tilesHoriz * tilesVert, but not necessarily,
    //  if there at blank tiles at the bottom of the spritesheet.
    this.numberOfTiles = numTiles;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );
    // how long should each image be displayed?
    this.tileDisplayDuration = tileDispDuration;
    // how long has the current image been displayed?
    this.currentDisplayTime = 0;
    // which image is currently being displayed?
    this.currentTile = 0;

    this.update = function( milliSec )
    {
        this.currentDisplayTime += milliSec;
        while (this.currentDisplayTime > this.tileDisplayDuration)
        {
            this.currentDisplayTime -= this.tileDisplayDuration;
            this.currentTile++;
            if (this.currentTile == this.numberOfTiles)
                this.currentTile = 0;
            var currentColumn = this.currentTile % this.tilesHorizontal;
            texture.offset.x = currentColumn / this.tilesHorizontal;
            var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
            texture.offset.y = currentRow / this.tilesVertical;
        }
    };
}

function loadGrass(grasss,number) {
    if(grasss===1)
        var grassImg = new THREE.ImageUtils.loadTexture("../textures/tree/grass1.png");
    else if (grasss===2)
        var grassImg = new THREE.ImageUtils.loadTexture("../textures/tree/grass2.png");
    else
        var grassImg = new THREE.ImageUtils.loadTexture("../textures/tree/grass3.png");
    var grassMat = new THREE.MeshLambertMaterial({
        map:grassImg,
        transparent:true
    });
    var leaf_size = 100;
    var geo = new THREE.PlaneGeometry(leaf_size*6,leaf_size);
    var grass = new THREE.Mesh(geo,grassMat);
    grass.geometry.translate(0,leaf_size/2.0,0);
    var pos = 30;
    for(var j = 0;j<number/10;j++) {
        for (var i = 0; i < 10; i++) {
            var grassMesh = grass.clone();
            grassMesh.position.x += planevertices[pos];
            grassMesh.position.z += planevertices[pos + 2];
            grassMesh.position.y += planevertices[pos + 1];
            var rotation = Math.random()*Math.PI*4;
            grassMesh.rotation.set(0,rotation,0);
            scene.add(grassMesh);
            grasses.push(grassMesh);
            if(i%2!==0)
                pos += 3;
            else
                pos+=3*250;
        }
        pos+=300 * Math.floor(Math.random() * 12 + 1);
    }
}

function cropClone(object,scale,number) {
    var pos = 30;
    for(var j = 0;j<number/20;j++) {
        for (var i = 0; i < 20; i++) {
            var grassMesh = object.clone();
            grassMesh.position.x += planevertices[pos];
            grassMesh.position.z += planevertices[pos + 2];
            grassMesh.position.y += planevertices[pos + 1];
            var rotation = Math.random()*Math.PI*4;
            grassMesh.rotation.set(0,rotation*i,0);
            var scaleR = Math.random();
            grassMesh.scale.set(scaleR*scale,scaleR *scale,scaleR * scale);
            scene.add(grassMesh);
            grasses.push(grassMesh);
            pos += 3;
        }
        pos+=3 * 236;
    }
}

function loadCrop(crop,number) {
    if(crop===1) {
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('crop/');
        var url = 'carrot.mtl';
        mtlLoader.load( url, function( materials ) {
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.load( 'crop/carrot.obj', function ( object ) {
                cropClone(object,0.08,number);
            } );
        });
    }
    else if (crop===2){
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('crop/');
        var url = 'ChiliLg_lod0_High.mtl';
        mtlLoader.load( url, function( materials ) {
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.load( 'crop/ChiliLg_lod0_High.obj', function ( object ) {
                cropClone(object,0.08,number);
            } );
        });
    }
    else if(crop === 3){
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('crop/');
        var url = 'Corn_lod2.mtl';
        mtlLoader.load( url, function( materials ) {
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.load( 'crop/Corn_lod2.obj', function ( object ) {
                cropClone(object,0.08,number);
            } );
        });
    }
    else if(crop === 4){
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('crop/');
        var url = 'Cucmber_lod2.mtl';
        mtlLoader.load( url, function( materials ) {
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.load( 'crop/Cucmber_lod2.obj', function ( object ) {
                cropClone(object,0.08,number);
            } );
        });
    }
    else if(crop === 5){
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('crop/');
        var url = 'Onion_lod0_High.mtl';
        mtlLoader.load( url, function( materials ) {
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.load( 'crop/Onion_lod0_High.obj', function ( object ) {
                cropClone(object,0.08,number);
            } );
        });
    }
    else if(crop === 6){
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('crop/');
        var url = 'ground_patch.mtl';
        mtlLoader.load( url, function( materials ) {
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.load( 'crop/ground_patch.obj', function ( object ) {
                cropClone(object,0.2,number);
            } );
        });
    }
    else if(crop === 7){
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('crop/');
        var url = 'Aubergine2_lod1.mtl';
        mtlLoader.load( url, function( materials ) {
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.load( 'crop/Aubergine2_lod1.obj', function ( object ) {
                cropClone(object,0.08,number);
            } );
        });
    }

}