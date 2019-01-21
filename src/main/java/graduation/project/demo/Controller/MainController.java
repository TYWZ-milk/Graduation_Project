package graduation.project.demo.Controller;


import com.mongodb.MongoClient;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;


/**
 * 这里的@RestController   相当于@ResponseBody + @Controller
 */
@SpringBootApplication(exclude = MongoAutoConfiguration.class)
@Controller
public class MainController {
    @RequestMapping(value = "/main",method = RequestMethod.GET)
    public String Main(Model model, HttpSession session){
        List<Object> documents = new ArrayList<>();
        String timeid = (String) session.getAttribute("timeid");
        try {
            // 连接到 mongodb 服务
            MongoClient mongoClient = new MongoClient("localhost", 27017);
            // 连接到数据库
            MongoDatabase mongoDatabase = mongoClient.getDatabase("Trees");
            MongoCollection<Document> collection = mongoDatabase.getCollection("trees");
            Bson filter = Filters.eq("treeID", timeid);
            FindIterable findIterable = collection.find(filter);
            MongoCursor cursor = findIterable.iterator();
            int i = 0;

            while (cursor.hasNext()) {
                documents.add(cursor.next());
                i++;
            }
            System.out.println("i=" + i);
        }catch (Exception e) {
            System.err.println( e.getClass().getName() + ": " + e.getMessage() );
        }
        model.addAttribute("data",documents);
        return "main";
    }
}