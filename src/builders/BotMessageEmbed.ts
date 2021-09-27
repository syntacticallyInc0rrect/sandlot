import {MessageEmbed, MessageEmbedOptions} from "discord.js";

export const BotMessageEmbed = (props: MessageEmbedOptions): MessageEmbed => new MessageEmbed(props);