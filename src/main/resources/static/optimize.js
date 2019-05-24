//叶子实时渲染
function leavesupdate(){
    for(var j=0,jl=leaves.length;j<jl;j++){
        leaves[j].visible = (j%leaves[j].level === 0);
        leaves[j].update();
    }
}
var update = 0;
//从画面中剔除部分距离较远的树木
function forestupdate(){

    // var cameraMatrix = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);
    var frustum = new THREE.Frustum();
    var matrix = new THREE.Matrix4();

    matrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
    frustum.setFromMatrix( matrix );
    for(var j=0,jl=forest.length;j<jl;j++) {
        if (j % 15 !== 0) {//至少展示几分之一的树木
            //
            // var point = new THREE.Vector3(forest[j][0].position.x, forest[j][0].position.y, forest[j][0].position.z);
            // var z = point.applyMatrix4(cameraMatrix).z;  //z值判断树木是否在画面内 z>1则不在画面内
            var dist = forest[j][0].position.clone();
            dist.sub(camera.position);
            dist = Math.sqrt(dist.x * dist.x + dist.y * dist.y + dist.z * dist.z);

            //通过距离筛选，越远的树木筛选可能性越大。
            var le = 0;
            for (var i = 0, il = LevelDefine.length; i < il; i++) {
                if (dist > LevelDefine[i]) le++;
                else break;
            }

            forest[j][0].visible = (j % le === 0);
            if (!frustum.intersectsObject(forest[j][0])) {
                forest[j][0].visible = false;
                forest[j][1].visible = false;

            }
            // if (z>0.9998)
            //     forest[j][0].visible = false;
            //对叶子采取同样的操作
            if (forest[j][0].visible === false) {
                for (var i = 0; i < forest[j].length; i++) {
                    forest[j][i].visible = false;
                }
                update++;
            }
            //else if(z>1){
            //    for(var i = 0;i<forest[j].length;i++){
            //        forest[j][i].visible = false;
            //    }
            //}
            else {
                for (var i = 0; i < forest[j].length; i++) {
                    forest[j][i].visible = true;
                }
            }
        }
    }
}

//FOI通过z值大小判断树木是否在画面内
function FOI(){
   var cameraMatrix = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);
   for(var j=0,jl=forest.length;j<jl;j++) {
       var point = new THREE.Vector3(forest[j][0].position.x,forest[j][0].position.y,forest[j][0].position.z);
       var z = point.applyMatrix4(cameraMatrix).z;
       console.log(z);
       if(z<0.9998  && z> 0.9997) {
           forest[j][0].visibale = false;
           for(var i = 0;i<forest[j].length;i++){
               forest[j][i].visible = false;
           }
       }
       else{
           for (var i = 0; i < forest[j].length; i++) {
               forest[j][i].visible = true;
           }
       }
   }
}