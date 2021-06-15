const HESS = require('../json/HESS');
const util = require('../json/util');
const moment = require('moment');
const smileyQuotes = require('../json/quotes.json');

var seconds = 0;
var minutes = 0;
var hours = 0;
var days = 0;
var weeks = 0;
var months = 0;

function SmileUpdate(){
    const data = [];

    if(months > 0){
        data.push(` ${months} Months`);
    }
    if(weeks > 0){
        data.push(` ${weeks} Weeks`);
    }
    if(days > 0){
        data.push(` ${days} Days`);
    }
    if(hours > 0){
        data.push(` ${hours} Hours`);
    }
    if(minutes > 0){
        data.push(` ${minutes} Minutes`);
    }
    return `${data.join()} ${seconds} Seconds`;
}


module.exports = {
    name: 'ready',
    once: true,
    async execute(client, db){
        //Init Log
        util.infoCon(`${client.user.tag} is logged in! :D`);
        util.infoCon(`Stopwatch starts at ${moment().format('LTS')}`);

        //Stopwatch
        setInterval(() => {
        
            if(seconds >= 60){
                minutes++;
                seconds = 0;
            }
            if(minutes >= 60){
                hours++;
                minutes = 0;
                
            }
            if(hours >= 24){
                days++;
                hours = 0;
            }
            if(days >= 7){
                weeks++;
                days = 0;
            }
            if(weeks >= 4){
                months++;
                weeks = 0;
            }
            seconds++;
        }, 1000)
        setInterval(() => {
            HESS._uptime(client).send(SmileUpdate());
        }, 60000*60)

        //Second Check
        setInterval(async () =>{

            //Activity Check
            if(client.activeSmilers >= 5){
                var randomPingTimer = (60000 * 75) * Math.random();

                setTimeout(async () =>{
                    db.get(util.guildDb(HESS.guildId), (err, row) =>{
                        HESS._general(client).send(`A non-smiler appears!!! 🚶‍♂️`);
                        const filter = m => m.content.includes(":D");
                        HESS._general(client).awaitMessages(filter, { max: 1, time: (60000 * 5), errors: ["time"] })
                        .then(c => {
                            var winner = c.first().author;
                            db.get(util.userDb(winner.id), (errr, roww) =>{
                                db.run(`UPDATE smiles SET specials = ${roww.specials + 1} WHERE userId = ${winner.id}`);
                            });
                            HESS._general(client).send(`${winner} is an outstanding smiler! :D`);

                            if(row.quota > 0){
                                db.run(`UPDATE guildSmile SET quota = ${row.quota - 1} WHERE guildId = ${HESS.guildId}`);
                            }
                        })
                        .catch(() =>{
                            HESS._general(client).send(`<:D_mmmwoke:779119205361778738> They got away...`);
                            db.run(`UPDATE guildSmile SET quota = ${row.quota + 1} WHERE guildId = ${HESS.guildId}`)
                        })
                    })
                }, randomPingTimer)

                client.activeSmilers = 0;
            }

            

        }, 1000)



        //Presence
        client.user.setPresence( {activity: {name: "with Smilers! :D"} } );

        //Initial Emote Cache
        setTimeout(() =>{
            HESS._guild(client).emojis.cache.map(e => client._demotesReact.push(`${e.id}`));
            HESS._guild(client).emojis.cache.filter(a => a.identifier.toLowerCase().includes('d:')).map(e => client._demotesFilter.push('<:' + e.identifer + '>'));
            util.infoCon(`${client._demotesReact.length} Smiley Emojis have been cached :D \nThere are ${smileyQuotes.length} Smiley Quotes!`);
        }, 2000)

        //Array Update
        setInterval(() =>{
            client._demotesFilter = [];
            HESS._guild(client).emojis.cache.filter(a => a.identifier.toLowerCase().includes("d:")).map(e => client._demotesFilter.push('<:' + e.identifier + '>'));
        }, 10000)
    }
}