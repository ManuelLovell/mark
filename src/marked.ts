import OBR, { buildText, Item, Metadata, Text } from '@owlbear-rodeo/sdk';
import { createElement, Tag, Shield, Bolt, Star, Skull, Heart, Plus, X, Settings2, Zap, Flame, SunMedium, MoonStar, Sparkles, Gem, CircleAlert, TriangleAlert, Ghost, Crown, Sword, Compass } from 'lucide';
import { setupContextMenu } from './contextMenu';
import { GetGUID } from './utilities';
import { Constants } from './constants';
import { InitiateListeners } from './integrationListener';
import { CreateTooltips } from './bsTooltips';
import * as Utilities from './utilities';
import './style.css'

type ViewMode = "group" | "settings";

type GroupIcon = {
    key: string;
    label: string;
    icon: typeof Tag;
};

const MAX_GROUPS = 10;
const NAME_MAX_LENGTH = 30;
const DEFAULT_GROUP_ICON = "tag";
const DEFAULT_GROUP_COLOR = "#ffffff";

const GROUP_ICONS: GroupIcon[] = [
    { key: "tag", label: "Tag", icon: Tag },
    { key: "shield", label: "Shield", icon: Shield },
    { key: "bolt", label: "Bolt", icon: Bolt },
    { key: "star", label: "Star", icon: Star },
    { key: "skull", label: "Skull", icon: Skull },
    { key: "heart", label: "Heart", icon: Heart },
    { key: "plus", label: "Plus", icon: Plus },
    { key: "x", label: "X", icon: X },
    { key: "settings-2", label: "Settings", icon: Settings2 },
    { key: "zap", label: "Zap", icon: Zap },
    { key: "flame", label: "Flame", icon: Flame },
    { key: "sun-medium", label: "Sun", icon: SunMedium },
    { key: "moon-star", label: "Moon Star", icon: MoonStar },
    { key: "sparkles", label: "Sparkles", icon: Sparkles },
    { key: "gem", label: "Gem", icon: Gem },
    { key: "circle-alert", label: "Alert", icon: CircleAlert },
    { key: "triangle-alert", label: "Warning", icon: TriangleAlert },
    { key: "ghost", label: "Ghost", icon: Ghost },
    { key: "crown", label: "Crown", icon: Crown },
    { key: "sword", label: "Sword", icon: Sword },
    { key: "compass", label: "Compass", icon: Compass },
];

const loadingApp = document.getElementById("loadingApp") as HTMLDivElement;
const labelApp = document.getElementById("labelApp") as HTMLDivElement;
const groupTabs = document.getElementById("groupTabs") as HTMLDivElement;
const settingsTab = document.getElementById("settingsTab") as HTMLButtonElement;
const groupPanel = document.getElementById("groupPanel") as HTMLDivElement;
const settingsPanel = document.getElementById("settingsPanel") as HTMLDivElement;
const groupNameInput = document.getElementById("groupNameInput") as HTMLInputElement;
const groupIconSelect = document.getElementById("groupIconSelect") as HTMLSelectElement;
const groupIconColorInput = document.getElementById("groupIconColorInput") as HTMLInputElement;
const removeGroupButton = document.getElementById("removeGroupButton") as HTMLButtonElement;
const labelTableBody = document.getElementById("label-list") as HTMLTableSectionElement;
const labelSort = document.getElementById("labelSort") as HTMLTableCellElement;
const mainButtonContainer = document.getElementById("mainButtons") as HTMLDivElement;
const topRightActionContainer = document.getElementById("patreonContainer") as HTMLDivElement;
const workspaceShell = document.getElementById("workspaceShell") as HTMLDivElement;
const sidebarScrim = document.getElementById("sidebarScrim") as HTMLDivElement;
const distance = document.getElementById("distance") as HTMLInputElement;
const opacity = document.getElementById("opacity") as HTMLInputElement;
const strokeWidth = document.getElementById("stroke") as HTMLInputElement;
const groupDistance = document.getElementById("groupDistance") as HTMLInputElement;
const groupOpacity = document.getElementById("groupOpacity") as HTMLInputElement;
const groupStroke = document.getElementById("groupStroke") as HTMLInputElement;
const clearGroupDistance = document.getElementById("clearGroupDistance") as HTMLButtonElement;
const clearGroupOpacity = document.getElementById("clearGroupOpacity") as HTMLButtonElement;
const clearGroupStroke = document.getElementById("clearGroupStroke") as HTMLButtonElement;
const fileButton = document.getElementById("fileButton") as HTMLInputElement;

