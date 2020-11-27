function getTimeline(timelineJson) {
  const promise = new Promise((resolve, reject) => {
    var file = `${timelineJson.replace("./data", "")}`;
    console.log(`getTimeline file: ${file}`);
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
        var data = JSON.parse(rawFile.responseText);
        console.log(data);
        resolve(data); // 콜백함수 호출
      }
    };
    rawFile.send(null);
  });
  return promise;
}

class MyClock {
  constructor({ template }) {
    this.template = template;
    this.flag = "finish";
    this.red_watch_start_time = "";
    this.userId;
    this.chartTimer;
    this.timelineJson;
    window.myPie;
  }

  load(userId, timelineJson) {
    // 시작시간, study duration, rest duration 계산(2n-(2n-1), 2n+1 - 2n)
    // 최근 스위치 시간-> study / rest 판단
    //
    // json 파일 다운로드 시작(비동기때문에 promise 사용)
    this.timelineJson = timelineJson;
    this.userId = userId;
    const promise = getTimeline(timelineJson);

    // 콜백을 통해 data(json)를 가져옴
    promise.then((data) => {
      console.log("{MyClcok.load} get all json data");
      console.log(data);

      var loadDate = new Date();
      loadDate.setTime(Number(data.startTime));

      var start_months = loadDate.getMonth() + 1;
      var start_date = loadDate.getDate();
      var start_hour = loadDate.getHours();
      var start_mins = loadDate.getMinutes();

      let start_time = "t.m.d h:m"
        .replace("t", loadDate.getFullYear())
        .replace("m", start_months)
        .replace("d", start_date)
        .replace("h", start_hour)
        .replace("m", start_mins);
      document.getElementById("start_time").innerHTML = start_time;

      this.red_watch_start_time = Number(data.startTime);
      this.blue_watch_start_time = Number(data.startTime);
      console.log(data);
      this.flag = data.switchTime.length % 2 == 1 ? "red_start" : "blue_start";

      for (var i = 0; i < data.switchTime.length; i++) {
        if (i == 0) {
        } else {
          if (i % 2 == 1) {
            this.blue_watch_start_time +=
              Number(data.switchTime[i]) - Number(data.switchTime[i - 1]);
          } else {
            this.red_watch_start_time +=
              Number(data.switchTime[i]) - Number(data.switchTime[i - 1]);
          }
        }
      }

      console.log(
        "{MyClcok.load} data switchTime: " + (data.switchTime.length % 2)
      );

      if (data.switchTime.length % 2 == 1) {
        this.flag = "red_start";
        this.blue_watch_pause_time = Number(
          data.switchTime[data.switchTime.length - 1]
        );
        blue_show(
          Number(this.red_watch_start_time) - Number(data.startTime),
          this.template
        );
      } else {
        this.flag = "blue_start";
        this.red_watch_pause_time = Number(
          data.switchTime[data.switchTime.length - 1]
        );
        red_show(
          Number(this.blue_watch_start_time) - Number(data.startTime),
          this.template
        );
      }

      this.timer = setInterval(() => {
        this.showWatch();
      }, 1000);

      var switchGapArray = getSwitchGapArray(data);
      var config = getAnimationConfig(switchGapArray);
      var ctx = document.getElementById("chart").getContext("2d");
      window.myPie = new Chart(ctx, config);

      var animationFlag = 0;
      this.chartTimer = setInterval(() => {
        const promiseTimer = getTimeline(timelineJson);
        promiseTimer.then((timeline) => {
          window.myPie = showChart(timeline, animationFlag, window.myPie);
        });
      }, 1000);
    });
  }

  startWatch() {
    console.log(arguments[0]);
    if (arguments[0] == undefined) {
      console.log("overriding checking: origin");
      this.date = new Date();
    }
    if (this.flag == "finish") {
      console.log("!start_watch!123");

      this.start_months = this.date.getMonth() + 1;
      this.start_date = this.date.getDate();
      this.start_hour = this.date.getHours();
      this.start_mins = this.date.getMinutes();

      if (this.start_months < 10) {
        this.start_months = "0" + this.start_months;
      }
      if (this.start_date < 10) {
        this.start_date = "0" + this.start_date;
      }
      if (this.start_hour < 10) {
        this.start_hour = "0" + this.start_hour;
      }
      if (this.start_mins < 10) {
        this.start_mins = "0" + this.start_mins;
      }

      let start_time = "t.m.d h:m"
        .replace("t", this.date.getFullYear())
        .replace("m", this.start_months)
        .replace("d", this.start_date)
        .replace("h", this.start_hour)
        .replace("m", this.start_mins);
      document.getElementById("start_time").innerHTML = start_time;

      this.red_watch_start_time = this.date.getTime();
      this.blue_watch_start_time = this.date.getTime();
      this.blue_watch_pause_time = this.date.getTime();

      this.flag = "red_start";
      this.timer = setInterval(() => this.showWatch(), 1000);
    }
  }

