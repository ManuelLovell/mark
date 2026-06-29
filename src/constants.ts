import { PathCommand, Command } from "@owlbear-rodeo/sdk";

export class Constants {
    static EXTENSIONID = "com.battle-system.mark";
    static VERSION = "whatsnew-mark-141";

    static USE_DIRECT_REGISTRATION_LOOKUP = true;
    static USE_REGISTRATION_METRICS = true;
    static REGISTRATION_METRICS_BATCH_SIZE = 25;
    static REGISTRATION_METRICS_FLUSH_MS = 10000;
    static REGISTRATION_LOOKUP_VIEW = 'bs_registration_status_public';
    static REGISTRATION_CACHE_PREFIX = 'MARK_REGISTRATION';
    static REGISTRATION_POSITIVE_TTL_MS = 12 * 60 * 60 * 1000;
    static REGISTRATION_NEGATIVE_TTL_MS = 60 * 60 * 1000;
    static REGISTRATION_ERROR_COOLDOWN_MS = 5 * 60 * 1000;

    static LABELSID = "com.battle-system.labels";
    static MARKCONNECT = "com.battle-system.marked-connect";
    static DICENOTATION = /(\d+)[dD](\d+)(.*)$/i;
    static DICEMODIFIER = /([+-])(\d+)/;
    static PARENTHESESMATCH = /\((\d*d\d+\s*([+-]\s*\d+)?)\)/g;
    static PLUSMATCH = /\s(\+\d+)\s/g;

    static CHECKREGISTRATION = 'https://vrwtdtmnbyhaehtitrlb.supabase.co/functions/v1/patreon-check';
    static ANONAUTH = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

    static DEFAULTSET: ILabelData[] = [
        { Id: "1", Name: "Blinded 🕶️", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1, Counter: 0 },
        { Id: "2", Name: "Charmed 💘", Color: "#ff0000", Group: "#1", Direction: "Top", Active: 1, Counter: 0 },
        { Id: "3", Name: "Deafened 🎧", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1, Counter: 0 },
        { Id: "4", Name: "Frightened 😱", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1, Counter: 0 },
        { Id: "5", Name: "Grappled 🫂", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1, Counter: 0 },
        { Id: "6", Name: "Incapacitated 💘", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1, Counter: 0 },
        { Id: "7", Name: "Invisible 😶‍🌫️", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1, Counter: 0 },
        { Id: "8", Name: "Paralyzed ⚡", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1, Counter: 0 },
        { Id: "9", Name: "Petrified 🪨", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1, Counter: 0 },
        { Id: "10", Name: "Poisoned 🤢", Color: "#008000", Group: "#1", Direction: "Top", Active: 1, Counter: 0 },
        { Id: "11", Name: "Prone 🦦", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1, Counter: 0 },
        { Id: "12", Name: "Restrained 🪢", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1, Counter: 0 },
        { Id: "13", Name: "Stunned 💫", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1, Counter: 0 },
        { Id: "14", Name: "Unconscious 💤", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1, Counter: 0 },
        { Id: "15", Name: "Exhaustion 🦥", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1, Counter: 0 },
        { Id: "16", Name: "Bardic Inspiration 🎵", Color: "#FFFFFF", Group: "#2", Direction: "Left", Active: 1, Counter: 0 },
        { Id: "17", Name: "Champion 👑", Color: "#FFFFFF", Group: "#3", Direction: "Right", Active: 1, Counter: 0 },
    ];
    static DEFAULTGROUP: string[] = ["Conditions", "Buffs", "Extra"];
    static DEFAULTFONTSIZE = "36"; // This is now font size 
    static DEFAULTOPACITY = "85";
    static DEFAULTSTROKE = "4";

    static MINUSBUTTON: PathCommand[] = [
    // Rectangle (110x100, radius 20 on right side)
    [Command.MOVE, -50 + 20, -50],
    [Command.LINE, 60 - 20, -50],
    [Command.QUAD, 60, -50, 60, -50 + 20],
    [Command.LINE, 60, 50 - 20],
    [Command.QUAD, 60, 50, 60 - 20, 50],
    [Command.LINE, -50 + 20, 50],
    [Command.QUAD, -50, 50, -50, 50 - 20],
    [Command.LINE, -50, -50 + 20],
    [Command.QUAD, -50, -50, -50 + 20, -50],
    // Minus sign
    [Command.MOVE, -27, 0],
    [Command.LINE, 27, 0],
    [Command.CLOSE]
    ];
    static ADDBUTTON: PathCommand[] = [
    // Rectangle (110x100, radius 20 on left side)
    [Command.MOVE, -60 + 20, -50],
    [Command.LINE, 50 - 20, -50],
    [Command.QUAD, 50, -50, 50, -50 + 20],
    [Command.LINE, 50, 50 - 20],
    [Command.QUAD, 50, 50, 50 - 20, 50],
    [Command.LINE, -60 + 20, 50],
    [Command.QUAD, -60, 50, -60, 50 - 20],
    [Command.LINE, -60, -50 + 20],
    [Command.QUAD, -60, -50, -60 + 20, -50],
    // Plus sign
    [Command.MOVE, -27, 0],
    [Command.LINE, 27, 0],
    [Command.MOVE, 0, -27],
    [Command.LINE, 0, 27],
    [Command.CLOSE]
    ];
}