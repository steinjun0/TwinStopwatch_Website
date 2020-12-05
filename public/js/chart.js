const chart_start_time = document.querySelector(".chart_start_time");
const chart_finish_time = document.querySelector(".chart_finish_time");
const chart_duration_time = document.querySelector(".chart_duration_time");

const chart_start_time_input = document.querySelector(
  ".chart_start_time_input"
);
const chart_finish_time_input = document.querySelector(
  ".chart_finish_time_input"
);

const chart_edit_box = document.querySelector(".chart_edit_box");
const finish_time_box = document.querySelector(".finish_time_box");
const duration_time_box = document.querySelector(".duration_time_box");

const chart_edit_button = document.querySelector(".chart_edit_button");
const chart_add_button = document.querySelector(".chart_add_button");
const chart_delete_button = document.querySelector(".chart_delete_button");

const edit_time_box = document.querySelector(".edit_time_box");
const add_time_box = document.querySelector(".add_time_box");
const edit_confirm_button = document.querySelector(".edit_confirm_button");
const add_confirm_button = document.querySelector(".add_confirm_button");

const edit_start_time_input = document.querySelector(".edit_start_time_input");
const edit_finish_time_input = document.querySelector(
  ".edit_finish_time_input"
);
const add_start_time_input = document.querySelector(".add_start_time_input");
const add_finish_time_input = document.querySelector(".add_finish_time_input");

var randomScalingFactor = function () {
  return Math.round(Math.random() * 100);
};

function getSwitchGapArray(timeline) {
  var switchArray = timeline.switchTime;
  //console.log(`3: ${timeline.switchTime}`);
  var switchGapArray = [];
  var now = new Date().getTime();
  switchArray.push(now);
  //console.log(`6: ${switchArray}`);
  switchArray = switchArray.map((x) => x - timeline.switchTime[0]);
  //console.log(`7: ${switchArray}`);
  for (var i = 0; i < switchArray.length - 1; i++) {
    switchGapArray.push(switchArray[i + 1] - switchArray[i]);
  }
  //console.log(switchGapArray);
  return switchGapArray;
}

var COLORS = function () {
  var short_COLORS = [
    window.chartColors.red,
    //window.chartColors.orange,
    //window.chartColors.yellow,
    //window.chartColors.green,
    window.chartColors.blue,
  ];
  var long_COLORS = [];
  for (var i = 0; i < 100; i++)
    long_COLORS.push(short_COLORS[i % short_COLORS.length]);
  return long_COLORS;
};

