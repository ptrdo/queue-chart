import Config from "./config";
import queue from "../../queue-chart.js";

class Index {

  constructor() {
    console.log("The Index module has been constructed!");
  };

  render(rootElement=document) {
    let button = document.createElement("BUTTON");
    button.appendChild(document.createTextNode("Do It"));
    button.setAttribute("style", "padding: 0.5em 1em;")
    button.addEventListener("click", function(event) {

      // queue.render();
      queue.refresh();
      
      console.log("queue", queue);
      
    });

    // rootElement.appendChild(button);
    document.querySelector("[itemid=QueueChart]").appendChild(button);

    console.log("The Index module has been rendered!", $(button).get(0));

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