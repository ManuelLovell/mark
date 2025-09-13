import OBR, { buildText, Item, Metadata, Text } from '@owlbear-rodeo/sdk';
import { setupContextMenu } from './contextMenu';
import { GetGUID, HexToRgb, RgbToHex } from './utilities';
import { Constants } from './constants';
import { InitiateListeners } from './integrationListener';
import { CreateTooltips } from './bsTooltips';
import * as Utilities from './utilities';
import Coloris from "@melloware/coloris";
import "@melloware/coloris/dist/coloris.css";
import './style.css'

//region Coloris Initialization
Coloris.init();
Coloris.coloris({
    el: ".coloris",
    alpha: false,
    format: 'hex',
    wrap: true,
    theme: 'polaroid',
    themeMode: "light",
    swatches: [
        'red',
        'yellow',
        'green',
        'cyan',
        'blue',
        'purple',
    ],
    onChange: () => {
    }
});
Coloris.close();
//#endregion

// Table Constants
const loadingApp = <HTMLDivElement>document.getElementById("loadingApp")!;
const labelApp = <HTMLDivElement>document.getElementById("labelApp")!;
const table = <HTMLTableElement>document.getElementById("label-list")!;
const headerRow = <HTMLTableCellElement>document.getElementById("labelSort")!;
let sortAscending = true;

// Document Constants
const mainButtonContainer = <HTMLButtonElement>document.getElementById("mainButtons")!;
const groupOne = <HTMLInputElement>document.getElementById("gr1n")!;
const groupTwo = <HTMLInputElement>document.getElementById("gr2n")!;
const groupThree = <HTMLInputElement>document.getElementById("gr3n")!;
const distance = <HTMLInputElement>document.getElementById("distance")!;
const opacity = <HTMLInputElement>document.getElementById("opacity")!;
const strokewidth = <HTMLInputElement>document.getElementById("stroke")!;
let sceneItemsCache: Item[] = [];

export async function Marked() {
    setupContextMenu();

    // Set theme accordingly
    const theme = await OBR.theme.getTheme();
    Utilities.SetThemeMode(theme, document);
    OBR.theme.onChange((theme) => {
        Utilities.SetThemeMode(theme, document);
    });

    // Selection Change Check
    sceneItemsCache = await OBR.scene.items.getItems();
    OBR.scene.items.onChange((items) => {
        sceneItemsCache = items;
    });

    OBR.player.onChange(async (player) => {
        if (player.selection?.length === 1) {
            const selectedItemId = player.selection[0];
            const itemFound = sceneItemsCache.find(x => x.id === selectedItemId 
                && (x.metadata[`${Constants.EXTENSIONID}/addId`] !== undefined
                    || x.metadata[`${Constants.EXTENSIONID}/minusId`] !== undefined
                ));
            if (itemFound) {
                if (sceneItemsCache.length === 0) {
                    sceneItemsCache = await OBR.scene.items.getItems();
                }
                const currentCountItem = sceneItemsCache.find(x => itemFound.attachedTo === x.metadata[`${Constants.EXTENSIONID}/counterId`]);
                if (currentCountItem)
                {
                    let currentCount = currentCountItem ? parseInt((currentCountItem as Text).text.plainText) : 1;
                    currentCount = (itemFound.metadata[`${Constants.EXTENSIONID}/addId`] !== undefined) ? currentCount + 1 : currentCount - 1;
                    if (currentCount === 0 && currentCountItem.attachedTo) {
                        await OBR.scene.items.deleteItems([currentCountItem.attachedTo]);
                    }
                    else {
                        if (currentCount > 9) currentCount = 9;
                        await OBR.scene.items.updateItems<Text>([currentCountItem.id], (counts) => {
                            for (let count of counts) {
                                count.text.plainText = currentCount.toString();
                            }
                        })
                        OBR.player.deselect([itemFound.id])
                    }
                }
            };
        }
    });

    // Add GM CHECK //
    const role = await OBR.player.getRole();
    if (role === "GM") {
        await Utilities.CheckRegistration();
        const patreonContainer = document.getElementById("patreonContainer")!;
        patreonContainer.appendChild(Utilities.GetPatreonButton());
        await SetupConfigAction();
        InitiateListeners();
        CreateTooltips();
    }
    else {
        loadingApp.innerHTML = `<div class="player-view">Configuration is GM-Access only.</div>`;
        await OBR.action.setHeight(70);
        await OBR.action.setWidth(150);
    }

    // This is emoji preload.
    setTimeout(async () => {
        const label = buildText()
            .fillColor("black")
            .plainText("You found me. 😱")
            .fillOpacity(0)
            .strokeWidth(0)
            .strokeColor("white")
            .strokeOpacity(0)
            .build();
        label.position = { x: -5000, y: -5000 };
        label.visible = false; // Set Visibility
        label.locked = true; // Set Lock, Don't want people to touch
        label.disableHit = true;
        label.type = "TEXT"; // Set Item Type
        label.text.type = "PLAIN";
        label.text.style.fontWeight = 100;
        label.text.style.fontSize = 12;
        label.text.style.textAlign = "CENTER";
        label.text.style.fontFamily = "Roboto";
        await OBR.scene.items.addItems([label]);

        await OBR.scene.items.getItemBounds([label.id]);

        setTimeout(async () => {
            await OBR.scene.items.deleteItems([label.id]);
        }, (1000));
    }, (1000));
};

