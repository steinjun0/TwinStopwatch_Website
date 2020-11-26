const chart_start_time = document.querySelector(".chart_start_time");
const chart_finish_time = document.querySelector(".chart_finish_time");
const chart_duration_time = document.querySelector(".chart_duration_time");
const chart_edit_box = document.querySelector(".chart_edit_box");

var randomScalingFactor = function () {
  return Math.round(Math.random() * 100);
};

function getSwitchGapArray(timeline) {
  var switchArray = timeline.switchTime;
  console.log(`3: ${timeline.switchTime}`);
  var switchGapArray = [];
  var now = new Date().getTime();
  switchArray.push(now);
  console.log(`6: ${switchArray}`);
  switchArray = switchArray.map((x) => x - timeline.switchTime[0]);
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
    console.log(`5: ${timeline.switchTime}`);
    myPie.destroy();
  } catch (error) {
    console.log(`{showChart}: there is no pie chart yet`);
  }

  var ctx = document.getElementById("chart").getContext("2d");
  myPie = new Chart(ctx, config);

  document.getElementById("chart").onclick = function (evt) {
    var activePoints = myPie.getElementsAtEvent(evt);

    if (activePoints.length > 0) {
      //get the internal index of slice in pie chart
      var clickedElementindex = activePoints[0]["_index"];

      // //get specific label by index
      // var label = chart.data.labels[clickedElementindex];

      // //get value by index
      // var value = chart.data.datasets[0].data[clickedElementindex];

      //editStartTime(clickedElementindex, "1606301470000");
      showChartEditText(clickedElementindex);

      /* other stuff that requires slice's label and value */
      //console.log("toggled!");
      //chart_edit_box.classList.toggle("active");
    }
  };
  return myPie;
}

function editStartTime(n, editTime) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/edit", true);
  var body = {
    option: "editStartTime",
    idx: n,
    data: editTime,
  };
  body = JSON.stringify(body);
  xhr.send(body);
  alert(`${body}`);
  console.log(body);
  console.log(xhr.readyState);
  console.log(xhr.status);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      clearInterval(myClock.timer);
      clearInterval(myClock.chartTimer);
      myClock.load(myClock.userId, myClock.timelineJson);
      chart_edit_box.classList.toggle("active");
    }
  };
}

function convertOneDigitToTwoDigits(number) {
  if (number < 10) {
    return "0" + number;
  }
  return number;
}

function showChartEditText(n) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/edit", true);
  var body = {
    option: "showChartEditText",
    idx: n,
  };
  body = JSON.stringify(body);
  xhr.send(body);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      var timeData = JSON.parse(xhr.responseText);
      var startTime = new Date();
      startTime.setTime(timeData.startTime);
      var finishTime = new Date();
      finishTime.setTime(timeData.finishTime);
      chart_start_time.innerHTML = `시작 시간: ${convertOneDigitToTwoDigits(
        startTime.getDate()
      )}일 ${convertOneDigitToTwoDigits(
        startTime.getHours()
      )}:${convertOneDigitToTwoDigits(startTime.getMinutes())}`;
      chart_finish_time.innerHTML = `종료 시간: ${convertOneDigitToTwoDigits(
        finishTime.getDate()
      )}일 ${convertOneDigitToTwoDigits(
        finishTime.getHours()
      )}:${convertOneDigitToTwoDigits(finishTime.getMinutes())}`;
      chart_duration_time.innerHTML = `소요 시간: ${
        Number(timeData.finishTime) - Number(timeData.startTime)
      }`;
      chart_edit_box.classList.toggle("active");
    }
  };
}
