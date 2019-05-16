
function HouseScene() {
    RemoveAll();

    var texture2 = THREE.ImageUtils.loadTexture("../textures/terrain/clay.png");
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.set(100*50/100,100*50/100);
    var newplane = new THREE.PlaneGeometry(25000, 25000);
    newplane.rotateX(-Math.PI/2);
    groud = new THREE.Mesh(newplane, new THREE.MeshLambertMaterial({
        map: texture2
    }));
    groud.position.set(0,110,0);
    scene.add(groud);
    objects.push(groud);

    texture2 = THREE.ImageUtils.loadTexture("../textures/terrain/grasslight-thin.jpg");
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.set(100*50/100,100*50/100);
    var grassplane = new THREE.PlaneGeometry(3500, 3500);
    grassplane.rotateX(-Math.PI/2);
    var grassgroud = new THREE.Mesh(grassplane, new THREE.MeshLambertMaterial({
        map: texture2
    }));
    grassgroud.position.set(0,115,0);
    scene.add(grassgroud);


    var grassImg = new THREE.ImageUtils.loadTexture("../textures/tree/flower1.png");
    var grassMat = new THREE.MeshLambertMaterial({
        map:grassImg,
        transparent:true
    });
    var geo = new THREE.PlaneGeometry(200, 200 );
    var grass = new THREE.Mesh(geo,grassMat);
    // var posx = -1100;
    // var posz = 700;
    // for(var i =0;i<67;i++){
    //     var grassMesh = grass.clone();
    //     //x:-1100~1700 z:700~-1200
    //     grassMesh.position.set(posx,210,posz);
    //     scene.add(grassMesh);
    //     objects.push(grassMesh);
    //     if(posx===-1100 && posz > -1300)
    //         posz-=100;
    //     else if(posz <= -1300 && posx <1700)
    //         posx+=100;
    //     else if(posx >=1700)
    //         posz+=100;
    // }
    // posx = -1400;
    // posz = 1000;
    // for(var i =0;i<43;i++){
    //
    //     //x:-1500~2000 z:1000~-1500
    //     var tree = forest[0][0].clone();
    //     var leave = forest[0][1].clone();
    //     tree.position.set(posx,110,posz);
    //     leave.position.set(posx,110,posz);
    //     scene.add(tree);
    //     scene.add(leave);
    //     if(posx===-1400 && posz >-1600)
    //         posz-=200;
    //     else if(posz <= -1600 && posx <2000)
    //         posx+=200;
    //     else if(posx >=2000)
    //         posz+=200;
    // }

    neighborhood(grassgroud.clone(),tree,leave,grass)
}

function neighborhood(grassgroud,grassMesh) {

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('conference/');
    var url = 'conference.mtl';
    mtlLoader.load( url, function( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.load( 'conference/conference.obj', function ( object ) {
            var posx = -10000;
            var posz = -10000;
            for(var i = 0; i <24;i++){
                var house = object.clone();
                house.position.set(posx,150,posz);
                scene.add(house);
                posx+=4000;
                if(posx === 14000) {
                    posx = -10000;
                    posz += 6000;
                }
            }
        } );
    });
    var posx = -9750;
    var posz = -10000;
    for(var i = 0; i <24;i++){
        var grass = grassgroud.clone();
        grass.position.set(posx,150,posz);
        scene.add(grass);
        posx+=4000;
        if(posx > 14000) {
            posx = -9750;
            posz += 6000;
        }
    }
    var tree = forest[0][0].clone();
    var leave = forest[0][1].clone();
    tree.position.set(1000,1000,100);
    scene.add(tree);
    leave.position.set(1000,1000,100);
    scene.add(leave);
    grassMesh.position.set(1000,1000,100);
    scene.add(grassMesh);
}

function RemoveAll() {
    for(var i = 0; i < objects.length;i++){
        scene.remove(objects[i]);
    }
    for(var i = 0; i < forest.length;i++){
        for(var j = 0; j <forest[i].length;j++){
            scene.remove(forest[i][j]);
        }
    }
    objects = [];
    planevertices = [];
}