package graduation.project.demo.Controller;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import graduation.project.demo.Model.Node;
import org.bson.Document;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

/**
 * 这里的@RestController   相当于@ResponseBody + @Controller
 */
@SpringBootApplication(exclude = MongoAutoConfiguration.class)
@Controller
public class IndexController {

    private static List<List<List<Node>>> tree1 = new ArrayList<>();
    private static List<List<List<Node>>> tree2 = new ArrayList<>();
    private static List<List<List<List<Node>>>> trees = new ArrayList<>();
    private static List<List<List<Node>>>  ptree1= new ArrayList<>(tree1);
    private static List<List<List<Node>>>  ptree2= new ArrayList<>(tree2);
    private static List<List<List<Node>>> blendtree = new ArrayList<>();
    private static List<Object> reusableset = new ArrayList<>();
    private static List<Document> documents = new ArrayList<>();

    @RequestMapping(value = "/index",method = RequestMethod.GET)
    public String helloSpringBoot(){
        return "index";
    }

    @RequestMapping(value = "/data", method = RequestMethod.POST)
    public String data(@RequestBody String fileString) {
        tree1 = new ArrayList<>();
        readFile(fileString, tree1);
        trees.add(tree1);
        return "index";
    }

    public List<List<List<Node>>> copy(List<List<List<Node>>> tree){
        List<List<List<Node>>> copyTree = new ArrayList<>();
        List<List<Node>> layer = new ArrayList<>();
        List<Node> trunk = new ArrayList<>();
        for (List<List<Node>> lists : tree) {
            for (List<Node> list : lists) {
                trunk.addAll(list);
                layer.add(trunk);
                trunk = new ArrayList<>();
            }
            copyTree.add(layer);
            layer = new ArrayList<>();
        }
        return copyTree;
    }

    @RequestMapping(value = "/blending", method = RequestMethod.POST)
    public String blend(@RequestBody String number, HttpSession session) {
        tree1 = new ArrayList<>();
        tree2 = new ArrayList<>();
        documents = new ArrayList<>();
        long startTime=System.currentTimeMillis();
        Date now = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");//可以方便地修改日期格式
        String time = dateFormat.format( now );
        int forestSize = Integer.parseInt(number)/(trees.size()-1);
        for(int seq = 0; seq<trees.size();seq++) {
            tree1 = copy(trees.get(seq));
            if(seq+1 == trees.size())
                tree2 = copy(trees.get(0));
            else
                tree2 = copy(trees.get(seq+1));
            reusableSet();
            addZero(tree1, tree2);
            for (int total = 0; total < forestSize; total++) {
                List<List<List<Node>>> temp = new ArrayList<>(blendtree);
                blendtree = new ArrayList<>();
                if (total == 0)
                    blending(ptree1, ptree2);
                else if (total < forestSize / 2)
                    blending(temp, ptree1);
                else
                    blending(temp, ptree2);
                compact();
                System.out.format("第%d棵树木生成完成\n", total + 1);
                save(time);
            }
        }
        session.setAttribute("timeid",time);
        toMongo();
        long endTime=System.currentTimeMillis(); //获取结束时间
        System.out.println("程序运行时间： "+(endTime-startTime)+"ms");
        trees = new ArrayList<>();
        return "index";
    }