let sceneItemsCache: Item[] = [];
let sortAscending = true;
let mode: ViewMode = "group";
let groups: IGroup[] = [];
let labels: ILabelData[] = [];
let activeGroupNum = "#1";
let hoverOverlayCloseTimer: number | undefined;

export async function Marked() {
    setupContextMenu();

    const theme = await OBR.theme.getTheme();
    Utilities.SetThemeMode(theme, document);
    OBR.theme.onChange((newTheme) => {
        Utilities.SetThemeMode(newTheme, document);
    });

    sceneItemsCache = await OBR.scene.items.getItems();
    OBR.scene.items.onChange((items) => {
        sceneItemsCache = items;
    });

    OBR.player.onChange(async (player) => {
        if (player.selection?.length !== 1) return;

        const selectedItemId = player.selection[0];
        const itemFound = sceneItemsCache.find((x) => x.id === selectedItemId
            && (x.metadata[`${Constants.EXTENSIONID}/addId`] !== undefined
                || x.metadata[`${Constants.EXTENSIONID}/minusId`] !== undefined));

        if (!itemFound) return;

        if (sceneItemsCache.length === 0) {
            sceneItemsCache = await OBR.scene.items.getItems();
        }

        const currentCountItem = sceneItemsCache.find((x) => itemFound.attachedTo === x.metadata[`${Constants.EXTENSIONID}/counterId`]);
        if (!currentCountItem) return;

        let currentCount = parseInt((currentCountItem as Text).text.plainText);
        currentCount = (itemFound.metadata[`${Constants.EXTENSIONID}/addId`] !== undefined) ? currentCount + 1 : currentCount - 1;

        if (currentCount === 0 && currentCountItem.attachedTo) {
            await OBR.scene.items.deleteItems([currentCountItem.attachedTo]);
        }
        else {
            if (currentCount > 9) currentCount = 9;
            await OBR.scene.items.updateItems<Text>([currentCountItem.id], (counts) => {
                for (const count of counts) {
                    count.text.plainText = currentCount.toString();
                }
            });
            OBR.player.deselect([itemFound.id]);
        }
    });

    const role = await OBR.player.getRole();
    if (role === "GM") {
        await Utilities.CheckRegistration();
        await SetupConfigAction();
        CreateTooltips();
    }
    else {
        loadingApp.innerHTML = "<div class='player-view'>Configuration is GM-Access only.</div>";
        await OBR.action.setHeight(70);
        await OBR.action.setWidth(150);
    }

    InitiateListeners();

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
        label.visible = false;
        label.locked = true;
        label.disableHit = true;
        label.type = "TEXT";
        label.text.type = "PLAIN";
        label.text.style.fontWeight = 100;
        label.text.style.fontSize = 12;
        label.text.style.textAlign = "CENTER";
        label.text.style.fontFamily = "Roboto";

        await OBR.scene.items.addItems([label]);
        await OBR.scene.items.getItemBounds([label.id]);

        setTimeout(async () => {
            await OBR.scene.items.deleteItems([label.id]);
        }, 1000);
    }, 1000);
}

function getDefaultGroups(): IGroup[] {
    return Constants.DEFAULTGROUP.map((name, index) => ({
        Num: `#${index + 1}`,
        Name: name,
        Icon: GROUP_ICONS[index]?.key ?? DEFAULT_GROUP_ICON,
        IconColor: DEFAULT_GROUP_COLOR,
    }));
}

