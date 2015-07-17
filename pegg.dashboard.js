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
    // Custom configuration here
  });


  // ----------------------------------------
  // Page Popularity Pie Chart
  // ----------------------------------------
  var pagePoplarity = new Keen.Query("count", {
    eventCollection: "showPage",
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
    title: false
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
    title: false
  });


  //// ----------------------------------------
  //// Daily Active Users
  //// ----------------------------------------
  var query = new Keen.Query("count_unique", {
    eventCollection: "showPage",
    interval: "daily",
    targetProperty: "userId",
    timeframe: "this_7_days",
    timezone: "UTC"
  });
  client.draw(query, document.getElementById("chart-05"), {
    title: false
  });

  //// ----------------------------------------
  //// Weekly Active Users
  //// ----------------------------------------
  var query = new Keen.Query("count_unique", {
    eventCollection: "showPage",
    targetProperty: "userId",
    timeframe: "this_7_days",
    timezone: "UTC"
  });
  client.draw(query, document.getElementById("chart-07"), {
    label: "some thing"
  });


});
