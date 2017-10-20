import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

public class Main {

    public static void main (String[] args) {
        try {
            ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");

            engine.eval("load('classpath:hash.js');");
            engine.eval("print('Hello World');");

            engine.eval("var mh = new MyHash();");
            engine.eval("print(mh);");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
