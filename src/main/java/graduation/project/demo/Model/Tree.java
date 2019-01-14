import java.io.Serializable;
import java.util.ArrayList;

import org.apache.tomcat.jni.Address;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
/**
 * 用户实体类
 * @author itdragon
 */
//@Document(collection = "itdragon_user")  如果为了代码的通用性，建议不要使用
public class Tree implements Serializable{

    private static final long serialVersionUID = 1L;
    @Id
    private Long id;
    private String treeData;
    private String treeID;

}

