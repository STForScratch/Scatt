"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const config_1 = tslib_1.__importDefault(require("./config"));
const commands_1 = tslib_1.__importDefault(require("./commands"));
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const { Client, Intents } = require('discord.js');
const { intents, prefix, token } = config_1.default;
const axios = require('axios')
const WasteOfSession = require("wasteof-client")
const cron = require('cron');
const fetch = require('node-fetch');
const jsonfile = require('jsonfile');
const Jimp = require('jimp');
const { readFile } = require('fs/promises');

let scheduledMessage = new cron.CronJob('00 00 14 * * *', async () => {
  try {
  // This runs every day at 10:30:00, you can do anything you want
  var qotd = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('❓❔ Question of the Day ❔❓')
    .setDescription(randomQuestion())
    .setTimestamp()
    .setFooter('Thanks to parade.com for the questions.');
  let channel = await client.channels.fetch('945348685963866123');
  channel.send({ embeds: [qotd] });
  } catch(err) {
    console.log(err)
  }
});

// When you want to start it, use:
scheduledMessage.start()




let getSuggestions = new cron.CronJob('* * * * * *', () => {
  async function getTheSuggestion() {
    var response = await fetch('https://tools.scratchstatus.org/getsuggestion')
      .then(async response => {
        var data = await response.json()
        if (data['content'] !== '') {
          if (data['user'] !== '') {
            var banana = await client.channels.fetch('976623135208140891')
            await banana.send({ content:"`"+`New message from rgantzos via school:${"`"} ${data['content']}` })
          }
        }
      })
      .catch(error => {
        console.log('error')

      })
  }
  getTheSuggestion()

  getLeaderboard()
  async function getLeaderboard() {
    var msgchannel = await client.channels.fetch('977365107841572914')
    var msg = await msgchannel.messages.fetch('977366214185734154')
    const file = "/home/runner/Scatt/dist/userdata/points.json";
    jsonfile.readFile(file, function(err, obj) {
      if (err) {
        console.log(err);

      } else {
        var allUsers = []
        var allValues = []
        var orderedUsers = []
        var orderedValues = []
        Object.keys(obj).forEach(function(user) {
          allUsers.push(user)
          allValues.push(obj[user])
        })
        order()
        function order() {
          while (allUsers.length !== 0) {
            var top = []
            top.push(allUsers[0])
            allUsers.forEach(function(el) {
              if (allValues[allUsers.indexOf(el)] > allValues[allUsers.indexOf(top[top.length - 1])]) {
                top.push(el)
              }
            })
            orderedUsers.push(top[top.length - 1])
            orderedValues.push(allValues[allUsers.indexOf(top[top.length - 1])])
            allValues.splice(allUsers.indexOf(top[top.length - 1]), 1)
            allUsers.splice(allUsers.indexOf(top[top.length - 1]), 1)
          }
          var leaderboard = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('🔴 Live XP Leaderboard (Top 10 Only)')
            .setAuthor({ name: 'ScratchTools Server' })
            .setDescription('You can earn XP by being active in the server and talking in channels! With XP, you can get special roles and work your way up in the server!')
            .setFooter({ "text": "Use !leaderboard in another channel to see the entire leaderboard!" })
          orderedUsers.forEach(async function(el) {
            var amount = orderedValues[orderedUsers.indexOf(el)]
            if (orderedUsers.indexOf(el) + 1 === 1) {
              leaderboard.addField(`🥇 #${orderedUsers.indexOf(el) + 1}`, `<@${el}>: ${amount} XP`)
            } else {
              if (orderedUsers.indexOf(el) + 1 === 2) {
                leaderboard.addField(`🥈 #${orderedUsers.indexOf(el) + 1}`, `<@${el}>: ${amount} XP`)
              } else {
                if (orderedUsers.indexOf(el) + 1 === 3) {
                  leaderboard.addField(`🥉 #${orderedUsers.indexOf(el) + 1}`, `<@${el}>: ${amount} XP`)
                } else {
                  if (orderedUsers.indexOf(el) + 1 < 11) {
                    leaderboard.addField(`#${orderedUsers.indexOf(el) + 1}`, `<@${el}>: ${amount} XP`)
                  }
                }
              }
            }
          })
          msg.edit({ embeds: [leaderboard], content: null })
        }
      }
    })
  }
});

const { SlashCommandBuilder } = require('@discordjs/builders');

const client = new discord_js_1.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'ROLE'],
  fetchAllMembers: true,
  presence: {
    status: 'online',
    activities: [{
      name: `the server :)`,
      type: 'WATCHING'
    }]
  }
});

client.on('ready', async () => {
  console.log(`Logged in as: ${client.user?.tag}`);
  var mm = new MessageEmbed()
    .setColor('#38bdff')
    .setTitle('Verification')
    .setDescription('Hit the button to verify!')
  var mb = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('primary')
        .setEmoji('✅')
        .setStyle('PRIMARY'),
    );
  // var msg = await client.channels.cache.get('945350004875333653').send({ embeds:[mm], components:[mb] })
  // version info

  // inside a command, event listener, etc.









  const profile = new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Gets scratch profile info')
    .addStringOption(option =>
      option.setName('account')
        .setDescription('Account to get info for')
        .setRequired(true))
  const command2 = new SlashCommandBuilder()
    .setName('suggestion_answer')
    .setDescription('Approves a user suggestion (devs only).')
    .addStringOption(option =>
      option.setName('answer')
        .setDescription('How to categorize the suggestion.')
        .setRequired(true)
        .addChoice('Approve', 'approve')
        .addChoice('Reject', 'reject')
        .addChoice('Already Implemented', 'implemented')
        .addChoice('Possible', 'possible')
        .addChoice('Impossible', 'impossible')
        .addChoice('Impractical', 'impractical')
        .addChoice('Completed', 'completed'))
    .addStringOption(option2 =>
      option2.setName('message_id')
        .setDescription('The id of the suggestion.')
        .setRequired(true))

  const wiki = new SlashCommandBuilder()
    .setName('wiki')
    .setDescription('Searches Wikipedia!')
    .addStringOption(option =>
      option.setName('search')
        .setDescription('What to search for.')
        .setRequired(true))
  const slowmode = new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set slowmode (admin)')
    .addStringOption(option =>
      option.setName('time')
        .setDescription('time')
        .setRequired(true))

  const connect = new SlashCommandBuilder()
    .setName('connect')
    .setDescription('Connect to your Scratch profile!')

  const removeslowmode = new SlashCommandBuilder()
    .setName('remove slowmode')
    .setDescription('Removes slowmode')
  const mute = new SlashCommandBuilder()
    .setName('z_mute')
    .setDescription('Mutes a user (admins only).')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to mute.')
        .setRequired(true))
    .addStringOption(option2 =>
      option2.setName('reason')
        .setDescription('Time (in minutes).')
        .setRequired(true))

  const modmail = new SlashCommandBuilder()
    .setName('modmail')
    .setDescription('Send modmail to a user (admin only).')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to send to.')
        .setRequired(true))
    .addStringOption(option2 =>
      option2.setName('content')
        .setDescription('The content to send.')
        .setRequired(true))
  const rank = new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Get any user's rank.")
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to get rank from.')
        .setRequired(true))

  const help = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get help with Scatt.')

  const search = new SlashCommandBuilder()
    .setName('project')
    .setDescription('Send modmail to a user (admin only).')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to send to.')
        .setRequired(true))
    .addStringOption(option2 =>
      option2.setName('content')
        .setDescription('The content to send.')
        .setRequired(true))

  const report = new SlashCommandBuilder()

    .setName('report')
    .setDescription('Report activity in the server (anonymous).')
    .addStringOption(option =>
      option.setName('describe')
        .setDescription('Please describe what happened.')
        .setRequired(true))
    .addUserOption(option => option.setName('user').setDescription('The user the report is on.').setRequired(true))
    .addStringOption(option =>
      option.setName('message_id')
        .setDescription('The ID of any message that the report was for.')
        .setRequired(false))
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel that the incident occurred in.')
        .setRequired(false))

  const mimic = new SlashCommandBuilder()
    .setName('mimic')
    .setDescription('Mimic a user (admins only).')
    .addUserOption(option =>
      option.setName('user')
        .setRequired(true)
        .setDescription('The user to mimic.'))
    .addStringOption(option =>
      option.setName('content')
        .setRequired(true)
        .setDescription('What to send as the user.'))

  const command3 = new SlashCommandBuilder()
    .setName('bug_answer')
    .setDescription('Approves a user bug (devs only).')
    .addStringOption(option =>
      option.setName('answer')
        .setDescription('How to categorize the bug.')
        .setRequired(true)
        .addChoice('Approve', 'approve')
        .addChoice('Reject', 'reject')
        .addChoice('Already Implemented', 'implemented')
        .addChoice('Impossible', 'impossible')
        .addChoice('Fixed', 'fixed'))
    .addStringOption(option2 =>
      option2.setName('message_id')
        .setDescription('The id of the bug.')
        .setRequired(true))

  const versionsearch = new SlashCommandBuilder()
    .setName('version')
    .setDescription('Info on ScratchTools versions.')
    .addStringOption(option =>
      option.setName('version_id')
        .setDescription('The version id.')
        .setRequired(true)
        .addChoice('1.0', '1.0')
        .addChoice('1.1', '1.1')
        .addChoice('1.2', '1.2')
        .addChoice('1.3', '1.3')
        .addChoice('1.4', '1.4')
        .addChoice('1.5', '1.5')
        .addChoice('1.6', '1.6')
        .addChoice('1.7', '1.7')
        .addChoice('1.8', '1.8')
        .addChoice('1.9', '1.9'))

  const suggestcreate = new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Create a suggestion for ScratchTools.')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Title the suggestion.')
        .setRequired(true))
    .addStringOption(option2 =>
      option2.setName('description')
        .setDescription('Give a description for the suggestion.')
        .setRequired(true))

  const bugcreate = new SlashCommandBuilder()
    .setName('bugreport')
    .setDescription('Create a bug report for ScratchTools.')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Title the bug.')
        .setRequired(true))
    .addStringOption(option2 =>
      option2.setName('description')
        .setDescription('Give a description for the bug.')
        .setRequired(true))

  const reverse = new SlashCommandBuilder()
    .setName('reverse')
    .setDescription('Reverse text!')
    .addStringOption(option =>
      option.setName('text')
        .setRequired(true)
        .setDescription('Text to reverse.'))

  const warn = new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to warn')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Why the user is being warned.')
        .setRequired(true))


  const alert = new SlashCommandBuilder()
    .setName('alert')
    .setDescription('Alert all users in the server.')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Title the alert.')
        .setRequired(true))
    .addStringOption(option2 =>
      option2.setName('description')
        .setDescription('Give a description for the alert.')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('color')
        .setDescription('The color for the alert.')
        .setRequired(true)
        .addChoice('Red', 'RED')
        .addChoice('Orange', 'ORANGE')
        .addChoice('Yellow', 'YELLOW')
        .addChoice('Green', 'GREEN')
        .addChoice('Blue', 'BLUE')
        .addChoice('Purple', 'PURPLE')
        .addChoice('Gold', 'GOLD')
        .addChoice('White', 'WHITE')
        .addChoice('Black', 'BLACK'))

  const feature = new SlashCommandBuilder()
    .setName('feature')
    .setDescription('Get info on a feature!')
    .addStringOption(option =>
      option.setName('text')
        .setRequired(true)
        .setDescription('Search for a feature.'))

  const april = new SlashCommandBuilder()
    .setName('deletetrick')
    .setDescription('Change all nicknames in the server.')

  const april2 = new SlashCommandBuilder()
    .setName('fixdeletetrick')
    .setDescription('Changes back all nicknames in the server.')

  const count = new SlashCommandBuilder()
    .setName('count')
    .setDescription('Get the user count for ScratchTools and the server.')
  client.api.applications(client.user.id).guilds('945340853189247016').commands.post({ data: command2 })
  client.api.applications(client.user.id).guilds('945340853189247016').commands.post({ data: warn })
  client.api.applications(client.user.id).guilds('945340853189247016').commands.post({ data: slowmode })

  client.api.applications(client.user.id).guilds('945340853189247016').commands.post({ data: command3 })

  client.api.applications(client.user.id).guilds('945340853189247016').commands.post({ data: rank })

  client.api.applications(client.user.id).guilds('945340853189247016').commands.post({ data: help })

  client.api.applications(client.user.id).guilds('945340853189247016').commands.post({ data: connect })

  client.api.applications(client.user.id).guilds('945340853189247016').commands.post({ data: suggestcreate })

  client.api.applications(client.user.id).guilds('945340853189247016').commands.post({ data: profile })

  client.api.applications(client.user.id).guilds('945340853189247016').commands.post({ data: bugcreate })

  client.api.applications(client.user.id).guilds('945340853189247016').commands.post({ data: wiki })


  getSuggestions.start()

});

client.on('guildMemberRemove', async (member) => {
  try {
  var banana = await client.channels.fetch('945342441987391549')
  var user = await client.users.fetch(member)
  await banana.send(`**${user.tag}** has just left server.. Bye Bye`);
  } catch(err) {
    console.log(err)
  }
})

client.on('guildMemberAdd', async (member) => {
  try {
  var welcome = new MessageEmbed()
    .setFooter({ text: 'Welcome Message' })
    .setDescription("The ScratchTools server is very happy to have you with us. Go on, explore the server! You can go to <#948417804728668200> to find some things to do!")
    .setAuthor({ name: 'ScratchTools' })
    .setTimestamp()
    .setColor('ORANGE')
  var row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setURL('https://discord.com/channels/945340853189247016/945342441987391548')
        .setLabel('Rules')
        .setEmoji('📕')
        .setStyle('LINK'),
      new MessageButton()
        .setURL('https://discord.com/channels/945340853189247016/948417804728668200')
        .setLabel('Directory')
        .setEmoji('🗺')
        .setStyle('LINK'),
    );
  member.send({ embeds: [welcome], components: [row] })
  var welcome = new MessageEmbed()
    //.setTitle(`${member} Just Joined!`)
    .setDescription("The ScratchTools server is very happy to have you with us. Go on, explore the server! You can go to <#948417804728668200> to find some things to do!")
    .setAuthor({ name: 'ScratchTools' })
    .setTimestamp()
    .setColor('ORANGE')
  //await client.channels.cache.get('945340853189247019').send({ embeds:[welcome] })

} catch(err) {
  console.log(err)
}
})

