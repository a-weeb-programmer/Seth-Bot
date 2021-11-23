module.exports = {
    name: "help",
    execute: async(message, client, args) =>{
        message.author.send("**COMMANDS:** \n ;help \n ;warn <member> <reason> \n ;ban <member> <reason> \n ;kick <member> <reason> \n ;mute <member> <time> \n ;clear-warns <user> \n ;modlods <user> \n emergency-crash(for admins and managers only) \n ;unban <user id> \n \n **TIP:** IF YOU WANT ME TO HATE YOU, PING ME IN #bot-commands-and-spam UWU");
    }
}