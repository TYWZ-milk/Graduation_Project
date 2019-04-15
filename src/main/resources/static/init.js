/**
 * Created by deii66 on 2018/1/30.
 */
// stats 控制面板 lbbs LBB.js渲染优化 forest 场景内所有树木 leaves 与leavesupdate()相关
var scene,renderer,camera,Trackcontrols,stats,lbbs;
var forest = [];
function init() {

    // lbbs = new LBBs();
    THREE.Cache.clear();
    var canvas = document.getElementById("canvas");
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer = new THREE.WebGLRenderer({
        antialias:true,
        canvas:canvas
    });
    renderer.setSize(width,height);
    renderer.setClearColor(0xaaaaaa,1.0);


    scene = new THREE.Scene();
    scene.frustumCulled = false;
    scene.matrixAutoUpdate = false;

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0,1,1).normalize();
    scene.add(light);
    light = new THREE.AmbientLight(0xffffff,1);
    scene.add(light);

    camera = new THREE.PerspectiveCamera(45,width/height,1,18000);
    camera.position.y = 3000;
    camera.position.z = 1000;
    camera.lookAt(0,0,0);

    Trackcontrols = new THREE.OrbitControls( camera, renderer.domElement );
    Trackcontrols.movementSpeed = 500;
    Trackcontrols.lookSpeed = 0.1;
    Trackcontrols.lookVertical = true;

    THREE.Cache.clear();
    var tgaLoader = new THREE.TGALoader();
    var texture = tgaLoader.load('crop/aTextures/Vegetables_OP.tga', function () {
    });
    THREE.Loader.Handlers.add(/\.tga$/i, new THREE.TGALoader());
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('crop/');
    var url = 'qiezie.mtl';
    mtlLoader.load( url, function( materials ) {


        materials.preload();
        materials.materials = new THREE.MeshLambertMaterial({
            // wireframe:true,

            map:new THREE.ImageUtils.loadTexture("../textures/tree/diffuse-min.png")
        });
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.load( 'crop/qiezie.obj', function ( object ) {
            object.position.y = - 95;
            scene.add( object );

        } );

    });

    initStats();
    initGui();
    initScene();
    initObject();
    newtreecircle(message);
    clean();
    //smallMap();
    animate();
}
function clean() {
    branchImg = null;
    leafImg = null;
    leafMat = null;
    leafMesh = null;
    branchesgeo = null;
    branch = null;
    instanceBranchSet = null;
    material = null;
    tree = null;
    tree1 = null;
    geo = null;
    planepos = null;
}
//小地图
function smallMap(){

    var plane2Geometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    var plane2Material = new THREE.MeshLambertMaterial({color: 0xffffff});
    var plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
    plane2.receiveShadow = true;
    plane2.rotation.x = -0.5 * Math.PI;
    plane2.position.x = 0;
    plane2.position.y = 0;
    plane2.position.z = 0;
    var scene2 = new THREE.Scene();
    scene2.add(groud);

    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene2.add(ambientLight);
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, 20);
    spotLight.castShadow = true;
    scene2.add(spotLight);


    var camera2 = new THREE.PerspectiveCamera(50, window.innerWidth/ window.innerHeight, 0.1, 2000);
    camera2.position.x = 0;
    camera2.position.y = 50;
    camera2.position.z = 0;
    camera2.lookAt(scene2.position);

    var renderer2 = new THREE.WebGLRenderer({ alpha: true });
    renderer2.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
    renderer2.setSize(300, 300 );
    renderer2.shadowMapEnabled = true;
    document.getElementById('demo').appendChild(renderer2.domElement);

    render2();
    function update(){

        plane2.position.x=groud.position.x;
        plane2.position.y=groud.position.y;
        plane2.position.z=groud.position.z;
        plane2.rotation.x=groud.rotation.x;
        plane2.rotation.y=groud.rotation.y;
        plane2.rotation.z=groud.rotation.z;
        plane2.scale.x=groud.scale.x;
        plane2.scale.y=groud.scale.y;
        plane2.scale.z=groud.scale.z;
    }

    function render2() {
        update();

        renderer2.render(scene2, camera2);
        requestAnimationFrame(render2);
    }

}


