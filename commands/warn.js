const {Permissions} = require('discord.js');
const db = require('quick.db')

module.exports = {
    name: "warn",
    execute: async(message, client, args)=>{
        if(args.length < 1) return message.channel.send("MENTION THE USER THAT IS TO BE WARNED")
		if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) return;
		const user = getUserFromMention(args[0], client) || message.guild.members.cache.get(args[0])
		const reason = args.slice(1).join(' ')
		if(!user) return message.channel.send('USER NOT FOUND');
		const warnings = db.get(`${message.guild.id}_${user.id}.warnings`)
		if(warnings == null){
			user.send(`YOU HAVE BEEN WARNED IN THE MVPERRY SERVER FOR: ${reason}!`).catch(error =>{
        message.channel.send("WARNING LOGGED, COULDN'T DM USER")
      });	
	  	db.set(`warn_num_${message.guild.id}_${user.id}`, 1)
			db.set(`${message.guild.id}_${user.id}`, {
				warnings: [{warn_num: db.get(`warn_num_${message.guild.id}_${user.id}`), reason: reason, moderator: `${message.member}`}]});
			return message.channel.send(`WARNED ${user} SUCCESSFULLY`)
		}else if(warnings != null){
			user.send(`YOU HAVE BEEN WARNED IN THE MVPERRY SERVER FOR: ${reason}`).catch(error =>{
        message.channel.send("WARNING LOGGED, COULDN'T DM USER")
      });
      	db.add(`warn_num_${message.guild.id}_${user.id}`, 1);
	  		db.push(`${message.guild.id}_${user.id}.warnings`, {warn_num: db.get(`warn_num_${message.guild.id}_${user.id}`), reason: reason, moderator: `${message.member}`})
			return message.channel.send(`WARNED ${user} SUCCESSFULLY`)
		}
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
