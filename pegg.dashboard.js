var client = new Keen({
  projectId: "55a49e79c1e0ab6df6508279",
  readKey: "a3e8a1c1aaf369027d32d5ef625dd2e88e7f7f93ce101489f509200e5bca098f2c50c5104f70c9835feee4b17d441bd6be8fb9ef2c4315bbaa7563a59bf994615e54765223e2f070421eb84a51ceb5a5e4662a625f5f18a919e2212712391b500ee0789fc8be176466ff0b45604b1a77"
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
  client.draw(averageLoadTime, document.getElementById("averageLoadTime"), {
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
  var weeklyActiveUsers = new Keen.Query("count_unique", {
    eventCollection: "userAction",
    targetProperty: "userId",
    filters: [{"operator":"exists","property_name":"userId","property_value":true}],
    timeframe: "this_7_days",
    timezone: "UTC"
  });
  client.draw(weeklyActiveUsers, document.getElementById("weeklyActiveUsers"), {
    title: "Weekly Active Users"
  });

  //// ----------------------------------------
  //// Section loads
  //// ----------------------------------------
  var query = new Keen.Query("count", {
    eventCollection: "userAction",
    filters: [{"operator":"exists","property_name":"page","property_value":true}],
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
    .el(document.getElementById("sessionLengthMetric"))
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
        .title("Average Session Length (mins)")
        .data({result: totalTime/sessionTimes.length / 60})
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
    .el(document.getElementById("gameTimeMetric"))
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
        .title("Average Game Time/Week (mins)")
        .data({result: totalTime/gameTimes.length / 60})
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
    .el(document.getElementById("cardsPerSessionMetric"))
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
