const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/chennai-super-kings-vs-kings-xi-punjab-53rd-match-1216506/full-scorecard";
const request = require("request");
const cheerio = require("cheerio");
console.log("Before");
request(url, cb);

function cb(err, response, html) {
    if (err) {
        console.log(err);
    } else {
        extractHTML(html);
    }
}

function extractHTML(html) {
    $ = cheerio.load(html);

    let teamsArr = $("div.ci-team-score.ds-flex.ds-justify-between.ds-items-center.ds-text-typo-title.ds-mb-2");
    let teamName = [];
    for (let i = 0; i < teamsArr.length; i++) {
        let teamNameElem = $(teamsArr[i]).find("a");
        teamName.push(teamNameElem.text().trim());
    }


    let batsmenInfo = $(".ds-w-full.ds-table.ds-table-md.ds-table-auto.ci-scorecard-table");
    let vhtml = "";
    for (let i = 0; i < batsmenInfo.length; i++) {
        let atag = $(batsmenInfo[i]).find("a");
        for (let j = 0; j < atag.length; j++) {
            let href = $(atag[j]).attr("href");
            let name = $(atag[j]).text();
            let fullLink = "https://www.espncricinfo.com" + href;
            // console.log(fullLink);
            getBirthdaypage(fullLink, name, teamName[i]);
        }
    }
}

function getBirthdaypage(url, name, teamName) {
    request(url, cb);
    function cb(err, response, html) {
        if (err) {

        } else {
            extractBirthDay(html, name, teamName);
        }
    }
}

function extractBirthDay(html, name, teamName) {
    let $ = cheerio.load(html);
    let detailsArr = $(".ds-text-title-s.ds-font-bold.ds-text-ui-typo");
    let birthDay = $(detailsArr[1]).text();
    console.log(`${name} plays for ${teamName} was born on ${birthDay}`);
}