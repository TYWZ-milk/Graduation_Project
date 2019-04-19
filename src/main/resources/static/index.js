var camera, scene, renderer, Trackcontrols;
var material;
var tree1 = [];
var tree = [];
var pos = 0;
var branchesgeo = new THREE.Geometry();
function init() {
    THREE.Cache.clear();
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.set( 100, 200, 300 );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    //scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

    var light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    light.position.set( 0, 200, 0 );
    scene.add( light );
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 200, 100 );
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = - 100;
    light.shadow.camera.left = - 120;
    light.shadow.camera.right = 120;
    scene.add( light );

    branchImg = new THREE.ImageUtils.loadTexture("../textures/tree/diffuse-min.png");
    material = new THREE.MeshNormalMaterial();

    var canvas = document.getElementById("canvas");
    renderer = new THREE.WebGLRenderer({
        antialias:true,
        canvas:canvas
    });
    renderer.setClearColor(0xFFFFFF,1.0);

    Trackcontrols = new THREE.OrbitControls( camera, renderer.domElement );
    Trackcontrols.movementSpeed = 500;
    Trackcontrols.lookSpeed = 0.1;
    Trackcontrols.lookVertical = true;

    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );
    var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );

    animate();
}

function showObjTree(fileStr) {
    var x = "";
    var y = "";
    var z ="";
    var points = [];
    var cir = 0;
    for(var i = 0;i<fileStr.length;i++){
        if(fileStr[i]=== 'v')
            i+=3;
        else if(fileStr[i+2] === '#')
            break;
        else if(fileStr[i+1]==='\n'){
            cir =0;
            var point = new THREE.Vector3(x * 60, y * 60, z * 60);
            points.push(point);
            i+=5;
            x="";
            y="";
            z="";
        }
        if(fileStr[i]!==' ' && cir===0)
            x+=fileStr[i];
        else if(fileStr[i]!==' '&& cir===1)
            y+=fileStr[i];
        else if(fileStr[i]!==' '&& cir === 2)
            z+=fileStr[i];
        else if(fileStr[i]===' ')
            cir++;

    }
    for(var j = 0;j <points.length;j++) {
        var cube = new THREE.Mesh(new THREE.CubeGeometry(3, 3, 3),
            new THREE.MeshBasicMaterial({
                color: 0xff0000
            })
        );
        cube.position.set(points[j].x,points[j].y,points[j].z);
        scene.add(cube);
    }
}