function normalizeGroups(source?: IGroup[]): IGroup[] {
    const defaults = getDefaultGroups();
    if (!source || source.length === 0) return defaults;

    const normalized = source
        .slice(0, MAX_GROUPS)
        .map((group, index) => ({
            Num: group.Num || `#${index + 1}`,
            Name: (group.Name || `Group ${index + 1}`).trim().slice(0, NAME_MAX_LENGTH),
            Icon: group.Icon || GROUP_ICONS[index % GROUP_ICONS.length].key,
            IconColor: group.IconColor || DEFAULT_GROUP_COLOR,
            TextSizeOverride: group.TextSizeOverride,
            BgOpacityOverride: group.BgOpacityOverride,
            OutlineStrokeOverride: group.OutlineStrokeOverride,
        }));

    if (normalized.length === 0) return defaults;
    return normalized;
}

function ensureLabelsBoundToGroups(): void {
    const validGroups = new Set(groups.map((group) => group.Num));
    const fallback = groups[0]?.Num ?? "#1";

    for (const label of labels) {
        if (!validGroups.has(label.Group)) {
            label.Group = fallback;
        }
    }
}

function normalizeLabelNames(source: ILabelData[]): ILabelData[] {
    return source.map((label) => ({
        ...label,
        Name: (label.Name || "Unnamed Label").trim().slice(0, NAME_MAX_LENGTH) || "Unnamed Label",
    }));
}

function createLabelForGroup(groupNum: string): ILabelData {
    return {
        Id: GetGUID(),
        Active: 1,
        Name: "New Label",
        Direction: "Top",
        Color: "#ffffff",
        Group: groupNum,
        Counter: 0,
    };
}

function getActiveGroup(): IGroup | undefined {
    return groups.find((group) => group.Num === activeGroupNum);
}

function setButtonIcon(button: HTMLElement, icon: typeof Tag): void {
    const iconSlot = button.querySelector<HTMLElement>(".tab-icon, .delete-icon");
    if (!iconSlot) return;

    iconSlot.replaceChildren(createElement(icon));
}

function openSidebarOverlay(): void {
    if (hoverOverlayCloseTimer !== undefined) {
        window.clearTimeout(hoverOverlayCloseTimer);
        hoverOverlayCloseTimer = undefined;
    }

    workspaceShell.classList.add("sidebar-open");
    sidebarScrim.setAttribute("data-visible", "true");
}

function closeSidebarOverlay(): void {
    if (hoverOverlayCloseTimer !== undefined) {
        window.clearTimeout(hoverOverlayCloseTimer);
    }

    hoverOverlayCloseTimer = window.setTimeout(() => {
        const anyHovering = groupTabs.querySelector(":scope .group-tab:hover") !== null || settingsTab.matches(":hover");
        if (anyHovering) return;

        workspaceShell.classList.remove("sidebar-open");
        sidebarScrim.removeAttribute("data-visible");
        hoverOverlayCloseTimer = undefined;
    }, 20);
}

function renderGroupIconOptions(): void {
    groupIconSelect.innerHTML = "";
    GROUP_ICONS.forEach((icon) => {
        const option = document.createElement("option");
        option.value = icon.key;
        option.textContent = icon.label;
        groupIconSelect.appendChild(option);
    });
}

