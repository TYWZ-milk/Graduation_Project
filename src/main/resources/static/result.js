var camera2, scene2, renderer2, Trackcontrols2;
var material;
var branchesgeo = new THREE.Geometry();
function result() {
    THREE.Cache.clear();
    camera2 = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 5000 );
    camera2.position.set( 100, 200, 300 );
    material = new THREE.MeshNormalMaterial();

    scene2 = new THREE.Scene();
    scene2.background = new THREE.Color( 0xa0a0a0 );

    var light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    light.position.set( 0, 200, 0 );
    scene2.add( light );
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 200, 100 );
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = - 100;
    light.shadow.camera.left = - 120;
    light.shadow.camera.right = 120;
    scene2.add( light );

    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene2.add( mesh );
    var grid = new THREE.GridHelper( 12000, 50, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene2.add( grid );

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

    animate2();
}
function blendingTree(result) {
    newtreecircle(result.context)
}
function animate2() {

    requestAnimationFrame( animate2 );
    renderer2.render( scene2, camera2 );

}
//从MongoDB中取出过渡树木参数，转换为圆环序列
function newtreecircle(content){
    var treecircle = [];
    var circle;
    var x="", y="",z="";
    var radius="";
    var branchcircle = [];

    for(var i = 0 ; i < content.length;i++) {
        treecircle = [];
        x = "";
        y = "";
        z = "";
        radius = "";
        branchcircle = [];
        for (var j = 0; j < content[i].treeData.length; j++) {
            if (content[i].treeData[j] === 'b') {
                if (branchcircle.length !== 0)
                    treecircle.push(branchcircle);
                branchcircle = [];
                j += 5;
            }
            else if (content[i].treeData[j] === 'x') {
                for (var m = j + 1; content[i].treeData[m] !== 'y'; m++) {
                    x += content[i].treeData[m];
                }
                j += x.length;
            }
            else if (content[i].treeData[j] === 'y') {
                for (var m = j + 1; content[i].treeData[m] !== 'z'; m++) {
                    y += content[i].treeData[m];
                }
                j += y.length;
            }
            else if (content[i].treeData[j] === 'z') {
                for (var m = j + 1; content[i].treeData[m] !== 'r'; m++) {
                    z += content[i].treeData[m];
                }
                j += z.length;
            }
            else if (content[i].treeData[j] === 'r') {
                for (var m = j + 6; m < content[i].treeData.length && (content[i].treeData[m] !== 'x' && content[i].treeData[m] !== 'b'); m++) {
                    radius += content[i].treeData[m];
                }
                j += radius.length + 5;

                circle = {
                    radius: parseFloat(radius/5),
                    pos: new THREE.Vector3(parseFloat(x/5), parseFloat(y/5), parseFloat(z/5))
                };
                branchcircle.push(circle);
                x = "";
                y = "";
                z = "";
                radius = "";
            }
        }
        branchesgeo = new THREE.Geometry();
        drawTree2(treecircle);
        // var branches = new THREE.Mesh(branchesgeo,material);
        // branches.position.x -= planepos*250;
        // branches.position.z -= planepos*250;
        // branches.scale.set(6,6,6);
        // scene2.add(branches);
        planepos++;
    }
}
//将圆环序列还原成树
var planepos = 0;
var geo = new THREE.BufferGeometry();
function drawBlendBranch(trunk) {

    var seg = 5;
    var vertices = [];
    var _32array = [];
    geo = new THREE.BufferGeometry();
    for (var i = 0, l = trunk.length; i < l - 1; i++) {
        var circle = trunk[i];
        for (var s = 0; s < seg; s++) {//for each point in the circle
            var rd = circle.radius;
            var pos = new THREE.Vector3(0, 0, 0);
            var posx = 0, posy = 0, posz = 0;
            if (i > 0) {
                posx = Math.abs(trunk[i].pos.x - trunk[i - 1].pos.x);
                posy = Math.abs(trunk[i].pos.y - trunk[i - 1].pos.y);
                posz = Math.abs(trunk[i].pos.z - trunk[i - 1].pos.z);
            }
            if (i === 0) {
                posx = Math.abs(trunk[i + 1].pos.x - trunk[i].pos.x);
                posy = Math.abs(trunk[i + 1].pos.y - trunk[i].pos.y);
                posz = Math.abs(trunk[i + 1].pos.z - trunk[i].pos.z);
            }
            if (posx >= posy && posx >= posz) {
                pos.x = 0;
                pos.y = rd * Math.sin(2 * Math.PI / seg * s);
                pos.z = rd * Math.cos(2 * Math.PI / seg * s);
            }
            if (posz >= posx && posz >= posy) {
                pos.x = rd * Math.sin(2 * Math.PI / seg * s);
                pos.y = rd * Math.cos(2 * Math.PI / seg * s);
                pos.z = 0;
            }
            if (posy >= posz && posy >= posx) {
                pos.x = rd * Math.cos(2 * Math.PI / seg * s);
                pos.y = 0;
                pos.z = rd * Math.sin(2 * Math.PI / seg * s);
            }
            vertices.push(pos.add(circle.pos));
            //geo.vertices.push(pos.add(circle.pos));
        }
    }

    vertices.push(trunk[trunk.length-1].pos);
    _32array = translate(vertices);
    geo.addAttribute( 'position', new THREE.Float32BufferAttribute( _32array, 3 ) );
    geo.computeVertexNormals();
    var branch = new THREE.Mesh(geo,material);
    branch.updateMatrix();
    branch.scale.set(6,4,6);
    branch.position.x -= 250*planepos;
    branch.position.z -= 250*planepos;
    scene2.add(branch);

    // for(i=0;i<l-2;i++){
    //     for(s=0;s<seg;s++){
    //         var v1 = i*seg+s;
    //         var v2 = i*seg+(s+1)%seg;
    //         var v3 = (i+1)*seg+(s+1)%seg;
    //         var v4 = (i+1)*seg+s;
    //
    //         geo.faces.push(new THREE.Face3(v1,v2,v3));
    //         geo.faceVertexUvs[0].push([new THREE.Vector2(s/seg,0),new THREE.Vector2((s+1)/seg,0),new THREE.Vector2((s+1)/seg,1)]);
    //         geo.faces.push(new THREE.Face3(v3,v4,v1));
    //         geo.faceVertexUvs[0].push([new THREE.Vector2((s+1)/seg,1),new THREE.Vector2((s)/seg,1),new THREE.Vector2((s)/seg,0)]);
    //     }
    // }
    //
    // var branch = new THREE.Mesh(geo,material);
    // branch.updateMatrix();
    // branchesgeo.merge(branch.geometry,branch.matrix);

}

//绘制一棵树
function drawTree2(blendtree){
    for(var i=0;i<blendtree.length;i++) {
        drawBlendBranch(blendtree[i]);

    }
}