  switchWatch() {
    this.now = new Date();
    if (this.flag == "red_start") {
      this.flag = "blue_start";
      this.red_watch_pause_time = this.now.getTime();
      this.blue_watch_start_time += this.pause_duration;
    } else if (this.flag == "blue_start") {
      this.flag = "red_start";
      this.blue_watch_pause_time = this.now.getTime();
      this.red_watch_start_time += this.pause_duration;
    }
  }

  resetWatch() {
    console.log("in finish!");

    if (this.flag == "red_start" || this.flag == "blue_start") {
      clearInterval(this.timer);
      clearInterval(this.chartTimer);
      var ctx = document.getElementById("chart").getContext("2d");

      console.log(window.myPie);
      window.myPie.destroy();
      this.flag = "finish";
      document.getElementById("finish_button").innerHTML = "reset";
      console.log("stop!");
    } else if (this.flag == "finish") {
      document.getElementById("study_time").innerHTML = "00:00:00";
      document.getElementById("rest_time").innerHTML = "00:00:00";
      document.getElementById("finish_button").innerHTML = "finish";
    }
  }

  showWatch() {
    console.log("showWatch!");
    if (this.flag == "red_start") {
      this.now = new Date();
      this.pause_duration = this.now.getTime() - this.blue_watch_pause_time;
      this.red_elapsed_seconds = this.now.getTime() - this.red_watch_start_time;

      red_show(this.red_elapsed_seconds, this.template);
    } else if (this.flag == "blue_start") {
      this.now = new Date();
      this.pause_duration = this.now.getTime() - this.red_watch_pause_time;
      this.blue_elapsed_seconds =
        this.now.getTime() - this.blue_watch_start_time;
      blue_show(this.blue_elapsed_seconds, this.template);
    }
  }
}

let myClock = new MyClock({ template: "h:m:s" });

const start_button = document.querySelector(".start_button");
const switch_button = document.querySelector(".switch_button");
const finish_button = document.querySelector(".finish_button");

var xhr = new XMLHttpRequest();

start_button.addEventListener("click", () => {
  myClock.startWatch();
  console.log(`myClock.userId: ${myClock.userId}`);

  xhr.open("POST", "/button", true);
  xhr.send(`start`);

  xhr.onreadystatechange = function () {
    console.log(`xhr.readyState: ${xhr.readyState}`);

    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      console.log(`get response`);
      console.log(`xhr.responseText: ${xhr.responseText}`);
      var chartTimerPromise = getTimeline("./" + xhr.responseText);
      console.log(`start first promise`);

      myClock.timelineJson = "./" + xhr.responseText;
      var animationFlag = 1;
      myClock.chartTimer = setInterval(() => {
        var chartTimerPromise = getTimeline(myClock.timelineJson);
        chartTimerPromise.then((timeline) => {
          myPie = showChart(timeline, animationFlag, window.myPie);
          if (animationFlag > 0) {
            animationFlag -= 1;
          }
        });
      }, 1000);
    }
  };
});

switch_button.addEventListener("click", () => {
  myClock.switchWatch();
  xhr.open("POST", "/button", true);
  xhr.send(`switch`);
});

finish_button.addEventListener("click", () => {
  myClock.resetWatch();
  console.log("click finish!");
  xhr.open("POST", "/button", true);
  xhr.send(`finish`);
});

function red_show(red_elapsed_seconds, template) {
  this.red_hour = parseInt((red_elapsed_seconds / (1000 * 3600)) % 24);
  this.red_minute = parseInt((red_elapsed_seconds / (1000 * 60)) % 60);
  this.red_second = parseInt((red_elapsed_seconds / 1000) % 60);

  if (this.red_hour < 10) {
    this.red_hour = "0" + this.red_hour;
  }
  if (this.red_minute < 10) {
    this.red_minute = "0" + this.red_minute;
  }
  if (this.red_second < 10) {
    this.red_second = "0" + this.red_second;
  }

  let red_output = template
    .replace("h", this.red_hour)
    .replace("m", this.red_minute)
    .replace("s", this.red_second);
  //this.lcd_red.display(text);

  document.getElementById("study_time").innerHTML = red_output;
}

function blue_show(blue_elapsed_seconds, template) {
  this.blue_hour = parseInt((blue_elapsed_seconds / (1000 * 3600)) % 24);
  this.blue_minute = parseInt((blue_elapsed_seconds / (1000 * 60)) % 60);
  this.blue_second = parseInt((blue_elapsed_seconds / 1000) % 60);

  if (this.blue_hour < 10) {
    this.blue_hour = "0" + this.blue_hour;
  }
  if (this.blue_minute < 10) {
    this.blue_minute = "0" + this.blue_minute;
  }
  if (this.blue_second < 10) {
    this.blue_second = "0" + this.blue_second;
  }
  // 시:분:초 형태로 문자열 포맷팅을 합니다.
  let blue_output = template
    .replace("h", this.blue_hour)
    .replace("m", this.blue_minute)
    .replace("s", this.blue_second);

  // 출력
  //this.lcd_blue.display(text)
  console.log("blue" + blue_output);

  document.getElementById("rest_time").innerHTML = blue_output;
}
