var client = new Keen({
  projectId: "55a6deb6c1e0ab70d10d1a39",
  readKey: "6b629b2a281928af8564f6fe0ef8167129b823a5c244b4dbd692b614583ca0ed03173d6f534fbb888295d43554e075820f1714916846d38da9a2433685b644b6b0067eb7892ae3d0500cdd5c9304fb57ccf39825077832043e9a353e6e4c29fcd2f8170e3f9e2db4c38c4fd89e9aa61b"
});

Keen.ready(function(){


  // ----------------------------------------
  // Load Time Area Chart
  // ----------------------------------------
  var pageviews_timeline = new Keen.Query("average", {
    eventCollection: "loadTime",
    groupBy: "keen.timestamp",
    interval: "daily",
    targetProperty: "milliseconds",
    timeframe: "this_7_days",
    timezone: "UTC"
  });
  client.draw(pageviews_timeline, document.getElementById("chart-01"), {
    chartType: "columnchart",
    title: false,
    height: 250,
    width: "auto",
    chartOptions: {
      legend: { position: "none" },
      chartArea: {
        height: "85%",
        left: "5%",
        top: "5%",
        width: "100%"
      },
    isStacked: false
    }
  });

  // ----------------------------------------
  // Load Time Metric
  // ----------------------------------------
  var averageLoadTime = new Keen.Query("average", {
    eventCollection: "loadTime",
    targetProperty: "milliseconds",
    timezone: "UTC"
  });
  client.draw(averageLoadTime, document.getElementById("chart-06"), {
    title: "Average Load Time (ms)"
  });


  // ----------------------------------------
  // Mood Popularity Pie Chart
  // ----------------------------------------
  var pagePoplarity = new Keen.Query("count", {
    eventCollection: "userAction",
    filters: [{"operator":"contains","property_name":"route","property_value":"/mood/"}],
    groupBy: "route",
    timezone: "UTC"
  });
  client.draw(pagePoplarity, document.getElementById("chart-02"), {
    chartType: "piechart",
    title: false,
    height: 250,
    width: "auto",
    chartOptions: {
      chartArea: {
        height: "85%",
        left: "5%",
        top: "5%",
        width: "100%"
      },
      pieHole: .4
    }
  });


  // ----------------------------------------
  // Gender
  // ----------------------------------------
  var gender = new Keen.Query("count_unique", {
    eventCollection: "demographics",
    groupBy: "gender",
    targetProperty: "userId",
    timezone: "UTC"
  });
  client.draw(gender, document.getElementById("chart-03"), {
    chartType: "piechart",
    chartOptions: {
      chartArea: {
        height: "85%",
        left: "5%",
        top: "5%",
        width: "100%"
      }
    }
  });


  // ----------------------------------------
  // Age
  // ----------------------------------------
  var age = new Keen.Query("count_unique", {
    eventCollection: "demographics",
    groupBy: "age_range",
    targetProperty: "userId",
    timezone: "UTC"
  });
  client.draw(age, document.getElementById("chart-04"), {
    chartType: "piechart",
    chartOptions: {
      chartArea: {
        height: "85%",
        left: "5%",
        top: "5%",
        width: "100%"
      }
    }
  });


  //// ----------------------------------------
  //// Daily Active Users
  //// ----------------------------------------
  var query = new Keen.Query("count_unique", {
    eventCollection: "userAction",
    filters: [{"operator":"exists","property_name":"userId","property_value":true}],
    interval: "daily",
    targetProperty: "userId",
    timeframe: "this_7_days",
    timezone: "UTC"
  });
  client.draw(query, document.getElementById("chart-05"), {
    height: 250,
    width: "auto",
    chartOptions: {
      chartArea: {
        height: "85%",
        left: "5%",
        top: "5%",
        width: "100%"
      }
    }
  });

  //// ----------------------------------------
  //// Weekly Active Users
  //// ----------------------------------------
  var query = new Keen.Query("count_unique", {
    eventCollection: "userAction",
    targetProperty: "userId",
    filters: [{"operator":"exists","property_name":"userId","property_value":true}],
    timeframe: "this_7_days",
    timezone: "UTC"
  });
  client.draw(query, document.getElementById("chart-07"), {
    title: "Weekly Active Users"
  });

  //// ----------------------------------------
  //// Section loads
  //// ----------------------------------------
  var query = new Keen.Query("count", {
    eventCollection: "userAction",
    groupBy: "page",
    timezone: "UTC"
  });
  client.draw(query, document.getElementById("chart-08"), {
    chartType: "piechart",
    title: false,
    height: 250,
    width: "auto",
    chartOptions: {
      chartArea: {
        height: "85%",
        left: "5%",
        top: "5%",
        width: "100%"
      },
      pieHole: .2
    }
  });



  //// ----------------------------------------
  //// Session lengths
  //// ----------------------------------------
  var sessionLength = new Keen.Query("maximum", {
    eventCollection: "userAction",
    groupBy: "sessionId",
    targetProperty: "sessionLength",
    timeframe: "this_7_days",
    timezone: "UTC"
  });
  client.draw(sessionLength, document.getElementById("chart-09"), {
    chartType: "columnchart",
    title: false,
    height: 250,
    width: "auto",
    chartOptions: {
      legend: {position: "none"},
      chartArea: {
        height: "85%",
        left: "5%",
        top: "5%",
        width: "100%"
      },
      isStacked: false
    }
  });

  //// ----------------------------------------
  //// Average Session length
  //// ----------------------------------------
  var sessionMetric = new Keen.Dataviz()
    .el(document.getElementById("chart-11"))
    .chartType("metric")
    .prepare(); // start spinner

  var req = client.run(sessionLength, function(err, res){
    if (err) {
      // Display the API error
      sessionMetric.error(err.message);
    }
    else {
      var sessionTimes = res.result;
      var totalTime = 0
      // Handle the response
      for(var i=0; i<sessionTimes.length; i++){
        totalTime += sessionTimes[i].result
      }

      sessionMetric
        //.parseRequest(this)
        .title("Average Session Length (s)")
        .data({result: totalTime/sessionTimes.length})
        .render();
    }
  });


  //// ----------------------------------------
  //// Time spent in each section
  //// ----------------------------------------
  var query = new Keen.Query("sum", {
    eventCollection: "userAction",
    filters: [{"operator":"exists","property_name":"lastEvent.page","property_value":true}],
    groupBy: "lastEvent.page",
    targetProperty: "lastEvent.eventLength",
    timezone: "UTC"
  });
  client.draw(query, document.getElementById("chart-10"), {
    chartType: "piechart",
    title: false,
    height: 250,
    width: "auto",
    chartOptions: {
      chartArea: {
        height: "85%",
        left: "5%",
        top: "5%",
        width: "100%"
      },
      pieHole: .2
    }
  });


  //// ----------------------------------------
  //// Weekly GameTime by User this week
  //// ----------------------------------------
  var weeklyGameTime = new Keen.Query("sum", {
    eventCollection: "userAction",
    filters: [{"operator":"exists","property_name":"userId","property_value":true}],
    groupBy: "userId",
    targetProperty: "lastEvent.eventLength",
    timeframe: "this_7_days",
    timezone: "UTC"
  });
  client.draw(weeklyGameTime, document.getElementById("chart-12"), {
    chartType: "columnchart",
    title: false,
    height: 250,
    width: "auto",
    chartOptions: {
      legend: {position: "none"},
      chartArea: {
        height: "85%",
        left: "5%",
        top: "5%",
        width: "100%"
      },
      isStacked: false
    }
  });


  //// ----------------------------------------
  //// Average GameTime this week
  //// ----------------------------------------
  var gameTimeMetric = new Keen.Dataviz()
    .el(document.getElementById("chart-13"))
    .chartType("metric")
    .prepare(); // start spinner

  var req = client.run(weeklyGameTime, function(err, res){
    if (err) {
      // Display the API error
      gameTimeMetric.error(err.message);
    }
    else {
      var gameTimes = res.result;
      var totalTime = 0
      // Handle the response
      for(var i=0; i<gameTimes.length; i++){
        totalTime += gameTimes[i].result
      }

      gameTimeMetric
        //.parseRequest(this)
        .title("Average Game Time (s)")
        .data({result: totalTime/gameTimes.length})
        .render();
    }
  });

  //// ----------------------------------------
  //// Average CardsPlayed per session this week
  //// ----------------------------------------
  var cardsPerSession = new Keen.Query("count", {
    eventCollection: "userAction",
    filters: [{"operator":"eq","property_name":"type","property_value":"cardPlay"}],
      //,{"operator":"exists","property_name":"peggeeId","property_value":true}],
    groupBy: "sessionId",
    timezone: "UTC",
    timeframe: "this_7_days"
  });

  var cardsPerSessionMetric = new Keen.Dataviz()
    .el(document.getElementById("chart-14"))
    .chartType("metric")
    .prepare(); // start spinner

  var req = client.run(cardsPerSession, function(err, res){
    if (err) {
      // Display the API error
      cardsPerSessionMetric.error(err.message);
    }
    else {
      var cardsPlayed = res.result;
      var totalCards = 0
      // Handle the response
      for(var i=0; i<cardsPlayed.length; i++){
        totalCards += cardsPlayed[i].result
      }

      cardsPerSessionMetric
        //.parseRequest(this)
        .title("Average Cards/Session")
        .data({result: totalCards/cardsPlayed.length})
        .render();
    }
  });

});
