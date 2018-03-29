const https = require("https");
const url =
  "http://localhost:5000/api/population";
https.get(url, res => {
  res.setEncoding("utf8");
  let body = "";
  res.on("data", data => {
    body += data;
  });
  res.on("end", () => {
    body = JSON.parse(body);
    console.log(
      `ID: ${body.results[0].id} -`,
      `Census Tract: ${body.results[0].census_tract} -`,
      `Population: ${body.results[0].pop_100}`
    );
  });
});
