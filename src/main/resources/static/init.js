/**
 * Created by deii66 on 2018/1/30.
 */
// stats 控制面板 lbbs LBB.js渲染优化 forest 场景内所有树木 leaves 与leavesupdate()相关
var scene,renderer,camera,Trackcontrols,stats,lbbs,mouse,raycaster,isShiftDown = false,rollOverMesh,rotcontrols;
var forest = [],objects = [];
var changeDirection = false;
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

    rotcontrols = new THREE.TransformControls(camera,renderer.domElement);
    rotcontrols.addEventListener( 'change', render );
    rotcontrols.setMode("rotate");
    scene.add(rotcontrols);

    THREE.Cache.clear();

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    preModel();

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );//鼠标移动事件
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );//鼠标点击事件
    document.addEventListener( 'keydown', onDocumentKeyDown, false );//对shift按键的控制
    document.addEventListener( 'keyup', onDocumentKeyUp, false );//对shift按键的控制

    //initStats();
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

    // //树木种类
    this.flower1 = false;
    this.flower2 = false;
    this.flower3 = false;
    this.grass1 = false;
    this.grass2 = false;
    this.grass3 = false;
    this.corn = false;
    this.aubergine = false;
    this.carrot = false;
    this.chililg = false;
    this.cucmber = false;
    this.ground_patch = false;
    this.onion = false;


    //初始树木量
    //this.Number = 100;

    //清空画面
    this.Clean = function(){
        for(var i=1 ; i <addObj.length;i++){
            scene.remove(addObj[i]);
        }
    };
    this.carrot = function (){
        addModel(3);
    };
    this.corn = function (){
        addModel(1);
    };
    this.aubergine = function (){
        addModel(2);
    };
    this.chililg = function (){
        addModel(4);
    };
    this.cucmber = function (){
        addModel(5);
    };
    this.ground_patch = function (){
        addModel(6);
    };
    this.onion = function (){
        addModel(7);
    };
    this.grass1 = function (){
        upplaneBuild(1)
    };
    this.grass2 = function (){
        upplaneBuild(2)
    };
    this.grass3 = function (){
        upplaneBuild(3)
    };
    this.flower1 = function (){
        upplaneBuild(4,1)
    };
    this.flower2 = function (){
        upplaneBuild(5,1)
    };
    this.flower3 = function (){
        upplaneBuild(6,1)
    };
    this.House = function (){
        HouseScene();
    };
    this.Direction = function (){
        changeDirection = true;
    };
    // this.Build = function (){
    //     if(this.flower1===true){
    //         loadFlower(1,this.Number);
    //     }
    //     if(this.flower2===true){
    //         loadFlower(2,this.Number);
    //     }
    //     if(this.flower3===true){
    //         loadFlower(3,this.Number);
    //     }
    //     if(this.grass1===true){
    //         loadGrass(1,this.Number)
    //     }
    //     if(this.grass2===true){
    //         loadGrass(2,this.Number);
    //     }
    //     if(this.grass3===true){
    //         loadGrass(3,this.Number)
    //     }
    // };

    //浏览轨道
    //this.Orbit = function (){
    //    browse = true;
    //    camera.position.set(-4000,1300,-4000);
    //};
};


//控制界面
function initGui(){
    var dataGui = new dat.GUI();
    var grassFolder = dataGui.addFolder( 'Grass' );
    var flowerFolder = dataGui.addFolder( 'Flower' );
    var cropFolder = dataGui.addFolder( 'Crop' );

    flowerFolder.add(controls,'flower1');
    flowerFolder.add(controls,'flower2');
    flowerFolder.add(controls,'flower3');
    grassFolder.add(controls,'grass1');
    grassFolder.add(controls,'grass2');
    grassFolder.add(controls,'grass3');
    cropFolder.add(controls,'corn');
    cropFolder.add(controls,'aubergine');
    cropFolder.add(controls,'carrot');
    cropFolder.add(controls,'chililg');
    cropFolder.add(controls,'cucmber');
    cropFolder.add(controls,'ground_patch');
    cropFolder.add(controls,'onion');
    // dataGui.add(controls,"Number",50,5000).step(50);
    // dataGui.add(controls,'Build');
    //dataGui.add(controls, "Orbit");
    dataGui.add(controls,'Direction');
    dataGui.add(controls,'Clean');
    dataGui.add(controls,'House');
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

    //每3秒更新一次界面，防止频闪现象
    var d= new Date();
    if(d.getSeconds()%3 === 0) {
        forestupdate();
        update = 0;
    }
    //FOI();
    //billboard
    for(var i =1;i<objects.length;i++){
        objects[i].quaternion.copy(camera.quaternion);
    }
    //leavesupdate();

    //浏览轨道控制
    var delta = clock.getDelta();
    // orbit();
    // Trackcontrols.update(delta);

    //实时渲染
    //stats.begin();
    renderer.clear();
    renderer.render(scene,camera);
    //stats.end();

    requestAnimationFrame(animate);
    if(annie!=null)
        annie.update(1000 * delta);
}
function render() {
    renderer.clear();
    renderer.render( scene, camera );
}