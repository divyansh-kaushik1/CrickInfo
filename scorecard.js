// const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
// Venue date opponent result runs balls fours sixes sr
const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
// home page 
function processScorecard(url) {

    request(url, cb);
}

function cb(err, response, html) {
    if (err) {
        console.log(err);
    } else {
        // console.log(html);
        extractMatchDetails(html);
    }
}

function extractMatchDetails(html) {

    let $ = cheerio.load(html);
    let descElem = $(".ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid");
    let result = $(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title");

    let stringArr = descElem.text().split(",");
    let venue = stringArr[1].trim();
    let date = stringArr[2].trim();
    result = result.text();

    let innings = $(".ds-rounded-lg.ds-mt-2");
    let htmlString = "";
    for (let i = 0; i < innings.length; i++) {
        // htmlString = $(innings[i]).html();
        let teamName = $(innings[i]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize").text();
        teamName = teamName.trim();
        let opponentIndex = i == 0 ? 1 : 0;
        let opponentName = $(innings[opponentIndex]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize").text();
        opponentName = opponentName.trim();

        let cInning = $(innings[i]);
        console.log(`${venue}| ${date} | ${teamName}| ${opponentName} | ${result}`);

        let allRows = cInning.find(".ds-w-full.ds-table.ds-table-md.ds-table-auto.ci-scorecard-table tbody>tr ");
        for (let j = 0; j < allRows.length - 3; j++) {

            // console.log(allCols.text());
            //       Player  runs balls fours sixes sr 
            let isHidden = $(allRows[j]).hasClass("ds-hidden");
            let isExtra = $(allRows[j]).hasClass("ds-text-tight-s");
            let didBat = $(allRows[j]).hasClass("!ds-border-b-0");
            if (isHidden == false && isExtra == false && didBat == false) {
                let allCols = $(allRows[j]).find("td");
                let playerName = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let sr = $(allCols[7]).text().trim();

                console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
                processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, opponentName, venue, date, result);
            }
        }
    }
    console.log("`````````````````````````````````````````````````");
    // console.log(htmlString);
}

function processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, opponentName, venue, date, result) {
    let teamPath = path.join(__dirname, "ipl", teamName);
    dirCreater(teamPath);
    let filePath = path.join(teamPath, playerName + ".xlsx");
    let content = excelReader(filePath, playerName);
    let playerObj = {
        teamName,
        playerName,
        venue,
        date,
        opponentName,
        result,
        runs,
        balls,
        fours,
        sixes,
        sr
    }
    content.push(playerObj);
    excelWriter(filePath, content, playerName);
}

function dirCreater(filePath) {
    if (fs.existsSync(filePath) == false) {
        fs.mkdirSync(filePath);
    }

}
function excelWriter(filePath, json, sheetName) {
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}
// // json data -> excel format convert
// // -> newwb , ws , sheet name
// // filePath
// read 
//  workbook get
function excelReader(filePath, sheetName) {
    if (fs.existsSync(filePath) == false) {
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}

module.exports = {
    ps: processScorecard
}