    private static void readFile(String txt1, List<List<List<Node>>> tree1){
        String content = txt1;
        content = content.replaceAll("\r", "");
        List<List<Node>> layer = new ArrayList<>();

        String x="" , y="", z="";
        String radius="";
        int temp = 0;
        String branchLength="";
        int inumber = 0;
        int branchlength = 0;
        List<Node> trunk = new ArrayList<>();
        String child = "";
        String position="";
        for(int i =0; i <content.length();i++){
            temp = 0;
            x="";
            y="";
            z="";
            radius="";
            if(content.charAt(i)=='L') {
                String number = String.valueOf(content.charAt(i + 8));
                if (content.charAt(i + 9) != '\n') {
                    number += String.valueOf(content.charAt(i + 9));
                    if (content.charAt(i + 10) != '\n') {
                        number += String.valueOf(content.charAt(i + 10));
                        i += 12;
                    } else {
                        i += 11;
                    }
                } else {
                    i += 10;
                }
                inumber = Integer.parseInt(number);
            }
            if(content.charAt(i+5)=='\n'||content.charAt(i+4)=='\n'||content.charAt(i+3)=='\n') {
                branchLength="";
                child="";
                position="";
                while (content.charAt(i) != ' ') {
                    child += String.valueOf(content.charAt(i));
                    i++;
                }
                i++;
                while (content.charAt(i) != '\n'){
                    position += String.valueOf(content.charAt(i ));
                    i++;
                }
                i+=1;
                while (content.charAt(i) != '\n') {
                    branchLength += String.valueOf(content.charAt(i));
                    i++;
                }
                i += 1;
                branchlength=Integer.parseInt(branchLength);
            }
            int j = i;
            for(;content.charAt(j)!='\n'&&j<content.length();j++) {
                if(content.charAt(j)!=' ') {
                    if(temp==0){
                        x+=String.valueOf(content.charAt(j));
                    }
                    if(temp==1){
                        y+=String.valueOf(content.charAt(j));
                    }
                    if(temp==2){
                        z+=String.valueOf(content.charAt(j));
                    }
                    if(temp==3){
                        radius+=String.valueOf(content.charAt(j));
                    }
                }
                else{
                    temp++;
                }
            }

            i = j;
            if(branchlength!=0) {
                Node circle = new Node();
                circle.radius = Float.parseFloat(radius)*70;
                circle.posx = Float.parseFloat(x)*70;
                circle.posy = Float.parseFloat(y)*70;
                circle.posz = Float.parseFloat(z)*70;
                circle.child = Integer.parseInt(child);
                circle.position = Integer.parseInt(position);
                trunk.add(circle);
                branchlength--;
                if(branchlength==0){
                    layer.add(trunk);
                    inumber--;
                    if(inumber == 0){
                        tree1.add(layer);
                        layer = new ArrayList<>();
                    }
                    trunk = new ArrayList<>();
                }
            }
        }
    }

    //reusabset为原始树木的枝干移动到零点后的集合
    public static void reusableSet() {
        List<Object> total = new ArrayList<Object>();
        List<Object> temp = new ArrayList<Object>();
        for (var i = 0; i < tree1.size() || i < tree2.size(); i++) {
            if (i >= tree1.size() && i < tree2.size()) {
                temp = new ArrayList<Object>();
                for(var j=0;j<((ArrayList) tree2.get(i)).size();j++){
                    temp.add(((ArrayList) tree2.get(i)).get(j));
                }
                total.add(temp);
            }
            else if(i>=tree2.size() && i<tree1.size()){
                temp = new ArrayList<Object>();
                for(var j=0;j<((ArrayList) tree1.get(i)).size();j++){
                    temp.add(((ArrayList) tree1.get(i)).get(j));
                }
                total.add(temp);
            }
            else if(i<tree1.size() && i<tree2.size()){
                temp = new ArrayList<Object>();
                for(var j=0;j<((ArrayList) tree1.get(i)).size();j++){
                    temp.add(((ArrayList) tree1.get(i)).get(j));
                    //if((i==1 && j==2) ||(i==2 && j==7)) break;
                }
                for(var j=0;j<((ArrayList) tree2.get(i)).size();j++){
                    temp.add(((ArrayList) tree2.get(i)).get(j));
                    //if((i==1 && j==2) ||(i==2 && j==7)) break;
                }
                total.add(temp);
            }
        }
        var layer = new ArrayList<Object>();
        for(var m=0;m<total.size();m++){
            for(var n=0;n<((ArrayList) total.get(m)).size();n++){
                layer.add(movetoOrigin(((ArrayList) total.get(m)).get(n)));
            }
            reusableset.add(layer);
            layer = new ArrayList<Object>();
        }
    }

