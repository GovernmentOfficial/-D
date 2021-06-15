const moment = require('moment');
module.exports = {
    errorCon(txt){
        return console.log(`[ERROR] (${moment().format('LTS')}) ${txt}`);
    },
    logCon(txt){
        return console.log(`[LOG] (${moment().format('LTS')}) ${txt}`);
    },
    infoCon(txt){
        return console.log(`[INFO] (${moment().format('LTS')}) ${txt}`);
    },
    clean(text){
        if(typeof(text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    },
    userDb(id){
        return `SELECT * FROM smiles WHERE userId = ${id}`;
    },
    guildDb(id){
        return `SELECT * FROM guildSmile WHERE guildId = ${id}`;
    }

}