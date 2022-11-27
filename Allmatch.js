const request = require("request");
const cheerio = require("cheerio");
const scoreCardObj = require("./scorecard");
function getAllMatchesLink(url) {
    request(url, function (err, response, html) {
        if (err) {
            console.log(err);
        }
        else {
            extractAllLinks(html);
        }
    })
}
function extractAllLinks(html) {
    let $ = cheerio.load(html);
    let scorecardElems = $(".ds-mb-4 .ds-p-0 .ds-flex .ds-no-tap-higlight");

    for (let i = 0; i < scorecardElems.length; i+=6) {
        let link = $(scorecardElems[i]).attr("href");
        let fullLink = "https://www.espncricinfo.com" + link;
        console.log(fullLink);     
        scoreCardObj.ps(fullLink); 
    }
}
module.exports = {
    gAlmatches: getAllMatchesLink
}