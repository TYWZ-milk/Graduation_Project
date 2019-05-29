var modelSca,modelClo;
var addObj = [];
function onDocumentMouseMove( event ) {
    event.preventDefault();//取消事件的默认动作
    mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( objects );
    if ( intersects.length > 0 && rollOverMesh !== undefined) {
        var intersect = intersects[ 0 ];
        rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
        rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
    }
    render();
}
var selected;
function onDocumentMouseDown( event ) {
    event.preventDefault();
    mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( objects );
    if ( intersects.length > 0 ) {
        var intersect = intersects[ 0 ];
        // delete cube
        if ( isShiftDown ) {
            if ( intersect.object !== groud ) {
                scene.remove(intersect.object);
                objects.splice(objects.indexOf(intersect.object), 1);
            }
            // create cube
        }
        else if(changeDirection) {
            if ( intersect.object !== groud ) {
                for (var i = objects.length - 1; i >= 0; i--)
                    if (intersects[0].object === objects[i]) {

                        selected = objects[i];
                        rotcontrols.attach(selected);
                    }
            }
            else{
                rotcontrols.detach(selected);
            }
        }
        else {
            if(modelClo !== undefined && modelClo !== null) {
                var voxel;
                voxel = modelClo.clone();
                voxel.scale.set(modelSca, modelSca, modelSca);
                voxel.position.copy(intersect.point).add(intersect.face.normal);
                voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
            }
            else{
                voxel = new THREE.Mesh(planeGeo, planeMat);
                voxel.position.copy(intersect.point).add(intersect.face.normal);
                voxel.position.divideScalar(50).floor().multiplyScalar(50);
                voxel.position.y+=110;
            }
            scene.add(voxel);
            objects.push(voxel);
            addObj.push(voxel);
        }
        render();
    }
}
function onDocumentKeyDown( event ) {
    switch( event.keyCode ) {
        case 16: isShiftDown = true; break;
    }
}
function onDocumentKeyUp( event ) {
    switch ( event.keyCode ) {
        case 16: isShiftDown = false; break;
    }
}