function getConfig(switchGapArray) {
  var config = {
    type: "pie",
    data: {
      datasets: [
        {
          data: switchGapArray,
          backgroundColor: COLORS,
          label: "Dataset 1",
        },
      ],
      //labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
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
          backgroundColor: COLORS,
          label: "Dataset 1",
        },
      ],
      //labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
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
  //console.log(`show chart`);
  try {
    myPie.data.datasets[0].data[myPie.data.datasets[0].data.length - 1] =
      switchGapArray[switchGapArray.length - 1];
    myPie.destroy();
  } catch (error) {
    //console.log(`{showChart}: there is no pie chart yet`);
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

      chart_edit_button.onclick = function () {
        edit_time_box.classList.toggle("active");
      };
      chart_add_button.onclick = function () {
        add_time_box.classList.toggle("active");
        //console.log(`${edit_start_time_input.value}`);
      };

      edit_confirm_button.onclick = function () {
        editTime(
          clickedElementindex,
          `${edit_start_time_input.value}`,
          `${edit_finish_time_input.value}`
        );
      };
      add_confirm_button.onclick = function () {
        addTimeBlock(clickedElementindex, startTime, endTime);
      };
      chart_delete_button.onclick = function () {
        deleteTimeBlock(clickedElementindex);
      };
    }
  };
  return myPie;
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
        startTime.getMonth()
      )}/${convertOneDigitToTwoDigits(
        startTime.getDate()
      )} ${convertOneDigitToTwoDigits(
        startTime.getHours()
      )}:${convertOneDigitToTwoDigits(startTime.getMinutes())}`;
      //console.log(`${startTime.getHours()}:${startTime.getMinutes()}`);
      edit_start_time_input.value = `${convertOneDigitToTwoDigits(
        startTime.getHours()
      )}:${convertOneDigitToTwoDigits(startTime.getMinutes())}`;
      add_start_time_input.value = `${convertOneDigitToTwoDigits(
        startTime.getHours()
      )}:${convertOneDigitToTwoDigits(startTime.getMinutes())}`;

      if (timeData.finishTime === undefined) {
        chart_finish_time.innerHTML = `종료 시간: 진행 중입니다`;
      } else {
        chart_finish_time.innerHTML = `종료 시간: ${convertOneDigitToTwoDigits(
          finishTime.getMonth()
        )}/${convertOneDigitToTwoDigits(
          finishTime.getDate()
        )} ${convertOneDigitToTwoDigits(
          finishTime.getHours()
        )}:${convertOneDigitToTwoDigits(finishTime.getMinutes())}`;
        edit_finish_time_input.value = `${convertOneDigitToTwoDigits(
          finishTime.getHours()
        )}:${convertOneDigitToTwoDigits(finishTime.getMinutes())}`;
        add_finish_time_input.value = `${convertOneDigitToTwoDigits(
          finishTime.getHours()
        )}:${convertOneDigitToTwoDigits(finishTime.getMinutes())}`;
      }
      // 소요시간 계산
      if (timeData.finishTime === undefined) {
        var duration = parseInt(
          (Number(new Date().getTime()) - Number(timeData.startTime)) / 1000
        );
      } else {
        var duration = parseInt(
          (Number(timeData.finishTime) - Number(timeData.startTime)) / 1000
        );
      }
      chart_duration_time.innerHTML = `소요 시간: ${convertOneDigitToTwoDigits(
        parseInt(duration / (60 * 60))
      )}:${convertOneDigitToTwoDigits(
        parseInt((duration / 60) % 60)
      )}:${convertOneDigitToTwoDigits(parseInt(duration % 60))}`;
      if (myClock.showingEditTimeBox === 0) {
        chart_edit_box.classList.toggle("active");
        myClock.showingEditTimeBox = 1;
      } else {
        //console.log(
        //  `{showChartEditText}myClock.presentChartIndex: ${myClock.presentChartIndex}`
        //);
        //console.log(`{showChartEditText}n: ${n}`);
        if (myClock.presentChartIndex === n) {
          chart_edit_box.classList.toggle("active");
          myClock.presentChartIndex = -1;
          myClock.showingEditTimeBox = 0;
          return;
        }
      }
      myClock.presentChartIndex = n;
    }
  };
}

function editTime(n, startTime, endTime) {
  var now = new Date();
  console.log(`now.toString:${now.getTime()}`);
  console.log(`Number(now.toString()):${Number(now.getTime())}`);
  console.log(`endTime:${endTime}`);
  if (startTime > endTime) {
    alert(`시작시간이 종료시간보다 빠릅니다!`);
  }
  else {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/edit", true);
    var body = {
      option: "editTime",
      idx: n,
      data: [startTime, endTime],
      yesterday: [0, 0],
      standardDate: new Date().toString(),
    };
    body = JSON.stringify(body);
    xhr.send(body);
    alert(`${body}`);
    //console.log(body);
    //console.log(xhr.readyState);
    //console.log(xhr.status);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        console.log(xhr.responseText);
        var response = JSON.parse(xhr.responseText);
        if (response.type === `error`) {
          console.log(`i'm in error`);
          alert(response.body);
        } else {
          clearInterval(myClock.timer);
          clearInterval(myClock.chartTimer);
          //window.myPie.destroy();
          myClock.load(myClock.userId, myClock.timelineJson);
        }
      }
    };
  }
}

function addTimeBlock(n, startTime, endTime) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/edit", true);
  var body = {
    option: "addTimeBlock",
    idx: n,
    data: [startTime, endTime],
  };
  body = JSON.stringify(body);
  xhr.send(body);
  alert(`${body}`);
  //console.log(body);
  //console.log(xhr.readyState);
  //console.log(xhr.status);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE && httpRequest.status == 200) {
      var response = JSON.parse(xhr.responseText);
      if (response.type === `error`) {
        alert(response.body);
      } else {
        clearInterval(myClock.timer);
        clearInterval(myClock.chartTimer);
        //window.myPie.destroy();
        myClock.load(myClock.userId, myClock.timelineJson);
      }
    }
  };
}

function deleteTimeBlock(n) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/edit", true);
  var body = {
    option: "deleteTimeBlock",
    idx: n,
    data: undefined,
  };
  body = JSON.stringify(body);
  xhr.send(body);
  alert(`${body}`);
  //console.log(body);
  //console.log(xhr.readyState);
  //console.log(xhr.status);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      clearInterval(myClock.timer);
      clearInterval(myClock.chartTimer);
      //window.myPie.destroy();
      myClock.load(myClock.userId, myClock.timelineJson);
    }
  };
}

function animateDownBox() {
  chart_edit_button.onclick = function () {
    chart_edit_box.classList.toggle("active");
  };
  chart_add_button.onclick = function () {
    finish_time_box.classList.toggle("active");
  };
  chart_delete_button.onclick = function () {
    duration_time_box.classList.toggle("active");
  };
}
