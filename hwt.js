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
    let $ = cheerio.load(html);
    // full page search
    let teamsArr = $("div.ci-team-score.ds-flex.ds-justify-between.ds-items-center.ds-text-typo-title.ds-mb-2");
    let wTeamName;
    let index = 0
    for (let i = 0; i < teamsArr.length; i++) {
        let hasclass = $(teamsArr[i]).hasClass("ds-opacity-50");
        if (hasclass == false) {
            // find 
            let teamNameElem = $(teamsArr[i]).find("a");
            wTeamName = teamNameElem.text().trim();
            index = i;
        }
    }

    console.log("WINNING TEAM", wTeamName, " index is ", index);
    // segregate 
    // shorter form html
    let innigsArr = $("table.ds-w-full.ds-table.ds-table-md.ds-table-auto");
    //usinf windex to seggregate bowling of winning team
    windex = index * 2 + 1;
    let allBowlers = $(innigsArr[windex]).find("a");
    //might contain other strong elements
    let allWickets = $(innigsArr[windex]).find("strong");
    let hwtName = "";
    let hwt = 0;

    let map = {};
    console.log("Players");
    let j = 0;
    for (let i = 0; i < allWickets.length; i++) {
        let wickets = $(allWickets[i]).text();
        let playerName;
        if (j < allBowlers.length && wickets.length == 1) {
            playerName = $(allBowlers[j]).text();
            map[playerName] = wickets;
            j++;

            if (wickets >= hwt) {
                hwt = wickets;
                hwtName = playerName;
            }
        }
    }

    console.log(`Winning Team ${wTeamName} highest wicket Taker playerName: ${hwtName} wickets: ${hwt}`);
}