var branchImg;
var leafMat;
var material;
var leafMesh;
var LevelDefine = [0,4000000,5000000,6000000,7000000,8000000,9000000,10000000,15000000,25000000];
var LeavesLevelDefine = [0,10000,250000,1000000];
var instanceBranchSet = [];
var branch;
//初始化树木
function initObject(){
    //枝干和叶子的模型
    branchImg = new THREE.ImageUtils.loadTexture("../textures/tree/diffuse-min.png");
    material = new THREE.MeshLambertMaterial({
        // wireframe:true,
        side:THREE.DoubleSide,
        map:branchImg
    });

    var leafImg = new THREE.ImageUtils.loadTexture("../textures/tree/leaf01-min.png");
    leafMat = new THREE.MeshLambertMaterial({
        map:leafImg,
        color:0x253F08,
        side:THREE.DoubleSide,
        transparent:true
    });
    var leaf_size = 14;
    var geo = new THREE.PlaneGeometry(leaf_size,leaf_size);
    leafMesh = new THREE.Mesh(geo,leafMat);
    leafMesh.geometry.translate(0,leaf_size/2.0,0);
}

//从MongoDB中取出过渡树木参数，转换为圆环序列
function newtreecircle(content){
    planepos = 30;
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
        instanceBranchSet = [];
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

        var uniforms = {
           map : {value : branchImg}
        };
        //uniforms.texture1.value.warpS = uniforms.texture1.value.warpT = THREE.RepeatWrapping;
        var shader_material = new THREE.RawShaderMaterial({
           uniforms: uniforms,
           vertexShader: [
               "precision highp float;",
               "",
               "uniform mat4 modelViewMatrix;",
               "uniform mat4 projectionMatrix;",
               "",
               "attribute vec3 position;",
               "attribute vec3 translate;",
               "varying vec2 vUv;",
               "",
               "void main() {",
               "",
               "	gl_Position = projectionMatrix * modelViewMatrix * vec4( translate + position, 1.0 );",
               "",
               "}"
           ].join("\n"),
           fragmentShader: [
               "precision highp float;",
               "",
               "varying vec2 vUv;",
               "",
               "uniform sampler2D texture1;",
               "",
               "void main(void) {",
               "",
               "	gl_FragColor = texture2D(texture1, vUv);",
               "",
               "}"
           ].join("\n"),
           side: THREE.DoubleSide,
           transparent: false

        });

        for(var cl = 0 ;cl<49;cl++) {
            //实例化
            var instancedGeo = new THREE.InstancedBufferGeometry();
            var bufferGeometry = new THREE.BufferGeometry().fromGeometry( branchesgeo );
            instancedGeo.index = bufferGeometry.index;
            instancedGeo.attributes = bufferGeometry.attributes;
            var particleCount = 1;
            var translateArray = new Float32Array( particleCount * 3 );

            for ( var li = 0, i3 = 0, l = particleCount; li < l; li ++, i3 += 3 ) {
                translateArray[ i3 + 0 ] = 0;
                translateArray[ i3 + 1 ] = 0;
                translateArray[ i3 + 2 ] = 0;
            }

            instancedGeo.addAttribute('translate', new THREE.InstancedBufferAttribute( translateArray, 3, 1 ) );
            var instancedTree = new THREE.Mesh( instancedGeo, shader_material );
            instancedTree.position.x += planevertices[planepos];
            instancedTree.position.z += planevertices[planepos+2];
            instancedTree.position.y += planevertices[planepos+1];
            var randomsize = Math.random() * 10 + 3;
            instancedTree.scale.set(randomsize,randomsize,randomsize);
            scene.add(instancedTree);
            planepos+=30 * Math.floor(Math.random() * 12 + 1);

            // //buffer版本
            // var temp = [];
            // for (var j = 0; j < tree.length; j++) {
            //    temp.push(tree[j].clone());
            // }
            // for(var po = 0; po<tree.length;po++) {
            //     temp[po].position.x -= tree[0].position.x;
            //     temp[po].position.y -= tree[0].position.y;
            //     temp[po].position.z -= tree[0].position.z;
            // }
            // forest.push(temp);
            // moveTree(temp);
            // planepos+=30 * Math.floor(Math.random() * 6 + 1);

            //geometry版本的克隆
            // var temp = [];
            // for (var seq = 0; seq < tree.length; seq++) {
            //     temp.push(tree[seq].clone());
            //     temp[seq].position.x -=tree[0].position.x;
            //     temp[seq].position.y -=tree[0].position.y;
            //     temp[seq].position.z -=tree[0].position.z;
            // }
            // forest.push(temp);
            // moveTree(temp);
            // planepos+=30 * Math.floor(Math.random() * 12 + 1);
        }
        tree = [];
        forestupdate();
    }
}

