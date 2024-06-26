package main.java.com.jos.spotifyclone.error;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class AppErrorController implements ErrorController {
    @Override
    @RequestMapping("/error")
    @ResponseBody
    public String getErrorPath() {
        return "This is a basic error message. Perhaps you have typed the link wrong?";
    }
}
