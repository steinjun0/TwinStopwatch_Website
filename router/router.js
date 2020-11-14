var qs = require("querystring");
var url = require("url");
var fs = require("fs");

const dataFolder = "./data";

function getFormatDate(date) {
  var year = date.getFullYear();
  var month = 1 + date.getMonth();
  month = month >= 10 ? month : "0" + month;
  var day = date.getDate();
  day = day >= 10 ? day : "0" + day;
  return year + "-" + month + "-" + day;
}

var global = this;

module.exports = function (app) {
  app.get("/", function (req, res) {
    res.render("login.html");
  });

  app.post("/timer", function (req, res) {
    var body = "";
    var userData = "";
    req.on("data", function (data) {
      body = body + data;
    });
    req.on("end", function () {
      global.userData = qs.parse(body);
      console.log("userdata: ");
      console.log(global.userData);

      fs.readdir(dataFolder, function (error, filelist) {
        console.log("filelist: " + filelist);
        // 처음 온 유저라면
        if (!fs.existsSync(`${dataFolder}/${global.userData.id}`)) {
          console.log("처음 방문합니다.");
          fs.mkdirSync(`${dataFolder}/${global.userData.id}`); // 유저 폴더 생성
          fs.writeFileSync(
            // 유저 데이터 json파일 생성
            `${dataFolder}/${global.userData.id}/${global.userData.id}-userData.json`,
            JSON.stringify(global.userData)
          );

          console.log("오늘 처음 방문합니다.");
          console.log("mkdir userid/date");
          fs.mkdirSync(
            `${dataFolder}/${global.userData.id}/${getFormatDate(new Date())}`
          );
          res.render("timer", {
            userId: global.userData.id,
            userName: global.userData.name,
            userImage: global.userData.image,
            date: getFormatDate(new Date()),
            visited: false,
          });
        }
        //온적 있다면
        else {
          console.log("온적 있습니다.");
          fs.writeFileSync(
            // 유저 데이터 json파일 생성
            `${dataFolder}/${global.userData.id}/${global.userData.id}-userData.json`,
            JSON.stringify(global.userData)
          );
          //오늘 처음 방문했다면
          if (
            !fs.existsSync(
              `${dataFolder}/${global.userData.id}/${getFormatDate(new Date())}`
            )
          ) {
            console.log("와봤는데 오늘 처음 방문합니다.");
            console.log("global.userdata.id");
            console.log(global.userData.id);

            console.log("mkdir userid/date");
            fs.mkdirSync(
              `${dataFolder}/${global.userData.id}/${getFormatDate(new Date())}`
            );

            res.render("timer", {
              userId: global.userData.id,
              userName: global.userData.name,
              userImage: global.userData.image,
              date: getFormatDate(new Date()),
              visited: false,
            });
          } else {
            // 오늘 방문한 적 있다면
            console.log("오늘 방문한적 있습니다");
            res.render("timer", {
              userId: global.userData.id,
              userName: global.userData.name,
              userImage: global.userData.image,
              date: getFormatDate(new Date()),
              visited: true,
            });
          }
        }
      });
    });
  });

  app.get("/timer", function (req, res) {
    now = new Date();
    var date = getFormatDate(now);
    var _url = req.url;
    var queryData = url.parse(_url, true).query;
    //userData = fs.readFileSync(userData.json);
    //userData = JSON.parse(userData);

    var timeFolder = `${dataFolder}/${queryData.id}/${date}`;

    console.log(queryData.id);
    console.log(getFormatDate(now));
    console.log(timeFolder);
    console.log(!fs.existsSync(timeFolder));
    // start 버튼을 눌렀을 때
    if (queryData.state === "start") {
      if (!fs.existsSync(timeFolder)) {
        fs.mkdirSync(timeFolder);
      }
      var startData = {
        startTime: `${now.getTime()}`,
        switch: [`${now.getTime()}`],
        finishTime: "",
      };
      startData = JSON.stringify(startData);
      fs.writeFileSync(`${timeFolder}/timeline.json`, startData);
    } // switch 버튼을 눌렀을 때
    else if (queryData.state === "switch") {
      var timeline = JSON.parse(
        fs.readFileSync(`${timeFolder}/timeline.json`).toString()
      );

      timeline.switch.push(`${now.getTime()}`);

      console.log("timeline: " + JSON.stringify(timeline));
      console.log("switch: " + timeline.switch);

      timeline = JSON.stringify(timeline);
      fs.writeFileSync(`${timeFolder}/timeline.json`, timeline);
    } // finish 버튼을 눌렀을 때
    else if (queryData.state === "finish") {
      var timeline = JSON.parse(
        fs.readFileSync(`${timeFolder}/timeline.json`).toString()
      );

      timeline.finishTime = `${now.getTime()}`;

      console.log("timeline: " + JSON.stringify(timeline));
      console.log("finish: " + timeline.finishTime);

      timeline = JSON.stringify(timeline);
      fs.writeFileSync(`${timeFolder}/timeline.json`, timeline);
    }
    res.status(204).send();
  });
};
