import jdk.nashorn.api.scripting.JSObject;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import java.util.Date;

public class Main {

    public static void main (String[] args) {
        try {
            ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");

            engine.eval("load('classpath:nashlib.js');");
            engine.eval("print('Hello World');");

            engine.eval("eval(Nash)");

            engine.eval("print(Nash.Nash('sheldon').display('Hello boy'));");

            Invocable invocable = (Invocable) engine;

            Object result = invocable.invokeFunction("Nash.Nash", "sheldon");
            System.out.println(result);
            System.out.println(result.getClass());

            result = invocable.invokeFunction("display", new Date());
            System.out.println(result);
            System.out.println(result.getClass());


        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
