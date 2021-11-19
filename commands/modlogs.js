const db = require('quick.db');
const {MessageEmbed} = require('discord.js')

module.exports = {
    name: "modlogs",
    execute: async(message, client, args) =>{
        
		if(!message.member.permissions.has('MANAGE_MESSAGES')) return;
        if(args.length < 1) return message.channel.send("MENTION THE USER");
            const user = getUserFromMention(args[0], client) || message.guild.members.cache.get(args[0])
            if(!user) return message.channel.send(`COULDN'T FIND USER`)
            let kick_reason = db.get(`kick_reason_${message.guild.id}_${user.id}`)
            let ban_reason = db.get(`ban_reason_${message.guild.id}_${user.id}`)
            let warnings = db.get(`${message.guild.id}_${user.id}.warnings`)
            let kicks = db.get(`kick_${message.guild.id}_${user.id}`)
            let bans = db.get(`ban_${message.guild.id}_${user.id}`)
        let warn_num = db.get(`warn_num_${message.guild.id}_${user.id}`);
            if(warnings == null){
                warnings = "none"
          warn_num = "no"
            }
            if(kicks == null){
                kicks = 'no'
                kick_reason = 'none'
            }
            if(bans == null){
                bans = 'no'
                ban_reason = 'none'
            }
        let warning_string = JSON.stringify(warnings, null, '\n');
            const embed = new MessageEmbed().setTitle(`Modlogs for ${user}`)
            .setDescription(`User has ${warn_num} warnings, ${kicks} kicks, ${bans} bans`)
            .addField('warnings', warning_string)
            .addField('kick reasons', kick_reason)
            .addField('ban reasons', ban_reason)
            .setColor('#EB0DEB')
            .setFooter(`user id: ${user.id}`);
            message.channel.send({embeds: [embed]})
    }
}
function getUserFromMention(mention, client) {
    if(mention != null){
	const matches = mention.match(/^<@!?(\d+)>$/);
	if (!matches) return;
	const id = matches[1];
	return client.users.cache.get(id);
    }
    return;
}
