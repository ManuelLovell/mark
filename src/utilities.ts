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

export function CombineGUIDs(guid1: string, guid2: string): string
{
    // Parse the GUIDs into byte arrays
    const guid1Bytes = ParseGUID(guid1);
    const guid2Bytes = ParseGUID(guid2);

    // Combine the byte arrays
    const combinedBytes = combineByteArrays(guid1Bytes, guid2Bytes);

    // Create a new GUID from the combined byte array
    const combinedGUID = createGUID(combinedBytes);

    return combinedGUID;
}

function ParseGUID(guid: string): number[]
{
    const hexDigits = guid.replace(/[^a-f0-9]/gi, '');
    const bytes: number[] = [];

    for (let i = 0; i < hexDigits.length; i += 2)
    {
        bytes.push(parseInt(hexDigits.substring(i, 2), 16));
    }

    return bytes;
}

export function parseCombinedValue(combinedValue: string): [string, string] | null
{
    if (combinedValue.length !== 32)
    {
        return null; // Invalid combined value
    }

    const guid1 = combinedValue.slice(0, 32);
    const guid2 = combinedValue.slice(32);

    return [guid1, guid2];
}


function combineByteArrays(arr1: number[], arr2: number[]): number[]
{
    return [...arr1, ...arr2];
}

function createGUID(byteArray: number[]): string
{
    const bytes = new Uint8Array(byteArray);
    const guidArray = Array.from(bytes).map((byte) => byte.toString(16).padStart(2, '0'));

    // Create the GUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    const guid = [
        guidArray.slice(0, 4).join(''),
        guidArray.slice(4, 6).join(''),
        guidArray.slice(6, 8).join(''),
        guidArray.slice(8, 10).join(''),
        guidArray.slice(10).join(''),
    ].join('-');

    return guid;
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

export function RgbToHex(rgb): string | undefined
{
    return `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`;
}