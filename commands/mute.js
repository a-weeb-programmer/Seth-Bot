module.exports = {
    name: "mute",
    execute: async(message, client, args) =>{
        const user = getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
		if(!user) return message.channel.send(`USER NOT FOUND`)
		if(!message.member.permissions.has('MANAGE_MESSAGES')) return;
		const time = args[1]
		let real_time = 0
        if(time != null){
		    if(time.endsWith(`h`)){
			    real_time = ((1000 * 60) * 60) * (parseInt(time.substring(0, 1)))
		    } else if(time.endsWith('s')){
			    real_time = ((1000) * parseInt(time.substring(0, 1)))
		    }
        }
		try{
		user.roles.add(message.guild.roles.cache.get('819833953338130443'))
		message.channel.send(`MUTED ${user} SUCCESSFULLY`)
		setTimeout(()=> {
			user.roles.remove(message.guild.roles.cache.get('819833953338130443'))
			}, real_time)
		} catch(error){
			message.channel.send("ERROR: THERE WAS AN ERROR IN ATTEMPTING TO MUTE! TRY AGAIN, AND CONTACT KUUDERE IF IT STILL DOESN'T WORK")
		}
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