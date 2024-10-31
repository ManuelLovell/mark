import OBR, { Image, Text, Metadata, buildText, Command, buildPath, PathCommand, BoundingBox } from "@owlbear-rodeo/sdk";
import { CombineGUIDs, GetImageBounds } from "./utilities";
import { Constants } from "./constants";

export class LabelLogic
{
    static async UpdateLabel(image: Image, labelData: ILabelData, font: string, opacity: string, show?: boolean): Promise<void>
    {
        const playerColor = await OBR.player.getColor();
        const brothers = await OBR.scene.items.getItems<Text>((item: any) =>
            item.attachedTo === image.id
            && item.type === "TEXT"
            && item.metadata[`${Constants.EXTENSIONID}/direction`] === GetOppDir(labelData.Direction));
        const labelItemExists = brothers.find(item => item.text.plainText === labelData.Name);

        if (show === undefined)
        {
            if (labelItemExists)
                await OBR.scene.items.deleteItems([labelItemExists.id]);
            else
                await ShowLabel();
        }
        else if (show === true)
        {
            if (!labelItemExists) await ShowLabel();
        }
        else if (show === false)
        {
            if (labelItemExists) await OBR.scene.items.deleteItems([labelItemExists.id]);
        }

        async function ShowLabel()
        {
            // For determing item order and placement
            let placement = 0;
            let labelSpacing = 0;

            if (brothers.length > 0)
            {
                // Find the item bounds height for later if there are others.
                const brotherItem = await OBR.scene.items.getItemBounds([brothers[0].id]);
                labelSpacing = brotherItem.max.y - brotherItem.min.y;

                for (let index = 0; index < brothers.length + 1; index++)
                {
                    let spot = false;
                    spot = brothers.some((brother) => brother.metadata[`${Constants.EXTENSIONID}/place`] === index);

                    if (!spot)
                    {
                        placement = index;
                        break;
                    }
                }
            }

            const GRIDDPI = await OBR.scene.grid.getDpi();
            const IMAGEBOUNDS = GetImageBounds(image, GRIDDPI);
            const COMBOID = CombineGUIDs(image.id, labelData.Id);
            const BGCOLOR = "#242424";
            const FONTSIZE = parseInt(font);
            const FONTFAM = FONTSIZE + "px Roboto";

            const labelOpacity = (+opacity / 100);
            // Calculate offset based on DPI for images resizd in the manager
            const labelWidth = getTextWidth(labelData.Name, FONTFAM);
            const labelHeight = getTextHeight("AjTg", FONTFAM); //Standardize Height based on FontFam and general Hi/Low characters.

            const markMeta: Metadata = {};
            markMeta[`${Constants.EXTENSIONID}/place`] = placement;
            markMeta[`${Constants.EXTENSIONID}/comboid`] = COMBOID;
            markMeta[`${Constants.EXTENSIONID}/direction`] = GetOppDir(labelData.Direction);

            const label = buildText()
                .fillColor(labelData.Color)
                .plainText(labelData.Name)
                .fillOpacity(labelOpacity)
                .strokeWidth(1.75)
                .strokeColor("black")
                .strokeOpacity(1)
                .build();
            label.position = { x: image.position.x, y: image.position.y };
            label.attachedTo = image.id; // Set Token Attached To
            label.visible = image.visible ? true : false; // Set Visibility
            label.locked = true; // Set Lock, Don't want people to touch
            label.metadata = markMeta;
            label.disableAttachmentBehavior = ["ROTATION", "SCALE"];
            label.type = "TEXT"; // Set Item Type
            label.text.type = "PLAIN";
            label.text.style.fontWeight = 600;
            label.text.style.fontSize = FONTSIZE;
            label.text.style.textAlign = "CENTER";
            label.text.style.fontFamily = "Roboto";

            if (labelData.Direction == "Top")
            {
                label.position.x -= (labelWidth / 2);
                label.position.y = IMAGEBOUNDS.min.y - (labelHeight + 20);

                if (brothers.length > 0 && placement !== 0)
                {
                    label.position.y -= (labelSpacing * placement);
                }
            }
            if (labelData.Direction == "Bottom")
            {
                label.position.x -= (labelWidth / 2);
                label.position.y = IMAGEBOUNDS.max.y - (labelHeight / 2) + 45;

                if (brothers.length > 0 && placement !== 0)
                {
                    label.position.y += (labelSpacing * placement);
                }
            }
            if (labelData.Direction == "Right")
            {
                label.position.x = IMAGEBOUNDS.max.x + 15;
                label.position.y -= labelHeight / 2;

                if (brothers.length > 0 && placement !== 0)
                {
                    label.position.y += (labelSpacing * placement);
                }
            }
            if (labelData.Direction == "Left")
            {
                label.position.x = IMAGEBOUNDS.min.x - 15;
                label.position.x -= (labelWidth + 15);
                label.position.y -= labelHeight / 2;
                if (brothers.length > 0 && placement !== 0)
                {
                    label.position.y -= (labelSpacing * placement);
                }
            }
            // Need offset for consecutive tags per token side
            await OBR.scene.items.addItems([label]);

            // Add nameplate
            const freshLabel = await OBR.scene.items.getItems(x => x.metadata[`${Constants.EXTENSIONID}/comboid`] === COMBOID);
            const labelBounds = await OBR.scene.items.getItemBounds(freshLabel.map(x => x.id));
            const plateCommands = GetPlate(labelBounds, labelData.Direction);

            const namePlate = buildPath()
                .commands(plateCommands)
                .strokeOpacity(1)
                .strokeWidth(4)
                .strokeColor(playerColor)
                .fillOpacity(labelOpacity)
                .fillColor(BGCOLOR)
                .build();
            namePlate.attachedTo = freshLabel[0].id; // Attach to label for cleanup/movement
            namePlate.disableHit = true;
            namePlate.disableAttachmentBehavior = ["ROTATION", "SCALE"];
            await OBR.scene.items.addItems([namePlate]);

            /// Functions
            function GetPlate(boundingBox: BoundingBox, side: string)
            {
                const plateSpacing = boundingBox.max.y - boundingBox.min.y;

                const minX = boundingBox.min.x - 10;
                const maxX = boundingBox.max.x + 10;
                const minY = boundingBox.min.y;
                const maxY = minY + plateSpacing;

                const height = Math.abs(maxY - minY);
                const radius = height / 2;
                const width = maxX - minX;
                const triangleWidth = 10;//(maxX - minX) * 0.1; // Width of the triangle (10% of the width)

                if (placement !== 0 && (side === "Top" || side === "Bottom"))
                {
                    //Start drawing the path
                    const nameplateCommands: PathCommand[] = [
                        [Command.MOVE, minX + radius, minY],
                        [Command.QUAD, minX, minY, minX, minY + radius],
                        [Command.LINE, minX, maxY - radius],
                        [Command.QUAD, minX, maxY, minX + radius, maxY],
                        [Command.LINE, maxX - radius, maxY],
                        [Command.QUAD, maxX, maxY, maxX, maxY - radius],
                        [Command.QUAD, maxX, minY, maxX - radius, minY],
                        [Command.CLOSE]
                    ];
                    return nameplateCommands;
                }
                else if (side === "Top")
                {
                    const nameplateCommands: PathCommand[] = [
                        [Command.MOVE, minX + radius, minY], // Move to the starting point on the left semi-circle
                        [Command.QUAD, minX, minY, minX, minY + radius], // Draw the left semi-circle
                        [Command.QUAD, minX, maxY, minX + radius, maxY],
                        [Command.LINE, minX + (width / 2) - triangleWidth, maxY], // Left vertex
                        [Command.LINE, minX + (width / 2), maxY + triangleWidth], // Pointer vertex
                        [Command.LINE, minX + (width / 2) + triangleWidth, maxY], // Right vertex
                        [Command.LINE, maxX - radius, maxY],
                        [Command.QUAD, maxX, maxY, maxX, maxY - radius],
                        [Command.QUAD, maxX, minY, maxX - radius, minY],

                        [Command.CLOSE] // Close the path
                    ];
                    return nameplateCommands;
                }
                else if (side === "Bottom")
                {
                    const nameplateCommands: PathCommand[] = [
                        [Command.MOVE, minX + radius, minY], // Move to the starting point on the left semi-circle
                        [Command.QUAD, minX, minY, minX, minY + radius], // Draw the left semi-circle
                        [Command.QUAD, minX, maxY, minX + radius, maxY],
                        [Command.LINE, maxX - radius, maxY],
                        [Command.QUAD, maxX, maxY, maxX, maxY - radius],
                        [Command.QUAD, maxX, minY, maxX - radius, minY],
                        [Command.LINE, minX + (width / 2) + triangleWidth, minY], // Left vertex
                        [Command.LINE, minX + (width / 2), minY - triangleWidth], // Pointer vertex
                        [Command.LINE, minX + (width / 2) - triangleWidth, minY], // Right vertex

                        [Command.CLOSE] // Close the path
                    ];
                    return nameplateCommands;
                }
                else if (side === "Left")
                {
                    //Start drawing the path
                    const nameplateCommands: PathCommand[] = [
                        // Move to the starting point on the left semi-circle
                        [Command.MOVE, minX + radius, minY],
                        [Command.QUAD, minX, minY, minX, minY + radius],
                        [Command.LINE, minX, maxY - radius],
                        [Command.QUAD, minX, maxY, minX + radius, maxY],
                        [Command.LINE, maxX - radius, maxY],
                        [Command.QUAD, maxX, maxY, maxX, (maxY + minY) / 2 + 5],
                        [Command.LINE, image.position.x, image.position.y],
                        [Command.LINE, maxX, (maxY + minY) / 2 - 5],
                        [Command.QUAD, maxX, minY, maxX - radius, minY],
                        [Command.LINE, minX + radius, minY],
                        // Close the path
                        [Command.CLOSE]
                    ];
                    return nameplateCommands;
                }
                else
                {
                    //Start drawing the path
                    const nameplateCommands: PathCommand[] = [
                        [Command.MOVE, minX + radius, minY],
                        [Command.QUAD, minX, minY, minX, (maxY + minY) / 2 - 5],
                        [Command.LINE, minX, (maxY + minY) / 2 - 5],
                        [Command.LINE, image.position.x, image.position.y],
                        [Command.LINE, minX, (maxY + minY) / 2 + 5],
                        [Command.QUAD, minX, maxY, minX + radius, maxY],
                        [Command.LINE, maxX - radius, maxY],
                        [Command.QUAD, maxX, maxY, maxX, maxY - radius],
                        [Command.QUAD, maxX, minY, maxX - radius, minY],
                        [Command.CLOSE]
                    ];
                    return nameplateCommands;
                }
            }

            function getTextWidth(text: string, fontSize: string): number
            {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                if (!ctx)
                {
                    throw new Error("Canvas 2D context is not supported.");
                }

                ctx.font = fontSize;
                const textMetrics = ctx.measureText(text);
                return textMetrics.width;
            }

            function getTextHeight(text: string, fontSize: string): number
            {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                if (!ctx)
                {
                    throw new Error("Canvas 2D context is not supported.");
                }

                ctx.font = fontSize;
                const textMetrics = ctx.measureText(text);
                const height = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
                return height;
            }
        }
        function GetOppDir(direction: string): number
        {
            switch (direction)
            {
                case 'Top':
                    return 601;
                case 'Bottom':
                    return 602;
                case 'Right':
                    return 603;
                case 'Left':
                    return 604;
                default:
                    throw new Error('Invalid direction');
            }
        }
    }
}