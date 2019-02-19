import templater from "microdata-template";

class Chart {
  /**
   * queue-chart
   * Means to Monitor Progress of Work Processing on HPC Cluster
   *
   * @author psylwester(at)idmod(dot)org
   * @version 1.00, 2019/02/07
   * @requires ES6
   *
   */
  constructor() {
    console.log("The Chart module has been constructed!");
  };

  render(rootElement=document) {
    
    console.log("The Chart module has been rendered!", templater);

    let templateElement = rootElement.querySelector("[itemscope]");
    // templater.render(templateElement, collection);
  };
  
  refresh(source) {
    
    let url = source; 
    let body = {};
    
    fetch(url, {
      method: "GET"
    })
    .then(response => response.json())
    .then(function (data) {
      console.log("data", data);    
    })
    .catch(error => console.error("Error", error));
    
  };

  load() {};
  unload() {};
}

export default Chart;