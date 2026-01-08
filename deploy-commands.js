// ===== IMPORTS =====
const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

// ===== CONFIG =====
const GUILD_ID = "1438917725471768799"; // Your Discord server ID
const CLIENT_ID = process.env.CLIENT_ID; // 1458857772358565989 from .env

// ===== COMMANDS =====
const commands = [
  new SlashCommandBuilder()
    .setName("bot")
    .setDescription("Toggle the bot on/off (admins only)"),

  new SlashCommandBuilder()
    .setName("rizz")
    .setDescription("Get a rizz or dark joke"),

  new SlashCommandBuilder().setName("joke").setDescription("Get a random joke"),

  new SlashCommandBuilder()
    .setName("update")
    .setDescription("Sync admin roles (allowlist only)"),
].map((cmd) => cmd.toJSON());

// ===== REST CLIENT =====
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

// ===== DEPLOY COMMANDS =====
(async () => {
  try {
    console.log("⏳ Registering commands...");

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });

    console.log("✅ Commands registered for guild!");
  } catch (error) {
    console.error(error);
  }
})();
