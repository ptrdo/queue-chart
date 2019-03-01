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

const ENDPOINT = "data/";

const API = {
  "QueueState": "QueueState.json",
  "Stats": "Stats.json",
  "Experiments": "Experiments.json"
};

const collection = {

  output: {},

  prep: function (data) {
    
    const mockedData = true;
    
    const vitalizeMockDate = function (dateString) {
      let yesterday = new Date(Date.now() - (36 * 60 * 60 * 1000));
      let yesterdate = yesterday.toISOString().split("T")[0];
      let recently = new Date(Date.parse(yesterdate + "T" + dateString.split("T")[1]) + (16 * 60 * 60 * 1000));
      return recently.toISOString();
    };
  
    const dateTransform = function (node) {
      /* preprocess dates from service-supplied GMT to ui-conducive Local */
      let basis, basic, simple, elapsed;
      if (node.hasOwnProperty("LastCreateTime")) {
        if (mockedData) {
          node.LastCreateTime = vitalizeMockDate(node.LastCreateTime);
        }
        basis = new Date(Date.parse(node.LastCreateTime));
        basic = basis.toLocaleDateString("en-US",{ month: "long", day: "numeric", hour:"2-digit", minute:"2-digit", second:"2-digit" });
        simple = basis.toLocaleDateString("en-US",{ weekday:"short", hour:"2-digit", minute:"2-digit" });
        elapsed = ((Date.now() - basis)/1000/60/60).toPrecision(4);
        node["LastCreateBasic"] = basic;
        node["LastCreateParts"] = simple.replace(/^(.*)(\d+\:\d+)(\s+)(.*)$/, "$1$2$4").split(/\s+/);
        node["ElapsedTime"] = elapsed;
      }
    };
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
  
  merge: function(data) {
    Object.values(this.output).forEach(value => {
      if (Array.isArray(value)) {
        value.forEach(item => {
          if ("ExperimentId" in item && item.ExperimentId in data) {
            Object.assign(item,  data[item.ExperimentId]);
          }
        });
      }
    });
  },

  update: function (data) {
    this.output = this.prep(data);
    return this.output;
  },
  
  append: function (data) {
    this.merge(data);
    return this.output;
  },

  get latest () {
    console.log("collection.latest", this.output);
    return this.output;
  }
};

const fetchAll = function (successCallback, failureCallback)  {

  fetch(ENDPOINT+API.QueueState, { method:"GET" })
  .then(response => response.json())
  .then(data => collection.update(data.QueueState))
  .then(response => fetch(ENDPOINT+API.Stats, { method:"GET" }))
  .then(response => response.json())
  .then(data => collection.append(data.Stats))
  .then(update => new Promise(function(resolve) {
    successCallback();
    setTimeout(function () {
      resolve(update);
    }, 0);
  }))
  .catch(function (error) {
    failureCallback(error);
  })
  .finally(function () {
    console.log("Done!");
  });
 
};

const recoup = function () {
  
};

const refresh = function () {

  fetchAll(render, recoup);

};

const render = function (rootElement=document) {

  let table = rootElement.querySelector("DIV[itemid=QueueChart] TABLE");
  let tbody = !!table ? table.querySelector("TBODY[itemref]") : null;

  if (!!tbody) {
    Object.values(PRIORITY).forEach(bucket => {
      let key = bucket.key;
      let temp = tbody.cloneNode(true);
      temp.setAttribute("itemref", key);
      temp.querySelector("TH").innerText = bucket.name;
      table.appendChild(temp);
      templater.render(temp.querySelector("TR[hidden]"), collection.latest[key]);
    });
  } else {
    alert("failed to render!");
    console.error("failed to render", collection.latest);
  }

};

export default { refresh };