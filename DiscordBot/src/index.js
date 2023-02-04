import { config } from "dotenv";
import { google } from "googleapis";
import { REST } from "@discordjs/rest";
import { Client, GatewayIntentBits, Routes } from "discord.js";
import enrollCMD from "./cmds/enroll.js";

config();

const GOOGLE_TOKEN = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
const token = process.env.PPSC_DISCORD_TOKEN;
const CLIENT_ID = process.env.PPSC_CLIENT_ID;
const GUILD_ID = process.env.PPSC_GUILD_ID;
const rest = new REST({ version: "10" }).setToken(token);
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => console.log(`Logged in as ${client.user.tag}!`));

async function main() {
  const commands = [enrollCMD];
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
    client.login(token);
  } catch (err) {
    console.error(err);
  }

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    const { commandName, options } = interaction;
    if (commandName === "enrollment") {

      const user = interaction.user;
      const userid = user.id;
      const username = user.username + "#" + user.discriminator;
      const name = options.getString("name");
      const email = options.getString("email");
      const interests = options.getString("interests");
      const Distro = options.getString("add_to_email_distro");

      interaction.reply(`Thank you ${name} for enrolling in the PPSC Cyber Club!\n${name}'s interests are "${interests}".`);

      const role = interaction.guild.roles.cache.find(
        (role) => role.name === "Student-Members"
      );
      interaction.member.roles.add(role);

      const auth = new google.auth.GoogleAuth({
        keyFile: GOOGLE_TOKEN,
        scopes: "https://www.googleapis.com/auth/spreadsheets",
      });
      
      const clientGoogle = await auth.getClient();
      const googleSheets = google.sheets({ version: "v4", auth: clientGoogle });
      const spreadsheetId = GOOGLE_SHEET_ID;
      const appendRow = googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1",
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [[userid, username, name, interests, email, Distro]],
        },
      });
    }
  });
}

main();