/** Add row to table one */
function AddToGroup(label?: ILabelData) {
    const row = table.insertRow(0);
    row.className = "data-row";
    row.id = GetGUID();

    const checkbox = row.insertCell(0);
    checkbox.innerHTML = `<input id="checkbox_${row.id}" type="checkbox" ${label?.Active === 0 ? "" : "checked"}/>`;

    const name = row.insertCell(1);
    name.id = "name_" + row.id;
    name.setAttribute("contenteditable", "true");
    name.innerHTML = label ? label.Name : "Default Name";

    const group = row.insertCell(2);
    group.className = "center";
    const groupSelect = CreateGroupDropDown();
    groupSelect.value = label ? label.Group : "#1";
    groupSelect.id = "group_" + row.id;
    group.appendChild(groupSelect);

    const direction = row.insertCell(3);
    direction.className = "center";
    const selector = CreateDirectionDropDown();
    selector.value = label ? label.Direction : "Top";
    selector.id = "selector_" + row.id;
    direction.appendChild(selector);

    const color = row.insertCell(4);
    color.id = row.id;
    color.className = "center";

    const counterBox = row.insertCell(5);
    counterBox.innerHTML = `<input id="counter${row.id}" type="checkbox" ${label?.Counter === 1 ? "checked" : ""}/>`;

    const rgbColorString = label ? HexToRgb(label.Color) : undefined;
    color.appendChild(AddColorisInput(color.id, rgbColorString));
}

/** Create the Coloris Color Picker Swatch */
function AddColorisInput(elementId: string, color?: string): HTMLDivElement {
    const divElement = document.createElement('div');
    const buttonElement = document.createElement('button');

    buttonElement.setAttribute('aria-labelledby', 'clr-open-label');
    buttonElement.id = 'clr-button_' + elementId;

    divElement.className = 'clr-field';
    divElement.id = 'clr-field_' + elementId;
    divElement.style.color = color ? 'rgb' + color : 'rgb(0, 0, 0)';
    divElement.appendChild(buttonElement);

    const input = <HTMLInputElement>document.createElement('input');
    input.type = 'text';
    input.id = 'clr-input_' + elementId;
    input.style.width = "20px";
    input.className = 'coloris';
    input.setAttribute("data-coloris", "");
    divElement.appendChild(input);
    return divElement;
}

/** Create the dropdown list to select the label alignment */
function CreateDirectionDropDown(): HTMLSelectElement {
    const selector = <HTMLSelectElement>document.createElement('select');
    selector.className = "directionSelect";

    const directions = ["Top", "Bottom", "Left", "Right"];
    directions.forEach((direction) => {
        const option = document.createElement("option");
        option.setAttribute('value', direction);
        const text = document.createTextNode(direction);
        option.appendChild(text);

        selector.appendChild(option);
    });

    return selector;
}

function CreateGroupDropDown(): HTMLSelectElement {
    const selector = <HTMLSelectElement>document.createElement('select');
    selector.className = "groupSelect";

    const groups = ["#1", "#2", "#3"];
    groups.forEach((group) => {
        const option = document.createElement("option");
        option.setAttribute('value', group);
        const text = document.createTextNode(group);
        option.appendChild(text);

        selector.appendChild(option);
    });

    return selector;
}