function renderSidebar(): void {
    groupTabs.innerHTML = "";

    const addGroupButton = document.createElement("button");
    addGroupButton.type = "button";
    addGroupButton.id = "addGroupButton";
    addGroupButton.className = "group-tab add-group-tab";
    addGroupButton.title = "Add Group";
    addGroupButton.innerHTML = `<span class="tab-icon"></span><span class="tab-name">Add Group</span>`;
    setButtonIcon(addGroupButton, Plus);
    addGroupButton.onclick = () => addGroup();
    addGroupButton.addEventListener("pointerenter", openSidebarOverlay);
    addGroupButton.addEventListener("pointerleave", closeSidebarOverlay);
    groupTabs.appendChild(addGroupButton);

    groups.forEach((group) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `group-tab ${mode === "group" && group.Num === activeGroupNum ? "active" : ""}`;
        button.title = group.Name;
        button.dataset.group = group.Num;

        const iconWrap = document.createElement("span");
        iconWrap.className = "tab-icon";
        iconWrap.style.color = group.IconColor || DEFAULT_GROUP_COLOR;
        const groupIcon = GROUP_ICONS.find((item) => item.key === group.Icon) ?? GROUP_ICONS[0];
        iconWrap.appendChild(createElement(groupIcon.icon));

        const nameWrap = document.createElement("span");
        nameWrap.className = "tab-name";
        nameWrap.textContent = group.Name;

        button.appendChild(iconWrap);
        button.appendChild(nameWrap);
        button.addEventListener("pointerenter", openSidebarOverlay);
        button.addEventListener("pointerleave", closeSidebarOverlay);
        button.onclick = () => {
            mode = "group";
            activeGroupNum = group.Num;
            renderView();
        };

        groupTabs.appendChild(button);
    });

    settingsTab.classList.toggle("active", mode === "settings");
    setButtonIcon(settingsTab, Settings2);
    settingsTab.onpointerenter = openSidebarOverlay;
    settingsTab.onpointerleave = closeSidebarOverlay;
}

function renderGroupPanel(): void {
    const active = getActiveGroup();
    if (!active) return;

    groupNameInput.value = active.Name;
    groupIconSelect.value = active.Icon || DEFAULT_GROUP_ICON;
    groupIconColorInput.value = active.IconColor || DEFAULT_GROUP_COLOR;
    groupDistance.value = active.TextSizeOverride || distance.value;
    groupOpacity.value = active.BgOpacityOverride || opacity.value;
    groupStroke.value = active.OutlineStrokeOverride || strokeWidth.value;
    removeGroupButton.disabled = groups.length <= 1;

    renderLabelsTable();
}

function sortActiveGroupLabels(): void {
    const active = activeGroupNum;
    const grouped = labels.filter((label) => label.Group === active);
    grouped.sort((a, b) => {
        const aName = a.Name.toLowerCase();
        const bName = b.Name.toLowerCase();
        if (aName === bName) return 0;
        if (sortAscending) return aName > bName ? 1 : -1;
        return aName < bName ? 1 : -1;
    });

    const remainder = labels.filter((label) => label.Group !== active);
    labels = [...remainder, ...grouped];
    sortAscending = !sortAscending;
    renderLabelsTable();
}

function renderLabelsTable(): void {
    const currentGroupLabels = labels.filter((label) => label.Group === activeGroupNum);
    labelTableBody.innerHTML = "";

    currentGroupLabels.forEach((label) => {
        const row = document.createElement("tr");
        row.className = "data-row";
        row.dataset.labelId = label.Id;

        const activeCell = document.createElement("td");
        activeCell.className = "center";
        const activeInput = document.createElement("input");
        activeInput.type = "checkbox";
        activeInput.className = "table-toggle";
        activeInput.checked = label.Active === 1;
        activeInput.onchange = () => {
            label.Active = activeInput.checked ? 1 : 0;
        };
        activeCell.appendChild(activeInput);

        const nameCell = document.createElement("td");
        nameCell.contentEditable = "true";
        nameCell.innerText = label.Name;
        nameCell.onblur = () => {
            const nextName = nameCell.innerText.trim().slice(0, NAME_MAX_LENGTH);
            label.Name = nextName.length > 0 ? nextName : "Unnamed Label";
            nameCell.innerText = label.Name;
        };

        const directionCell = document.createElement("td");
        directionCell.className = "center";
        const directionSelect = document.createElement("select");
        directionSelect.className = "directionSelect";
        ["Top", "Bottom", "Left", "Right"].forEach((direction) => {
            const option = document.createElement("option");
            option.value = direction;
            option.textContent = direction;
            directionSelect.appendChild(option);
        });
        directionSelect.value = label.Direction;
        directionSelect.onchange = () => {
            label.Direction = directionSelect.value;
        };
        directionCell.appendChild(directionSelect);

        const colorCell = document.createElement("td");
        colorCell.className = "center";
        const colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.className = "label-color-input";
        colorInput.value = label.Color || "#ffffff";
        colorInput.oninput = () => {
            label.Color = colorInput.value;
        };
        colorCell.appendChild(colorInput);

        const counterCell = document.createElement("td");
        counterCell.className = "center";
        const counterInput = document.createElement("input");
        counterInput.type = "checkbox";
        counterInput.className = "table-toggle";
        counterInput.checked = label.Counter === 1;
        counterInput.onchange = () => {
            label.Counter = counterInput.checked ? 1 : 0;
        };
        counterCell.appendChild(counterInput);

        row.append(activeCell, nameCell, directionCell, colorCell, counterCell);
        row.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            const confirmDelete = window.confirm(`Are you sure you want to delete ${label.Name}?`);
            if (!confirmDelete) return;
            labels = labels.filter((existingLabel) => existingLabel.Id !== label.Id);
            renderLabelsTable();
        });

        labelTableBody.appendChild(row);
    });

    const addRow = document.createElement("tr");
    addRow.className = "add-label-row";
    const addCell = document.createElement("td");
    addCell.colSpan = 5;

    const addButton = document.createElement("button");
    addButton.id = "addLabelButton";
    addButton.type = "button";
    addButton.className = "add-label-button";
    addButton.textContent = "Add New Label";
    addButton.onclick = () => {
        labels.push(createLabelForGroup(activeGroupNum));
        renderLabelsTable();
    };

    addCell.appendChild(addButton);
    addRow.appendChild(addCell);
    labelTableBody.appendChild(addRow);
}

