var camera2, scene2, renderer2, Trackcontrols2;
var material;
function result() {
    THREE.Cache.clear();
    camera2 = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,1,100000);
    camera2.position.z = 700;
    camera2.position.y = 90;
    camera2.position.x = -800;
    material = new THREE.MeshNormalMaterial();

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
        draw(treecircle);
        planepos++;
        tree2 = [];
    }
}
var branchesgeo = new THREE.Geometry();
//将圆环序列还原成树
var tree2 = [];
var planepos = 0;
function draw(treecircle){

    tree2 = [];
    branchesgeo = new THREE.Geometry();
    drawTree2(treecircle);

    //branches为一棵树所有枝干merge后的
    var branches = new THREE.Mesh(branchesgeo,material);
    var randomy =  Math.random() * 8 + 1;
    var randomsize = Math.random() * 4 + 1;
    branches.scale.set(randomy/randomsize,randomy,randomy/randomsize);
    tree2.push(branches);
    for(var i=0; i <tree2.length;i++){
        tree2[i].position.x -= 250*planepos;
        tree2[i].position.z -= 250*planepos;
        scene2.add(tree2[i]);
    }
}

var geo = new THREE.BufferGeometry();
function drawBlendBranch(trunk) {

    var seg = 3 ;
    var vertices = [];
    var _32array = [];
    geo = new THREE.Geometry();
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
            geo.vertices.push(pos.add(circle.pos));
        }
    }
    //vertices.push(trunk[trunk.length - 1].pos);
    //_32array = translate(vertices, seg);
    //
    ////geometry版本
    //for(var i = 0;i<_32array.length;i+=3){
    //    geo.vertices.push(
    //       new THREE.Vector3( _32array[i],_32array[i+1],_32array[i+2])
    //    );
    //}
    for(i=0;i<l-1;i++){
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
    }//add faces and uv
    //geo.computeFaceNormals();

    var branch = new THREE.Mesh(geo,material);
    branch.updateMatrix();
    branchesgeo.merge(branch.geometry,branch.matrix);

}

//绘制一棵树
function drawTree2(blendtree){
    for(var i=0;i<blendtree.length;i++) {
        drawBlendBranch(blendtree[i]);

    }
}