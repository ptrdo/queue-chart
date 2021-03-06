import Config from "./config";
import Auth from "comps-ui-auth";
import queue from "../../queue-chart.js";

class Index {

  constructor() {
    console.log("The Index module has been constructed!");
  };

  render(rootElement=document) {
    
    let button = document.createElement("BUTTON");
    button.appendChild(document.createTextNode("Do It"));
    button.setAttribute("style", "padding: 0.5em 1em;")
    button.addEventListener("click", function (event) {
      event.preventDefault();
      queue.refresh();
    });
    
    let redraw = document.querySelector("div[itemid=QueueChart] button.refresh");
    redraw.addEventListener("click", function (event) {
      event.preventDefault();
      queue.redraw();
    });

    let authMenu = document.querySelector("a.nav-account");
    authMenu.addEventListener("click", function (event) {
      let menu = event.target;
      while (!/^(LI|MENU)$/i.test(menu.nodeName)) {
        menu = menu.parentElement;
      }
      menu.classList.toggle("active"); 
    });
    
    let authToggle = document.querySelector("a[data-action=session]");
    authToggle.addEventListener("click", function (event) {
      let menu = event.target;
      while (!menu.classList.contains("active")) {
        menu = menu.parentElement;
      }
      menu.classList.remove("active");
      Auth.signout(Config.appName);
    });
    
    document.querySelector("[itemid=QueueChart]").appendChild(button);

    setTimeout(function () {
      document.documentElement.setAttribute("data-useragent", navigator.userAgent);
      window.addEventListener("touchstart", function onFirstTouch() {

        document.body.classList.add("touch");
        window.removeEventListener('touchstart', onFirstTouch, false);

      }, false);
    }, 0);

  };

  load() {};
  unload() {};
}

export default Index;