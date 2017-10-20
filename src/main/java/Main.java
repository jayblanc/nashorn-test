import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

public class Main {

    public static void main (String[] args) {
        try {
            ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");

            engine.eval("load('classpath:hash.js');");
            engine.eval("print('Hello World');");

            engine.eval("print(MyHash('toto'));");

            Invocable invocable = (Invocable) engine;

            Object result = invocable.invokeFunction("MyHash", "Sheldon Cooper");
            System.out.println(result);
            System.out.println(result.getClass());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
