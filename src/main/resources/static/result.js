var camera2, scene2, renderer2, Trackcontrols2;
var material2;
var tree2 = [];
var tree_2 = [];
var pos2 = 0;
function result() {
    THREE.Cache.clear();
    camera2 = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,1,100000);
    camera2.position.z = 700;
    camera2.position.y = 90;
    camera2.position.x = -800;


    scene2 = new THREE.Scene();

    var canvas = document.getElementById("result");
    renderer2 = new THREE.WebGLRenderer({
        antialias:true,
        canvas:canvas
    });
    renderer2.setClearColor(0xFFFFFF,1.0);

    Trackcontrols2 = new THREE.OrbitControls( camera2, renderer2.domElement );
    Trackcontrols2.movementSpeed = 500;
    Trackcontrols2.lookSpeed = 0.1;
    Trackcontrols2.lookVertical = true;
    var geometry = new THREE.BoxGeometry( 200, 200, 200 );
    material2 = new THREE.MeshNormalMaterial();

    var mesh = new THREE.Mesh( geometry, material2 );
    scene2.add( mesh );
    animate2();
}

function animate2() {

    requestAnimationFrame( animate );
    renderer2.render( scene2, camera2 );

}