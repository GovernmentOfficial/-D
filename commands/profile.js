const util = require('../json/util');

module.exports = {
    name: "profile",
    execute(message, args, client, db){
        //Message Layout
        var data = [];
        data.push("```diff");
        data.push("This message shows the positivity of the server! :D\n");
        //User Data
        db.get(util.userDb(message.author.id), (err, row) =>{
            if(err) console.error(err);
            data.push(`-- Stats of ${message.author.username} The ${row.title} --`); //Beginning of User Stats
            data.push(`+ Current Smiles: ${row.smiles}\n+ SPECIAL SMILES: ${row.specials}\n+ Smiles from last check: ${row.lastCheck}\n+ Change since last check: +${row.smiles - row.lastCheck}\n`);                
        
            //Last User Check
            db.run(`UPDATE smiles SET lastCheck = ${row.smiles} WHERE userId = ${message.author.id}`);
        })
        //Guild Data
        db.get(util.guildDb(message.guild.id), (err, row) => {
            data.push(`-- ${message.guild.name}'s Smile Stats --`); //Beginning of Guild Stats
            data.push(`+ Current Smiles: ${row.smiles}\n+ Smiles from last check: ${row.lastCheck}\n+ Change since last check: +${row.smiles - row.lastCheck}\n`);
        
            //Last Guild Check
            db.run(`UPDATE guildSmile SET lastCheck = ${row.smiles} WHERE guildId = ${message.author.id}`);
            data.push("```"); // Ending
        })

        message.channel.send(`Fetching your positivity record...`).then(m =>{
            setTimeout(() => { m.edit(data.join('\n')) }, 1000);
        })
    }
}