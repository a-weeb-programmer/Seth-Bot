const Discord = require('discord.js');
const db = require("quick.db");

module.exports = {
    name: "kick",
    execute: async(message, client, args) =>{
if(!message.member.permissions.has("KICK_MEMBERS")) return;
    if(args.length < 1){
        return message.channel.send('MENTION THE USER THAT IS TO BE KICKED')
    }
const user = getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if(!user){
        return message.channel.send("COULD NOT FIND USER");
    }
    if(!user.kickable) return message.channel.send('DON\'T KICK A FELLOW MOD B-BAKA');
        const reason = args.slice(1).join(' ')
        if(!reason) return message.channel.send('SPECIFY THE REASON');
            try{
                if(db.get(`kick_${message.guild.id}_${user.id}`) == null){
                     db.set(`kick_${message.guild.id}_${user.id}`, 1)
                    db.set(`kick_reason_${message.guild.id}_${user.id}`, reason)
        } else if(db.get(`kick_${message.guild.id}_${user.id}`) != null){
            db.add(`kick_${message.guild.id}_${user.id}`, 1)
            db.set(`kick_reason_${message.guild.id}_${user.id}`, db.get(`kick_reason_${message.guild.id}_${user.id}`) + ` | ` + `${reason}`)
        }
        message.guild.members.kick(user, reason)
    } catch(error){
        return message.channel.send("ERROR: ENEXPECTED ERROR WHILE TRYING TO KICK, PLS TRY AGAIN AND CONTACT KUUDERE IF IT DOESN'T WORK")
    }
    return message.channel.send(`${user} HAS BEEN KICKED OUT OF THE MAID CAFE`)
    }
}
function getMemberFromMention(message, mention){
	if(mention != null){
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return;
    const id = matches[1];
    return message.guild.members.cache.get(id);
	}
	return;
}