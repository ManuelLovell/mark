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
        async onClick(context, elementId: string)
        {
            if (context.items.length == 1)
            {
                await OBR.popover.open({
                    id: Constants.LABELSID,
                    url: `/labelpicker.html?targetid=${context.items[0].id}`,
                    height: 250,
                    width: 300,
                    anchorElementId: elementId
                });
            }
            else
            {
                await OBR.popover.open({
                    id: Constants.LABELSID,
                    url: `/labelpicker.html?targetid=${context.items.map(item => item.id).toString()}&multi=true`,
                    height: 250,
                    width: 300,
                    anchorElementId: elementId
                });
            }
        },
    });
}