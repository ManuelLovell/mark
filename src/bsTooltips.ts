import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

function SetupTooltips(idSelect: string, tooltipContent: string)
{
    const element = document.getElementById(`${idSelect}`);
    if (!element) return;
    tippy(element, {
        content: tooltipContent,
        theme: 'battlesystem',
    });
};

export function CreateTooltips()
{
    const tooltips = new Map<string, string>();

    tooltips.set(`tip_opacity`, "Change the opacity of the background of a label.");
    tooltips.set(`tip_textsize`, "Change the text size of the label name.");
    tooltips.set(`tip_stroke`, "Change the player-indication color stroke around the label.");
    tooltips.set(`exportButton`, "Export your current label set to a JSON file, for sharing or saving.");
    tooltips.set(`importButton`, "Import a JSON text file and overwrite your current Label set.");
    tooltips.set(`saveButton`, "Save changes to your Labels so they are available to be used.");
    tooltips.set(`addButton`, "Add another label row to the list for a new item.");
    tooltips.set(`resetButton`, "Reset your labels back to the default state.");

    tooltips.forEach((value, key) => { SetupTooltips(key, value); });
}