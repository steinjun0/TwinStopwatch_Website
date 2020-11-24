var randomScalingFactor = function () {
  return Math.round(Math.random() * 100);
};

function getSwitchGapArray(timeline) {
  var switchArray = timeline.switch;
  console.log(`3: ${timeline.switch}`);
  var switchGapArray = [];
  var now = new Date().getTime();
  switchArray.push(now);
  console.log(`6: ${switchArray}`);
  switchArray = switchArray.map((x) => x - timeline.switch[0]);
  console.log(`7: ${switchArray}`);
  for (var i = 0; i < switchArray.length - 1; i++) {
    switchGapArray.push(switchArray[i + 1] - switchArray[i]);
  }
  console.log(switchGapArray);
  return switchGapArray;
}

function getConfig(switchGapArray) {
  var config = {
    type: "pie",
    data: {
      datasets: [
        {
          data: switchGapArray,
          backgroundColor: [
            window.chartColors.red,
            window.chartColors.orange,
            window.chartColors.yellow,
            window.chartColors.green,
            window.chartColors.blue,
          ],
          label: "Dataset 1",
        },
      ],
      labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
    },
    options: {
      responsive: true,
      animation: false,
      //events: ["click", "hover"],
    },
  };

  return config;
}

function getAnimationConfig(switchGapArray) {
  var config = {
    type: "pie",
    data: {
      datasets: [
        {
          data: switchGapArray,
          backgroundColor: [
            window.chartColors.red,
            window.chartColors.orange,
            window.chartColors.yellow,
            window.chartColors.green,
            window.chartColors.blue,
          ],
          label: "Dataset 1",
        },
      ],
      labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
    },
    options: {
      responsive: true,
    },
  };

  return config;
}

function showChart(timeline, animationFlag, myPie) {
  var switchGapArray = getSwitchGapArray(timeline);
  if (animationFlag > 0) {
    var config = getAnimationConfig(switchGapArray);
  } else {
    var config = getConfig(switchGapArray);
  }
  console.log(`show chart`);
  try {
    myPie.data.datasets[0].data[myPie.data.datasets[0].data.length - 1] =
      switchGapArray[switchGapArray.length - 1];
    console.log(`5: ${timeline.switch}`);
    myPie.destroy();
  } catch (error) {
    console.log(`{showChart}: there is no pie chart yet`);
  }

  var ctx = document.getElementById("chart").getContext("2d");
  myPie = new Chart(ctx, config);
  return myPie;
}

function editStartTime() {}