async function ExportData(): Promise<void> {
    const content = GetSaveData();

    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(content)], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = `MarkedExport-${Date.now()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

async function ImportData(saveData: ISaveData): Promise<void> {
    if (saveData && saveData.Labels?.length > 0) {
        const labelTable = document.getElementById("label-list")!;
        labelTable.innerHTML = "";
        saveData.Labels.forEach((label) => {
            AddToGroup(label);
        });
        saveData.Groups.forEach((group) => {
            switch (group.Num) {
                case '#1':
                    groupOne.value = group.Name;
                    break;
                case '#2':
                    groupTwo.value = group.Name;
                    break;
                case '#3':
                    groupThree.value = group.Name;
                    break;
                default:
                    throw new Error('Invalid Group');
            }
        });
        distance.value = saveData.Distance;
        opacity.value = saveData.Opacity;
    }
    await Save();
}

/** Save the current label setup to room metadata */
async function Save(): Promise<void> {
    const saveData = GetSaveData();

    let markMeta: Metadata = {};
    markMeta[`${Constants.EXTENSIONID}/metadata_marks`] = { saveData };
    await OBR.room.setMetadata(markMeta);
}

function GetSaveData(): ISaveData {
    const labels: ILabelData[] = [];
    const groups: IGroup[] = [];
    const distanceNumber = distance.value;
    const opacityNumber = opacity.value;
    const strokeNumber = strokewidth.value;

    var table = <HTMLTableElement>document.getElementById("label-list");
    for (var i = 0, row: HTMLTableRowElement; row = table.rows[i]; i++) {
        const id = row.id;
        const checkbox = <HTMLInputElement>row.querySelector(`#checkbox_` + id);
        const name = <HTMLTableCellElement>row.querySelector(`#name_` + id);
        const direction = <HTMLSelectElement>row.querySelector(`#selector_` + id);
        const group = <HTMLSelectElement>row.querySelector(`#group_` + id);
        const color = <HTMLDivElement>row.querySelector(`#clr-field_` + id);
        const countbox = <HTMLInputElement>row.querySelector(`#counter` + id);
        const hexColor = RgbToHex(color.style.color)!;
        const label: ILabelData =
        {
            Id: id,
            Active: checkbox.checked ? 1 : 0,
            Name: name.innerText.trim(),
            Direction: direction.value,
            Color: hexColor,
            Group: group.value,
            Counter: countbox.checked ? 1 : 0,
        };
        labels.push(label);
    }

    groups.push({ Name: groupOne.value, Num: "#1" });
    groups.push({ Name: groupTwo.value, Num: "#2" });
    groups.push({ Name: groupThree.value, Num: "#3" });

    return { Groups: groups, Labels: labels.reverse(), Distance: distanceNumber, Opacity: opacityNumber, Stroke: strokeNumber };
}

/**Set the metadata back to defaults */
async function Reset(): Promise<void> {
    if (confirm("Erase everything and go back to default labels?")) {
        table.innerHTML = "";
        await LoadDefaults();
    }
}

async function LoadDefaults(): Promise<void> {
    groupOne.value = Constants.DEFAULTGROUP[0];
    groupTwo.value = Constants.DEFAULTGROUP[1];
    groupThree.value = Constants.DEFAULTGROUP[2];
    distance.value = Constants.DEFAULTFONTSIZE;
    opacity.value = Constants.DEFAULTOPACITY;
    strokewidth.value = Constants.DEFAULTSTROKE;

    // Load defaults
    Constants.DEFAULTSET.forEach((label) => {
        AddToGroup(label);
    });
    await Save();
}

