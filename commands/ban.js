const Discord = require('discord.js')
const db = require('quick.db')
module.exports = {
    name: "ban",
    execute: async(message, client, args)=>{
        if(!message.member.permissions.has("BAN_MEMBERS")) return;
		if(args.length < 1){
			return message.channel.send({content: "MENTION THE USER THAT IS TO BE BANNED"})
		}
		const user = getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
		if(!user){
			return message.channel.send({content: "COULDN'T FIND USER"})
		}
    if(user == message.member) return message.channel.send('IF YOU BAN ME, I SHALL NOT BE BANNED YOU STINKY HEAD');
    if(user != null){
    if(!user.bannable) return message.channel.send('DON\'T BAN FELLOW MODS OR ADMINS B-BAKA');
    }
		if(user == message.author) return message.channel.send("YOU CANNOT BAN YOURSELF B-BAKA");
		const reason = args.slice(1).join(' ')
		try{
			if(db.get(`ban_${message.guild.id}_${user.id}`) == null){
				db.set(`ban_${message.guild.id}_${user.id}`, 1)
				db.set(`ban_reason_${message.guild.id}_${user.id}`, reason)
			} else if(db.get(`ban_${message.guild.id}_${user.id}`) != null){
				db.add(`ban_${message.guild.id}_${user.id}`, 1)
				db.set(`ban_reason_${message.guild.id}_${user.id}`, db.get(`ban_reason_${message.guild.id}_${user.id}`) + ` | ` + `${reason}`)
			}
			message.guild.members.ban(user, {reason: reason})
		} catch(error){
			return message.channel.send({content: 'ERROR: UNEXPECTED ERROR WHILE TRYING TO BAN! PLEASE TRY AGAIN AND CONTACT KUUDERE IF IT STILL DOESN\'T WORK'})
		}
		await message.channel.send({content:`${user} HAS BEEN SENT TO THE SHADOW REALM`})
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