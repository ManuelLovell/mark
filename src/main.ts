import OBR, { Metadata } from '@owlbear-rodeo/sdk';
import { setupContextMenu } from './contextMenu';
import "@melloware/coloris/dist/coloris.css";
import Coloris from "@melloware/coloris";
import { GetGUID, HexToRgb, RgbToHex } from './utilities';
import './style.css'
import { Constants } from './constants';

//#region Coloris Initialization
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
    onChange: (color) =>
    {
        console.log(color);
    }
});
Coloris.close();
//#endregion

// Set base HTML (Set Loading instead..)
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="loadingApp">
  <h1>Loading...</div>
  <div id="labelApp" style="display:none;">
  Mark!<div id="mainButtons"></div>
  <div id="buttonLabels">
  <div class="nameGroup center">
  <label for="gr1n">Group #1</label><br>
  <input type="text" id="gr1n" name="gr1n" maxlength="15" size="10">
  </div>
  <div class="nameGroup center">
  <label for="gr2n">Group #2</label><br>
  <input type="text" id="gr2n" name="gr2n" maxlength="15" size="10">
  </div>
  <div class="nameGroup center">
  <label for="gr3n">Group #3</label><br>
  <input type="text" id="gr3n" name="gr3n" maxlength="15" size="10">
  </div>
  </div>
  <hr style="height:1px; visibility:hidden;" />
  <table id="table-one" style="width:100%">
  <thead>
  <tr>
  <th style="width: 5%">☑️</th>
  <th style="width: 50%">Label Name</th>
  <th style="width: 20%">Group</th>
  <th style="width: 20%">Direction</th>
  <th style="width: 5%">🖍️</th>
  </tr>
  </thead>
  <tbody id="label-list"></tbody>
  </table>
  </div>`

// Table Constants
const loadingApp = <HTMLDivElement>document.getElementById("loadingApp")!;
const labelApp = <HTMLDivElement>document.getElementById("labelApp")!;
const table = <HTMLTableElement>document.getElementById("label-list")!;
// Document Constants
const mainButtonContainer = <HTMLButtonElement>document.getElementById("mainButtons")!;
const groupOne = <HTMLInputElement>document.getElementById("gr1n")!;
const groupTwo = <HTMLInputElement>document.getElementById("gr2n")!;
const groupThree = <HTMLInputElement>document.getElementById("gr3n")!;

// Test Data
const defaultSet: ILabelData[] = [
    { Id: "1", Name: "Blinded 🕶️", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1 },
    { Id: "2", Name: "Charmed 💘", Color: "#ff0000", Group: "#1", Direction: "Top", Active: 1 },
    { Id: "3", Name: "Deafened 🎧", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1 },
    { Id: "4", Name: "Frightened 😱", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1 },
    { Id: "5", Name: "Grappled 🫂", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1 },
    { Id: "6", Name: "Incapacitated 💘", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1 },
    { Id: "7", Name: "Invisible 😶‍🌫️", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1 },
    { Id: "8", Name: "Paralyzed ⚡", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1 },
    { Id: "9", Name: "Petrified 🪨", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1 },
    { Id: "10", Name: "Poisoned 🤢", Color: "#008000", Group: "#1", Direction: "Top", Active: 1 },
    { Id: "11", Name: "Prone 🦦", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1 },
    { Id: "12", Name: "Restrained 🪢", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1 },
    { Id: "13", Name: "Stunned 💫", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1 },
    { Id: "14", Name: "Unconscious 💤", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1 },
    { Id: "15", Name: "Exhaustion 🦥", Color: "#FFFFFF", Group: "#1", Direction: "Top", Active: 1 },
    { Id: "16", Name: "Bardic Inspiration 🎵", Color: "#FFFFFF", Group: "#2", Direction: "Left", Active: 1 },
    { Id: "17", Name: "Champion 👑", Color: "#FFFFFF", Group: "#3", Direction: "Right", Active: 1 },
];
const defaultGroups: string[] = ["Conditions", "Buffs", "Extra"];

OBR.onReady(async () =>
{
    setupContextMenu();

    const roomsLabels = await OBR.room.getMetadata();
    const meta = roomsLabels[`${Constants.EXTENSIONID}/metadata_marks`] as any;
    const saveData = meta?.saveData as ISaveData;
    if (saveData && saveData.Labels?.length > 0)
    {
        saveData.Labels.forEach((label) =>
        {
            AddToGroup(label);
        });
        saveData.Groups.forEach((group) =>
        {
            switch (group.Num)
            {
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
    else
    {
        await LoadDefaults();
    }

    //Create Save Button
    const saveButton = document.createElement('input');
    saveButton.type = "image";
    saveButton.className = "Icon clickable";
    saveButton.id = "saveButton";
    saveButton.onclick = async function () 
    {
        await Save();
    }
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
    addButton.onclick = async function () 
    {
        await AddToGroup();
    }
    addButton.src = "/add.svg";
    addButton.title = "Add Label";
    addButton.height = 20;
    addButton.width = 20;
    mainButtonContainer.appendChild(addButton);

    //Create Reset Button
    const resetButton = document.createElement('input');
    resetButton.type = "image";
    resetButton.className = "Icon clickable";
    resetButton.id = "addButton";
    resetButton.onclick = async function () 
    {
        await Reset();
    }
    resetButton.src = "/reset.svg";
    resetButton.title = "Reset to Default Labels";
    resetButton.height = 20;
    resetButton.width = 20;
    mainButtonContainer.appendChild(resetButton);

    // Once all loaded, display the extension.
    loadingApp.style.display = "none";
    labelApp.style.display = "";

});

/** Add row to table one */
function AddToGroup(label?: ILabelData)
{
    const row = table.insertRow(-1);
    row.id = GetGUID();
    const checkbox = row.insertCell(0);
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
    checkbox.innerHTML = `<input id="checkbox_${row.id}" type="checkbox" ${label?.Active ? "checked" : ""}/>`;

    const rgbColorString = label ? HexToRgb(label.Color) : undefined;
    color.appendChild(AddColorisInput(color.id, rgbColorString));
}

/** Create the Coloris Color Picker Swatch */
function AddColorisInput(elementId: string, color?: string): HTMLDivElement
{
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
function CreateDirectionDropDown(): HTMLSelectElement
{
    const selector = <HTMLSelectElement>document.createElement('select');

    const directions = ["Top", "Bottom", "Left", "Right"];
    directions.forEach((direction) =>
    {
        const option = document.createElement("option");
        option.setAttribute('value', direction);
        const text = document.createTextNode(direction);
        option.appendChild(text);

        selector.appendChild(option);
    });

    return selector;
}

function CreateGroupDropDown(): HTMLSelectElement
{
    const selector = <HTMLSelectElement>document.createElement('select');

    const groups = ["#1", "#2", "#3"];
    groups.forEach((group) =>
    {
        const option = document.createElement("option");
        option.setAttribute('value', group);
        const text = document.createTextNode(group);
        option.appendChild(text);

        selector.appendChild(option);
    });

    return selector;
}

/** Save the current label setup to room metadata */
async function Save(): Promise<void>
{
    const labels: ILabelData[] = [];
    const groups: IGroup[] = [];

    var table = <HTMLTableElement>document.getElementById("label-list");
    for (var i = 0, row: HTMLTableRowElement; row = table.rows[i]; i++)
    {
        const id = row.id;
        const checkbox = <HTMLInputElement>row.querySelector(`#checkbox_` + id);
        const name = <HTMLTableCellElement>row.querySelector(`#name_` + id);
        const direction = <HTMLSelectElement>row.querySelector(`#selector_` + id);
        const group = <HTMLSelectElement>row.querySelector(`#group_` + id);
        const color = <HTMLDivElement>row.querySelector(`#clr-field_` + id);
        const hexColor = RgbToHex(color.style.color)!;
        const label: ILabelData =
        {
            Id: id,
            Active: checkbox.checked ? 1 : 0,
            Name: name.innerHTML,
            Direction: direction.value,
            Color: hexColor,
            Group: group.value,
        };
        labels.push(label);
    }

    groups.push({Name: groupOne.value, Num: "#1"});
    groups.push({Name: groupTwo.value, Num: "#2"});
    groups.push({Name: groupThree.value, Num: "#3"});

    const saveData: ISaveData = {Groups: groups, Labels: labels};

    let markMeta: Metadata = {};
    markMeta[`${Constants.EXTENSIONID}/metadata_marks`] = { saveData };
    await OBR.room.setMetadata(markMeta);
}

/**Set the metadata back to defaults */
async function Reset(): Promise<void>
{
    if (confirm("Erase everything and go back to default labels?"))
    {
        table.innerHTML = "";
        await LoadDefaults();
    }
}

// function GetGroupName(number: string): string
// {
//     switch (number)
//     {
//         case '#1':
//             return groupOne.value;;
//         case '#2':
//             return groupTwo.value;;
//         case '#3':
//             return groupThree.value;;
//         default:
//             throw new Error('Invalid Group');
//     }
// }

async function LoadDefaults(): Promise<void>
{
    groupOne.value = defaultGroups[0];
    groupTwo.value = defaultGroups[1];
    groupThree.value = defaultGroups[2];

    // Load defaults
    defaultSet.forEach((label) =>
    {
        AddToGroup(label);
    });
    await Save();
}