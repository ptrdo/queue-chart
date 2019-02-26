import templater from "microdata-template";

/**
 * queue-chart
 * Means to Monitor Progress of Work Processing on HPC Cluster
 *
 * @author psylwester(at)idmod(dot)org
 * @version 0.1.0, 2019/02/20
 * @requires ES6, microdata-template
 *
 */

const PRIORITY = {
  1: { 
    key: "Highest", 
    name: "Highest" 
  },
  2: { 
    key: "AboveNormal", 
    name: "Above Normal" 
  },
  3: { 
    key: "Normal", 
    name: "Normal" 
  },
  4: { 
    key: "BelowNormal", 
    name: "Below Normal" 
  },
  5: { 
    key: "Lowest", 
    name: "Lowest" 
  }
};

const collection = {

  output: {},

  prep: function (data) {
    const dateTransform = function (node) {
      /* preprocess dates from service-supplied GMT to ui-conducive Local */
      let basis, local, split;
      if (node.hasOwnProperty("LastCreateTime")) {
        basis = new Date(Date.parse(node.LastCreateTime));
        local = basis.toLocaleString();
        split = local.split(/,?\s+/);
        if (split.length > 2) {
          /* IE doesn't support a negative lookahead */
          split[1] = [split[1], split[2]].join(" ");
        }
        node["LastCreateTimeLocalSplit"] = split;
      }
    }
    Object.values(data).forEach(value => {
      if (Array.isArray(value)) {
        value.forEach(item => {
          dateTransform(item);
        });
      }
    });
    Object.values(PRIORITY).forEach(bucket => { 
      if(bucket.key in data) {} else {
        data[bucket.key] = [];
      }
    });
    return data;
  },

  set input (data) {
    this.output = this.prep(data);
  },

  get latest () {
    return this.output;
  }
};

const refresh = function (source) {

  let url = source;
  let body = {};

  fetch(url, {
    method: "GET"
  })
  .then(response => response.json())
  .then(function (data) {
    console.log("data", data);
    collection.input = data.QueueState;
    render();
  })
  .catch(error => console.error("Error", error));

};

const render = function (rootElement=document) {

  let table = rootElement.querySelector("DIV[itemid=QueueChart] TABLE");
  let tbody = !!table ? table.querySelector("TBODY[itemref]") : null;

  if (!!tbody) {
    Object.values(PRIORITY).forEach(bucket => {
      let key = bucket.key;
      let temp = tbody.cloneNode(true);
      temp.setAttribute("itemid", key);
      table.appendChild(temp);
      templater.render(temp.querySelector("TR[hidden]"), collection.latest[key]);
    });
  } else {
    alert("failed to render!");
    console.error("failed to render", collection.latest);
  }

};

export default { refresh };