async function SetupConfigAction(): Promise<void> {
    const roomsLabels = await OBR.room.getMetadata();
    const meta = roomsLabels[`${Constants.EXTENSIONID}/metadata_marks`] as any;
    const saveData = meta?.saveData as ISaveData;
    if (saveData && saveData.Labels?.length > 0) {
        saveData.Labels.forEach((label) => {
            AddToGroup(label);
        });
        saveData.Groups.forEach((group) => {
            switch (group.Num) {
                case '#1':
                    groupOne.value = group.Name;
                    break;
                case '#2':
                    groupTwo.value = group.Name;
                    break;
                case '#3':
                    groupThree.value = group.Name;
                    break;
                default:
                    throw new Error('Invalid Group');
            }
        });
    }
    else {
        await LoadDefaults();
    }

    ///Setup Distance Configuration
    distance.max = "999";
    distance.min = "1";
    distance.maxLength = 4;
    distance.value = saveData?.Distance ? saveData.Distance : Constants.DEFAULTFONTSIZE;
    distance.oninput = (ev) => {
        checkValue(ev.target);
    };

    ///Setup Opacity Configuration
    opacity.max = "99";
    opacity.min = "1";
    opacity.maxLength = 2;
    opacity.value = saveData?.Opacity ? saveData.Opacity : Constants.DEFAULTOPACITY;
    opacity.oninput = (ev) => {
        checkValue(ev.target);
    };

    ///Setup Stroke Configuration
    strokewidth.max = "20";
    strokewidth.min = "0";
    strokewidth.maxLength = 2;
    strokewidth.value = saveData?.Stroke ? saveData.Stroke : Constants.DEFAULTSTROKE;
    strokewidth.oninput = (ev) => {
        checkValue(ev.target);
    };

    //Create Export Button
    const exportButton = document.createElement('input');
    exportButton.type = "image";
    exportButton.className = "Icon clickable";
    exportButton.id = "exportButton";
    exportButton.onclick = async function () {
        await ExportData();
    };
    exportButton.src = "/export.svg";
    exportButton.title = "Export Data";
    exportButton.height = 20;
    exportButton.width = 20;
    mainButtonContainer.appendChild(exportButton);

    //Create Import Button
    const importButton = document.createElement('input');
    importButton.type = "image";
    importButton.className = "Icon clickable";
    importButton.id = "importButton";
    importButton.onclick = async function () {
        document.getElementById("fileButton")!.click();
    };
    importButton.src = "/import.svg";
    importButton.title = "Import Data";
    importButton.height = 20;
    importButton.width = 20;
    mainButtonContainer.appendChild(importButton);

    const fileButton = document.createElement('input');
    fileButton.type = "file";
    fileButton.id = "fileButton";
    fileButton.title = "Choose a file to import"
    fileButton.className = "tinyType";
    fileButton.hidden = true;
    fileButton.onchange = async function () {
        console.log('FILE ADDED');

        if (fileButton.files && fileButton.files.length > 0) {
            let file = fileButton.files[0];
            let reader = new FileReader();

            reader.readAsText(file);

            reader.onload = async function () {
                try {
                    const saveData: ISaveData = JSON.parse(reader.result as string);
                    await ImportData(saveData);
                    OBR.notification.show("Import Complete!", "SUCCESS");
                }
                catch (error) {
                    OBR.notification.show(`The import failed - ${error}`, "ERROR");
                }
            };

            reader.onerror = function () {
                console.log(reader.error);
            };
        }
    }
    mainButtonContainer.appendChild(fileButton);


    //Create Save Button
    const saveButton = document.createElement('input');
    saveButton.type = "image";
    saveButton.className = "Icon clickable";
    saveButton.id = "saveButton";
    saveButton.onclick = async function () {
        await Save();
    };
    saveButton.src = "/save.svg";
    saveButton.title = "Save Changes";
    saveButton.height = 20;
    saveButton.width = 20;
    mainButtonContainer.appendChild(saveButton);

    //Create Add Button
    const addButton = document.createElement('input');
    addButton.type = "image";
    addButton.className = "Icon clickable";
    addButton.id = "addButton";
    addButton.onclick = async function () {
        await AddToGroup();
    };
    addButton.src = "/add.svg";
    addButton.title = "Add Label";
    addButton.height = 20;
    addButton.width = 20;
    mainButtonContainer.appendChild(addButton);

    //Create Reset Button
    const resetButton = document.createElement('input');
    resetButton.type = "image";
    resetButton.className = "Icon clickable";
    resetButton.id = "resetButton";
    resetButton.onclick = async function () {
        await Reset();
    };
    resetButton.src = "/reset.svg";
    resetButton.title = "Reset to Default Labels";
    resetButton.height = 20;
    resetButton.width = 20;
    mainButtonContainer.appendChild(resetButton);

    //Setup Sorters
    headerRow.onclick = async function () {
        var table, rows, switching, i, x, y, shouldSwitch;
        table = document.getElementById("label-list");
        switching = true;

        while (switching) {
            switching = false;
            rows = table.getElementsByClassName("data-row");

            for (i = 0; i < rows.length - 1; i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("td")[1];
                y = rows[i + 1].getElementsByTagName("td")[1];

                // Compare the values based on the sorting order
                if (sortAscending) {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                } else {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }

            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }

        // Toggle the sorting order for the next click
        sortAscending = !sortAscending;
    };

    // Once all loaded, display the extension.
    loadingApp.style.display = "none";
    labelApp.style.display = "";

    // this function will convert a string to an integer
    // beware this will throw an exception if the value does not parse properly
    function int(value) {
        return parseInt(value);
    }

    // this checks the value and updates it on the control, if needed
    function checkValue(sender) {
        let min = sender.min;
        let max = sender.max;
        let value = int(sender.value);
        if (value > max) {
            sender.value = max;
        }
        else if (value < min) {
            sender.value = min;
        }
    }

    function deleteRow(event: MouseEvent): void {
        event.preventDefault();

        const row = (event.target as HTMLElement).closest('tr');

        if (row && row.rowIndex > 0 && window.confirm(`Are you sure you want to delete ${row.children[1].innerHTML}?`)) {
            row.remove();
        }
    }

    const table = document.getElementById('table-one');

    if (table) {
        table.addEventListener('contextmenu', deleteRow);
    }
}