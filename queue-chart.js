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
    console.log("The Chart module has been rendered!");
  };

  load() {};
  unload() {};
}

export default Chart;