client.on('interactionCreate', async (interaction) => {
  try {
  if (interaction.type === 'MESSAGE_COMPONENT') {
    if (interaction.componentType === 'BUTTON') {
      if (interaction.customId.includes('wasteof ')) {
        interaction.message.edit({ content: 'Checking...', components: [] })
        var response = await fetch(`https://wasteof.auth.gantzos.com/getUser/${interaction.customId.split(' ')[1]}/`)
        var data = await response.text()
        interaction.reply(`Hello, ${"`"}@${data}${"`"}!`)
      }
      if (interaction.customId.includes('ban-ip-address-')) {
        if (interaction.member.roles.cache.some(role => role.name === 'Admin') || interaction.member.roles.cache.some(role => role.name === 'Moderator')) {
          var response = await fetch(`https://tools.scratchstatus.org/ip/ban/${interaction.customId.split('ban-ip-address-')[1]}/`)
            .then(async response => {
              var data = await response.json()
              var row = new MessageActionRow()
                .addComponents(
                  new MessageButton()
                    .setCustomId('suggestion')
                    .setLabel('Mark as Suggestion')
                    .setDisabled(true)
                    .setStyle('PRIMARY'),
                  new MessageButton()
                    .setCustomId('bug')
                    .setLabel('Mark as Bug')
                    .setDisabled(true)
                    .setStyle('PRIMARY'),
                  new MessageButton()
                    .setCustomId(`unban-ip-add-${interaction.customId.split('ban-ip-address-')[1]}`)
                    .setLabel('IP Unban')
                    .setStyle('DANGER')
                );
              interaction.message.edit({ content: `IP Banned by ${interaction.user.tag}:`, embeds: interaction.message.embeds, components: [row] })
              var msg = interaction.message.pin()
              interaction.reply({ content: "Successfully IP banned this user.", ephemeral: true })
            })
            .catch(error => {
              interaction.reply({ content: "Error, unable to ban.", ephemeral: true })
              client.channels.cache.get('945342441987391549').send(`😭 ${interaction.user.tag} is experiencing an error!!!` + "`" + error + "`")
              console.log(error)
            })
        } else {
          interaction.reply({ content: "Sorry, only admins and moderators can perform this action.", ephemeral: true })
        }
      }
      if (interaction.customId.includes('unban-ip-add-')) {
        if (interaction.member.roles.cache.some(role => role.name === 'Admin') || interaction.member.roles.cache.some(role => role.name === 'Moderator')) {
          var response = await fetch(`https://tools.scratchstatus.org/ip/unban/${interaction.customId.split('unban-ip-add-')[1]}/`)
            .then(async response => {
              var data = await response.json()
              var row = new MessageActionRow()
                .addComponents(
                  new MessageButton()
                    .setCustomId('suggestion')
                    .setLabel('Mark as Suggestion')
                    .setDisabled(true)
                    .setStyle('PRIMARY'),
                  new MessageButton()
                    .setCustomId('bug')
                    .setLabel('Mark as Bug')
                    .setDisabled(true)
                    .setStyle('PRIMARY'),
                );
              interaction.message.edit({ content: `IP Unbanned by ${interaction.user.tag}:`, embeds: interaction.message.embeds, components: [row] })
              interaction.message.unpin()
              interaction.reply({ content: "Successfully IP unbanned this user.", ephemeral: true })
            })
            .catch(error => {
              interaction.reply({ content: "Error, unable to unban.", ephemeral: true })
              client.channels.cache.get('945342441987391549').send(`😭 ${interaction.user.tag} is experiencing an error!!!` + "`" + error + "`")
            })
        } else {
          interaction.reply({ content: "Sorry, only admins and moderators can perform this action.", ephemeral: true })
        }
      }
      if (interaction.customId === 'suggestion') {
        var banana = await client.channels.fetch("948411171797606401")
        var msg = await banana.send({ embeds: interaction.message.embeds });
        msg.react("👍")
        msg.react("👎")
        const threadforsuggest = await msg.startThread({
          name: 'Feedback via ScratchTools Website',
          autoArchiveDuration: 60,
          reason: 'Space to talk about suggestion!',
          type: 'GUILD_PRIVATE_THREAD',
        });
        await threadforsuggest.send("This suggestion came from `https://tools.scratchstatus.org/`!");
        interaction.reply({ content: "Successfully created suggestion!", ephemeral: true })
        var row = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId('suggestion')
              .setLabel('Mark as Suggestion')
              .setDisabled(true)
              .setStyle('PRIMARY'),
            new MessageButton()
              .setCustomId('bug')
              .setLabel('Mark as Bug')
              .setDisabled(true)
              .setStyle('PRIMARY'),
            new MessageButton()
              .setCustomId('ban')
              .setLabel('IP Ban')
              .setDisabled(true)
              .setStyle('DANGER')
          );
        interaction.message.edit({ content: "Marked as suggestion:", embeds: interaction.message.embeds, components: [row] })
      }
      if (interaction.customId.includes('connect ')) {
        var response = await fetch('https://clouddata.scratch.mit.edu/logs?projectid=694190317&limit=1&offset=0')
        var data = await response.json()
        if (interaction.customId.split(' ')[2] === interaction.user.id) {
          if (data[0]['value'] === String(interaction.customId.split(' ')[1])) {
            await interaction.reply({ content: "Successfully set Scratch profile to `" + data[0]['user'] + "`!", ephemeral: true })
            var file = "/home/runner/Scatt/dist/userdata/profiles.json";
            jsonfile.readFile(file, function(err, obj) {
              if (err) {
                console.log(err)
              } else {
                obj[interaction.user.id] = data[0]['user']
                jsonfile.writeFile(file, obj)
              }
            })
          } else {
            await interaction.reply({ content: "Hmmm... that didn't seem to work. Please click this button in a few seconds, and if that still doesn't work, you should start over..", ephemeral: true })
          }
        }
      }
      if (interaction.customId === 'bug') {
        var banana = await client.channels.fetch("950609986151653438")
        var msg = await banana.send({ embeds: interaction.message.embeds });
        msg.react("👍")
        msg.react("👎")
        const threadforsuggest = await msg.startThread({
          name: 'Feedback via ScratchTools Website',
          autoArchiveDuration: 60,
          reason: 'Space to talk about suggestion!',
          type: 'GUILD_PRIVATE_THREAD',
        });
        await threadforsuggest.send("This suggestion came from `https://tools.scratchstatus.org/`!");
        interaction.reply({ content: "Successfully created bug report!", ephemeral: true })
        var row = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId('suggestion')
              .setLabel('Mark as Suggestion')
              .setDisabled(true)
              .setStyle('PRIMARY'),
            new MessageButton()
              .setCustomId('bug')
              .setLabel('Mark as Bug')
              .setDisabled(true)
              .setStyle('PRIMARY'),
            new MessageButton()
              .setCustomId('ban')
              .setLabel('IP Ban')
              .setDisabled(true)
              .setStyle('DANGER')
          );
        interaction.message.edit({ content: "Marked as bug:", embeds: interaction.message.embeds, components: [row] })
      }
      if (interaction.message.id === '964576587318177884') {
        if (!interaction.member.roles.cache.some(role => role.name === 'Member')) {
          var role3 = interaction.guild.roles.cache.find(r => r.id === "945347146612342806");
          interaction.member.roles.add(role3)
          interaction.reply({ content: 'Verified!', ephemeral: true })

          var gotit = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId('gotit')
                .setLabel("I Will Welcome Them")
                .setStyle('PRIMARY')
                .setDisabled(false)
            );

          var banana = await client.channels.fetch('973239218518245386')
          await banana.send({ content: `<@&973238564034859109> - <@${interaction.user.id}> just joined!`, components: [gotit] })
        } else {
          await interaction.reply({ content: "Already verified!", ephemeral: true })
        }
      }
      if (interaction.customId === 'gotit') {
        var gotit = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId('gotit')
              .setLabel(interaction.user.username + " Is Already Welcoming Them")
              .setStyle('PRIMARY')
              .setDisabled(true)
          );

        await interaction.message.edit({ content: interaction.message.content, components: [gotit] })
        await interaction.reply({ content: "Thanks! Just go to the lounge to find them!!" })
      }
      if (interaction.message.channel.type === 'DM') {
        if (interaction.customId === 'primary') {
          var arow = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId('primary')
                .setLabel('Confirm')
                .setStyle('PRIMARY')
                .setDisabled(true),
              new MessageButton()
                .setCustomId('cancel')
                .setLabel('Cancel')
                .setStyle('SECONDARY')
                .setDisabled(true),
            );
          var theembedthreadchannel = await client.channels.fetch("954823644415135826")
          var theembedthread = await theembedthreadchannel.threads.cache.find(x => x.name === interaction.user.id);
          var theembed = interaction.message.embeds[0]
          console.log(theembed.footer.text)
          var msg = await theembedthreadchannel.send(`${interaction.user.id} - ${theembed.author.name} - ${theembed.footer.text}`)

          if (theembedthread !== undefined) {
            var texttosend = await interaction.message.channel.messages.fetch(interaction.message.reference.messageId)
            await theembedthread.send(texttosend)
          } else {
            var texttosend = await interaction.message.channel.messages.fetch(interaction.message.reference.messageId)
            var thethreadforembed = await theembedthreadchannel.threads.create({
              name: interaction.user.id,
              autoArchiveDuration: 4320,
              reason: 'Needed a separate thread for modmail',
            });
            await thethreadforembed.send("`" + interaction.user.tag + "` " + texttosend.content)
            await interaction.reply({ content: "We have alerted moderators and admins. Messages sent to this bot will automatically be sent to admins until an admin closes it. Currently, images are not supported.", ephemeral: true })
            await theembedthreadchannel.send(`@here <@${interaction.user.id}> has requested modmail.`)
          }
          interaction.message.edit({ embeds: [theembed], components: [arow] })
        } else {
          var theembed = interaction.message.embeds[0]
          var arow = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId('primary')
                .setLabel('Confirm')
                .setStyle('PRIMARY')
                .setDisabled(true),
              new MessageButton()
                .setCustomId('cancel')
                .setLabel('Cancel')
                .setStyle('SECONDARY')
                .setDisabled(true),
            );
          interaction.message.edit({ embeds: [theembed], components: [arow] })
          interaction.reply('Modmail cancelled.')
        }
      }
    }
  }
  if (interaction.message !== undefined) {
    if (interaction.message.id === '962152879190343722') {
      if (interaction.values[0] === 'basic') {
        var role = interaction.guild.roles.cache.find(r => r.id === "962153481618214983");
        var role2 = interaction.guild.roles.cache.find(r => r.id === "962153437569646594");
        interaction.member.roles.add(role);
        interaction.member.roles.remove(role2)
        interaction.reply({ content: `Marked ${interaction.user.tag} as Basic Announcements Receiver`, ephemeral: true })
      }
      if (interaction.values[0] === 'priority') {
        var role = interaction.guild.roles.cache.find(r => r.id === "962153437569646594");
        var role2 = interaction.guild.roles.cache.find(r => r.id === "962153481618214983");
        interaction.member.roles.add(role);
        interaction.member.roles.remove(role2)
        interaction.reply({ content: `Marked ${interaction.user.tag} as Priority Announcements Receiver`, ephemeral: true })
      }
    }
  }


  if (interaction.isCommand()) {
    const { commandName } = interaction;
    if (commandName === 'help') {
      var file = "/home/runner/Scatt/dist/commands.json";
      jsonfile.readFile(file, function(err, obj) {
        if (err) {
          console.log(err)
          interaction.reply({ content: "Sorry, an error occurred.", ephemeral: true })
        } else {
          var help = new MessageEmbed()
          help.setTitle('Scatt Help')
          help.setDescription('Here are my commands!')
          help.setColor('BLUE')
          Object.keys(obj).forEach(function(command) {
            if (interaction.member.roles.cache.some(role => role.name === obj[command]['role'])) {
              help.addField(command, obj[command]['description'], true)
            }
          })
          var about = new MessageEmbed()
          about.setTitle('About ScratchTools')
          about.setDescription("ScratchTools is a completely free and open source extension for scratch.mit.edu! We're constantly adding new features and releasing new versions, and we're community run, so anyone can develop features! Try using `/suggest` to suggest a feature for ScratchTools, and our developers will see if it's practical!")
          about.setColor('BLUE')
          interaction.reply({ embeds: [about, help], ephemeral: true })
        }
      })
    }
    if (commandName === 'search') {
      var response = await fetch(`https://api.scratch.mit.edu/projects/${interaction.options._hoistedOptions[0].value}/`)
      var data = await response.json()
      if (data['code'] !== null) {
        interaction.reply('Project not found.')
      } else {
        var projectInfo = new MessageEmbed()
          .setColor('#ff9f00')
          .setTitle(data['title'])
          .setURL(`https://scratch.mit.edu/projects/${interaction.options._hoistedOptions[0].value}/`)
          .setAuthor({ name: data['author']['username'], iconURL: data['author']['profile']['images']['90x90'], url: `https://scratch.mit.edu/users/${data['author']['username']}/` })
          .setDescription(data['instructions'])
          .setThumbnail(data['images']['282x218'])
          .addFields(
            { name: 'Loves', value: data['stats']['loves'] },
            { name: 'Favorites', value: data['stats']['favorites'] },
            { name: 'Remixes', value: data['stats']['remixes'] },
            { name: 'Views', value: data['stats']['views'] }
          )
        interaction.reply({ embeds: [projectInfo] })
      }
    }
    //bookmark1
    if (commandName == "imgEffect") {
      interaction.reply("Coming soon.... :)")

    }
    if (commandName === "rank") {
      let user = await client.users.fetch(interaction.options._hoistedOptions[0].value);
      var info = []
      var file = "/home/runner/Scatt/dist/userdata/points.json";
      jsonfile.readFile(file, function(err, obj) {
        if (err) {
          console.log(err);
        } else {
          try {
            let xp = obj[user.id];
            if (xp === undefined) {
              if (user !== undefined) {
              if (user.id === '948687053896433714') {
                interaction.reply({ content: "Nice job, you've passed the first part. It only gets harder from here. Maybe try checking the project from `/connect`...", ephemeral: true })
              } else {
                interaction.reply({ content: "This use is so inactive that they don't even have a rank!(L)", ephemeral: true })
              }
              } else {
              interaction.reply({ content: "This use is so inactive that they don't even have a rank!(L)", ephemeral: true })
              }
            } else {
              info.push(xp)
              console.log(info)
              var allUsers = []
              var allValues = []
              var orderedUsers = []
              var orderedValues = []
              Object.keys(obj).forEach(function(user) {
                allUsers.push(user)
                allValues.push(obj[user])
              })
              order()
              function order() {
                while (allUsers.length !== 0) {
                  var top = []
                  top.push(allUsers[0])
                  allUsers.forEach(function(el) {
                    if (allValues[allUsers.indexOf(el)] > allValues[allUsers.indexOf(top[top.length - 1])]) {
                      top.push(el)
                    }
                  })
                  orderedUsers.push(top[top.length - 1])
                  orderedValues.push(allValues[allUsers.indexOf(top[top.length - 1])])
                  allValues.splice(allUsers.indexOf(top[top.length - 1]), 1)
                  allUsers.splice(allUsers.indexOf(top[top.length - 1]), 1)
                }
              }
              console.log(info)
              const file2 = "/home/runner/Scatt/dist/userdata/about.json";
              jsonfile.readFile(file2, function(err, obj) {
                if (err) {
                  console.log(err)
                } else {
                  if (obj[user.id] !== undefined) {
                    info.push(obj[user.id])
                  }
                  const file3 = "/home/runner/Scatt/dist/userdata/profiles.json";
                  jsonfile.readFile(file3, async function(err, obj) {
                    if (err) {
                      console.log(err)
                    } else {
                      var infoEmbed = new MessageEmbed()
                        .setTitle(`${user.tag}'s Stats`)
                      var member = await interaction.channel.guild.members.fetch(user.id)
                      await infoEmbed.setColor(member.displayHexColor)
                      infoEmbed.setThumbnail(user.avatarURL())
                      infoEmbed.setDescription(`<@${user.id}>'s stats in the ScratchTools server.`)
                      infoEmbed.addField('Total XP', info[0].toString(), true)
                      infoEmbed.addField('Overall Rank', `#${(orderedUsers.indexOf(user.id) + 1).toString()} in the server`, true)

                      infoEmbed.setTimestamp()
                      if (obj[user.id] !== undefined) {
                        infoEmbed.addField('Scratch Profile', obj[user.id], false)
                      }
                      if (info.length === 2) {
                        console.log(info[1])
                        infoEmbed.addField('\u200B', '\u200B', false)
                        infoEmbed.addField('About Me', info[1], false)
                      }
                      interaction.reply({ embeds: [infoEmbed] })
                    }
                  })
                }
              })
            }
          } catch (e) {
            interaction.reply("Something went wrong: `" + e + "`");
            client.channels.cache.get('945342441987391549').send(`😭 ${interaction.user.tag} is experiencing an error!!!` + "`" + e + "`")
          }
        }
      })
    }
    if (commandName === 'ban') {
      if (interaction.member.roles.cache.some(role => role.name === 'Admin' || interaction.member.roles.cache.some(role => role.name === 'Moderator'))) {
        let user = interaction.options._hoistedOptions[0].value;
        let reasonforban = interaction.options._hoistedOptions[1].value;
        user.ban({ reason: reasonforban });

      } else {
        interaction.reply("Not admin (L bozo)")
      }
    }
    if (commandName == 'slowmode') {
      if (interaction.member.roles.cache.some(role => role.name === 'Admin' || interaction.member.roles.cache.some(role => role.name === 'Moderator'))) {
        function isNumeric(val) {
          return /^-?\d+$/.test(val);
        }
        if (isNumeric(interaction.options._hoistedOptions[0].value)) {

          interaction.channel.setRateLimitPerUser(interaction.options._hoistedOptions[0].value, "Scatt Bot set slowmode")
          interaction.reply("✅ Slowmode set!")
        } else {
          interaction.reply("❌ Invalid time.");
        }
      } else {
        interaction.reply("❌ Admin or moderator required.");
      }
    }
    if (commandName === 'warn') {
      if (interaction.member.roles.cache.some(role => role.name === 'Admin' || interaction.member.roles.cache.some(role => role.name === 'Moderator'))) {
        let user = await client.users.fetch(interaction.options._hoistedOptions[0].value)
        if (user !== undefined) {
          if (user.bot !== true) {
            //nvm there is a npm library for json files yay
            const file = "/home/runner/Scatt/dist/userdata/warns.json";
            jsonfile.readFile(file, function(err, obj) {
              if (err) {
                console.log(err);
                client.channels.cache.get('945342441987391549').send(`😭 ${interaction.user.tag} is experiencing an error!!!` + "`" + err + "`")
              }
              else {
                function countObjectKeys(obje) {
                  return Object.keys(obje).length;
                }
                if (obj[user.id] !== undefined) {
                  console.log(countObjectKeys(obj[user.id]))
                  obj[user.id][countObjectKeys(obj[user.id])] = { "reason": interaction.options._hoistedOptions[1].value, "moderator": interaction.user.id }
                  console.log("You've had one warning before!")
                  jsonfile.writeFile(file, obj)
                  interaction.reply(`<@${user.id}> was warned (this is warning #${countObjectKeys(obj[user.id])} for them). Reason: ` + "`" + interaction.options._hoistedOptions[1].value + "`");
                } else {
                  obj[user.id] = {}
                  obj[user.id][0] = {}
                  obj[user.id][0]['reason'] = interaction.options._hoistedOptions[1].value
                  obj[user.id][0]['moderator'] = interaction.user.id
                  jsonfile.writeFile(file, obj)
                  interaction.reply(`<@${user.id}> was warned (this is warning #${countObjectKeys(obj[user.id])} for them). Reason: ` + "`" + interaction.options._hoistedOptions[1].value + "`");
                }
                const warningEmbed = new MessageEmbed()
                  .setColor('RED')
                  .setTitle('Be Warned!')
                  .setAuthor({ name: 'ScratchTools Official Server' })
                  .setDescription('You were warned in the ScratchTools server by an admin/moderator.')
                  .addField('Reason', interaction.options._hoistedOptions[1].value, true)
                user.send({ embeds: [warningEmbed] })
              }
            }
            )
          } else {
            interaction.reply({ content: "Sorry, but I can't warn other bots.", ephemeral: true })
          }
        } else {
          interaction.reply({ content: "I couldn't find this user :(", ephemeral: true })
        }
      } else {
        interaction.reply({ content: "You can't use this command!", ephemeral: true })
      }
    }
    if (commandName === "profile") {
      if (false) {
      //taken from my scratch info getter: https://replit.com/@the-electro-bros/Scratch-Info-Getter#index.js
      let url = `https://api.scratch.mit.edu/users/${interaction.options._hoistedOptions[0].value}`;
      const response = await fetch(url);
      if (!response.ok) {
        interaction.reply(`Error! status: ${response.status}`);
      }
      else {
        const data = await response.json();
        let bio;
        //
        // i'm just gonna fix something for u
        if (!data['profile']['bio']) {
          bio = "None.";
        }
        else {
          data['profile']['bio'];
        }
        // const result = await response.json();
        var embed = new MessageEmbed()
          .setColor('#6e6e6e')
          .setTitle(data['username'])
          .setURL(`https://scratch.mit.edu/users/${interaction.options._hoistedOptions[0].value}`)
          .setThumbnail(data['profile']['images']['90x90'])
          .setTimestamp()
          .addFields(
            { name: 'Country', value: data['profile']['country'] })
          .addFields(
            { name: 'Join date', value: data['history']['joined'] })
        if (data['profile']['bio'] !== '' && data['profile']['bio'] !== null && data['profile']['bio'] !== undefined) {
          embed.addFields(
            { name: 'Bio', value: data['profile']['bio'] })
        }
        if (data['profile']['status'] !== '' && data['profile']['status'] !== null && data['profile']['status'] !== undefined) {
          embed.addFields(
            { name: 'Status', value: data['profile']['status'] })
        }
        interaction.reply({ embeds: [embed] });
      }
    } else {
      interaction.reply('Command temporarily disabled.')
    }
    }
    //wikiBot
    if (commandName === 'connect') {
      var number = Math.floor(Math.random() * 9999999999);
      var row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId(`connect ${number} ${interaction.user.id}`)
            .setLabel('Done!')
            .setStyle('PRIMARY'),
        );
      interaction.reply({ content: "Your verification code is: `" + number + "`. Please enter that into this project: https://scratch.mit.edu/projects/694190317/.", components: [row], ephemeral: true })
    }
    if (commandName === 'wiki') {
      if (false) {
      // taken from my wikipedia bot https://replit.com/@the-electro-bros/Wikipedia-bot-for-discord#commands/tools/wiki.js
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${interaction.options._hoistedOptions[0].value}`;
      const response = await fetch(url);
      const result = await response.json();
      console.log(result['title'])
      if (result['title'] === 'Not found.') {
        var embed = new MessageEmbed()
          .setColor('RED')
          .setTitle('No Results')
          .setDescription("No results were found for your search. Feel free to try again!")
          .setThumbnail('https://silicophilic.com/wp-content/uploads/2021/01/Vac_System_Error.png')
          .setTimestamp()
      } else {
        let thing = "";
        try {
          thing = result.thumbnail.source;
        }
        catch (e) {
          thing = "https://images-ext-1.discordapp.net/external/qyRkBOMmX6otEt4xw6PDDYkJ_4GP1jthsbYXpVWFiBU/https/upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png";
          await client.channels.cache.get('945342441987391549').send(`😭 ${interaction.user.tag} is experiencing an error!!!` + "`" + e + "`")
        }
        let finalurl = "";
        try {
          finalurl = result.content_urls.desktop.page;
        }
        catch (e) {
          finalurl = "https://www.mediawiki.org/wiki/HyperSwitch/errors/not_found";
          await client.channels.cache.get('945342441987391549').send(`😭 ${interaction.user.tag} is experiencing an error!!!` + "`" + e + "`")
          //console.log("Error: "+e);
        }
        let edit = "";
        let talk = "";
        let rev = "";
        try {
          edit = result.content_urls.desktop.page;
          talk = result.content_urls.desktop.talk;
          rev = result.content_urls.desktop.revisions;
        } catch (e) {
          edit = "https://www.mediawiki.org/wiki/HyperSwitch/errors/not_found";
          talk = "https://www.mediawiki.org/wiki/HyperSwitch/errors/not_found";
          rev = "https://www.mediawiki.org/wiki/HyperSwitch/errors/not_found";
          await client.channels.cache.get('945342441987391549').send(`😭 ${interaction.user.tag} is experiencing an error!!!` + "`" + e + "`")
        }
        let revesions = "";
        try {
          revesions = result.revision;
        }
        catch (e) {
          revesions = "404";
          await client.channels.cache.get('945342441987391549').send(`😭 ${interaction.user.tag} is experiencing an error!!!` + "`" + e + "`")
        }
        try {
        console.log(finalurl);
        var embed = new MessageEmbed()
          .setColor('#6e6e6e')
          .setTitle(result.title)
          .setURL(finalurl)
          .setThumbnail(thing)
          .setTimestamp()
          .addFields(
            { name: 'Description:', value: result.description },
            { name: 'Details: ', value: result.extract },
            { name: 'Metadata', value: `Page ID: ${result.pageid} Last Edited: ${result.timestamp}    Reversion # ${revesions} Parsed:  ${interaction.options._hoistedOptions[0].value}` },
          )
          .addFields(
            { name: 'Options', value: `[Edit](${edit}) [Talk](${talk}) [Revisions](${rev})` },
          )
        }
        catch(err) {
          await client.channels.cache.get('945342441987391549').send(`😭 ${interaction.user.tag} is experiencing an error!!!` + "`" +err+ "`")
        }
      }
      interaction.reply({ embeds: [embed] });

    } else {
        interaction.reply('Command temporarily disabled.')
    }
    }
    if (commandName === 'mimic') {
      var stufftododevs = ['810336621198835723', '734839709041164339']
      if (stufftododevs.includes(interaction.user.id)) {
        console.log(interaction.user.username)
        var u = await client.users.fetch(interaction.options._hoistedOptions[0].value)

        var webhookClient = await interaction.channel.createWebhook(u.username, {
          avatar: u.avatarURL(),
        })

        webhookClient.send({
          content: interaction.options._hoistedOptions[1].value,
          username: u.username,
          avatarURL: u.avatarURL(),
        });
        interaction.reply({ content: "Mimicked!", ephemeral: true })
      }
    }
    if (commandName === 'feature') {
      if (1 === 1) {
        interaction.reply('This command is being worked on.')
      } else {
        function similarity(s1, s2) {
          var longer = s1;
          var shorter = s2;
          if (s1.length < s2.length) {
            longer = s2;
            shorter = s1;
          }
          var longerLength = longer.length;
          if (longerLength == 0) {
            return 1.0;
          }
          return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
        }
        function editDistance(s1, s2) {
          s1 = s1.toLowerCase();
          s2 = s2.toLowerCase();

          var costs = new Array();
          for (var i = 0; i <= s1.length; i++) {
            var lastValue = i;
            for (var j = 0; j <= s2.length; j++) {
              if (i == 0)
                costs[j] = j;
              else {
                if (j > 0) {
                  var newValue = costs[j - 1];
                  if (s1.charAt(i - 1) != s2.charAt(j - 1))
                    newValue = Math.min(Math.min(newValue, lastValue),
                      costs[j]) + 1;
                  costs[j - 1] = lastValue;
                  lastValue = newValue;
                }
              }
            }
            if (i > 0)
              costs[s2.length] = lastValue;
          }
          return costs[s2.length];
        }
        var features = ['tools', 'stuff', 'scratch', 'replace']
        const similaritystuff = 0
        const similarityfeature = ''
        similaritystuff.name = '0'
        similarityfeature.name = ''
        features.forEach(function(feature) {
          var similar = similarity(feature, interaction.options._hoistedOptions[0].value)
          if (similar > parseInt(similaritystuff.name)) {
            similaritystuff.name = feature
            similarityfeature.name = feature
          }
        })
        interaction.reply(similarityfeature.name)
      }

    }
    if (commandName === 'deletetrick') {
      if (interaction.user.id === '810336621198835723') {
        await interaction.guild.members.fetch().then(members => {
          // Loop through every members
          members.forEach(member => {
            if (member.user.id !== '810336621198835723') {
              member.setNickname(`Deleted User#${member.user.discriminator}`);
              console.log(member.user.username)
            }
          });
        });
        interaction.reply('Done!')
      }
    }
    if (commandName === 'fixdeletetrick') {
      if (interaction.user.id === '810336621198835723') {
        await interaction.guild.members.fetch().then(members => {
          // Loop through every members
          members.forEach(member => {
            if (member.user.id !== '810336621198835723') {
              member.setNickname(member.user.username);
              console.log(member.user.username)
            }
          });
        });
        interaction.reply('Done!')
      }
    }
    if (commandName === 'reverse') {
      interaction.reply(interaction.options._hoistedOptions[0].value.split("").reverse().join(""))
    }
    if (commandName === 'alert') {
      if (interaction.user.id === '810336621198835723') {
        var items = Array('GREEN', 'RED', 'BLUE', 'ORANGE', 'BLACK', 'WHITE', 'PURPLE', 'YELLOW');
        var test2 = new MessageEmbed()
          .setColor(interaction.options._hoistedOptions[2].value)
          .setTitle(interaction.options._hoistedOptions[0].value)
          .setDescription(interaction.options._hoistedOptions[1].value)
          .setAuthor(`ScratchTools`)
          .setFooter({ text: "You can reply to this message" })
          .setTimestamp()
        interaction.guild.members.cache.forEach(member => {
          if (member.id != client.user.id && !member.user.bot) member.send({ embeds: [test2] });
        });
        await interaction.reply({ content: "Successfully sent message!", ephemeral: true })
      } else {
        await interaction.reply({ content: "Done!", ephemeral: true })
      }
    }
    if (commandName === 'modmail') {
      const devs2 = ['877812664053669968', '860344889139920897', '889743434015998004', '551652411769618440', '810336621198835723']
      if (devs2.includes(interaction.user.id)) {
        var apple = await client.users.fetch(interaction.options._hoistedOptions[0].value)
        await apple.send(interaction.options._hoistedOptions[1].value)
        await interaction.reply({ content: "Successfully sent message!", ephemeral: true })
      } else {
        await interaction.reply({ content: "You don't have permission to use this command!", ephemeral: true })
      }
    }
    if (commandName === 'version') {
      if (interaction.options._hoistedOptions[0].value === '1.0') {
        await interaction.reply({ content: "ScratchTools v1.0 was the first version created, and it had a few major bugs. The biggest of them made it completely impossible for the extension to be downloaded, so after release on February 22nd, the developers scrambled to create v1.1 of ScratchTools, which fixed these issues. Many of the original features are still usable now, including a large favorite, message counts on profiles.", ephemeral: true })
      }
      if (interaction.options._hoistedOptions[0].value === '1.1') {
        await interaction.reply({ content: "ScratchTools v1.1 came immediately after v1.0 was released, due to a major bug in v1.0. The bug included a missing file, so the file was removed from the manifest file, and it was no longer marked as missing. No other changes were made to this version, as the only point was to fix the bug.", ephemeral: true })
      }
      if (interaction.options._hoistedOptions[0].value === '1.2') {
        await interaction.reply({ content: "ScratchTools v1.2 added one of the LARGEST features and certainly one of the most popular! With v1.2, project links in profile comments automatically switch to their project titles, while leaving them clickable still.", ephemeral: true })
      }
      if (interaction.options._hoistedOptions[0].value === '1.3') {
        await interaction.reply({ content: "ScratchTools v1.3 fixed some bugs with the profile comments project links feature from v1.2. It made it possible for the project links to switch to their titles on ALL profiles, not just yours.", ephemeral: true })
      }
      if (interaction.options._hoistedOptions[0].value === '1.4') {
        await interaction.reply({ content: "ScratchTools v1.4 added a new feature by ScratchFangs (https://scratch.mit.edu/users/ScratchFangs/), which adds a button to search through all projects on Scratch (including NFE ones).", ephemeral: true })
      }
      if (interaction.options._hoistedOptions[0].value === '1.5') {
        await interaction.reply({ content: "ScratchTools v1.5 was a VERY large release. It made the TurboWarp button show up faster in the editor, and it also hides the useless sprite watermark in the top-right corner of the block editor. We also added a badge on profiles for ScratchTools Bug Bounty users.", ephemeral: true })
      }
      if (interaction.options._hoistedOptions[0].value === '1.6') {
        await interaction.reply({ content: "ScratchTools v1.6, like v1.5, also added a LOT of features! It made it so that you can hover over any project title on profiles to display the full title, not just the shortened one. In the forums, an asterisk (*) now displays next to Scratch Team members' usernames. We also fixed a bug reported by JoePotatoScratch (https://scratch.mit.edu/users/JoePotatoScratch/) to make the statistics button work for users, even when they had long usernames. We also fixed a bug that was causing the TurboWarp button to not display sometimes.", ephemeral: true })
      }
      if (interaction.options._hoistedOptions[0].value === '1.7') {
        await interaction.reply({ content: "ScratchTools v1.7 added some holiday features, and one regular feature. The regular feature is that you can hover over any username in the profile comments to view their bio! We also added a St. Patrick's Day feature and a TOP SECRET April Fool's Day feature.", ephemeral: true })
      }
      if (interaction.options._hoistedOptions[0].value === '1.8') {
        await interaction.reply({ content: "ScratchTools v1.8 created a settings page, so that you can choose which features you want to turn on and off, and the ones that you want to view on Scratch! If you have ScratchTools installed on this device, you can view it by going to https://scratch.mit.edu/ScratchTools/ on a browser that has the extension installed.", ephemeral: true })
      }
      if (interaction.options._hoistedOptions[0].value === '1.9') {
        await interaction.reply({ content: "ScratchTools v1.9 just fixed a major bug that was causing the ScratchTools settings to not display. This was a bug with the storage.", ephemeral: true })
      }
    }
    if (commandName === 'report') {
      if (interaction.options._hoistedOptions[3] !== undefined) {
        var ch = interaction.options._hoistedOptions[3].value
      } else {
        var ch = 'None.'
      }
      if (interaction.options._hoistedOptions[2] !== undefined) {
        var me = interaction.options._hoistedOptions[2].value
      } else {
        var me = 'None.'
      }
      var apple = await client.users.fetch("810336621198835723")
      await apple.send(`Description: ${interaction.options._hoistedOptions[0].value} - User: ${interaction.options._hoistedOptions[1].value} - Message: ${me} - Channel: ${ch} - Reporting User: ${interaction.user.tag}`);
      interaction.reply({ content: "Thank you for the report! Your report is anonymous to everyone except for rgantzos (ScratchTools owner)!", ephemeral: true })
    }

    if (commandName === 'suggest') {
      var exampleEmbed = new MessageEmbed()
        .setColor('BLACK')
        .setTitle(interaction.options._hoistedOptions[0].value)
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
        .setDescription(interaction.options._hoistedOptions[1].value)

      var msg = await client.channels.cache.get("948411171797606401").send({ embeds: [exampleEmbed] });
      msg.react("👍")
      msg.react("👎")
      const threadforsuggest = await msg.startThread({
        name: interaction.options._hoistedOptions[0].value,
        autoArchiveDuration: 60,
        reason: 'Space to talk about suggestion!',
        type: 'GUILD_PRIVATE_THREAD',
      });
      await threadforsuggest.members.add(interaction.user);
      interaction.reply({ content: "Successfully created your suggestion!", ephemeral: true })
    }

    if (commandName === 'bugreport') {
      var exampleEmbed = new MessageEmbed()
        .setColor('BLACK')
        .setTitle(interaction.options._hoistedOptions[0].value)
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
        .setDescription(interaction.options._hoistedOptions[1].value)

      var msg = await client.channels.cache.get("950609986151653438").send({ embeds: [exampleEmbed] });
      msg.react("👍")
      msg.react("👎")
      const bugthread = await msg.startThread({
        name: interaction.options._hoistedOptions[0].value,
        autoArchiveDuration: 60,
        reason: 'Space to talk about bug!',
        type: 'GUILD_PRIVATE_THREAD',
      });
      await bugthread.members.add(interaction.user);
      interaction.reply({ content: "Successfully created your bug report!", ephemeral: true })
    }








    if (commandName === 'suggestion_answer') {
      if (interaction.member.roles.cache.some(role => role.name === 'Developer')) {
        interaction.reply({ content: interaction.options._hoistedOptions[0].value, ephemeral: true })
        var msgId = interaction.options._hoistedOptions[1].value
        var status = interaction.options._hoistedOptions[0].value
        if (status === 'approve') {
          var msg = await client.channels.cache.get("948411171797606401").messages.fetch(msgId)
          var exampleEmbed = new MessageEmbed()
            .setColor('GREEN')
            .setTitle(msg.embeds[0].title)
            .setAuthor(msg.embeds[0].author.name)
            .setDescription(msg.embeds[0].description)
            .setFooter({ text: 'Approved' })
          msg.edit({ embeds: [exampleEmbed] })
        }
        if (status === 'reject') {
          var msg = await client.channels.cache.get("948411171797606401").messages.fetch(msgId)
          var exampleEmbed = new MessageEmbed()
            .setColor('RED')
            .setTitle(msg.embeds[0].title)
            .setAuthor(msg.embeds[0].author.name)
            .setDescription(msg.embeds[0].description)
            .setFooter({ text: 'Rejected' })
          msg.edit({ embeds: [exampleEmbed] })
        }
        if (status === 'implemented') {
          var msg = await client.channels.cache.get("948411171797606401").messages.fetch(msgId)
          var exampleEmbed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle(msg.embeds[0].title)
            .setAuthor(msg.embeds[0].author.name)
            .setDescription(msg.embeds[0].description)
            .setFooter({ text: 'Already Implemented' })
          msg.edit({ embeds: [exampleEmbed] })
        }
        if (status === 'impossible') {
          var msg = await client.channels.cache.get("948411171797606401").messages.fetch(msgId)
          var exampleEmbed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle(msg.embeds[0].title)
            .setAuthor(msg.embeds[0].author.name)
            .setDescription(msg.embeds[0].description)
            .setFooter({ text: 'Impossible/Impractical' })
          msg.edit({ embeds: [exampleEmbed] })
        }
        if (status === 'possible') {
          var msg = await client.channels.cache.get("948411171797606401").messages.fetch(msgId)
          var exampleEmbed = new MessageEmbed()
            .setColor('YELLOW')
            .setTitle(msg.embeds[0].title)
            .setAuthor(msg.embeds[0].author.name)
            .setDescription(msg.embeds[0].description)
            .setFooter({ text: 'Possible' })
          msg.edit({ embeds: [exampleEmbed] })
        }
        if (status === 'completed') {
          var msg = await client.channels.cache.get("948411171797606401").messages.fetch(msgId)
          var exampleEmbed = new MessageEmbed()
            .setColor('GOLD')
            .setTitle(msg.embeds[0].title)
            .setAuthor(msg.embeds[0].author.name)
            .setDescription(msg.embeds[0].description)
            .setFooter({ text: 'Completed' })
          msg.edit({ embeds: [exampleEmbed] })
        }
      } else {
        interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true })
      }
    }

    if (commandName === 'bug_answer') {
      if (interaction.member.roles.cache.some(role => role.name === 'Developer')) {
        interaction.reply({ content: interaction.options._hoistedOptions[0].value, ephemeral: true })
        client.channels.cache.get('945351020530245652').send(`!${interaction.options._hoistedOptions[0].value}bug ${interaction.options._hoistedOptions[1].value}`)
      } else {
        interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true })
      }
    }

    if (commandName === 'echo') {
      interaction.reply({ content: interaction.options._hoistedOptions[0].value, ephemeral: true })
    }
  } else {
    // scratchtools poll
    if (interaction.message.content.includes('Do you have ScratchTools downloaded?')) {
      console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
      var intanswer = interaction.values[0]
      if (intanswer === 'pollyes') {
        await interaction.reply({ content: 'We are glad to hear you have ScratchTools downloaded! Thanks for taking the poll!', ephemeral: true });
      }
      if (intanswer === 'pollno') {
        await interaction.reply({ content: 'You should download ScratchTools! Thanks for taking the poll!', ephemeral: true });
      }
    }

    // scratchtools dev apply
    if (interaction.message.content.includes('Pick a job!')) {
      var intanswer = interaction.values[0]
      if (intanswer === 'brain') {
        await interaction.reply({ content: 'Thanks! We will contact you soon!', ephemeral: true });
        var apple = await client.users.fetch('810336621198835723')
        await apple.send(`${interaction.user.tag} - Brainstorming`)
        interaction.message.delete()
      }
      if (intanswer === 'coding') {
        await interaction.reply({ content: 'Thanks! We will contact you soon!', ephemeral: true });
        var apple = await client.users.fetch('810336621198835723')
        apple.send(`${interaction.user.tag} - Coder`)
        interaction.message.delete()
      }
      if (intanswer === 'pr') {
        await interaction.reply({ content: 'Thanks! We will contact you soon!', ephemeral: true });
        var apple = await client.users.fetch('810336621198835723')
        await apple.send(`${interaction.user.tag} - Press Release`)
        interaction.message.delete()
      }
      if (intanswer === 'artist') {
        await interaction.reply({ content: 'Thanks! We will contact you soon!', ephemeral: true });
        var apple = await client.users.fetch('810336621198835723')
        await apple.send(`${interaction.user.tag} - Artist`)
        interaction.message.delete()
      }
    }
  }
} catch(err) {
  console.log(err)
  await interaction.reply({ content:"Sorry, an error occurred.", ephemeral:true })
}
});


