const app = require('http');
const fs = require('fs');
const port = 3000;

app.createServer((req, res) => {
  if(req.url === "/"){
  fs.readFile('seth.html', (err, data)=>{
    if(err){
      throw err;
    }
      res.write(data)
    })
  }
  if(req.url === "/seth.css"){
    
    fs.readFile('seth.css', (err, data)=>{
      if(err){
        throw err;
      }
      res.write(data);
         res.end();
    })
  }
}).listen('3000', () => console.log(`listening at http://localhost:${port}`));

//--------------------------------BOT CODE START------------------------------

//TODO: organize all of this shid
const {Client, Intents, Collection, Permissions, MessageEmbed, DMChannel} = require('discord.js')
const{prefix} = require('./config.json')
const db = require('quick.db')
let already_executing = false;


const client = new Client({intents:[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS]}) 
client.once('ready', ()=>{
	console.log("KUUDERE OS IS LOADING.......... INITIALIZING SETH BOT.. READY!!!!!1111!!!!!!!!!!!1")
});

function getUserFromMention(mention) {
	const matches = mention.match(/^<@!?(\d+)>$/);
	if (!matches) return;
	const id = matches[1];
	return client.users.cache.get(id);
}

function getMemberFromMention(message, mention){
	const matches = mention.match(/^<@!?(\d+)>$/);
	if (!matches) return;
	const id = matches[1];
	return message.guild.members.cache.get(id);
}
//message creation event
client.on('messageCreate', message =>{
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	if(!message.guild) return;
	if(message.author.bot)return;
	if(db.get(`message_num_${message.guild.id}`) == null){
	db.set(`message_num_${message.guild.id}`, 0)
	}
	if(message.channel === message.guild.channels.cache.get('772129160411217940')){
	db.add(`message_num_${message.guild.id}`, 1)
	}
	if(!message.content.startsWith(prefix)) return;
	if(command === 'help'){
		message.author.send("WITH WHAT")
	}else if (command === 'ban') {
		if(!message.member.permissions.has("BAN_MEMBERS")) return;
		if(args.length < 1){
			return message.channel.send({content: "MENTION THE USER THAT IS TO BE BANNED"})
		}
		const user = getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
		if(!user){
			return message.channel.send({content: "COULDN'T FIND USER"})
		}
    if(user == client.user) return message.channel.send('IF YOU BAN ME, I SHALL NOT BE BANNED YOU STINKY HEAD');
    if(!user.bannable) return message.channel.send('DON\'T BAN FELLOW MODS OR ADMINS B-BAKA');
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
			return message.channel({content: 'ERROR: UNEXPECTED ERROR WHILE TRYING TO BAN! PLEASE TRY AGAIN AND CONTACT KUUDERE IF IT STILL DOESN\'T WORK'})
		}
		return message.channel.send({content:`${user} HAS BEEN SENT TO THE SHADOW REALM`})
	} else if(command === 'unban'){
    if(!message.member.permissions.has('BAN_MEMBERS')) return;
		if(args.length < 1)
		  return message.channel.send('PUT IN A USER ID TO UNBAN');
	  let user = message.guild.members.resolveId(args[0])
    message.guild.bans.fetch().then(bans =>{
      if(bans.size == 0) return message.channel.send('THERE IS NO ONE TO UNBAN')
      let bUser = bans.find(b => b.user.id == user)
      if(!bUser) return message.channel.send('CANNOT FIND BANNED USER');
        message.guild.members.unban(bUser.user)
      return message.channel.send(`${user} HAS BEEN BROUGHT BACK FROM THE SHADOW REALM`)
    })
	} else if(command == "kick"){
    if(!message.member.permissions.has("KICK_MEMBERS")) return;
		if(args.length < 1){
			return message.channel.send('MENTION THE USER THAT IS TO BE KICKED')
		}
    const user = getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
		if(!user){
			message.channel.send("COULD NOT FIND USER")
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
	} else if(command == "warn"){
		if(args.length < 1) return message.channel.send("MENTION THE USER THAT IS TO BE WARNED")
		if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) return;
		const user = getUserFromMention(args[0]) || message.guild.members.cache.get(args[0])
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
	} else if(command === "modlogs"){
		if(!message.member.permissions.has('MANAGE_MESSAGES')) return;
    if(args.length < 1) return message.channel.send("MENTION THE USER");
		const user = getUserFromMention(args[0]) || message.guild.members.cache.get(args[0])
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
	} else if(command == 'message_numbers'){
		message_num = db.get(`message_num_${message.guild.id}`)
		message.channel.send(`this server has had ${message_num} messages since this bot was turned on`)
	}
	else if(command == 'mute'){
		const user = message.guild.members.cache.get(args[0]);
		if(!user) return message.channel.send(`USER NOT FOUND`)
		if(!message.member.permissions.has('MANAGE_MESSAGES')) return;
		const time = args[1]
		let real_time = 0
		if(time.endsWith(`h`)){
			real_time = ((1000 * 60) * 60) * (parseInt(time.substring(0, 1)))
		} else if(time.endsWith('s')){
			real_time = ((1000) * parseInt(time.substring(0, 1)))
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
	} else if(command === 'emergency-crash'){
    if(!message.member.permissions.has('ADMINISTRATOR')) return;
    const yes = 'uw694irjfjjtdj'
    message.channel.send("turning off the bot now")
    message.guild.unban(yes)
  } else if(command == 'clearwarns'){
    if(!message.member.permissions.has('MANAGE_NICKNAMES')) return;
    if(args.length < 1){
      message.channel.send('MENTION THE USER WHO\'S WARNS YOU ARE CLEARING')
    }
    const user = getUserFromMention(args[0]) || message.guild.members.cache.get(args[0]);
    db.set(`${message.guild.id}_${user.id}.warnings`, null)
    db.set(`warn_num_${message.guild.id}_${user.id}`, null);
    return message.channel.send("WARNINGS FOR USER HAVE BEEN CLEARED")
  }
});
//ded chat timer
setInterval(() =>{
	if(db.get(`message_num_${client.guilds.cache.get('604171739894775809').id}`) < 15){
		const chat_revive_role = client.guilds.cache.get('604171739894775809').roles.cache.get('907031895102087179')
		const channel = client.guilds.cache.get('604171739894775809').channels.cache.get('772129160411217940')
		channel.send(`${chat_revive_role} THE CHAT IS DED`)
		already_executing = false
		return db.subtract(`message_num_${client.guilds.cache.get('604171739894775809').id}`, db.get(`message_num_${client.guilds.cache.get('604171739894775809').id}`));
	} else if(db.get(`message_num_${client.guilds.cache.get('604171739894775809').id}`) > 15){
		already_executing = false
		return db.subtract(`message_num_${client.guilds.cache.get('604171739894775809').id}`, db.get(`message_num_${client.guilds.cache.get('604171739894775809').id}`));
	}
}, (1000 * 60) * 3);
//welcoming system
client.on('guildMemberUpdate', (oldMember, newMember)=>{
	if(!oldMember.roles.cache.get('772129150114201620') && newMember.roles.cache.get('772129150114201620')){
		let channel = newMember.guild.channels.cache.get('667857844237893703')
    const rules = newMember.guild.channels.cache.get(606019936397295628);
		channel.send(`Welcome to the MVPerry Discord Server, ${newMember.user}, Please read the rules if you haven't done already! I hope you enjoy you experience in this server!!`)
	}
});

client.login(process.env.TOKEN)