const HESS = require('../json/HESS');
const util = require('../json/util');
module.exports = {
    name: "guildMemberAdd",
    execute(member, client, db){
        member.edit({nick: ":D"}).catch(err => util.errorCon(`${member.guild.id} does not permit Nickname Perms.`));
        db.get(util.userDb(member.id), (err, row) =>{
            if(!row){
                db.run(`INSERT INTO smiles VALUES (?, ?, ?, ?, ?)`, [member.id, 0, "newbieSmiler", 0, 0])
            }
        })

        //Smile Server Specific
        var smileRole = "740816514030108755";
        if(member.guild.id === HESS.guildId){
            member.edit({roles: [smileRole]});
        }
    }
}