function addModel(model){
    changeDirection = false;
    if(model === 3) {
        modelFollow(3);
        modelClo = carrot.clone();
        modelSca = 0.08;
    }
    else if(model === 1){
        modelFollow(1);
        modelClo = corn.clone();
        modelSca = 0.08;
    }
    else if(model === 2){
        modelFollow(2);
        modelClo = aubergine.clone();
        modelSca = 0.08;
    }
    else if(model === 4){
        modelFollow(4);
        modelClo = chililg.clone();
        modelSca = 0.08;
    }
    else if(model === 5){
        modelFollow(5);
        modelClo = cucmber.clone();
        modelSca = 0.08;
    }
    else if(model === 6){
        modelFollow(6);
        modelClo = ground_patch.clone();
        modelSca = 0.08;
    }
    else if(model === 7){
        modelFollow(7);
        modelClo = onion.clone();
        modelSca = 0.08;
    }


}
function modelFollow(model){
    scene.remove(rollOverMesh);
    var loader = new THREE.OBJLoader();
    var url;
    if(model === 3) {
        url =  'crop/carrot.obj';
    }
    else if(model === 1) {
        url =  'crop/Corn_lod2.obj';
    }
    else if(model === 2) {
        url =  'crop/Aubergine2_lod1.obj';
    }    else if(model === 4) {
        url =  'crop/ChiliLg_lod0_High.obj';
    }    else if(model === 5) {
        url =  'crop/Cucmber_lod2.obj';
    }else if(model === 6) {
        url =  'crop/ground_patch.obj';
    }else if(model === 7) {
        url =  'crop/Onion_lod0_High.obj';
    }
    loader.load(url, function (geometry) {
        geometry.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material.depthTest = true;
                child.material = new THREE.MeshBasicMaterial({color: 0xff0000, opacity: 0.5, transparent: true});
                child.geometry.computeBoundingSphere();
            }
        });
        geometry.scale.set(0.08, 0.08, 0.08);
        rollOverMesh = geometry;
        scene.add(rollOverMesh);
    });
}
var carrot,corn,aubergine,chililg,cucmber,ground_patch,onion;
function preModel() {
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('crop/');
    var url = 'carrot.mtl';
    mtlLoader.load( url, function( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.load( 'crop/carrot.obj', function ( object ) {
            carrot = object;
        } );
    });

    mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('crop/');
    url = 'Corn_lod2.mtl';
    mtlLoader.load( url, function( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.load( 'crop/Corn_lod2.obj', function ( object ) {
            corn = object;
        } );
    });

    mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('crop/');
    url = 'Aubergine2_lod1.mtl';
    mtlLoader.load( url, function( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.load( 'crop/Aubergine2_lod1.obj', function ( object ) {
            aubergine = object;
        } );
    });

    mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('crop/');
    url = 'ChiliLg_lod0_High.mtl';
    mtlLoader.load( url, function( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.load( 'crop/ChiliLg_lod0_High.obj', function ( object ) {
            chililg = object;
        } );
    });

    mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('crop/');
    url = 'Cucmber_lod2.mtl';
    mtlLoader.load( url, function( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.load( 'crop/Cucmber_lod2.obj', function ( object ) {
            cucmber = object;
        } );
    });
    mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('crop/');
    url = 'ground_patch.mtl';
    mtlLoader.load( url, function( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.load( 'crop/ground_patch.obj', function ( object ) {
            ground_patch = object;
        } );
    });

    mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('crop/');
    url = 'Onion_lod0_High.mtl';
    mtlLoader.load( url, function( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.load( 'crop/Onion_lod0_High.obj', function ( object ) {
            onion = object;
        } );
    });
}
var planeGeo,planeMat;
function upplaneBuild(upplane,type){
    changeDirection = false;
    modelClo = null;
    if(type === 1) {
        upplaneFollow(1);
        planeGeo = new THREE.PlaneGeometry( 200, 200 );
    }
    else {
        upplaneFollow(0);
        planeGeo = new THREE.PlaneGeometry(  600, 100 );
    }
    // 实体对象，就是鼠标点击确定之后的实体对象，并且实体对象的图片引入
    var anima_flower = new THREE.ImageUtils.loadTexture("../textures/tree/anima_flower_1.png");
    annie = new TextureAnimator( anima_flower, 1, 10, 10, 300 ); // texture, #horiz, #vert, #total, duration.
    if(upplane === 1)
        planeMat = new THREE.MeshLambertMaterial( {  map: new THREE.ImageUtils.loadTexture("../textures/tree/grass1.png"),transparent:true} );
    else if(upplane === 2)
        planeMat = new THREE.MeshLambertMaterial( {  map: new THREE.ImageUtils.loadTexture("../textures/tree/grass2.png"),transparent:true} );
    else if(upplane === 3)
        planeMat = new THREE.MeshLambertMaterial( {  map: new THREE.ImageUtils.loadTexture("../textures/tree/grass3.png"),transparent:true} );
    else if(upplane === 4)
        planeMat = new THREE.MeshLambertMaterial( {  map: new THREE.ImageUtils.loadTexture("../textures/tree/flower1.png"),transparent:true} );
    else if(upplane === 5)
        planeMat = new THREE.MeshLambertMaterial( {  map: anima_flower,transparent:true} );
    else if(upplane === 6)
        planeMat = new THREE.MeshLambertMaterial( {  map: new THREE.ImageUtils.loadTexture("../textures/tree/flower3.png"),transparent:true} );


}
var rollOverGeo,rollOverMaterial;
function upplaneFollow(type){
    scene.remove(rollOverMesh);
    // 这个几何对象是鼠标在移动时候，跟随鼠标显示的几何对象
    if (type !== 1)
        rollOverGeo = new THREE.PlaneGeometry( 600, 100 );//创建一个盒状几何对象
    else
        rollOverGeo = new THREE.PlaneGeometry(  200, 200 );
    rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );

    //创建一个色彩为红色的材料，透明度为半透明
    rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
    //通过mesh方法把颜色应用到几何对象上
    scene.add( rollOverMesh );
    //最后把该立方体对象添加到场景scene中
}