function renderView(): void {
    renderSidebar();

    if (mode === "settings") {
        groupPanel.style.display = "none";
        settingsPanel.style.display = "";
        return;
    }

    groupPanel.style.display = "";
    settingsPanel.style.display = "none";
    renderGroupPanel();
}

function validateRangeInput(sender: HTMLInputElement): void {
    const min = parseInt(sender.min);
    const max = parseInt(sender.max);
    const value = parseInt(sender.value);

    if (Number.isNaN(value)) {
        sender.value = sender.min;
        return;
    }

    if (value > max) sender.value = sender.max;
    if (value < min) sender.value = sender.min;
}

function getSaveData(): ISaveData {
    return {
        Groups: groups,
        Labels: labels,
        Distance: distance.value,
        Opacity: opacity.value,
        Stroke: strokeWidth.value,
    };
}

async function Save(): Promise<void> {
    const saveData = getSaveData();
    const markMeta: Metadata = {};
    markMeta[`${Constants.EXTENSIONID}/metadata_marks`] = { saveData };
    await OBR.room.setMetadata(markMeta);
}

async function ExportData(): Promise<void> {
    const content = getSaveData();
    const anchor = document.createElement("a");
    const file = new Blob([JSON.stringify(content)], { type: "text/plain" });
    anchor.href = URL.createObjectURL(file);
    anchor.download = `MarkedExport-${Date.now()}`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

async function ImportData(saveData: ISaveData): Promise<void> {
    groups = normalizeGroups(saveData.Groups);
    labels = saveData.Labels?.length > 0
        ? normalizeLabelNames(saveData.Labels)
        : normalizeLabelNames(Constants.DEFAULTSET.map((label) => ({ ...label })));
    ensureLabelsBoundToGroups();

    activeGroupNum = groups[0].Num;
    distance.value = saveData.Distance || Constants.DEFAULTFONTSIZE;
    opacity.value = saveData.Opacity || Constants.DEFAULTOPACITY;
    strokeWidth.value = saveData.Stroke || Constants.DEFAULTSTROKE;

    renderView();
    await Save();
}

async function LoadDefaults(): Promise<void> {
    groups = getDefaultGroups();
    labels = normalizeLabelNames(Constants.DEFAULTSET.map((label) => ({ ...label })));
    activeGroupNum = groups[0].Num;
    distance.value = Constants.DEFAULTFONTSIZE;
    opacity.value = Constants.DEFAULTOPACITY;
    strokeWidth.value = Constants.DEFAULTSTROKE;

    renderView();
    await Save();
}

async function Reset(): Promise<void> {
    if (!confirm("Erase everything and go back to default labels?")) return;
    await LoadDefaults();
}

function addGroup(): void {
    if (groups.length >= MAX_GROUPS) {
        OBR.notification.show("A maximum of 10 groups is allowed.", "WARNING");
        return;
    }

    let slot = 1;
    while (groups.some((group) => group.Num === `#${slot}`) && slot <= MAX_GROUPS) {
        slot += 1;
    }

    const newGroup: IGroup = {
        Num: `#${slot}`,
        Name: `Group ${groups.length + 1}`,
        Icon: GROUP_ICONS[groups.length % GROUP_ICONS.length].key,
        IconColor: DEFAULT_GROUP_COLOR,
    };

    groups.push(newGroup);
    activeGroupNum = newGroup.Num;
    mode = "group";
    renderView();
}

function removeGroup(): void {
    if (groups.length <= 1) {
        OBR.notification.show("At least one group is required.", "WARNING");
        return;
    }

    const active = getActiveGroup();
    if (!active) return;

    const confirmDelete = window.confirm(`Delete group \"${active.Name}\" and move its labels to the first group?`);
    if (!confirmDelete) return;

    const fallback = groups.find((group) => group.Num !== active.Num);
    if (!fallback) return;

    labels.forEach((label) => {
        if (label.Group === active.Num) {
            label.Group = fallback.Num;
        }
    });

    groups = groups.filter((group) => group.Num !== active.Num);
    activeGroupNum = fallback.Num;
    renderView();
}

async function SetupConfigAction(): Promise<void> {
    renderGroupIconOptions();

    const roomLabels = await OBR.room.getMetadata();
    const meta = roomLabels[`${Constants.EXTENSIONID}/metadata_marks`] as { saveData?: ISaveData } | undefined;
    const saveData = meta?.saveData;

    if (saveData && saveData.Labels?.length > 0) {
        groups = normalizeGroups(saveData.Groups);
        labels = normalizeLabelNames(saveData.Labels);
        ensureLabelsBoundToGroups();
        activeGroupNum = groups[0].Num;

        distance.value = saveData.Distance || Constants.DEFAULTFONTSIZE;
        opacity.value = saveData.Opacity || Constants.DEFAULTOPACITY;
        strokeWidth.value = saveData.Stroke || Constants.DEFAULTSTROKE;
    }
    else {
        groups = getDefaultGroups();
        labels = normalizeLabelNames(Constants.DEFAULTSET.map((label) => ({ ...label })));
        activeGroupNum = groups[0].Num;

        distance.value = Constants.DEFAULTFONTSIZE;
        opacity.value = Constants.DEFAULTOPACITY;
        strokeWidth.value = Constants.DEFAULTSTROKE;

        await Save();
    }

    distance.max = "999";
    distance.min = "1";
    distance.maxLength = 4;
    distance.oninput = () => validateRangeInput(distance);

    opacity.max = "99";
    opacity.min = "1";
    opacity.maxLength = 2;
    opacity.oninput = () => validateRangeInput(opacity);

    strokeWidth.max = "20";
    strokeWidth.min = "0";
    strokeWidth.maxLength = 2;
    strokeWidth.oninput = () => validateRangeInput(strokeWidth);

    groupDistance.max = "999";
    groupDistance.min = "1";
    groupDistance.maxLength = 4;
    groupDistance.oninput = () => validateRangeInput(groupDistance);

    groupOpacity.max = "99";
    groupOpacity.min = "1";
    groupOpacity.maxLength = 2;
    groupOpacity.oninput = () => validateRangeInput(groupOpacity);

    groupStroke.max = "20";
    groupStroke.min = "0";
    groupStroke.maxLength = 2;
    groupStroke.oninput = () => validateRangeInput(groupStroke);

    settingsTab.onclick = () => {
        mode = "settings";
        renderView();
    };

    setButtonIcon(removeGroupButton, X);

    removeGroupButton.onclick = () => removeGroup();

    groupNameInput.oninput = () => {
        const group = getActiveGroup();
        if (!group) return;
        group.Name = groupNameInput.value.slice(0, NAME_MAX_LENGTH) || "Unnamed Group";
        renderSidebar();
    };

    groupIconSelect.onchange = () => {
        const group = getActiveGroup();
        if (!group) return;
        group.Icon = groupIconSelect.value;
        renderSidebar();
    };

    groupIconColorInput.oninput = () => {
        const group = getActiveGroup();
        if (!group) return;
        group.IconColor = groupIconColorInput.value;
        renderSidebar();
    };

    groupDistance.oninput = () => {
        const group = getActiveGroup();
        if (!group) return;
        validateRangeInput(groupDistance);
        group.TextSizeOverride = groupDistance.value;
    };

    groupOpacity.oninput = () => {
        const group = getActiveGroup();
        if (!group) return;
        validateRangeInput(groupOpacity);
        group.BgOpacityOverride = groupOpacity.value;
    };

    groupStroke.oninput = () => {
        const group = getActiveGroup();
        if (!group) return;
        validateRangeInput(groupStroke);
        group.OutlineStrokeOverride = groupStroke.value;
    };

    clearGroupDistance.onclick = () => {
        const group = getActiveGroup();
        if (!group) return;
        delete group.TextSizeOverride;
        groupDistance.value = distance.value;
    };

    clearGroupOpacity.onclick = () => {
        const group = getActiveGroup();
        if (!group) return;
        delete group.BgOpacityOverride;
        groupOpacity.value = opacity.value;
    };

    clearGroupStroke.onclick = () => {
        const group = getActiveGroup();
        if (!group) return;
        delete group.OutlineStrokeOverride;
        groupStroke.value = strokeWidth.value;
    };

    labelSort.onclick = () => {
        if (mode !== "group") return;
        sortActiveGroupLabels();
    };

    fileButton.onchange = async () => {
        if (!fileButton.files || fileButton.files.length === 0) return;

        const file = fileButton.files[0];
        const reader = new FileReader();
        reader.readAsText(file);

        reader.onload = async () => {
            try {
                const parsedSaveData = JSON.parse(reader.result as string) as ISaveData;
                await ImportData(parsedSaveData);
                OBR.notification.show("Import Complete!", "SUCCESS");
            }
            catch (error) {
                OBR.notification.show(`The import failed - ${error}`, "ERROR");
            }
            finally {
                fileButton.value = "";
            }
        };

        reader.onerror = () => {
            OBR.notification.show(`The import failed - ${reader.error}`, "ERROR");
            fileButton.value = "";
        };
    };

    const exportButton = document.createElement("button");
    exportButton.type = "button";
    exportButton.className = "settings-action";
    exportButton.id = "exportButton";
    exportButton.onclick = async () => ExportData();
    exportButton.textContent = "Export";
    mainButtonContainer.appendChild(exportButton);

    const importButton = document.createElement("button");
    importButton.type = "button";
    importButton.className = "settings-action";
    importButton.id = "importButton";
    importButton.onclick = async () => fileButton.click();
    importButton.textContent = "Import";
    mainButtonContainer.appendChild(importButton);

    topRightActionContainer.innerHTML = "";
    const saveButton = document.createElement("input");
    saveButton.type = "image";
    saveButton.className = "Icon clickable";
    saveButton.id = "saveButton";
    saveButton.onclick = async () => Save();
    saveButton.src = "/save.svg";
    saveButton.title = "Save Changes";
    saveButton.height = 20;
    saveButton.width = 20;
    topRightActionContainer.appendChild(saveButton);

    const resetButton = document.createElement("button");
    resetButton.type = "button";
    resetButton.className = "settings-action";
    resetButton.id = "resetButton";
    resetButton.onclick = async () => Reset();
    resetButton.textContent = "Reset";
    mainButtonContainer.appendChild(resetButton);

    renderView();

    loadingApp.style.display = "none";
    labelApp.style.display = "";
}
