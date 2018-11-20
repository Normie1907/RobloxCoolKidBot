const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs")
const moment = require("moment")
let userData = JSON.parse(fs.readFileSync('userData.json', 'utf8'))
let serverData = JSON.parse(fs.readFileSync('serverData.json', 'utf8'))
const prefix = ">"//sets the prefix
var helpCommand = {
    trigger:prefix+"help",
    description:"Activates the help command"
}
var pruneCommand = {
    trigger:prefix+"prune",
    description:"Do "+prefix+"prune (number 1-100)"
}
var kickCommand = {
    trigger:prefix+"kick",
    description:"Do "+prefix+"kick @user | reason"
}
var banCommand = {
    trigger:prefix+"ban",
    description:"Do "+prefix+"ban @user | reason"
}
var commands = [helpCommand]//list of commands
var staffCommands = [pruneCommand,kickCommand,banCommand]//list of staff only commands
var teeth = [1,"e"]
client.on('ready', () => {//activates when "node ." is typed into command prompt
    console.log('Bot ready!');//tells the command prompt that the bot is ready
    client.user.setActivity("in alpha mode | prefix: "+prefix);//sets the status to "Playing with my robotic foreskin"
});
client.on("message",(message)=>{//activates when a message is sent via dms or in a shared server [Commands one]
    if (message.author.bot) return
    var author = message.author
    var basicStaff = message.member.roles.has(message.guild.roles.find("name", "Basic Staff").id)//true or false if user is basic staff
    var moderator = message.member.roles.has(message.guild.roles.find("name", "Moderator").id)//true or false if user is mod
    var administrator = message.member.roles.has(message.guild.roles.find("name", "Administrator").id)//true or false if iser is admin
    var superAdmin = message.member.roles.has(message.guild.roles.find("name", "Super Administrator").id)//true or false if user is super admin
    var RCK = message.member.roles.has(message.guild.roles.find("name", "Roblox Cool Kid").id)//true or false of user is a roblox cool kid
    let userData = JSON.parse(fs.readFileSync('userData.json', 'utf8'))
    let serverData = JSON.parse(fs.readFileSync('serverData.json', 'utf8'))
    if (!userData[message.author.id + message.guild.id]) userData[message.author.id + message.guild.id] = {}
    if (!userData[message.author.id + message.guild.id].money) userData[message.author.id + message.guild.id].money = 100
    if (!serverData[message.guild.id]) serverData[message.guild.id] = {}
    if (!serverData[message.guild.id].commandChannel) serverData[message.guild.id].commandChannel = ""
    if (!userData[message.author.id + message.guild.id].xp) userData[message.author.id + message.guild.id].xp = 0
    if (!userData[message.author.id + message.guild.id].level) userData[message.author.id + message.guild.id].level = 0
    fs.writeFile("userData.json", JSON.stringify(userData), (err) => {
        if (err) console.error(err)
    })
    fs.writeFile("serverData.json", JSON.stringify(serverData), (err) => {
        if (err) console.error(err)
    })
    var isStaffCommand = function(){
        for (var i = 0; i < staffCommands.length;i++ ){//goes through the ammount of items in command list
            if (message.content.startsWith(staffCommands[i])){
                return true;
            }
        }
    }
    var xpRandom = Math.floor(Math.random()*10)
    var level = userData[message.author.id + message.guild.id].level
    userData[message.author.id + message.guild.id].xp += xpRandom
    if (userData[message.author.id + message.guild.id].xp >= (userData[message.author.id + message.guild.id].level+1)*100){
        userData[message.author.id + message.guild.id].level += 1
        userData[message.author.id + message.guild.id].xp = userData[message.author.id + message.guild.id].xp - userData[message.author.id + message.guild.id].level*100
        message.reply("you reached level "+userData[message.author.id + message.guild.id].level)
    }
        if (message.content.startsWith(prefix+"SetCommandChannel ")){
            var commandChannel = message.content.split(prefix+"SetCommandChannel ").splice(1)
            serverData[message.guild.id].commandChannel = commandChannel
            message.channel.send("Set bot commands channel to "+serverData[message.guild.id].commandChannel)
            return
        }
        if (message.content.startsWith(prefix+"prune")){//activation of prune command
            if (basicStaff||moderator||administrator||superAdmin||RCK){//makes sure the person pruning is staff
                var args = message.content.split(" ").splice(1);//splits the command and the arguments
                if (!args[0]){//activates if no arguments are given
                    message.reply("you didn't specify how many messages to prune, do 'prune (number 1-100)'");//informs users that they didn't specify how many messages to prune
                    return;
                }else if(args[0]>100){//limits pruned messages to 100
                    message.reply("you can't prune more than 100 messgaes at once");//informs users that only 100 messages can be pruned
                }else{//activates if messages can be pruned
                    message.delete;//deletes the message calling the command, to accurately prune
                    message.channel.bulkDelete(args[0]);//deletes how many messages the person said to
                    message.reply("you pruned "+args[0]+" messages");//says which user pruned
                }
            }else{
                message.reply("only staff can use this command");//tells a non-staff member that they need to be staff in order to prune
            }
        }
        if (message.content.startsWith(prefix+"ban")){//if it's the ban command
            if (administrator||superAdmin||RCK){//if the person has a proper role
                var memberToBan = message.mentions.members.first();//sets the person to ban as the first mention
                var banReason = message.content.split(" | ").slice(1);//puts the ban reason as anything after a "|"
                if(!memberToBan){
                    message.reply("Missing a member to ban. Proper use: ?ban (@mention user) | (reason)");//tells the user what the propper usage is
                    return;
                }
                if (!banReason[0]){
                    message.reply("Missing a reason for ban. Proper use: ?ban (@mention user) | (reason)")//if there's no reson for the ban
                    return;
                }
                else if (memberToBan.roles.find("name", "Roblox Cool Kid")){//if the person who is being banned is an admin
                    message.reply("you can't ban an owner");//tells user that staff can't ban eachother
                    return;
                }else if (memberToBan.roles.find("name", "Super Administrator")){//if the person who is being banned is a super admin
                    message.reply("manually ban staff");//tells user that staff can't ban eachother
                    return;
                }else if (memberToBan.roles.find("name", "Administrator")){//if the person who is being banned is a roblox cool kid
                    message.reply("manually ban staff");//tells user TO NOT BAN ROBLOC COOL KIDS
                    return;
                }
                 memberToBan.ban(banReason);//bans a user for the reason listed
                message.reply("you banned "+memberToBan+" for "+banReason);//says that you banned the person
            }else{
            message.reply("you do not have permission to ban members");//tells a non-admin they can't ban people
        }
    }
    if (message.content.startsWith(prefix+"kick")){//if it's the kick command
            if (administrator||superAdmin||RCK||moderator){//if the person has a proper role
                var memberToKick = message.mentions.members.first();//sets the person to kick as the first mention
                var kickReason = message.content.split(" | ").slice(1);//puts the kick reason as anything after a "|"
                if(!memberToKick){
                    message.reply("Missing a member to kick. Proper use: ?kick (@mention user) | (reason)");//tells the user what the propper usage is
                    return;
                }
                if (!kickReason[0]){
                    message.reply("Missing a reason for kick. Proper use: ?kick (@mention user) | (reason)")//if there's no reson for the ban
                    return;
                }
                else if (memberToKick.roles.find("name", "Roblox Cool Kid")){//if the person who is being kicked is an admin
                    message.reply("you can't kick an owner");//tells user that staff can't kick eachother
                    return;
                }else if (memberToKick.roles.find("name", "Super Administrator")){//if the person who is being kicked is a super admin
                    message.reply("manually kick staff");//tells user that staff can't kick eachother
                    return;
                }else if (memberToKick.roles.find("name", "Administrator")){//if the person who is being kicked is a roblox cool kid
                    message.reply("manually kick staff");//tells user TO NOT KICK ROBLOC COOL KIDS
                    return;
                }else if (memberToKick.roles.find("name", "Moderator")){//if the person who is being kicked is a roblox cool kid
                    message.reply("manually kick staff");//tells user TO NOT KICK ROBLOC COOL KIDS
                    return;
                }
                memberToKick.kick(kickReason);//kicks a user for the reason listed
                message.reply("you kicked "+memberToKick+" for "+kickReason);//says that you kicked the person
            }else{
            message.reply("you do not have permission to kick members");//tells a non-admin they can't kick people
        }
    }
    if (message.channel.name === serverData[message.guild.id].commandChannel[0]){
        switch(message.content.toLowerCase){//detects more simple commands
            case prefix+"level":
                message.channel.send({embed:{
                    title:message.author.username+"'s Level",
                    color: 0x22ccb7,
                    fields:[{
                        name:"Level",
                        value:userData[message.author.id + message.guild.id].level,             
                        inline:true
                    },{
                        name:"Xp left to level up",
                        value:(userData[message.author.id + message.guild.id].level+1)*100 - userData[message.author.id + message.guild.id].xp,
                        inline:true
                    }
                    ]}

                })
                break;
            case prefix+"work":
                var moneyRandom = Math.floor(Math.random()*100)
                userData[message.author.id + message.guild.id].money += moneyRandom
                message.channel.send({embed:{
                    title:"Work Today",
                        color: 0x2a4722,
                        fields:[{
                            name:"User",
                            value:message.author.username,
                            inline:true
                        },{
                            name:"Earned Money",
                            value:moneyRandom,
                            inline:true
                           }
                        ]}
                })
                break;
            case prefix+"money":
                    message.channel.send({embed:{
                title:"Bank",
                color: 0x2a4722,
                fields:[{
                    name:"User",
                    value:message.author.username,
                    inline:true
                },{
                    name:"Money",
                    value:userData[message.author.id + message.guild.id].money,
                    inline:true
                }
                ]}
            })
                break;

            case prefix+"help":;//activation of help command
                message.channel.send({embed:{
                    title:"Commands",
                    color: 0xFFFFFF,
                    fields:[{
                        name:commands[0].trigger,
                        value:commands[0].description,
                        inline:false
                    }
                ]}

            })
            message.channel.send({embed:{
                title:"Staff Commands",
                color: 0xFFFFFF,
                fields:[{
                    name:staffCommands[0].trigger,
                    value:staffCommands[0].description,             
                    inline:false
                },{
                    name:staffCommands[1].trigger,
                    value:staffCommands[1].description,
                    inline:false
                },{
                    name:staffCommands[2].trigger,
                    value:staffCommands[2].description,
                    inline:false
                }
            ]}

        })
            break;
        
        }
    } else {
        message.reply("use the bot commands channel!")//warns the person to use the right channel
    }
fs.writeFile("userData.json", JSON.stringify(userData), (err) => {
    if (err) console.error(err)
})
fs.writeFile("serverData.json", JSON.stringify(serverData), (err) => {
    if (err) console.error(err)
})
});
client.login(process.env.BOT_TOKEN);
