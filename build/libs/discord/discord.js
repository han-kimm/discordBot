"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDiscord = initDiscord;
const discord_js_1 = require("discord.js");
const dotenv_1 = require("dotenv");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)();
const isProduction = process.env.NODE_ENV === "production";
const extension = isProduction ? ".js" : ".ts";
const token = process.env.DISCORD_TOKEN;
async function initDiscord() {
    const client = new discord_js_1.Client({
        intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.DirectMessages],
        partials: [discord_js_1.Partials.Channel],
    });
    // @ts-ignore
    client.commands = new discord_js_1.Collection();
    const foldersPath = path_1.default.join(__dirname, "commands");
    const commandFolders = fs_1.default.readdirSync(foldersPath);
    for (const folder of commandFolders) {
        const commandsPath = path_1.default.join(foldersPath, folder);
        const commandFiles = fs_1.default
            .readdirSync(commandsPath)
            .filter((file) => file.endsWith(extension));
        for (const file of commandFiles) {
            const filePath = path_1.default.join(commandsPath, file);
            const command = require(filePath);
            if ("data" in command && "execute" in command) {
                //@ts-ignore
                client.commands.set(command.data.name, command);
            }
            else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
    const eventsPath = path_1.default.join(__dirname, "events");
    const eventFiles = fs_1.default
        .readdirSync(eventsPath)
        .filter((file) => file.endsWith(extension));
    for (const file of eventFiles) {
        const filePath = path_1.default.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        }
        else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
    client.login(token);
}