    //把枝干移动到坐标轴原点
    public static List<Node> movetoOrigin(Object trunk){
        Node zero = (Node)((ArrayList) trunk).get(0);
        float x = zero.posx - 0;
        float y = zero.posy - 0;
        float z = zero.posz - 0;
        List<Node> rtrunk = new ArrayList<Node>();
        for(var m=0;m<((ArrayList) trunk).size();m++){
            rtrunk.add((Node) ((ArrayList) trunk).get(m));
        }
        for(var i=0;i<((ArrayList) trunk).size();i++){
            Node node = (Node)((ArrayList) rtrunk).get(i);
            node.posx -= x;
            node.posy -= y;
            node.posz -= z;
        }
        return rtrunk;
    }
    //数据预处理 包括添加零枝干、零枝干层、不同层处理
    public static void addZero(List<List<List<Node>>>tree1,List<List<List<Node>>>tree2){
        List<List<Node>> layer;
        ptree1= new ArrayList<>();
        ptree2= new ArrayList<>();
        ptree1.addAll(tree1);
        ptree2.addAll(tree2);
        if(ptree2.size()!=ptree1.size()){
            if(ptree2.size() > ptree1.size() && ((ArrayList) ptree2.get( ptree2.size()-2)).size() < ((ArrayList) ptree1.get( ptree1.size()-1)).size()){
                int interval = ((ArrayList) ptree1.get( ptree1.size()-1)).size()/((ArrayList) ptree2.get( ptree2.size()-2)).size();
                for(var i=0;i<((ArrayList) ptree2.get( ptree2.size()-1)).size();i++){
                    Node temp = (Node) ((ArrayList) ptree2.get(ptree2.size()-1)).get(i);
                    temp.child*=interval;
                }
            }
            if(ptree2.size() < ptree1.size() && ((ArrayList) ptree1.get( ptree1.size()-2)).size() <  ((ArrayList) ptree2.get( ptree2.size()-1)).size()){
                int interval = ((ArrayList) ptree2.get( ptree2.size()-1)).size()/((ArrayList) ptree1.get( ptree1.size()-2)).size();
                for(var i=0;i<((ArrayList) ptree1.get( ptree1.size()-1)).size();i++){
                    for(var j=0;j<((ArrayList)((ArrayList) ptree1.get(ptree1.size()-1)).get(0)).size();j++) {
                        Node temp = (Node) ((ArrayList)((ArrayList) ptree2.get(ptree2.size()-1)).get(i)).get(j);
                        temp.child *= interval;
                    }
                }
            }
        }
        for(var i=0 ; i<tree1.size()||i<tree2.size();i++){
            int interval;
            int dvalue;
            ArrayList<Node> zero = new ArrayList<>();
            Node zeroN = new Node();
            zeroN.zero = true;
            zero.add(zeroN);
            layer = new ArrayList<>();
            if(i>=tree1.size()){
                for(var j = 0; j< tree2.get(i).size(); j++){
                    layer.add(zero);
                }
                ptree1.add(layer);
            }
            else if(i>=tree2.size()){
                for(var j = 0; j< tree1.get(i).size(); j++){
                    layer.add(zero);
                }
                ptree2.add(layer);
            }
            else if(tree1.get(i).size() > tree2.get(i).size()){
                interval = tree1.get(i).size()/ tree2.get(i).size()+1;
                dvalue = tree1.get(i).size() - tree2.get(i).size();
                for(int j = 0, n = 0; j< tree1.get(i).size(); j++){
                    if(j%interval!=0 && dvalue!=0) {
                        layer.add(zero);
                        dvalue--;
                    }
                    else {
                        layer.add(((ArrayList)((ArrayList) tree2.get(i)).get(n)));
                        n++;
                    }
                    if(layer.size() == ((ArrayList)tree1.get(i)).size())
                        break;
                }
                ((ArrayList) ptree2.get(i)).clear();
                for(int q=0;q<layer.size();q++){
                    ((ArrayList) ptree2.get(i)).add(layer.get(i));
                }
            }
            else if(((ArrayList)tree1.get(i)).size() < ((ArrayList)tree2.get(i)).size()){
                interval = ((ArrayList)tree2.get(i)).size()/((ArrayList)tree1.get(i)).size()+1;
                dvalue = ((ArrayList)tree2.get(i)).size() - ((ArrayList)tree1.get(i)).size();
                for(int j= 0,n=0; j<((ArrayList)tree2.get(i)).size(); j++){
                    if(j%interval!=0 && dvalue!=0) {
                        layer.add(zero);
                        dvalue--;
                    }
                    else {
                        layer.add(((ArrayList)((ArrayList) tree1.get(i)).get(n)));
                        n++;
                    }
                    if(layer.size() == ((ArrayList)tree2.get(i)).size())
                        break;
                }
                ((ArrayList) ptree1.get(i)).clear();
                for(int q=0;q<layer.size();q++){
                    ((ArrayList) ptree1.get(i)).add(layer.get(q));
                }
            }
        }
    }
    //生成过渡树木层次结构
    public static void blending(List<List<List<Node>>>ptree1,List<List<List<Node>>>ptree2){
        List<List<Node>> layer = new ArrayList<>();
        List<List<List<Node>>> temptree2 = new ArrayList<>(ptree2);
        List<List<List<Node>>> temptree1 = new ArrayList<>(ptree1);
        ArrayList<Node> trunk = new ArrayList<>();
        for(var i=0;i<ptree1.size()||i<ptree2.size();i++){
            if(i==0) {
                layer.add(blendBranch(((ArrayList)((ArrayList) temptree1.get(i)).get(0)), ((ArrayList)((ArrayList) temptree2.get(i)).get(0))));
            }
            else{
                for(var j=0; j<((ArrayList)ptree1.get(i)).size() || j<((ArrayList)ptree2.get(i)).size(); j++) {
                    layer.add(blendBranch(((ArrayList)((ArrayList) temptree1.get(i)).get(j)), ((ArrayList)((ArrayList) temptree2.get(i)).get(j))));
//                    trunk=compare(blendBranch(((ArrayList)((ArrayList) temptree1.get(i)).get(j)), ((ArrayList)((ArrayList) temptree2.get(i)).get(j))),i);
//                    if(trunk!=null)
//                        layer.add(trunk);
                }
            }
            blendtree.add(layer);
            layer = new ArrayList<>();
        }
    }