function showBaseTree(fileStr) {
    tree1 = [];
    tree = [];
    var layer = [];
    var circle;
    var x="", y="",z="";
    var radius="";
    var temp=0;
    var branchlength="";
    var trunk=[];
    var child="";
    var position="";
    // output the text to the console
    for(var i=0;i<fileStr.length;i++) {
        temp = 0;
        x="";
        y="";
        z="";
        radius="";
        if(fileStr[i]==='L'){
            var number=fileStr[i+9].toString();
            if(fileStr[i+10]!=='\r') {
                number += fileStr[i + 10].toString();
                if (fileStr[i + 11] !== '\r') {
                    number += fileStr[i + 11].toString();
                    i+=14;
                }
                else{
                    i+=13;
                }
            }
            else{
                i+=12;
            }
            number = parseInt(number);
        }
        if(fileStr[i+5]==='\r'||fileStr[i+4]==='\r'||fileStr[i+3]==='\r') {
            branchlength='';
            child='';
            position='';
            while (fileStr[i] !== ' ') {
                child += fileStr[i].toString();
                i++;
            }
            i++;
            while (fileStr[i] !== '\r'){
                position += fileStr[i].toString();
                i++;
            }
            i+=2;
            while (fileStr[i] !== '\r') {
                branchlength += fileStr[i].toString();
                i++;
            }
            i += 2;
        }
        for(var j=i; fileStr[j]!=='\r'&&j<fileStr.length; j++) {
            if(fileStr[j]!==' ') {
                if(temp===0){
                    x+=fileStr[j];
                }
                if(temp===1){
                    y+=fileStr[j];
                }
                if(temp===2){
                    z+=fileStr[j];
                }
                if(temp===3){
                    radius+=fileStr[j];
                }
            }
            else{
                temp++;
            }
        }
        i = j+1;
        if(branchlength!==0) {
            circle = {
                radius: radius * 70,
                position:position,//
                child:child,
                pos: new THREE.Vector3(x * 70, y * 70, z * 70)
            };
            trunk.push(circle);
            branchlength--;
            if(branchlength === 0){
                layer.push(trunk);
                number--;
                if(number === 0){
                    tree1.push(layer);
                    layer = [];
                }
                trunk=[];
            }
        }
    }
    branchesgeo = new THREE.Geometry();
    compact(tree1);
    drawTree(tree1);
    var branches = new THREE.Mesh(branchesgeo,material);
    moveTree(branches,pos,pos);
    pos++;
}
function moveTree(tree,x,y){
    tree.position.x -= x*250;
    tree.position.z -= y*250;
    scene.add(tree);

}
function drawTree(blendtree){
    for(var i=0;i<blendtree.length;i++) {
        for(var j=0;j<blendtree[i].length;j++) {
            drawBranch(blendtree[i][j]);
        }
    }
}
//紧凑化处理
function compact(blendtree){
    for(var i=1;i<blendtree.length;i++){
        for(var j=0;j<blendtree[i].length;j++){
            var child = parseInt(blendtree[i][j][0].child);
            var position = parseInt(blendtree[i][j][0].position);
            if(position >= blendtree[i-1][child].length)
                position = blendtree[i-1][child].length-1;
            var x = blendtree[i-1][child][position].pos.x - blendtree[i][j][0].pos.x;
            var y = blendtree[i-1][child][position].pos.y - blendtree[i][j][0].pos.y;
            var z = blendtree[i-1][child][position].pos.z - blendtree[i][j][0].pos.z;
            for(var m=0;m<blendtree[i][j].length;m++){
                blendtree[i][j][m].pos.x += x;
                blendtree[i][j][m].pos.y += y;
                blendtree[i][j][m].pos.z += z;
            }
        }
    }
}
//有buffer的老版本drawbranch
var geo = new THREE.Geometry();
function drawBranch(trunk) {
    var seg = 5;
    var vertices = [];
    geo = new THREE.Geometry();
    var _32array = [];
    for(var i = 0, l = trunk.length; i < l-1; i ++){
        var circle = trunk[i];
        for(var s=0;s<seg;s++){//for each point in the circle
            var rd = circle.radius;
            var pos = new THREE.Vector3(0,0,0);
            var posx=0,posy=0,posz=0;
            if(i>0) {
                posx = Math.abs(trunk[i].pos.x - trunk[i - 1].pos.x);
                posy = Math.abs(trunk[i].pos.y - trunk[i - 1].pos.y);
                posz = Math.abs(trunk[i].pos.z - trunk[i - 1].pos.z);
            }
            if(i===0){
                posx = Math.abs(trunk[i+1].pos.x - trunk[i].pos.x);
                posy = Math.abs(trunk[i+1].pos.y - trunk[i].pos.y);
                posz = Math.abs(trunk[i+1].pos.z - trunk[i].pos.z);
            }
            if(posx>=posy&&posx>=posz) {
                pos.x = 0;
                pos.y = rd * Math.sin(2 * Math.PI / seg * s);
                pos.z = rd * Math.cos(2 * Math.PI / seg * s);
            }
            if(posz>=posx&&posz>=posy){
                pos.x = rd * Math.sin(2 * Math.PI / seg * s);
                pos.y = rd * Math.cos(2 * Math.PI / seg * s);
                pos.z = 0;
            }
            if(posy>=posz&&posy>=posx) {
                pos.x = rd * Math.cos(2 * Math.PI / seg * s);
                pos.y = 0;
                pos.z = rd * Math.sin(2 * Math.PI / seg * s);
            }
            geo.vertices.push(pos.add(circle.pos));
        }
    }
    for(i=0;i<l-2;i++){
        for(s=0;s<seg;s++){
            var v1 = i*seg+s;
            var v2 = i*seg+(s+1)%seg;
            var v3 = (i+1)*seg+(s+1)%seg;
            var v4 = (i+1)*seg+s;

            geo.faces.push(new THREE.Face3(v1,v2,v3));
            geo.faceVertexUvs[0].push([new THREE.Vector2(s/seg,0),new THREE.Vector2((s+1)/seg,0),new THREE.Vector2((s+1)/seg,1)]);
            geo.faces.push(new THREE.Face3(v3,v4,v1));
            geo.faceVertexUvs[0].push([new THREE.Vector2((s+1)/seg,1),new THREE.Vector2((s)/seg,1),new THREE.Vector2((s)/seg,0)]);
        }
    }

    var branch = new THREE.Mesh(geo,material);
    branch.updateMatrix();
    branchesgeo.merge(branch.geometry,branch.matrix);


    //BufferGeometry
    // vertices.push(trunk[trunk.length-1].pos);
    // _32array = translate(vertices);
    // geo.addAttribute( 'position', new THREE.Float32BufferAttribute( _32array, 3 ) );
    // geo.computeVertexNormals();
    // branch = new THREE.Mesh(geo,material);
    // tree.push(branch);
}

