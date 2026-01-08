// ===== IMPORTS =====
const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

// ===== CONFIG (PUT YOUR IDS HERE) =====
const ADMIN_ROLES = ["1458849494178463987","1458851254808608872"];
const TARGET_ROLE = "1458892702862278766";
const ALT_VC_ID = "1438925257011499221";
const WATCH_CHANNEL = "1438917726050451489";
const BANNED_KEYWORDS = ["dick", "gay", "shit", "pussy", "fuck", "toilet", "sex", "corn", "porn", "masterbaiter", "masterbait", "children"];

let botActive = false; // Bot is off by default

// ===== CLIENT =====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

// ===== SLASH COMMAND HANDLER =====
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  // Toggle bot on/off
  if (commandName === "bot") {
    if (!interaction.member.roles.cache.some(role => ADMIN_ROLES.includes(role.id))) {
      return interaction.reply({ content: "❌ You are not allowed to do this.", ephemeral: true });
    }
    botActive = !botActive;
    return interaction.reply({
      content: `Bot is now ${botActive ? "ACTIVE 🔥" : "INACTIVE ❌"}`,
      ephemeral: true,
    });
  }

  // Rizz or dark joke command
  if (commandName === "rizz") {
    const jokes = [
      "Here’s some rizz 😏",
      "Dark joke incoming 🖤",
      "You have 0% chance at this rizz 😎",
    ];
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    return interaction.reply({ content: joke, ephemeral: true });
  }
});

// ===== GIF FILTER =====
client.on("messageCreate", (message) => {
  if (message.channel.id !== WATCH_CHANNEL) return;
  if (!message.attachments.size) return;

  message.attachments.forEach((attachment) => {
    const name = attachment.name.toLowerCase();
    if (BANNED_KEYWORDS.some(keyword => name.includes(keyword))) {
      message.delete().catch(() => {});
    }
  });
});

// ===== VC CHAOS LOOP =====
setInterval(() => {
  if (!botActive) return;

  client.guilds.cache.forEach((guild) => {
    guild.members.cache.forEach((member) => {
      if (!member.voice.channel) return;
      if (!member.roles.cache.has(TARGET_ROLE)) return;

      // 1/10000 chance per second
      if (Math.floor(Math.random() * 10000) === 0) {
        const targetVC = guild.channels.cache.get(ALT_VC_ID);
        Math.random() < 0.5
          ? member.voice.disconnect().catch(() => {})
          : targetVC && member.voice.setChannel(targetVC).catch(() => {});
      }
    });
  });
}, 1000);

// ===== READY =====
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ===== LOGIN =====
client.login(process.env.TOKEN);