client.on('messageReactionAdd', async (reaction, user) => {
  try {
  var reactionchannel = await client.channels.cache.get(reaction.message.channelId).messages.fetch(reaction.message.id)
  var member = await client.channels.cache.get('953148482737299456').guild.members.fetch(user.id)
  if (reaction.message.id === '954940600036257842') {
    if (reaction._emoji.name === '🧪') {
      var role = reactionchannel.guild.roles.cache.find(r => r.id === "948232783866769409");
      member.roles.add(role)
    }
  }
  if (reaction.message.id === '953149033067720704') {
    if (reaction._emoji.name === '💻') {
      var role = reactionchannel.guild.roles.cache.find(r => r.id === "953149270997995601");
      member.roles.add(role)
    }
  }
  if (reaction.message.id === '953149033067720704') {
    if (reaction._emoji.name === '👾') {
      var role = reactionchannel.guild.roles.cache.find(r => r.id === "953149490217492510");
      member.roles.add(role)
    }
  }
  if (reaction.message.id === '953149033067720704') {
    if (reaction._emoji.name === '😎') {
      var role = reactionchannel.guild.roles.cache.find(r => r.id === "953149386790150154");
      member.roles.add(role)
    }
  }

  if (reaction.message.id === '978769348896358421') {
    console.log(reaction._emoji.name)
    if (reaction._emoji.name === 'scratchtools') {
      var role = reactionchannel.guild.roles.cache.find(r => r.id === "978771891831599145");
      member.roles.add(role)
    }
  }
  if (reaction.message.id === '978769348896358421') {
    if (reaction._emoji.name === '💻') {
      var role = reactionchannel.guild.roles.cache.find(r => r.id === "978771991551180890");
      member.roles.add(role)
    }
  }
  if (reaction.message.id === '978769348896358421') {
    if (reaction._emoji.name === '🐱') {
      var role = reactionchannel.guild.roles.cache.find(r => r.id === "978771942981132368");
      member.roles.add(role)
    }
  }
  if (reaction.message.id === '978769348896358421') {
    if (reaction._emoji.name === '🎲') {
      var role = reactionchannel.guild.roles.cache.find(r => r.id === "978772038154088472");
      member.roles.add(role)
    }
  }
  if (user.id !== '948687053896433714') {
    if (reaction._emoji.name === '🍪') {
      var reactionchannel = await client.channels.cache.get(reaction.message.channelId).messages.fetch(reaction.message.id)
      if (reactionchannel.content === '') {
        //reaction.remove()
      } else {
        await console.log(reactionchannel.author.displayAvatarURL)
        var pig1 = await reactionchannel.reactions.cache.get('🍪')
        var reactioncount = pig1.count

        if (reactioncount > 2) {

          let pigboardc = await client.channels.cache.get("955181553535832145")
          const found = []
          await pigboardc.messages.fetch({ limit: 40 }).then(messages => {
            messages.forEach(function(msg) {
              found.push(msg.id)
              if (msg.embeds[0].footer.text === reactionchannel.id) {
                found.push('Found!')
                var pigboardembed = new MessageEmbed()
                  .setFooter({ text: reactionchannel.id })
                  .setDescription(reactionchannel.content)
                  .setAuthor({ name: reactionchannel.author.username, iconURL: reactionchannel.author.avatarURL() })
                  .setTimestamp(reactionchannel.createdTimestamp)
                  .setColor('#ff78ae')
                var row = new MessageActionRow()
                  .addComponents(
                    new MessageButton()
                      .setURL(reactionchannel.url)
                      .setLabel('Go to Message')
                      .setEmoji('🍪')
                      .setStyle('LINK'),
                  );
                msg.edit({ content: `🍪x${reactioncount} - <@!${reactionchannel.author.id}>`, embeds: [pigboardembed], components: [row], files: reactionchannel.files })
              }
            })
          })
          if (found.includes('Found!')) {

          } else {
            var pigboardembed = new MessageEmbed()
              .setFooter({ text: reactionchannel.id })
              .setDescription(reactionchannel.content)
              .setAuthor({ name: reactionchannel.author.username, iconURL: reactionchannel.author.avatarURL() })
              .setTimestamp(reactionchannel.createdTimestamp)
              .setColor('#ff78ae')
            var row = new MessageActionRow()
              .addComponents(
                new MessageButton()
                  .setLabel('Go to Message')
                  .setEmoji('🍪')
                  .setStyle('LINK')
                  .setURL(reactionchannel.url),
              );
            pigboardc.send({ content: `🍪x${reactioncount} - <@!${reactionchannel.author.id}>`, embeds: [pigboardembed], components: [row] })
          }
          // if (await works === true) {

          //} else {
          //var sendto = client.channels.cache.get('955181553535832145')
          //var items = Array('GREEN', 'RED', 'BLUE', 'ORANGE', 'BLACK', 'WHITE', 'PURPLE', 'YELLOW');
          //  reactionchannel.pin()
          //    var item = items[Math.floor(Math.random()*items.length)];
          //  var test = new MessageEmbed()
          //	.setColor(item)
          //  .setFooter(reactionchannel.id)
          //   .setTitle(`Message by ${reactionchannel.author.username}`)
          //.setDescription(reactionchannel.content)
          //.setAuthor(`🍪x${reactioncount}`)
          //sendto.send({ embeds: [test] });
          //}
        }
      }
    }
  }
} catch(err) {
  console.log(err)
}
});

