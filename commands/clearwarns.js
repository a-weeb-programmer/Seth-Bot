const db = require('quick.db');

module.exports = {
    name: "clearwarns",
    execute: async(message, client, args) =>{
        if(!message.member.permissions.has('MANAGE_NICKNAMES')) return;
        if(args.length < 1){
            message.channel.send('MENTION THE USER WHO\'S WARNS YOU ARE CLEARING')
        }
        const user = getUserFromMention(args[0], client) || message.guild.members.cache.get(args[0]);
        db.set(`${message.guild.id}_${user.id}.warnings`, null)
        db.set(`warn_num_${message.guild.id}_${user.id}`, null);
        return message.channel.send("WARNINGS FOR USER HAVE BEEN CLEARED")
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
