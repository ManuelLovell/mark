import OBR from "@owlbear-rodeo/sdk";

const ID = "com.tutorial.initiative-tracker";

export function setupContextMenu()
{
    OBR.contextMenu.create({
        id: `${ID}/context-menu`,
        icons: [
            {
                icon: "/tag1.svg",
                label: "Mark It",
                filter: {
                    every: [
                        { key: "layer", value: "CHARACTER" },
                    ],
                },
            },
        ],
        onClick(context)
        {
            console.log(context.items[0].name);
        },
    });
}