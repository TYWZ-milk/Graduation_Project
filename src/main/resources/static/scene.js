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
    var texture2 = THREE.ImageUtils.loadTexture("../textures/terrain/backgrounddetailed6.jpg");
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
    var groud =  new THREE.Mesh(plane, new THREE.MeshLambertMaterial({
        map: texture2
    }));
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
function loadGrass() {
    var grassImg = new THREE.ImageUtils.loadTexture("../textures/tree/grass1.png");
    var grassMat = new THREE.MeshLambertMaterial({
        map:grassImg,
        color:0x253F08,
        side:THREE.DoubleSide,
        transparent:true
    });
    var leaf_size = 200;
    var geo = new THREE.PlaneGeometry(leaf_size,leaf_size);
    var grass = new THREE.Mesh(geo,grassMat);
    grass.geometry.translate(0,leaf_size/2.0,0);
    var pos = 30;
    for(var j = 0;j<20;j++) {
        for (var i = 0; i < 50; i++) {
            var grassMesh = grass.clone();
            grassMesh.position.x += planevertices[pos];
            grassMesh.position.z += planevertices[pos + 2];
            grassMesh.position.y += planevertices[pos + 1];
            var rotation = Math.random()*Math.PI*4;
            grassMesh.rotation.set(0,rotation,0);
            scene.add(grassMesh);
            if(i%10!==0)
                pos += 3;
            else
                pos+=3*250;
        }
        pos+=300 * Math.floor(Math.random() * 12 + 1);
    }
}