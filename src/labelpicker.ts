import OBR, { Image, Path } from "@owlbear-rodeo/sdk";
import { createElement, Tag, Shield, Bolt, Star, Skull, Heart, Plus, X, Settings2, Zap, Flame, SunMedium, MoonStar, Sparkles, Gem, CircleAlert, TriangleAlert, Ghost, Crown, Sword, Compass } from "lucide";
import { LabelLogic } from "./label-logic";
import { Constants } from "./constants";
import * as Utilities from "./utilities";
import "./style.css";

type GroupIcon = {
    key: string;
    icon: typeof Tag;
};

const GROUP_ICONS: GroupIcon[] = [
    { key: "tag", icon: Tag },
    { key: "shield", icon: Shield },
    { key: "bolt", icon: Bolt },
    { key: "star", icon: Star },
    { key: "skull", icon: Skull },
    { key: "heart", icon: Heart },
    { key: "plus", icon: Plus },
    { key: "x", icon: X },
    { key: "settings-2", icon: Settings2 },
    { key: "zap", icon: Zap },
    { key: "flame", icon: Flame },
    { key: "sun-medium", icon: SunMedium },
    { key: "moon-star", icon: MoonStar },
    { key: "sparkles", icon: Sparkles },
    { key: "gem", icon: Gem },
    { key: "circle-alert", icon: CircleAlert },
    { key: "triangle-alert", icon: TriangleAlert },
    { key: "ghost", icon: Ghost },
    { key: "crown", icon: Crown },
    { key: "sword", icon: Sword },
    { key: "compass", icon: Compass },
];

OBR.onReady(async () => {
    document.documentElement.style.borderRadius = "16px";
    document.documentElement.style.height = "100%";

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const contextMenu = urlParams.get("contextmenu");

    let attachedLabels: Path[] = [];
    const selected = await OBR.player.getSelection();
    const target = await OBR.scene.items.getItems(selected) as Image[];

    if (selected?.length === 1) {
        attachedLabels = await OBR.scene.items.getItems<Path>((item: any) =>
            item.attachedTo === target[0].id && item.type === "PATH");
    }

    const theme = await OBR.theme.getTheme();
    Utilities.SetThemeMode(theme, document);
    OBR.theme.onChange((nextTheme) => {
        Utilities.SetThemeMode(nextTheme, document);
    });

    const metadata = await OBR.room.getMetadata();
    const meta = metadata[`${Constants.EXTENSIONID}/metadata_marks`] as { saveData?: ISaveData } | undefined;
    const saveData = meta?.saveData;

    const list = document.getElementById("picker-list") as HTMLDivElement;
    const tabContainer = document.getElementById("picker-tabs") as HTMLDivElement;
    const filterInput = document.getElementById("pickerFilter") as HTMLInputElement;

    if (!saveData || !saveData.Labels || saveData.Labels.length === 0) {
        list.innerHTML = "<div>No labels found.</div>";
        return;
    }

    if (contextMenu) {
        list.classList.remove("btn-group");
        list.classList.add("context-btn-group");
    }

    const currentSaveData = saveData;

    const groups = (currentSaveData.Groups && currentSaveData.Groups.length > 0)
        ? currentSaveData.Groups
        : [{ Num: "#1", Name: "Group #1" }];

    let activeGroup = groups[0].Num;
    let activeFilter = "";

    function getIconForGroup(group: IGroup): typeof Tag {
        const iconKey = group.Icon || "tag";
        return (GROUP_ICONS.find((entry) => entry.key === iconKey) || GROUP_ICONS[0]).icon;
    }

    const renderTabs = () => {
        tabContainer.innerHTML = "";

        groups.forEach((group) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = `picker-group-tab ${group.Num === activeGroup ? "active" : ""}`;
            button.title = group.Name;

            const iconWrap = document.createElement("span");
            iconWrap.className = "picker-group-icon";
            iconWrap.style.color = group.IconColor || "#ffffff";
            iconWrap.appendChild(createElement(getIconForGroup(group)));

            button.appendChild(iconWrap);
            button.onclick = () => {
                activeGroup = group.Num;
                renderTabs();
                renderLabels();
            };
            tabContainer.appendChild(button);
        });
    };

    const renderLabels = () => {
        list.innerHTML = "";

        const labelsToRender = currentSaveData.Labels
            .filter((label) => label.Active && label.Group === activeGroup)
            .filter((label) => {
                if (activeFilter.length === 0) return true;
                return label.Name.toLowerCase().includes(activeFilter);
            });

        if (labelsToRender.length === 0) {
            list.innerHTML = activeFilter.length > 0
                ? "<div class='picker-empty'>No labels match your filter.</div>"
                : "<div class='picker-empty'>No active labels in this group.</div>";
            return;
        }

        labelsToRender.forEach((label) => {
            const highlight = attachedLabels.find((attach) => attach.name === label.Name);
            const button = document.createElement("button");
            button.id = `toggle-${label.Id}`;
            button.className = `group1${highlight ? " highlight" : ""}`;
            button.value = label.Name;
            button.title = label.Name;
            button.textContent = label.Name;
            button.addEventListener("click", async (event) => {
                await ToggleLabel(event.currentTarget as Element);
            });
            list.appendChild(button);
        });
    };

    renderTabs();
    renderLabels();

    filterInput.oninput = () => {
        activeFilter = filterInput.value.trim().toLowerCase();
        renderLabels();
    };

    async function ToggleLabel(elem: Element) {
        const cleanedId = elem.id.substring(7);
        const label = currentSaveData.Labels.find((existingLabel) => existingLabel.Id === cleanedId);
        if (!label) return;

        if (selected?.length === 1) {
            elem.className = elem.className === "group1" ? "group1 highlight" : "group1";
        }

        target.forEach(async (token) => {
            const group = groups.find((existingGroup) => existingGroup.Num === label.Group);
            const nextDistance = group?.TextSizeOverride || currentSaveData.Distance;
            const nextOpacity = group?.BgOpacityOverride || currentSaveData.Opacity;
            const nextStroke = group?.OutlineStrokeOverride || currentSaveData.Stroke;

            await LabelLogic.UpdateLabel(token, label, nextDistance, nextOpacity, nextStroke);
        });
    }
});
