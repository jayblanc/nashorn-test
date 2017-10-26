import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public class MyTest {

    @Test
    public void displayProps() {
        System.out.println(System.getProperty("myprop"));
    }

}