//点集转换为32Array
function translate(vertices){
    var precision = 3;
    var _32array = [];
    for(var i=0;i<vertices.length;i++){
        if((i+1) %5 === 0 && i + 1 !== vertices.length-1){
            _32array.push(vertices[i].x, vertices[i].y, vertices[i].z);
            _32array.push(vertices[i - precision +1].x, vertices[i - precision +1].y, vertices[i - precision +1].z);
            _32array.push(vertices[i + precision].x, vertices[i + precision].y, vertices[i + precision].z);
        }
        else if(i === vertices.length-1){
            _32array.push(vertices[i].x, vertices[i].y, vertices[i].z);
        }
        else if(i + 1 === vertices.length-1){
            _32array.push(vertices[i].x, vertices[i].y, vertices[i].z);
            _32array.push(vertices[i- precision +1].x, vertices[i- precision +1].y, vertices[i- precision +1].z);
            _32array.push(vertices[vertices.length-1].x, vertices[vertices.length-1].y, vertices[vertices.length-1].z);
        }
        else if(i + precision >= vertices.length-1){
            _32array.push(vertices[i].x, vertices[i].y, vertices[i].z);
            _32array.push(vertices[i + 1].x, vertices[i + 1].y, vertices[i + 1].z);
            _32array.push(vertices[vertices.length-1].x, vertices[vertices.length-1].y, vertices[vertices.length-1].z);
        }
        else {
            _32array.push(vertices[i].x, vertices[i].y, vertices[i].z);
            _32array.push(vertices[i + 1].x, vertices[i + 1].y, vertices[i + 1].z);
            _32array.push(vertices[i + precision].x, vertices[i + precision].y, vertices[i + precision].z);
        }
    }
    for(var j = vertices.length-2; j>=5;j--){
        if(j % 5 ==0){
            _32array.push(vertices[j].x, vertices[j].y, vertices[j].z);
            _32array.push(vertices[j + precision -1].x, vertices[j + precision -1].y, vertices[j + precision -1].z);
            _32array.push(vertices[j - 1].x, vertices[j - 1].y, vertices[j -1].z);
        }
        else{
            _32array.push(vertices[j].x, vertices[j].y, vertices[j].z);
            _32array.push(vertices[j - 1].x, vertices[j - 1].y, vertices[j - 1].z);
            _32array.push(vertices[j - precision -1].x, vertices[j - precision -1].y, vertices[j - precision -1].z);
        }
    }
    return _32array;
}
function animate() {

    requestAnimationFrame( animate );
    renderer.render( scene, camera );

}