import OBR from '@owlbear-rodeo/sdk';
import { setupContextMenu } from './contextMenu';
import "@melloware/coloris/dist/coloris.css";
import Coloris from "@melloware/coloris";
import { GetGUID, HexToRgb } from './utilities';
import './style.css'

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
  <h1>Mark!</h1>
  <table id="table-one" style="width:100%">
  <thead>
  <tr>
  <th style="width: 5%">☑️</th>
  <th style="width: 50%">Label Name</th>
  <th style="width: 25%">Direction</th>
  <th style="width: 20%">Color</th>
  </tr>
  </thead>
  <tbody id="label-list"></tbody>
  </table>
  <button id="AddGroupOne">Add</button>
  </div>`

// Table Constants
const loadingApp = <HTMLDivElement>document.getElementById("loadingApp")!;
const labelApp = <HTMLDivElement>document.getElementById("labelApp")!;
const table = <HTMLTableElement>document.getElementById("table-one")!;
// Document Constants
const buttonOne = <HTMLButtonElement>document.getElementById("AddGroupOne")!;
// Test Data
const testData: ILabelData[] = [
  {Id: "1", Name: "Poisoned", Color:"#008000", Direction: "Top", Active: 1},
  {Id: "2", Name: "Burning", Color:"#ff0000", Direction: "Right", Active: 1},
  {Id: "3", Name: "Frozen", Color:"#0000ff", Direction: "Bottom", Active: 1}
];

OBR.onReady(() =>
{
  setupContextMenu();
  // Load Labels from Database

  // Add Clickers to append rows/labels
  buttonOne.onclick = () => AddToGroupOne();

  // Once all loaded, display the extension.
  loadingApp.style.display = "none";
  labelApp.style.display = "";

  // Load database
  testData.forEach((label) =>
  {
    AddToGroupOne(label);
  });
});

/** Add row to table one */
function AddToGroupOne(label?: ILabelData)
{
  const row = table.insertRow(-1);
  const checkbox = row.insertCell(0);
  const name = row.insertCell(1);
  name.setAttribute("contenteditable", "true");
  name.innerHTML = label ? label.Name : "Default Name";
  const direction = row.insertCell(2);
  const selector = CreateDirectionDropDown();
  selector.value = label ? label.Direction : "Top";
  direction.appendChild(selector);
  const color = row.insertCell(3);
  color.id = GetGUID();
  checkbox.innerHTML = `<label><input type="checkbox" /></label>`;

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

/** Save the current label setup to the database NAME-DIRECTION-COLOR-ACTIVE */
async function Save(): Promise<void>
{
  //await db.Labels.update(Constants.TURNTRACKER, { });
}