    //任意两枝干生成过渡枝干
    public static List<Node> blendBranch(List<Node>trunk1,List<Node>trunk2){
        ArrayList<Node> trunk = new ArrayList<>();
        Node circle = new Node();
        if(trunk2.size()!=1 && trunk1.size()!=1 &&  trunk1.size() > trunk2.size()){  //保证两枝干节点信息一样多
            int size = trunk1.size() - trunk2.size();
            for(var j=0;j<size;j++){
                trunk2.add(trunk2.get(trunk2.size()-1));
            }
        }
        else if(trunk2.size()!=1 && trunk1.size()!=1&&  trunk1.size() < trunk2.size()){
            int size = trunk2.size() - trunk1.size();
            for(var j=0;j<size;j++){
                trunk1.add(trunk1.get(trunk1.size()-1));
            }
        }
        for(var i= 0;i<trunk1.size() || i<trunk2.size();i++) {
            if (trunk2.size()==1) {
                circle = new Node();
                circle.radius = trunk1.get(i).radius/2;
                circle.posx = trunk1.get(i).posx/2;
                circle.posy = trunk1.get(i).posy/2;
                circle.posz = trunk1.get(i).posz/2;
                circle.child = trunk1.get(i).child;
                circle.position = trunk1.get(i).position;
            }
            else if (trunk1.size()==1) {
                circle = new Node();
                circle.radius = trunk2.get(i).radius/2;
                circle.posx = trunk2.get(i).posx/2;
                circle.posy = trunk2.get(i).posy/2;
                circle.posz = trunk2.get(i).posz/2;
                circle.child = trunk2.get(i).child;
                circle.position = trunk2.get(i).position;
            }
            else if (i < trunk1.size() && i < trunk2.size()) {
                circle = new Node();
                circle.posx = (trunk1.get(i).posx+trunk2.get(i).posx)/2;
                circle.posy = (trunk1.get(i).posy+trunk2.get(i).posy)/2;
                circle.posz = (trunk1.get(i).posz+trunk2.get(i).posz)/2;
                circle.radius = (trunk1.get(i).radius+trunk2.get(i).radius)/2;
                if(trunk1.get(i).child>trunk2.get(i).child){
                    circle.child = trunk1.get(i).child;
                    circle.position = trunk2.get(i).position;

                }
                else{
                    circle.child = trunk2.get(i).child;
                    circle.position = trunk2.get(i).position;
                }
            }
            trunk.add(circle);
        }
        return trunk;
    }