function initStats() {

    stats = new Stats();

    stats.setMode(0); // 0: fps, 1: ms

    // 放在左上角
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild(stats.domElement);

    return stats;
}

//控制界面参数 browse 轨道浏览参数
var browse = false;
var controls = new function (){

    //树木种类
    this.flower1 = false;
    this.flower2 = false;
    this.flower3 = false;
    this.grass1 = false;
    this.grass2 = false;
    this.grass3 = false;

    //初始树木量
    this.TreeNumber = 100;

    //清空画面
    this.Clean = function(){
        for(var i=0 ; i <grasses.length;i++){
            scene.remove(grasses[i]);
        }
    };

    //树木合成
    this.Build = function (){
        if(this.flower1===true){
            loadFlower(1);
        }
        if(this.flower2===true){
            loadFlower(2);
        }
        if(this.flower3===true){
            loadFlower(3);
        }
        if(this.grass1===true){
            loadGrass(1)
        }
        if(this.grass2===true){
            loadGrass(2);
        }
        if(this.grass3===true){
            loadGrass(3)
        }
    };

    //浏览轨道
    //this.Orbit = function (){
    //    browse = true;
    //    camera.position.set(-4000,1300,-4000);
    //};
};


//控制界面
function initGui(){
    var dataGui = new dat.GUI();
    var grassFolder = dataGui.addFolder( '草坪' );
    var flowerFolder = dataGui.addFolder( '花丛' );

    flowerFolder.add(controls,'flower1');
    flowerFolder.add(controls,'flower2');
    flowerFolder.add(controls,'flower3');
    grassFolder.add(controls,'grass1');
    grassFolder.add(controls,'grass2');
    grassFolder.add(controls,'grass3');
    dataGui.add(controls,'Build');
    // dataGui.add(controls,"TreeNumber",50,15000).step(50);
    //dataGui.add(controls, "Orbit");
    dataGui.add(controls,'Clean');
}

//初始化场景
function initScene() {
    scene.add(loadGround());
    scene.add(loadSky());
}

//回字形轨道
function orbit(){
    if(browse == true) {
        Trackcontrols.enabled = false;
        camera.lookAt(0,0,0);
        if(camera.position.x < 4000 && camera.position.z == -4000)
            camera.position.x = camera.position.x + 10;
        else if(camera.position.x == 4000 && camera.position.z <4000)
            camera.position.z = camera.position.z + 10;
        else if(camera.position.z == 4000 && camera.position.x > -4000)
            camera.position.x = camera.position.x - 10;
        else if(camera.position.x == -4000 && camera.position.z > 0)
            camera.position.z = camera.position.z - 10;
        else if(camera.position.x <0 && camera.position.z ==0)
            camera.position.x = camera.position.x + 10;
        else if(camera.position.x ==0 && camera.position.z ==0)
        {
            Trackcontrols.enabled = true;
            browse = false;
        }
    }
}


var clock = new THREE.Clock();
function animate() {

    //每10秒更新一次界面，防止频闪现象
    var d= new Date();
    if(d.getSeconds()%10 === 0) {
        forestupdate();
        update = 0;
    }
    //FOI();
    //billboard
    for(var i =0;i<grasses.length;i++){
        grasses[i].quaternion.copy(camera.quaternion);
    }
    //leavesupdate();

    //浏览轨道控制
    // var delta = clock.getDelta();
    // orbit();
    // Trackcontrols.update(delta);

    //实时渲染
    stats.begin();
    renderer.clear();
    renderer.render(scene,camera);
    stats.end();
    // lbbs.update();
    // scene.traverse( function ( object ) {
    //     if ( object instanceof THREE.LOD ) {
    //         object.update( camera );
    //         console.log("sda");
    //     }
    // } );
    requestAnimationFrame(animate);
    if(annie!=null)
        annie.update(1000 * delta);
}
