
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
    groud.position.set(0,0,0);
    scene.add(groud);
    objects.push(groud);

    texture2 = THREE.ImageUtils.loadTexture("../textures/terrain/grass.png");
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.set(100*50/100,100*50/100);
    var grassplane = new THREE.PlaneGeometry(3500, 3500);
    grassplane.rotateX(-Math.PI/2);
    var grassgroud = new THREE.Mesh(grassplane, new THREE.MeshLambertMaterial({
        map: texture2
    }));


    var grassImg = new THREE.ImageUtils.loadTexture("../textures/tree/flower1.png");
    var grassMat = new THREE.MeshLambertMaterial({
        map:grassImg,
        transparent:true
    });
    var geo = new THREE.PlaneGeometry(200, 200 );
    var grass = new THREE.Mesh(geo,grassMat);

    neighborhood(grassgroud.clone(),grass)
}

function neighborhood(grassgroud,grassMesh) {

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('conference/');
    var url = 'huisuo.mtl';
    mtlLoader.load( url, function( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.load( 'conference/huisuo.obj', function ( object ) {
            object.scale.set(0.05,0.05,0.05);
            var posx = -11200;
            var posz = -9000;
            for(var i = 0; i <24;i++){
                var house = object.clone();
                house.position.set(posx,10,posz);
                scene.add(house);
                posx+=4000;
                if(posx >= 14000) {
                    posx = -11200;
                    posz += 6000;
                }
            }
        } );
    });
    var posx = -9600;
    var posz = -10000;
    for(var i = 0; i <24;i++){
        var grass = grassgroud.clone();
        grass.position.set(posx,5,posz);
        scene.add(grass);
        posx+=4000;
        if(posx > 14000) {
            posx = -9600;
            posz += 6000;
        }
    }

    var left = -11100;
    var right = -8200;
    var top = -11300;
    posx = -11100;
    posz = -9200;
    for(var j = 0;j<24;j++) {
        for (var i = 0; i < 71; i++) {
            var flowers = grassMesh.clone();
            flowers.position.set(posx, 110, posz);
            scene.add(flowers);
            objects.push(flowers);
            if (posx === left && posz > top)
                posz -= 100;
            else if (posz <= top && posx < right)
                posx += 100;
            else if (posx >= right)
                posz += 100;
        }
        posx+=1100;
        left+=4000;
        right+=4000;
        if(posx > 10000) {
            posx = -11100;
            left = -11100;
            right = -8200;
            posz += 6000;
            top+=6000;
        }
    }


    left = -11200;
    right = -8100;
    top = -11400;
    posx = -11200;
    posz = -9300;
    for(var j = 0;j<24;j++) {
        for (var i = 0; i < 21; i++) {
            var tree = forest[0][0].clone();
            var leave = forest[0][1].clone();
            var rotation = Math.random()*Math.PI*4;
            tree.position.set(posx, 0, posz);
            leave.position.set(posx, 0, posz);
            leave.rotation.set(0,rotation,0);
            scene.add(tree);
            scene.add(leave);
            if (posx === left && posz > top)
                posz -= 400;
            else if (posz <= top && posx < right)
                posx += 400;
            else if (posx >= right)
                posz += 400;
        }
        posx+=800;
        left+=4000;
        right+=4000;
        if(posx > 10000) {
            posx = -11200;
            left = -11200;
            right = -8100;
            posz += 6000;
            top+=6000;
        }
    }
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