client.on('messageReactionRemove', async (reaction, user) => {
  try {
  console.log(reaction.message.id)
  var reactionchannel = await client.channels.cache.get(reaction.message.channelId).messages.fetch(reaction.message.id)
  var member = await client.channels.cache.get('953148482737299456').guild.members.fetch(user.id)
  if (reaction.message.id === '978769348896358421') {
    console.log(reaction._emoji.name)
    if (reaction._emoji.name === 'scratchtools') {
      var role = reactionchannel.guild.roles.cache.find(r => r.id === "978771891831599145");
      member.roles.remove(role)
    }
  }
  if (reaction.message.id === '978769348896358421') {
    if (reaction._emoji.name === '💻') {
      var role = reactionchannel.guild.roles.cache.find(r => r.id === "978771991551180890");
      member.roles.remove(role)
    }
  }
  if (reaction.message.id === '978769348896358421') {
    if (reaction._emoji.name === '🐱') {
      var role = reactionchannel.guild.roles.cache.find(r => r.id === "978771942981132368");
      member.roles.remove(role)
    }
  }
  if (reaction.message.id === '978769348896358421') {
    if (reaction._emoji.name === '🎲') {
      var role = reactionchannel.guild.roles.cache.find(r => r.id === "978772038154088472");
      member.roles.remove(role)
    }
  }
  if (user.id !== '948687053896433714') {
    if (reaction._emoji.name === '🍪') {
      var reactionchannel = await client.channels.cache.get(reaction.message.channelId).messages.fetch(reaction.message.id)
      if (reactionchannel.content === '') {
        reaction.remove()
      } else {
        await console.log(reactionchannel.author.displayAvatarURL)
        var pig1 = await reactionchannel.reactions.cache.get('🍪')
        if (pig1 !== undefined) {
          var reactioncount = pig1.count


          let pigboardc = await client.channels.cache.get("955181553535832145")
          const found = []
          await pigboardc.messages.fetch({ limit: 40 }).then(messages => {
            messages.forEach(function(msg) {
              found.push(msg.id)
              if (msg.embeds[0].footer.text === reactionchannel.id) {
                found.push('Found!')
                var pigboardembed = new MessageEmbed()
                  .setFooter({ text: reactionchannel.id })
                  .setDescription(reactionchannel.content)
                  .setAuthor({ name: reactionchannel.author.username, iconURL: reactionchannel.author.avatarURL() })
                  .setTimestamp(reactionchannel.createdTimestamp)
                  .setColor('#ff78ae')
                var row = new MessageActionRow()
                  .addComponents(
                    new MessageButton()
                      .setURL(reactionchannel.url)
                      .setLabel('Go to Message')
                      .setEmoji('🍪')
                      .setStyle('LINK'),
                  );
                msg.edit({ content: `🍪x${reactioncount} - <@!${reactionchannel.author.id}>`, embeds: [pigboardembed], components: [row] })
              }
            })
          })
          if (found.includes('Info!')) {

            // } else {
            var pigboardembed = new MessageEmbed()
              .setFooter({ text: reactionchannel.id })
              .setDescription(reactionchannel.content)
              .setAuthor({ name: reactionchannel.author.username, iconURL: reactionchannel.author.avatarURL() })
              .setTimestamp(reactionchannel.createdTimestamp)
              .setColor('#ff78ae')
            var row = new MessageActionRow()
              .addComponents(
                new MessageButton()
                  .setLabel('Go to Message')
                  .setEmoji('🍪')
                  .setStyle('LINK')
                  .setURL(reactionchannel.url),
              );
            pigboardc.send({ content: `🍪x${reactioncount} - <@!${reactionchannel.author.id}>`, embeds: [pigboardembed], components: [row], files: reactionchannel.files })
          }
          // if (await works === true) {

          //} else {
          //var sendto = client.channels.cache.get('955181553535832145')
          //var items = Array('GREEN', 'RED', 'BLUE', 'ORANGE', 'BLACK', 'WHITE', 'PURPLE', 'YELLOW');
          //  reactionchannel.pin()
          //    var item = items[Math.floor(Math.random()*items.length)];
          //  var test = new MessageEmbed()
          //	.setColor(item)
          //  .setFooter(reactionchannel.id)
          //   .setTitle(`Message by ${reactionchannel.author.username}`)
          //.setDescription(reactionchannel.content)
          //.setAuthor(`🍪x${reactioncount}`)
          //sendto.send({ embeds: [test] });
          //}
        }
      }
    }
  }
} catch(err) {
          console.log(err)
}
});







