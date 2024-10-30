import OBR from "@owlbear-rodeo/sdk";
import { Constants } from "./constants";

const ID = "com.battle-system.mark-menu";

export function setupContextMenu()
{
    OBR.contextMenu.create({
        id: `${ID}/context-menu`,
        icons: [
            {
                icon: "/tag1.svg",
                label: "Mark It",
                filter: {
                    some: [
                        { key: "layer", value: "CHARACTER", coordinator: "||" },
                        { key: "layer", value: "MOUNT" }],
                },
            },
        ],
        async onClick(_context, elementId: string)
        {
            await OBR.popover.open({
                id: Constants.LABELSID,
                url: `/labelpicker.html`,
                height: 250,
                width: 300,
                anchorElementId: elementId
            });
        },
        embed: { url: `/labelpicker.html?contextmenu=true`, height: 200 }
    });
}