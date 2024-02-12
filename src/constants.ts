export class Constants
{
    static EXTENSIONID = "com.battle-system.mark";
    static EXTENSIONWHATSNEW = "com.battle-system.mark-whatsnew";
    static VERSION = "whatsnew-mark-140";

    static LABELSID = "com.battle-system.labels";
    static DICENOTATION = /(\d+)[dD](\d+)(.*)$/i;
    static DICEMODIFIER = /([+-])(\d+)/;
    static PARENTHESESMATCH = /\((\d*d\d+\s*([+-]\s*\d+)?)\)/g;
    static PLUSMATCH = /\s(\+\d+)\s/g;
}