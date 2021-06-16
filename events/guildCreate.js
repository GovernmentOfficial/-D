const util = require('../json/util');
module.exports = {
    name: "guildCreate",
    execute(guild, client, db){
        db.get(util.guildDb(guild.id), (err, row) =>{
            if(err) return util.errorCon(`Something went wrong adding ${guild.name} to database.\n${err}`);
            if(!row) db.run(`INSERT INTO guildSmile VALUES (?, ?, ?, ?)`, [guild.id, 0, 0, 0]);
        })
    }
}