import { Theme } from "@owlbear-rodeo/sdk";

export function GetGUID(): string
{
    let d = new Date().getTime();
    const guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) =>
    {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return guid;
}

export function SetThemeMode(theme: Theme, document: Document): void
{
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    console.log(darkThemeMq.matches);

    const darkTheme = darkThemeMq.matches ? "dark" : "light";
    const lightTheme = darkThemeMq.matches ? "light" : "dark";

    for (var s = 0; s < document.styleSheets.length; s++)
    {
        for (var i = 0; i < document.styleSheets[s].cssRules.length; i++)
        {
            let rule = document.styleSheets[s].cssRules[i] as CSSMediaRule;

            if (rule && rule.media && rule.media.mediaText.includes("prefers-color-scheme"))
            {
                if (theme.mode == "LIGHT")
                {
                    rule.media.appendMedium(`(prefers-color-scheme: ${darkTheme})`);

                    if (rule.media.mediaText.includes(lightTheme))
                    {
                        rule.media.deleteMedium(`(prefers-color-scheme: ${lightTheme})`);
                    }
                }
                else if (theme.mode == "DARK")
                {
                    rule.media.appendMedium(`(prefers-color-scheme: ${lightTheme})`);

                    if (rule.media.mediaText.includes(darkTheme))
                    {
                        rule.media.deleteMedium(`(prefers-color-scheme: ${darkTheme})`);
                    }
                }
            }
        }
    }
}

export function HexToRgb(hex: string): string | undefined
{
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (_m, r, g, b)
    {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result)
    {
        var resultToString = `(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`;
        return resultToString;
    }
    else
    {
        return undefined;
    }
}