//将圆环序列还原成树
var tree = [];
function draw(treecircle){
    tree = [];
    branchesgeo = new THREE.Geometry();
    drawTree(treecircle);
    addLeaf(treecircle);

    //branches为一棵树所有枝干merge后的
    var branches = new THREE.Mesh(branchesgeo,material);
    var randomsize = Math.random() * 10 + 3;
    // branch.scale.set(randomy/randomsize,randomy,randomy/randomsize);
    // leaves.scale.set(randomy/randomsize,randomy,randomy/randomsize);
    tree.push(branches);

    tree[0].maintrunk = true;
    tree[0].childs = [];
    tree[0].scale.set(randomsize,randomsize,randomsize);
    for(var i = 1;i<tree.length;i++){
        tree[0].childs.push(tree[i]);
        tree[i].scale.set(randomsize,randomsize,randomsize);
    }
    moveTree(tree);
    planepos+=30 * Math.floor(Math.random() * 18 + 1);
    forest.push(tree);
}
//有buffer的老版本drawbranch，绘制每一个branch
var geo = new THREE.Geometry();
var branchesgeo = new THREE.Geometry();
/**
 * @return {boolean}
 */
function None(element, index, array){
    return !isNaN(element);
}
function drawBranch(trunk) {

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
}
//点集转换为32Array，用于BufferGeometry的position属性
function translate(vertices,precision){
    var _32array = [];
    for(var i=0;i<vertices.length;i++){
        if(i + 1 === vertices.length-1){
            _32array.push(vertices[i].x, vertices[i].y, vertices[i].z);
            _32array.push(vertices[i- precision +1].x, vertices[i- precision +1].y, vertices[i- precision +1].z);
            _32array.push(vertices[vertices.length-1].x, vertices[vertices.length-1].y, vertices[vertices.length-1].z);
        }
        else if(i === vertices.length-1){
            _32array.push(vertices[i].x, vertices[i].y, vertices[i].z);
        }
        else if((i+1) %precision === 0 && i + 1 !== vertices.length-1){
            _32array.push(vertices[i].x, vertices[i].y, vertices[i].z);
            _32array.push(vertices[i - precision +1].x, vertices[i - precision +1].y, vertices[i - precision +1].z);
            _32array.push(vertices[i + precision].x, vertices[i + precision].y, vertices[i + precision].z);
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
    for(var j = vertices.length-2; j>=precision;j--){
        if(j % precision === 0){
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
//绘制一棵树
function drawTree(blendtree){
    for(var i=0;i<blendtree.length;i++) {
        drawBranch(blendtree[i]);

    }
}
//添加叶子，在圆环序列上随机添加叶子
var leafgeo = new THREE.Geometry();
var leaves;
function addLeaf(trunk){
    leafgeo = new THREE.Geometry();
    for(var i = 1;i<trunk.length;i++) {
        for(var j = Math.floor(trunk[i].length/2+Math.floor(Math.random()*4 + 1));j<trunk[i].length;j+=Math.floor(Math.random()*3 + 1)) {
            for (var k = Math.floor(Math.random() * 6 + 1); k < 4; k++) {
                var leaf = leafMesh.clone();
                var phi = Math.random()*60+20;
                var theta = Math.random()*360;
                var selfRotate = Math.random()*360;
                leaf.rotateY(theta/180*Math.PI);
                leaf.rotateZ(phi/180*Math.PI);
                leaf.rotateY(selfRotate/180*Math.PI);
                leaf.position.x = trunk[i][j].pos.x;
                leaf.position.z = trunk[i][j].pos.z;
                leaf.position.y = trunk[i][j].pos.y;
                leaf.updateMatrix();
                leafgeo.merge(leaf.geometry,leaf.matrix);
                //tree.push(leaf);
                //forest.push(leaf.mesh);
                //leaves.push(leaf);
                //lbbs.add(leaf);
            }
        }
    }
    leaves = new THREE.Mesh(leafgeo,leafMesh.material);
    tree.push(leaves);
}
//修改树木的位置
var planepos = 30;
function moveTree(trees){
    for(var i=0; i <trees.length;i++){
        trees[i].position.x += planevertices[planepos];
        trees[i].position.z += planevertices[planepos+2];
        trees[i].position.y += planevertices[planepos+1];
        scene.add(trees[i]);
    }
}