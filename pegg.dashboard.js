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
    timeframe: "this_14_days",
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
  // Impressions timeline
  // ----------------------------------------
  //var impressions_timeline = new Keen.Query("count", {
  //  eventCollection: "impressions",
  //  groupBy: "ad.advertiser",
  //  interval: "hourly",
  //  timeframe: {
  //    start: "2014-05-04T00:00:00.000Z",
  //    end: "2014-05-05T00:00:00.000Z"
  //  }
  //});
  //client.draw(impressions_timeline, document.getElementById("chart-03"), {
  //  chartType: "columnchart",
  //  title: false,
  //  height: 250,
  //  width: "auto",
  //  chartOptions: {
  //    chartArea: {
  //      height: "75%",
  //      left: "10%",
  //      top: "5%",
  //      width: "60%"
  //    },
  //    bar: {
  //      groupWidth: "85%"
  //    },
  //    isStacked: true
  //  }
  //});
  //
  //
  //// ----------------------------------------
  //// Impressions timeline (device)
  //// ----------------------------------------
  //var impressions_timeline_by_device = new Keen.Query("count", {
  //  eventCollection: "impressions",
  //  groupBy: "user.device_info.device.family",
  //  interval: "hourly",
  //  timeframe: {
  //    start: "2014-05-04T00:00:00.000Z",
  //    end: "2014-05-05T00:00:00.000Z"
  //  }
  //});
  //client.draw(impressions_timeline_by_device, document.getElementById("chart-04"), {
  //  chartType: "columnchart",
  //  title: false,
  //  height: 250,
  //  width: "auto",
  //  chartOptions: {
  //    chartArea: {
  //      height: "75%",
  //      left: "10%",
  //      top: "5%",
  //      width: "60%"
  //    },
  //    bar: {
  //      groupWidth: "85%"
  //    },
  //    isStacked: true
  //  }
  //});
  //
  //
  //// ----------------------------------------
  //// Impressions timeline (country)
  //// ----------------------------------------
  //var impressions_timeline_by_country = new Keen.Query("count", {
  //  eventCollection: "impressions",
  //  groupBy: "user.geo_info.country",
  //  interval: "hourly",
  //  timeframe: {
  //    start: "2014-05-04T00:00:00.000Z",
  //    end: "2014-05-05T00:00:00.000Z"
  //  }
  //});
  //client.draw(impressions_timeline_by_country, document.getElementById("chart-05"), {
  //  chartType: "columnchart",
  //  title: false,
  //  height: 250,
  //  width: "auto",
  //  chartOptions: {
  //    chartArea: {
  //      height: "75%",
  //      left: "10%",
  //      top: "5%",
  //      width: "60%"
  //    },
  //    bar: {
  //      groupWidth: "85%"
  //    },
  //    isStacked: true
  //  }
  //});


});