    private static void compact(){
        for(var i=1;i<blendtree.size();i++){

            for(var j=0;j<((ArrayList)blendtree.get(i)).size();j++){
                int child = ((Node) ((ArrayList)((ArrayList) blendtree.get(i)).get(j)).get(0)).child;
                int position = ((Node) ((ArrayList)((ArrayList) blendtree.get(i)).get(j)).get(0)).position;
                if(position >= ((ArrayList)((ArrayList) blendtree.get(i-1)).get(child)).size())
                    position = ((ArrayList)((ArrayList) blendtree.get(i-1)).get(child)).size()-1;

                float x = ((Node) ((ArrayList)((ArrayList) blendtree.get(i-1)).get(child)).get(position)).posx - ((Node) ((ArrayList)((ArrayList) blendtree.get(i)).get(j)).get(0)).posx;
                float y = ((Node) ((ArrayList)((ArrayList) blendtree.get(i-1)).get(child)).get(position)).posy - ((Node) ((ArrayList)((ArrayList) blendtree.get(i)).get(j)).get(0)).posy;
                float z = ((Node) ((ArrayList)((ArrayList) blendtree.get(i-1)).get(child)).get(position)).posz - ((Node) ((ArrayList)((ArrayList) blendtree.get(i)).get(j)).get(0)).posz;
                for(var m=0;m<((ArrayList)((ArrayList) blendtree.get(i)).get(j)).size();m++){
                    ((Node) ((ArrayList)((ArrayList) blendtree.get(i)).get(j)).get(m)).posx += x;
                    ((Node) ((ArrayList)((ArrayList) blendtree.get(i)).get(j)).get(m)).posy += y;
                    ((Node) ((ArrayList)((ArrayList) blendtree.get(i)).get(j)).get(m)).posz += z;
                }
            }
        }
    }

    private static void toMongo(){

        try{
            // 连接到 mongodb 服务
            MongoClient mongoClient = new MongoClient( "localhost" , 27017 );
            // 连接到数据库
            MongoDatabase mongoDatabase = mongoClient.getDatabase("Trees");
            MongoCollection<Document> collection = mongoDatabase.getCollection("trees");

            collection.insertMany(documents);
            System.out.println("Insert successfully");

        }catch(Exception e){
            System.err.println( e.getClass().getName() + ": " + e.getMessage() );
        }

    }

    private static void save(String time){
        StringBuilder content = new StringBuilder();
        for (Object aBlendtree : blendtree) {
            for (int j = 0; j < ((ArrayList) aBlendtree).size(); j++) {
                content.append("branch");
                for (var m = 0; m < ((ArrayList) ((ArrayList) aBlendtree).get(j)).size(); m++) {
                    Node temp = ((Node) ((ArrayList) ((ArrayList) aBlendtree).get(j)).get(m));
                    var x = temp.posx;
                    var y = temp.posy;
                    var z = temp.posz;
                    var radius = temp.radius;
                    content.append("x").append(x).append("y").append(y).append("z").append(z).append("radius").append(radius);
                }
            }
        }
        Document document = new Document("treeID",time).
                append("treeData", content.toString());
        documents.add(document);
    }
}