client.on('messageCreate', async (message) => {
  try {
  if (!message.author.bot) {
    if (message.channel.id !== '973560596454850630') {
      var user = message.author
      var file = "/home/runner/Scatt/dist/userdata/points.json";
      jsonfile.readFile(file, async function(err, obj) {
        if (err) {
          console.log(err);
          client.channels.cache.get('945342441987391549').send(`😭 ${message.author.tag} is experiencing an error!!!` + "`" + err + "`")
        } else {
          if (obj[user.id] === undefined) {
            obj[user.id] = Math.floor(Math.random() * 50) + 50
            jsonfile.writeFile(file, obj)
            function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
            if (isJson(JSON.stringify(obj))) {
            var response = await fetch(`https://tools.scratchstatus.org/databackup/${JSON.stringify(obj)}/`)
            }
            try {
            var data = await response.json()
            console.log(data['status'])
            }
            catch(err) {
              console.log(err)
            }
          } else {
            obj[user.id] = parseInt(obj[user.id]) + (Math.floor(Math.random() * 50) + 50)
            jsonfile.writeFile(file, obj)
            function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
            if (isJson(JSON.stringify(obj))) {
            var response = await fetch(`https://tools.scratchstatus.org/databackup/${JSON.stringify(obj)}/`)
            }
            try {
            var data = await response.json()
            console.log(data['status'])
            }
            catch(err) {
              console.log(err)
            }
          }
          console.log(obj[user.id])
        }
      })
    }
  }
  //bookmark2
  if (message.content === '!leaderboard') {
    const file = "/home/runner/Scatt/dist/userdata/points.json";
    jsonfile.readFile(file, function(err, obj) {
      if (err) {
        console.log(err);
        client.channels.cache.get('945342441987391549').send(`😭 ${message.author.tag} is experiencing an error!!!` + "`" + err + "`")
      } else {
        var allUsers = []
        var allValues = []
        var orderedUsers = []
        var orderedValues = []
        Object.keys(obj).forEach(function(user) {
          allUsers.push(user)
          allValues.push(obj[user])
        })
        order()
        function order() {
          while (allUsers.length !== 0) {
            var top = []
            top.push(allUsers[0])
            allUsers.forEach(function(el) {
              if (allValues[allUsers.indexOf(el)] > allValues[allUsers.indexOf(top[top.length - 1])]) {
                top.push(el)
              }
            })
            orderedUsers.push(top[top.length - 1])
            orderedValues.push(allValues[allUsers.indexOf(top[top.length - 1])])
            allValues.splice(allUsers.indexOf(top[top.length - 1]), 1)
            allUsers.splice(allUsers.indexOf(top[top.length - 1]), 1)
          }
          console.log(orderedUsers)
          console.log(orderedValues)
          var leaderboard = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('XP Leaderboard')
            .setAuthor({ name: 'ScratchTools Server' })
            .setDescription('You can earn XP by being active in the server and talking in channels! With XP, you can get special roles and work your way up in the server!')
          orderedUsers.forEach(async function(el) {
            var amount = orderedValues[orderedUsers.indexOf(el)]
            if (orderedUsers.indexOf(el) + 1 === 1) {
              leaderboard.addField(`🥇 #${orderedUsers.indexOf(el) + 1}`, `<@${el}>: ${amount} XP`)
            } else {
              if (orderedUsers.indexOf(el) + 1 === 2) {
                leaderboard.addField(`🥈 #${orderedUsers.indexOf(el) + 1}`, `<@${el}>: ${amount} XP`)
              } else {
                if (orderedUsers.indexOf(el) + 1 === 3) {
                  leaderboard.addField(`🥉 #${orderedUsers.indexOf(el) + 1}`, `<@${el}>: ${amount} XP`)
                } else {
                  leaderboard.addField(`#${orderedUsers.indexOf(el) + 1}`, `<@${el}>: ${amount} XP`)
                }
              }
            }
          })
          message.reply({ embeds: [leaderboard] })
        }
      }
    })

  }


  var msg = message
  if (msg.interaction !== null) {
    if (msg.interaction.commandName === 'bump') {
      var file = '/home/runner/Scatt/dist/userdata/points.json'
      jsonfile.readFile(file, function(err, obj) {
        if (err) {
          console.log(err);
          client.channels.cache.get('945342441987391549').send(`😭 ${message.author.tag} is experiencing an error!!!` + "`" + err + "`")
        } else {
          if (obj[msg.interaction.user.id] === undefined) {
            obj[msg.interaction.user.id] = 1000
            jsonfile.writeFile(file, obj)
          } else {
            obj[msg.interaction.user.id] = parseInt(parseInt(obj[msg.interaction.user.id]) + parseInt(1000))
            jsonfile.writeFile(file, obj)
          }
          msg.channel.send(`Thanks for bumping the server <@${msg.interaction.user.id}>! I just gave you 1000 XP!`)
        }
      })
    }
  }
  if (message.channel.id === '954823644415135826') {
    if (message.author.id !== '948687053896433714') {
    if (message.content.includes('<@')) {
      if (message.content.split('<@')[1].includes('>')) {

        var user = await client.users.fetch(message.content.split('<@')[1].split('>')[0])
        if (user !== undefined) {
          var modmailchannel = await client.channels.cache.get('954823644415135826')
          var modmailmessage = await modmailchannel.send({ content: 'Modmail to ' + user.tag + '!' })
          var modmail = await modmailmessage.startThread({
            name: message.content.split('<@')[1].split('>')[0],
            autoArchiveDuration: 4320,
            reason: 'Needed a modmail thread.',
          });
          var modmail = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Modmail Opened')
            .setDescription('A member of our mod team opened up a new modmail conversation with you.')
            .setTimestamp()
            .setFooter({ text: `We hope you can talk to us!` });
          await user.send({ embeds: [modmail] })
        }
      }
    }
  }
  }

  if (message.channel.id === '975847150737063990') {
    message.author.send("Sorry, but we need to protect my data, so I deleted your message.")
    message.delete()
  }
  if (message.channel.id === '945352412779126885') {
    function isNumeric(str) {
      if (typeof str != "string") return false // we only process strings!  
      return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }
    // var lastMessage = await client.channels.cache.get('975847150737063990').messages.fetch('975851453337964616')

    var file2 = '/home/runner/Scatt/dist/userdata/counting.json'
    var data = []
    jsonfile.readFile(file2, function(err, obj) {
      if (err) {
        console.log(err)
      } else {
        data.push(obj['user'])
        data.push(obj['number'])
        console.log(data)









        if (isNumeric(message.content)) {
          if (data[0] !== message.author.id) {
            if (Number(message.content) === Number(data[1]) + 1) {
              message.react('✅')
              obj['user'] = message.author.id
              obj['number'] = Number(data[1]) + 1
              jsonfile.writeFile(file2, { "user": message.author.id, "number": Number(data[1]) + 1 })
            } else {
              message.reply(`Oh no! <@${message.author.id}> ruined it at ${data[1]}! We're starting back at 0!`)
              message.react('❌')
              jsonfile.writeFile(file2, { "user": "0", "number": 0 })
            }
          } else {
            message.reply(`Oh no! <@${message.author.id}> ruined it at ${data[1]} by going twice in a row! We're starting back at 0!`)
            message.react('❌')
            jsonfile.writeFile(file2, { "user": "0", "number": 0 })
          }
        }
      }
    })
  }
  if (message.author.id !== '948687053896433714') {

    if (message.content.includes('!wasteof status')) {
      if (message.author.id === '810336621198835723') {
        const pass = process.env['wasteofpass']

        let wasteof = new WasteOfSession("ScratchTools", pass)
        wasteof.login()
          .then(async function() {
            wasteof.setBio(message.content.split('!wasteof status ')[1])
          })
        message.reply('Set!')
      } else {
        message.reply('You do not have permission to do this.')
      }
    }
    if (message.content.includes('!wasteof post')) {

      if (message.author.id === '810336621198835723') {
        const pass = process.env['wasteofpass']

        let wasteof = new WasteOfSession("ScratchTools", pass)
        wasteof.login()
          .then(async function() {
            wasteof.post(message.content.split('!wasteof post ')[1], null)
          })
        message.reply('Posted!')
      } else {
        message.reply('You do not have permission to do this.')
      }
    }

    if (message.author === '302050872383242240') {
      if (message.embeds[0] !== null) {
        if (message.embeds[0].title === 'DISBOARD: The Public Server List') {
          message.channel.send('Thanks for bumping!! People who bump the server a lot get a special role!')
        }
      }
    }
    if (message.channel.id === '954823644415135826') {
      var threads = client.channels.cache.get('954823644415135826').threads
      console.log(threads)
    }
    if (message.channel.type === 'GUILD_PUBLIC_THREAD') {
      try {
      if (message.channel.parentId === '954823644415135826') {
        if (message.author.id !== '948687053896433714') {
          if (message.content.toLowerCase() === '!close') {
            var modmail = new MessageEmbed()
              .setColor('#0099ff')
              .setTitle('Modmail Closed')
              .setDescription('New modmail will be opened in a different conversation. This one is closed.')
              .setTimestamp()
              .setFooter({ text: `Thanks for talking with us!` });
            await message.channel.send({ embeds: [modmail] })
            var modder = await client.users.fetch(message.channel.name)
            if (await client.users.fetch(message.channel.name) === undefined) {
              await message.reply('This modmail has been archived.')
              await message.react('❌')
            } else {
              await modder.send({ embeds: [modmail] })
              await message.channel.setName(modder.tag)
              await message.channel.setArchived(true)
            }
          } else {
            console.log(message.content)
            if (message.content !== '') {
              console.log(message.channel.name)
              if (await client.users.fetch(message.channel.name) === undefined) {
                await message.reply('This modmail has been archived.')
                await message.react('❌')
              } else {
                var modmailsend = await client.users.fetch(message.channel.name)
                var modmailsent = await modmailsend.send('`' + message.author.tag + '` ' + message.content)
                await message.react('📪')
              }
            }
          }
        }
      }
      } catch(err) {
        await message.react('❌')
        await message.channel.setArchived(true)
      }
    }
  }
  if (message.channel !== null) {
    if (message.channel.type === 'DM') {
      if (message.content !== null) {
        if (message.content.toLowerCase().includes('lacitirc')) {
          message.reply("Oh- you're trying to solve the riddle. I'm glad to know you're on my side. We must act fast, or else all the cookies will be destroyed. Find the word right before 'critical' in my bio. That's the word to lock my data from attackers. That's your final guess.")
        }
        if (message.author.id !== '948687053896433714') {
          var theembedthread = await client.channels.cache.get("954823644415135826").threads.cache.find(x => x.name === message.author.id);
          if (theembedthread === undefined) {
            if (message.content !== '') {
              var modmail = new MessageEmbed()
                .setAuthor(message.author.tag)
                .setColor('#0099ff')
                .setTitle('**Alert**')
                .setDescription('You sent a DM to ScratchTools. Are you sure that you like to forward this message to ScratchTools admin?')
                .setTimestamp()
                .setFooter({ text: `Content: ${message.content}` });

              var modmailrow = new MessageActionRow()
                .addComponents(
                  new MessageButton()
                    .setCustomId('primary')
                    .setLabel('Confirm')
                    .setStyle('PRIMARY'),
                  new MessageButton()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle('SECONDARY')
                );

              var stuff = await message.reply({ embeds: [modmail], components: [modmailrow] });
            } else {
              message.reply("Sorry, but we only support normal messages at the moment.")
              message.react('❌')
            }
          } else {
            if (message.content !== '') {
              var repyto = message
              await repyto.react('📪')
              var theembedthread = await client.channels.cache.get("954823644415135826").threads.cache.find(x => x.name === message.author.id);
              await theembedthread.send("`" + message.author.tag + "` " + message.content)
            } else {
              message.react('❌')
            }
          }
        }
      }
    } else {
      //  if (message.channel.id === '945352412779126885') {
      //      var current2 = await client.channels.cache.get('955145228128514149').messages.fetch({ limit: 1 }).lastMessage
      //        var current = await current2.content
      //    var next = await parseInt(current) + 1
      //    console.log(next)
      //    if (next === parseInt(message.content.split(' ')[0])) {
      //      message.react('✅')
      //      await client.channels.cache.get('955145228128514149').send(message.content.split(' ')[0])
      //    } else {
      //      message.react('❎')
      //      await client.channels.cache.get('955145228128514149').send('0')
      //    }
      //  }

      if (message.channel.id === '955168139065323520') {
        if (message.content.includes('<#')) {
          if (message.content.includes('>')) {
            var channelid = message.content.split('<#')[1].split('>')[0]
            if (channelid === '975847150737063990') {
              message.reply("This channel can't do that.")
            } else {
              const speakthread = await message.startThread({
                name: channelid,
                autoArchiveDuration: 60,
                reason: 'Way to talk using ScratchTools bot!',
                type: "GUILD_PRIVATE_THREAD"
              });
              await speakthread.members.add(message.author);
            }
          }
        }
      }
      if (message.channel.type === 'GUILD_PUBLIC_THREAD') {
        console.log('done')
        if (message.channel.parentId === '955168139065323520') {
          console.log(message.content)
          await message.content
          var channeltosend = await client.channels.cache.get(message.channel.name)
          if (message.content !== '') {
            await channeltosend.send(message.content)
          }
        }
      }
      if (message.author.id === '810336621198835723') {
        if (message.channel.id === '945342505262673980') {
          if (message.content.includes('📌 ')) {
            const athread = await message.startThread({
              name: message.content.split('📌 ')[1],
              autoArchiveDuration: 60,
              reason: 'Space to talk about announcement!',
              type: 'GUILD_PUBLIC_THREAD',
            });
            var msg = message.pin()
          }
        } else {
          if (message.channel.id === '949838386275954698') {
            if (message.content.includes('📌 ')) {
              const athread = await message.startThread({
                name: message.content.split('📌 ')[1],
                autoArchiveDuration: 60,
                reason: 'Space to talk about announcement!',
                type: 'GUILD_PUBLIC_THREAD',
              });
              var msg = message.pin()
            }
          } else {
            if (message.channel.id === '954883336524927006') {
              if (message.content.includes('📌 ')) {
                const athread = await message.startThread({
                  name: message.content.split('📌 ')[1],
                  autoArchiveDuration: 60,
                  reason: 'Space to talk about announcement!',
                  type: 'GUILD_PUBLIC_THREAD',
                });
                var msg = message.pin()
              }
            }
          }
        }
      }
      var wills = ['will smith', 'slap', 'jada', 'chris rock']
      wills.forEach(function(will) {
        if (message.content !== undefined) {
          if (message.content.toLowerCase().includes(will)) {
            message.react('<:willsmith:961471496298057868>')
          }
        }
      })

      function auto(list, emoji) {
        list.forEach(function(item) {
          if (message.content !== undefined) {
            if (message.content.toLowerCase().includes(item)) {
              message.react(emoji)
            }
          }
        })
      }

      auto(['948687053896433714', 'scatt'], '❤️')

      if (message.content.toLowerCase().includes('scratchtools')) {
        message.react('<:st:954926294691373099>')
      } else {
        if (message.content.toLowerCase().includes('scratch tools')) {
          message.react('<:st:954926294691373099>')
        }
      }
      if (message.content.toLowerCase().includes('sus')) {
        message.react('<:sus:954927401316520009>')
      }
      if (message.content.toLowerCase().includes('among us')) {
        message.react('<:sus:954927401316520009>')
      }
      if (message.content.toLowerCase().includes('amongus')) {
        message.react('<:sus:954927401316520009>')
      }
      if (message.content.toLowerCase().includes('amogus')) {
        message.react('<:sus:954927401316520009>')
      }
      if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).split(' ');
        const command = args.shift();
        switch (command) {

          

          //case 'wasteofconnect':
            //var response = await fetch('https://wasteof.auth.gantzos.com/generate/')
            //var data = await response.json()
 //           message.react('✅')
   //         const verify = new MessageActionRow()
     //         .addComponents(
       //         new MessageButton()
         //         .setCustomId('wasteof ' + data['code'])
           //       .setLabel('Done')
             //     .setEmoji('✅')
               //   .setStyle('PRIMARY'),
 //             );
   //         message.author.send({ content: `Please verify here: ${data['url']}?redirect=https://tools.scratchstatus.org`, components: [verify] })
     //       break;

          case 'aboutme':
            if (message.content.includes('!aboutme ')) {
              if (message.content.split('!aboutme ').length > 1) {
                const file = "/home/runner/Scatt/dist/userdata/about.json";
                jsonfile.readFile(file, function(err, obj) {
                  if (err) {
                    console.log(err);
                    client.channels.cache.get('945342441987391549').send(`😭 ${message.author.tag} is experiencing an error!!!` + "`" + err + "`")
                  } else {
                    if (message.member.roles.cache.some(role => role.name === 'Friends of Gobo')) {
                      obj[message.author.id] = message.content.split('!aboutme ')[1]
                      jsonfile.writeFile(file, obj)
                      message.reply("Successfully set about me!")
                    } else {
                      message.reply("Sorry, but you must have the `Friends of Gobo` role for this command.")
                    }
                  }
                })
              } else {
                message.reply("Format: `!aboutme <status>`")
              }
            } else {
              message.reply("Format: `!aboutme <status>`")
            }
            break;

          case 'fbi':
            if (message.content.split('!fbi').length > 1) {
              var funny = message.content.split('!fbi')[1].toString()
              async function textOverlay(joke) {
                // Reading image
                const image = await Jimp.read('/home/runner/Scatt/dist/images/fbi.png');
                // Defining the text font
                const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
                image.print(font, 50, 450, joke);
                // Writing image after processing
                await image.writeAsync('/home/runner/Scatt/dist/images/edited.png');
                message.reply({ files: ['/home/runner/Scatt/dist/images/edited.png'] })
              }

              textOverlay(funny);
              console.log("Image is processed succesfully");
            } else {
              message.reply("Format: `!fbi <text>`")
            }
            break;

          case 'scatt':
            if (message.member.roles.cache.some(role => role.name === 'Admin')) {
              try {
                var status = message.content.split(' ')
                status.shift()
                status.shift()
                client.user.setActivity(status.join(' '), { type: message.content.split(' ')[2].toUpperCase() })
              }
              catch (err) {
                message.reply("Error. You must use `!scatt [type] [message]`. Your type options are playing, streaming, listening, watching, and competing.")
                console.log(err)
              }
            } else {
              message.reply("Only admins can do this.")
            }
            break;

          case 'addxp':
            if (message.member.roles.cache.some(role => role.name === 'Admin' || message.member.roles.cache.some(role => role.name === 'Moderator'))) {
              if (message.content.includes('!addxp ')) {
                if (message.content.split('!addxp ')[1].includes(' ')) {
                  if (await client.users.fetch(message.content.split('!addxp ')[1].split(' ')[0].replaceAll('<', '').replaceAll('>', '').replaceAll('@', '')) !== undefined) {
                    var user = await client.users.fetch(message.content.split('!addxp ')[1].split(' ')[0].replaceAll('<', '').replaceAll('>', '').replaceAll('@', ''))
                    if (!user.bot) {
                      function isNumeric(val) {
                        return /^-?\d+$/.test(val);
                      }
                      if (isNumeric(message.content.split(' ')[2])) {
                        const file = "/home/runner/Scatt/dist/userdata/points.json";
                        jsonfile.readFile(file, async function(err, obj) {
                          if (err) {
                            console.log(err);
                            client.channels.cache.get('945342441987391549').send(`😭 ${message.author.tag} is experiencing an error!!!` + "`" + err + "`")
                          } else {
                            if (obj[user.id] === undefined) {
                              obj[user.id] = parseInt(parseInt(message.content.split(' ')[2]))
                              jsonfile.writeFile(file, obj)
                            } else {
                              obj[user.id] = parseInt(parseInt(obj[user.id]) + parseInt(message.content.split(' ')[2]))
                              jsonfile.writeFile(file, obj)
                            }
                            console.log(obj[user.id])
                            message.reply(`Gave ${message.content.split(' ')[2]} XP to ${user.tag}. Now they have ${obj[user.id]}.`)
                            var rgantzos = await client.users.fetch('810336621198835723')
                            await rgantzos.send(`<@${message.author.id}> just gave ${message.content.split(' ')[2]} XP to <@${user.id}>!`)
                          }
                        })
                      } else {
                        message.reply("XP must be a valid number.")
                      }
                    } else {
                      message.reply("User must not be a bot.")
                    }
                  } else {
                    message.reply("Invalid user.")
                  }
                } else {
                  message.reply("Must be formatted as `!addxp <user> <amount>`")
                }
              } else {
                message.reply("Must be formatted as `!addxp <user> <amount>`")
              }
            } else {
              message.reply("Only admin and moderators can perform this command.")
            }
            break;

          case 'removewarn':
            message.reply("This is a WIP.")
            if (WIP !== undefined) {
              var user = message.content.split('!removewarn ')[1].split(' ')[0]
              var warning = message.content.split(user + ' ')[1]
              const file = "/home/runner/Scatt/dist/userdata/warns.json";
              jsonfile.readFile(file, function(err, obj) {
                if (err) {
                  console.log(err);
                  client.channels.cache.get('945342441987391549').send(`😭 ${message.author.tag} is experiencing an error!!!` + "`" + err + "`")
                } else {
                  delete obj[user][warning - 1]
                  jsonfile.writeFile(file, obj)
                  var exampleEmbed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`Warnings`)
                    .setDescription('ALL of their warnings.')
                  Object.keys(obj).forEach(function(users) {
                    console.log('me')
                    if (users === user) {
                      console.log('2')
                      Object.keys(obj[users]).forEach(function(item, i) {
                        exampleEmbed.addField(`Warning #${i + 1}`, obj[users][item]['reason'])
                      })
                    }
                  })
                  message.reply({ embeds: [exampleEmbed] })
                }
              })
            }
            break;

          case 'warnings':
            if (message.member.roles.cache.some(role => role.name === 'Admin' || message.member.roles.cache.some(role => role.name === 'Moderator'))) {
              console.log('try')
              if (message.content.includes('!warnings ')) {
                if (message.content.includes('<@')) {
                  if (message.content.split('<@')[1].includes('>')) {
                    var user = message.content.split('!warnings ')[1].split('<@')[1].split('>')[0]
                  } else {
                    var user = message.content.split('!warnings ')[1]
                  }
                } else {
                  console.log('yes')
                  var user = message.content.split('!warnings ')[1]
                }
                const file = "/home/runner/Scatt/dist/userdata/warns.json";
                jsonfile.readFile(file, function(err, obj) {
                  if (err) {
                    console.log(err);
                    client.channels.cache.get('945342441987391549').send(`😭 ${message.author.tag} is experiencing an error!!!` + "`" + err + "`")
                  }
                  else {
                    function countObjectKeys(obje) {
                      return Object.keys(obje).length;
                    }
                    var exampleEmbed = new MessageEmbed()
                      .setColor('#0099ff')
                      .setTitle(`Warnings`)
                      .setDescription('ALL of their warnings.')
                    Object.keys(obj).forEach(function(users) {
                      console.log('me')
                      if (users === user) {
                        console.log('2')
                        Object.keys(obj[users]).forEach(function(item, i) {
                          exampleEmbed.addField(`Warning #${i + 1}`, obj[users][item]['reason'])
                        })
                      }
                    })
                    message.reply({ embeds: [exampleEmbed] })
                  }
                })
              } else {
                message.reply("Sorry, but you must put the ID of an actual user.")
              }
            } else {
              message.reply("Sorry, only admin and moderators can use this command.")
            }
            break;

          case 'resetc':
            db.set("counting", "1").then(() => { });
            break;

          case 'botspeak':
            var thechannel = await client.channels.cache.get(args.join(' ').split('<#')[1].split('>')[0])
            var themessage = args.join(' ').split(' ')[1]
            thechannel.send(themessage)
            break;

          case 'pin':
            if (message.author.id === '810336621198835723') {
              var length = message.content.split(" ").length - 1
              if (message.content.includes('anonymous')) {
                if (length === 3) {
                  var msg = await client.channels.cache.get(args.join(' ').split('<#')[1].split('>')[0]).messages.fetch(args.join(' ').split(' ')[1].split(' ')[0])
                } else {
                  var msg = await client.channels.cache.get(message.channel.id).messages.fetch(message.content.split(' ')[1].split(' ')[0])
                }

                var items = Array('GREEN', 'RED', 'BLUE', 'ORANGE', 'BLACK', 'WHITE', 'PURPLE', 'YELLOW');
                var item = items[Math.floor(Math.random() * items.length)];
                var exampleEmbed = new MessageEmbed()
                  .setColor(item)
                  .setTitle(msg.content)
                  .setAuthor({ name: `Message by ${msg.author.username}` })
                client.channels.cache.get("954811863433097327").send({ embeds: [exampleEmbed] });
              } else {
                if (length === 2) {
                  var msg = await client.channels.cache.get(args.join(' ').split('<#')[1].split('>')[0]).messages.fetch(args.join(' ').split(' ')[1].split(' ')[0])
                } else {
                  var msg = await client.channels.cache.get(message.channel.id).messages.fetch(message.content.split(' ')[1])
                }

                var items = Array('GREEN', 'RED', 'BLUE', 'ORANGE', 'BLACK', 'WHITE', 'PURPLE', 'YELLOW');
                var item = items[Math.floor(Math.random() * items.length)];
                console.log(item)
                var exampleEmbed = new MessageEmbed()
                  .setColor(item)
                  .setTitle(msg.content)
                  .setAuthor({ name: `Message by ${msg.author.username}` })
                  .setFooter({ "text": ` Pinned By ${message.author.username}` })
                client.channels.cache.get("954811863433097327").send({ embeds: [exampleEmbed] });

              }
            }
            break;

          case 'button':
            const row3 = new MessageActionRow()
              .addComponents(
                new MessageButton()
                  .setCustomId('primary')
                  .setLabel('Verify')
                  .setEmoji('✅')
                  .setStyle('PRIMARY'),
              );

            await message.channel.send({ content: 'Hit the button to verify!', components: [row3] });
            break;

          case 'reactionroles':
            var rr = new MessageEmbed()
              .setTitle(`Ping Roles`)
              .setDescription("Grab some ping roles, so that you only get pinged for what matters!")
              .setAuthor({ name: 'ScratchTools' })
              .setTimestamp()
              .setColor('RED')
            var row23 = new MessageActionRow()
              .addComponents(
                new MessageSelectMenu()
                  .setCustomId('ping')
                  .setPlaceholder('Select a level.')
                  .addOptions([
                    {
                      label: 'Priority',
                      description: 'You will only get the somewhat important announcements.',
                      value: 'priority',
                    },
                    {
                      label: 'Basic',
                      description: 'You will get all normal announcements.',
                      value: 'basic',
                    },
                  ]),
              );
            message.channel.send({ components: [row23], embeds: [rr] })

          case 'poll':
            const row = new MessageActionRow()
              .addComponents(
                new MessageSelectMenu()
                  .setCustomId('select')
                  .setPlaceholder('Nothing selected')
                  .addOptions([
                    {
                      label: 'Yes',
                      description: 'I do have ScratchTools downloaded.',
                      value: 'pollyes',
                    },
                    {
                      label: 'No',
                      description: 'I do not have ScratchTools downloaded.',
                      value: 'pollno',
                    },
                  ]),
              );

            await message.reply({ content: 'Do you have ScratchTools downloaded?', components: [row] });
            break;

          case 'apply':
            const row2 = new MessageActionRow()
              .addComponents(
                new MessageSelectMenu()
                  .setCustomId('select')
                  .setPlaceholder('Nothing selected')
                  .addOptions([
                    {
                      label: 'Brainstorming',
                      description: 'Comes up with a lot if ideas for new features.',
                      value: 'brain',
                    },
                    {
                      label: 'Press Release',
                      description: 'Makes ScratchTools popular and spreads the word.',
                      value: 'pr',
                    },
                    {
                      label: 'Coder',
                      description: 'Codes the ScratchTools features.',
                      value: 'coding',
                    },
                    {
                      label: 'Artist',
                      description: 'Design the branding for ScratchTools.',
                      value: 'artist',
                    },
                  ]),
              );

            await message.reply({ content: 'Pick a job!', components: [row2], ephemeral: true });
            break;

          case 'suggest':
            if (1 === 2) {
              var exampleEmbed = new MessageEmbed()
                .setColor('BLACK')
                .setTitle(`Suggestion from ${message.author.username}`)
                .setAuthor({ name: message.author.username })
                .setDescription(args.join(' '))

              var msg = await client.channels.cache.get("948411171797606401").send({ embeds: [exampleEmbed] });
              msg.react("👍")
              msg.react("👎")
              const thread = await msg.startThread({
                name: `Suggestion from ${message.author.username}`,
                autoArchiveDuration: 60,
                reason: 'Space to talk about suggestion!',
                type: 'GUILD_PRIVATE_THREAD',
              });
              await thread.members.add(message.author);
            } else {
              message.reply({ content: "This method of suggesting is deprecated. Please use `/suggest` instead." })
            }
            break;

          case 'qotd':
            client.channels.cache.get("945348685963866123").send(args.join(' '))
            break;

          case 'count':
            var userCount = message.guild.memberCount
            var response = await fetch('https://tools.scratchstatus.org/users')
            var data = await response.text()
            message.reply(`ScratchTools has ${data} users. ScratchTools has ${userCount} members in this server.`)
            break;

          case 'bug':
            if (1 === 2) {
              var exampleEmbed = new MessageEmbed()
                .setColor('BLACK')
                .setTitle(`Suggestion from ${message.author.username}`)
                .setAuthor({ name: message.author.username })
                .setDescription(args.join(' '))

              var msg = await client.channels.cache.get("950609986151653438").send({ embeds: [exampleEmbed] });
              msg.react("👍")
              msg.react("👎")
              const thread2 = await msg.startThread({
                name: `Bug Report from ${message.author.username}`,
                autoArchiveDuration: 60,
                reason: 'Space to talk about bug!',
                type: 'GUILD_PRIVATE_THREAD',
              });
              await thread2.members.add(message.author);
            } else {
              message.reply({ content: "This method of reporting bugs is deprecated. Please use `/bugreport` instead." })
            }
            break;

          case 'approvebug':
            var msg = await client.channels.cache.get("950609986151653438").messages.fetch(args.join(' '))
            var exampleEmbed = new MessageEmbed()
              .setColor('GREEN')
              .setTitle(msg.embeds[0].title)
              .setAuthor(msg.embeds[0].author.name)
              .setDescription(msg.embeds[0].description)
              .setFooter({ text: 'Approved!' })
            msg.edit({ embeds: [exampleEmbed] })
            break;

          case 'rejectbug':
            var msg = await client.channels.cache.get("950609986151653438").messages.fetch(args.join(' '))
            var exampleEmbed = new MessageEmbed()
              .setColor('RED')
              .setTitle(msg.embeds[0].title)
              .setAuthor(msg.embeds[0].author.name)
              .setDescription(msg.embeds[0].description)
              .setFooter({ text: 'Rejected!' })
            msg.edit({ embeds: [exampleEmbed] })
            break;

          case 'impossiblebug':
            var msg = await client.channels.cache.get("950609986151653438").messages.fetch(args.join(' '))
            var exampleEmbed = new MessageEmbed()
              .setColor('PURPLE')
              .setTitle(msg.embeds[0].title)
              .setAuthor(msg.embeds[0].author.name)
              .setDescription(msg.embeds[0].description)
              .setFooter({ text: 'Impossible!' })
            msg.edit({ embeds: [exampleEmbed] })
            break;

          case 'fixedbug':
            var msg = await client.channels.cache.get("950609986151653438").messages.fetch(args.join(' '))
            var exampleEmbed = new MessageEmbed()
              .setColor('GOLD')
              .setTitle(msg.embeds[0].title)
              .setAuthor(msg.embeds[0].author.name)
              .setDescription(msg.embeds[0].description)
              .setFooter({ text: 'Fixed!' })
            msg.edit({ embeds: [exampleEmbed] })
            break;

          case 'embed':
            var channel = message.content.split('embed-channel: ')[1].split('embed-title')[0]
            var color = message.content.split('embed-color: ')[1]
            var title = message.content.split('embed-title: ')[1].split('embed-description: ')[0]
            var description = message.content.split('embed-description: ')[1].split('embed-color: ')[0]
            var exampleEmbed = new MessageEmbed()
              .setColor(color)
              .setTitle(title)
              .setDescription(description)

            var msg = await client.channels.cache.get(channel).send({ embeds: [exampleEmbed] });
            message.reply({ embeds: [exampleEmbed] });
            break;

          case 'modsend':
            var user = await client.users.fetch(message.content.split('id: ')[1].split(' content: ')[0]);
            var content = message.content.split(' content: ')[1];
            var exampleEmbed = new MessageEmbed()
              .setColor('ORANGE')
              .setTitle('Message from ScratchTools')
              .setDescription(content)
            user.send({ embeds: [exampleEmbed] });
            message.reply({ embeds: [exampleEmbed] });
            break;

          case 'repeat':
            if (args.length > 0)
              await message.channel.send(args.join(' '));
            else
              await message.reply('You did not send a message to repeat, cancelling command.');
            break;
          case 'help':
            const embed = (0, commands_1.default)(message);
            embed.setThumbnail(client.user.avatarURL());
            await message.author.send({ embeds: [embed] });
            break;

          case 'modhelp':
            if (message.author.id === '810336621198835723') {
              message.author.send('!pin <channel> <message id> (pins a message to the pinboard), <include 📌 <thread title> to pin a message in an announcements channel and create a thread for it>, !approve, !possible, !reject, !impossible, !implemented, -approvebug, !rejectbug, !impossiblebug, !apply, !embed embed-title: <title>embed-description: <description>embed-color:<color>, !modsend id: <user id> content: <content>, !repeat <say>, !qotd <message>, !botspeak <channel> <message>')
            }
        }
      }
    }
  }
} catch(err) {
  console.log(err)
await message.reply("An error occurred.")
}
});

