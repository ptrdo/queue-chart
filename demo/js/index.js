import Config from "./config";
import Chart from "../../queue-chart.js";

let chart = new Chart();

class Index {

  constructor() {
    console.log("The Index module has been constructed!");
  };

  render(rootElement=document) {
    let button = document.createElement("BUTTON");
    button.appendChild(document.createTextNode("Do It"));
    button.addEventListener("click", function(event) {
      alert("done!");
      chart.render();
    });
    rootElement.appendChild(button);
    console.log("The Index module has been rendered!");
  };

  load() {};
  unload() {};
}

export default Index;