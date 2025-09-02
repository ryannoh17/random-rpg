import type {
  SlashCommandBuilder,
  Client,
  ChatInputCommandInteraction,
  MessageComponentInteraction,
} from "discord.js";

export type commandFile = {
  default: {
    data: SlashCommandBuilder;
    execute: (
      interaction: ChatInputCommandInteraction,
      client: Client
    ) => Promise<any>;
  };
};

export type componentFile = {
  default: {
    data: {
      name: string;
    };
    execute: (
      interaction: MessageComponentInteraction,
      client: Client
    ) => Promise<any>;
  };
};

export type eventFile = {
  default: {
    name: string;
    once?: boolean;
    execute: (
      interaction?: ChatInputCommandInteraction,
      client?: Client
    ) => Promise<any>;
  };
};

export type functionFile = {
  default: (client: Client) => Promise<void>;
};
