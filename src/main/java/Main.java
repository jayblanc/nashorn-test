import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

public class Main {

    public static void main (String[] args) {
        try {
            ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");

            engine.eval("load('classpath:js/timeout.js');");
            engine.eval("load('classpath:js/require.js');");
            engine.eval("load('classpath:js/main.js');");

            engine.eval("print('Hello World');");

            engine.eval("var cc = new Hash('sha512');");
            engine.eval("cc.hash('this is my text').then( (h) => { print(h) });");

//            Invocable invocable = (Invocable) engine;
//
//            Object result = invocable.invokeFunction("Nash.Nash", "sheldon");
//            System.out.println(result);
//            System.out.println(result.getClass());
//
//            result = invocable.invokeFunction("display", new Date());
//            System.out.println(result);
//            System.out.println(result.getClass());


        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