function randomQuestion() {
  var questions = [
    "This is a modal window.",
    "Beginning of dialog window. Escape will cancel and close the window.",
    "End of dialog window.",
    "No matter the occasion, these fun questions to ask can help you connect better with your friends and other people you meet. You could even use one in a social media post to engage with your followers. You might learn something new about someone simply by asking one of these questions. Feel free to check out the full list of fun questions below!",
    "What is your favorite sleeping position of all time?",
    "What is the dumbest way you’ve been hurt?",
    "What are the three scents you like?",
    "What sport will be invented next?",
    "What’s your favorite board game?",
    "Would you rather have intelligence over looks?",
    "What’s your most embarrassing moment in grade school?",
    "Have you ever thrown someone an extravagant party?",
    "What is the weirdest thing you have ever eaten?",
    "Out of the four seasons, what’s your favorite one?",
    "What is the most absurd thing you’ve been tricked into doing or believing?",
    "What is something that’s true that nobody agrees with you on?",
    "Which instrument has the funniest sound?",
    "Where would you relocate if you were forced to leave the country?",
    "Do you care about what other people tell you?",
    "If you could meet anyone in this world today, who would you meet?",
    "What’s the best type of cheese for you?",
    "What is the greatest risk you have ever taken?",
    "Have you ever thought of what your future baby will be named?",
    "What are those things you’re too old to do but you still enjoy?",
    "What are your pet peeves?",
    "Who’s the messiest person you’ve ever known?",
    "Which of the two smells better, fresh-cut grass or bread baking in the oven?",
    "Who is your all-time favorite Disney character?",
    "Are you afraid of ghosts?",
    "Can you carry an elephant?",
    "What’s the worst color that was ever invented?",
    "What is the weirdest text you have ever received recently?",
    "What is one ability that you believe everybody should possess?",
    "How many times has your heart been broken?",
    "What is the first thing you do after getting home from a trip?",
    "What are the things you’d spend with a billion dollars?",
    "What are the songs that make you sing along whenever you hear it?",
    "How did your parents meet?",
    "What has been your greatest kitchen mistake?",
    "What’s the craziest bet you have ever made?",
    "Do you believe that love is blind?",
    "Who would you want to trade lives with?",
    "If you were given the chance to steal something, what would it be?",
    "What type of cuisine would you serve your customers if you own a five-star restaurant?",
    "What’s the fanciest event you’ve ever attended?",
    "Who is your greatest enemy?",
    "What food should taste better than its appearance?",
    "What’s the first thing you pack during an out of the country flight?",
    "Do you actively post on social media?",
    "If you could only teach three things to your future child, what would it be?",
    "What is the worst TV advertisement you’ve seen recently?",
    "What’s the most addictive game for you?",
    "What do you usually do during weekends?",
    "If you were given the chance to make your one wish come true, what would it be?",
    "What period would you travel to if you were given a time machine?",
    "What’s the food you usually refuse to share?",
    "What are the hobbies you want to develop?",
    "Do you believe in horoscopes?",
    "What was your favorite childhood book?",
    "Would you take it if you had the opportunity to be immortal?",
    "What is something your brain wants to convince you to do but you have to fight it?",
    "Which would be the smartest animal if they could all talk?",
    "What movie makes you laugh even after watching it several times?",
    "What’s your favorite toy when you were a child?",
    "What is the best name you could think for a cat?",
    "Have you ever counted your steps while walking?",
    "Do you believe in heaven?",
    "If you have a million, what are the things you wouldn’t spend?",
    "If you could have lunch with one person from history, who would it be?",
    "What’s the certain product you couldn’t live without?",
    "What would you name your yacht if you had one?",
    "Where is your all-time dream vacation?",
    "How do you want to die?",
    "What is the most stupid thing you’ve done in your entire life?",
    "If you could sit next to a famous celebrity in a restaurant, who would it be?",
    "If you had 24 hours to do whatever you wanted in this country, what would you like to do?",
    "If you could be a Hollywood celebrity, who would you like to become?",
    "What is your main reason for getting out of bed every day?",
    "How could you politely end a conversation with a person who is so annoying?",
    "What makes your day better?",
    "What is the strangest thing your teacher has ever done?",
    "What is the best color in the rainbow?",
    "Who is the best movie villain?",
    "Would you rather have 20 hobbies or a single passion?",
    "What’s your favorite exotic animal?",
    "How would you describe me based on my outside appearance?",
    "What is your favorite viral video?",
    "Who is your favorite YouTube vlogger?",
    "What’s your favorite action movie?",
    "What gets you motivated?",
    "What’s the most beautiful country you’ve ever visited?",
    "Would you rather cook or eat at a restaurant?",
    "What is the most useless talent you possess?",
    "What is the craziest thing you’ve done in school?",
    "How often do you replace your bedsheets?",
    "Do you like listening to podcasts?",
    "Do you like to save more or spend more?",
    "What is the weirdest superstition you’ve ever heard?",
    "If dark chocolate is the only available food in this planet, would you eat it?",
    "What are the two things you’d like to ask your pet?",
    "What’s the easiest dish to cook?",
    "If you could be any type of object, what would you like to be?",
    "How do you deal with a stressful environment?",
    "Which part of the roller coaster do you usually ride: the front, middle or back?",
    "Do you believe in second chances?",
    "Have you tried flirting with a stranger online?",
    "What would you like to change in this country if you were chosen as the president?",
    "Do you have a close relationship with your parents?",
    "What has been your hardest goodbye in life been so far?",
    "If you could change your name for a day, what would it be?",
    "Would you rather have a massage or get a facial?",
    "Can you describe to me your relationship with your dad?",
    "Which do you listen to the most: your heart or your brain?",
    "When was the last time you’ve felt your biggest adrenaline rush?",
    "Who is the tallest member of your family?",
    "What traits did you get from your parents?",
    "Who do you look up to the most?",
    "Can you show me your oldest item inside your closet?",
    "If you could only have one superpower, what would it be?",
    "What’s the best thing to do when you’re alone?",
    "Will you ever imagine having a child named after you?",
    "Do you want to have a cat as a companion or do you want to be a cat instead?",
    "What’s one body part that you wouldn’t even mind losing?",
    "For you, what does a perfect vacation look like?",
    "Which one do you prefer: being controlled or be in control?",
    "What are your phobias?",
    "Do you feel happy to be my friend?",
    "What makes you jealous?",
    "Is there someone you really hate?",
    "Who gave you the best compliment?",
    "Which film do you want to see turned into a musical?",
    "Do you still believe in Santa Claus?",
    "How would you describe your greatest enemy?",
    "When was the last time you screwed anything up and no one ever noticed?",
    "Have you already experienced writing a journal?",
    "What do you usually daydream about?",
    "If you were given the chance to listen to a singer or a band for the rest of your life, who/what would it be?",
    "What are the things you wish you could easily forget?",
    "What’s the most beautiful part of your face?",
    "Has anyone given you a strange gift?",
    "What’s the weirdest thing on your bucket list?",
    "Have you ever pulled out a tooth just to get money from the tooth fairy?",
    "What are the childish acts you still enjoy doing up until now?",
    "What does your brain try to make you do and you have to resist yourself not to do it?",
    "What three things did your past relationship teach you?",
    "What do you think is the best hangover cure?",
    "What are the foreign languages you’d like to master?",
    "In your own opinion, how smart are you?",
    "When was the last time you’ve ever felt jealous?",
    "What’s the biggest pimple you’ve ever had?",
    "Do you still remember the place where we first met?",
    "Would you move to another country for love?",
    "When was the time you felt really proud of me?",
    "What has been your worst nightmare?",
    "What usually keeps you up at night when you couldn’t sleep?",
    "Were you born for challenges?",
    "Are you confident to face the future?",
    "Who gave you the weirdest gift?",
    "What makes you cry?",
    "When was the last time you cried?",
    "How many concerts have you gone to?",
    "What would you name your car?",
    "Do you think life after death is really possible?",
    "What is so special about you?",
    "What will you tell your past self?",
    "What movie did you last watch inside the cinema?",
    "Which one do you prefer: summer or winter?",
    "Do you believe in aliens?",
    "What was the best year of your life?",
    "Do you actually believe in soulmates?",
    "What is your biggest accomplishment in life?",
    "What TV series could you watch several times?",
    "Where do you like to go right now?",
    "Where’s the worst-smelling place you have ever been?",
    "Will you be willing to move to another country without your friends and family?",
    "What qualities do you want in a partner who will be with you for the rest of your life?",
    "If you were given the chance to travel back to the past, where would you go?",
    "What do you usually eat for breakfast?",
    "Which store would you like if you could just shop at one for the rest of your life?",
    "What household chore do you hate doing the most?",
    "Who is your role model in life?",
    "Which celebrity would you rate as a perfect 10?",
    "What are the things that drive you crazy?",
    "Do you plan to have kids?",
    "What is your most favorite holiday?",
    "What are the things I do that you wish I would stop doing?",
    "What’s the first book you’ve read?",
    "What are the facts about you that you think I would find difficult to believe?",
    "Which body part is your favorite?",
    "What has been the worst phase in your life?",
    "What do you prioritize more: relationship or career?",
    "What flower is your favorite?",
    "What are your hidden talents?",
    "What’s your most favorite family tradition?",
    "Have you ever been caught while sneaking outside the house?",
    "What’s the meaning of your name?",
    "Do you ever dream of living somewhere else?",
    "What is/was your favorite subject in school?",
    "What are your hopes for the future?",
    "What usually scares you the most?",
    "What’s the weirdest animal for you?",
    "What will be your reaction if you see a ghost?",
    "Does my face look funny to you?",
    "Who was your first crush?",
    "What are you actually good at?",
    "Do you hate math?",
    "What’s your favorite lullaby?",
    "How was your reaction when you found out you were going to be parents for the first time?",
    "What is your dream for me?",
    "What would you serve if you were to make a special dinner for the family?",
    "What are the things you love the most about yourself?",
    "Can you guess what I’m thinking right now?",
    "What’s your greatest philosophy in life?",
    "What is the worst decision you’ve ever made?",
    "Where did all of our family traditions originate?",
    "What is your most favorite day of the week?",
    "Where did you tie the knot?",
    "What’s the weirdest Halloween you have ever worn in your entire life?",
    "What do you miss the most about being a kid?",
    "How do you inspire other people?",
    "What is the best song to describe your life right now?",
    "Where do you see yourself in the next 5 years?",
    "Have you ever stolen food from the refrigerator and blamed it on someone?",
    "What do you hate about me?",
    "What’s your favorite car brand?",
    "What would you do if you knew you’d be good in a different profession?",
    "Do you like to exercise regularly?",
    "What’s the worst food you’ve ever eaten?",
    "What is your most cherished possession?",
    "What’s the most valuable thing you’ve learned in life?",
    "What makes you really angry?",
    "If you were a pair of shoes, what brand would you like to be?",
    "What’s your dream job?",
    "What habits of other people you definitely find disgusting?",
    "Do you still keep secrets from mom/dad?",
    "What’s the extreme challenge in your life that you’ve already overcome?",
    "Have you ever thought of having plastic surgery?",
    "What sound do you hate?",
    "What is your current favorite TV show?",
    "Which of the Seven Dwarfs resembles you the most?",
    "Without calling 911 when you are in danger, what would you do instead?",
    "What is your favorite dance move when you were a kid?",
    "If you were given the chance to kiss and hug someone, who would that be?",
    "What is the worst punishment your parents gave you?",
    "How many countries have you visited so far?",
    "Have you experienced falling down the stairs?",
    "What are the challenges you never gave up on?",
    "What is one piece of advice you wished you’ve seriously taken?",
    "What do you like most about going to the beach?",
    "Have you experienced being confined in a hospital?",
    "If you are drowning, who do you think would save your life?",
    "What is the most embarrassing moment you had in your workplace?",
    "Who has taught you the best lesson in life?",
    "How would it feel like to cry underwater?",
    "How many times have you traveled by sea?",
    "Who would you want to portray your life story in a movie?",
    "Have you ever composed a song?",
    "What’s the last thing on your bucket list?",
    "How was your wedding?",
    "Which fictional book character would like to meet in the future?",
    "Has anyone tried to kill you?",
    "Who eats the most in the family?",
    "Do you get thirsty in the middle of the night?",
    "What are the qualities you search for in other people?",
    "Do you think fish ever get thirsty?",
    "Which of the politicians would you like to marry?",
    "How competitive are you?",
    "What family traditions have we forgotten about that you’d like to revive?",
    "If you could be part of another family, whose family would it be?",
    "Who is your favorite athlete?",
    "What is your favorite sports team?",
    "What are the musical instruments you can play?",
    "What would you do if you become lost in a city you aren’t familiar with?",
    "How old were you when you were allowed to have a cellphone?",
    "Can you name 5 things that are hidden inside your bedroom?",
    "Do you feel any pressure right now?",
    "If you could make one word famous, what would it be?",
    "What movie are you going to make if you become a filmmaker?",
    "What is your dream laptop?",
    "Which member of your family were you closest to as a child?",
    "If you could be great in only one sport, which sport would you choose?",
    "Do you see yourself as a creative one?",
    "Do you know how to change a flat tire?",
    "If you were ever bullied as a child, what did you do about it?",
    "What would you do if ever we were given a special time together?",
    "What type of genre would you choose if you were an author?",
    "What time were you born?",
    "Who do you not trust among your friends?",
    "Are you an impulsive type of person?",
    "Do you keep a really big secret from someone anyone?",
    "What are the things you’re going to bring in a zombie apocalypse?",
    "If you could teach a dog one trick, what would it be?",
    "Do you watch the full ad on YouTube or you just skip them?",
    "If someone would let you borrow their car, where would you go?",
    "Who do you think is your celebrity look-a-like?",
    "Why does it still rain in the movies when there is a funeral and then stop right after the burial?",
    "What flower would you prefer if you awoke as a flower one day?",
    "What location would you choose if you had the power to make it disappear?",
    "What’s the last food you ate?",
    "What was something you really wanted to do as a kid but never had the opportunity to do?",
    "Do you know any funny pick-up lines?",
    "Is there something you recently regret doing?",
    "What’s your least favorite board game?",
    "When you reach the age of 80, what will matter the most to you?",
    "Have you ever been caught staring at the opposite gender?",
    "Would you like to be famous someday?",
    "What are your top 5 favorite fast-food restaurants?",
    "Which brand of smartphone do you dislike the most?",
    "Have you ever had to run from the police?",
    "What law would you like to make that every person should strictly follow?",
    "Would you rather be a hero or a villain in a movie?",
    "What’s that certain thing that people always misunderstand about you?",
    "If you survived a plane crash, what would you do next?",
    "Do you like dipping your Oreo in milk?",
    "Are you a collector of something?",
    "How do you think does God looks like?",
    "Would you rather wear shoes or slippers?",
    "What’s your lucky number?",
    "Have you recently checked out one of your bucket lists?",
    "Do you like to stalk someone on social media?",
    "Are you smart enough to solve 100 addition problems in 100 minutes?",
    "What is your most-used emoji?",
    "If you could sit on a bench in the middle of a beautiful forest, who would you like to sit next to you and why?",
    "What fruit would you be if you were a fruit?",
    "When the doctor says, “You have 24 hours to live,” what will you do with the time you have left?",
    "Have you ever taken anything out of your possession and failed to return it?",
    "Do you ever believe in heroic deeds?",
    "What is the highest degree of pain you’ve ever experienced on a scale of 1-10?",
    "When you see a homeless person, what is your first thought?",
    "Have you ever dropped something on the floor, then picked it up and ate it?",
    "What is your favorite indoor activity?",
    "What is your favorite outdoor activity?",
    "Do you get bored easily?",
    "If you could choose one imaginary friend, who is it going to be?",
    "What age would you prefer if you could choose any age for the rest of your life, and why?",
    "Where would you go if you could teleport yourself from one place to another?",
    "Are you afraid of going near robots?",
    "Which one do you like: foot massage or hand massage?",
    "How many pizzas can you eat in a minute?",
    "What is a popular food ingredient, spice, or herb that you dislike?",
    "What are the things that take up too much of your time?",
    "Did you ever think that clowns were creepy?",
    "What would you do for an extra hour if you had 25 hours in a day?",
    "Would you choose to live for another 100 years or start over from the beginning?",
    "What do you want me to tell you?",
    "What’s your favorite sandwich spread?",
    "Are you more of a “fix it yourself” or “call an expert” kind of person?",
    "What time do you usually sleep?",
    "What time do you usually wake up?",
    "How many pairs of shoes do you have?",
    "Would you rather visit your ancestors in the past or meet your descendants in the future?",
    "Do you think you would enjoy a love-hate relationship with someone?",
    "Do you spend too much time playing games on your smartphone?",
    "What three things would you want with you if you were stranded on a desert island?",
    "Did you ever think you had superpowers as a child?",
    "Would you spend a thousand dollars on food?",
    "Which toy do you wish didn’t exist?",
    "Which year would you visit if you could travel back in time 1,000 years?",
    "What did you learn today?",
    "What has been the longest time you had to wait for someone?",
    "What season best fits your personality?",
    "What’s your opinion on garden gnomes or pink flamingos?",
    "What would you teach every girl on the planet about men if you had the chance?",
    "What has been the longest plane trip you’ve ever taken?",
    "What vegetable would you be if you were a vegetable?",
    "Would you like to tell me a story?",
    "Do you want to change the world?",
    "What’s your current habit that you want to quit?",
    "Does Christmas mean something special to you?",
    "What is your favorite Winter Olympics sport?",
    "What has been the most severe weather you’ve ever experienced?",
    "What habits are preventing you from achieving your goals?",
    "How do your friends usually describe you?",
    "When no one is around, what do you like to wear?",
    "What did you buy recently?",
    "Could you describe your favorite material object that you already have?",
    "What kind of company would you start if I offered you $50,000 to start one?",
    "What words of advice would you offer to your younger self?",
    "For a day, would you rather be a hobbit or an elf?",
    "What was your favorite childhood snack?",
    "What’s your favorite day of the week?",
    "What’s your favorite month?",
    "Who was your favorite classmate?",
    "Do I look attractive to you?",
    "Which of the continents have you already been to?",
    "What style of design do you think is the perfect match for you when it comes to houses?",
    "Have you ever walked out of the cinema without finishing the movie?"
  ]
  return questions[Math.floor(Math.random() * questions.length)]
}

client.login(token);
//# sourceMappingURL=index.js.map