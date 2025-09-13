import OBR, { Image, Metadata, buildText, Command, buildPath, PathCommand, BoundingBox, Vector2, Path, Item } from "@owlbear-rodeo/sdk";
import { CombineGUIDs, GetImageBounds } from "./utilities";
import { Constants } from "./constants";

export class LabelLogic {
    static async UpdateLabel(image: Image,
        labelData: ILabelData,
        font: string = Constants.DEFAULTFONTSIZE,
        opacity: string = Constants.DEFAULTOPACITY,
        stroke: string = Constants.DEFAULTSTROKE,
        show?: boolean): Promise<void> {
        const playerColor = await OBR.player.getColor();
        const brothers = await OBR.scene.items.getItems<Path>((item: any) =>
            item.attachedTo === image.id
            && item.type === "PATH"
            && item.metadata[`${Constants.EXTENSIONID}/direction`] === GetOppDir(labelData.Direction));
        const labelItemExists = brothers.find(item => item.name === labelData.Name);

        if (show === undefined) {
            if (labelItemExists)
                await OBR.scene.items.deleteItems([labelItemExists.id]);
            else
                await ShowLabel();
        }
        else if (show === true) {
            if (!labelItemExists) await ShowLabel();
        }
        else if (show === false) {
            if (labelItemExists) await OBR.scene.items.deleteItems([labelItemExists.id]);
        }

        async function ShowLabel() {
            // For determing item order and placement
            let placement = 0;
            let labelSpacing = 0;

            if (brothers.length > 0) {
                // Find the item bounds height for later if there are others.
                const brotherItem = await OBR.scene.items.getItemBounds([brothers[0].id]);
                labelSpacing = brotherItem.max.y - brotherItem.min.y;

                for (let index = 0; index < brothers.length + 1; index++) {
                    let spot = false;
                    spot = brothers.some((brother) => brother.metadata[`${Constants.EXTENSIONID}/place`] === index);

                    if (!spot) {
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
            label.disableHit = true;
            label.type = "TEXT"; // Set Item Type
            label.text.type = "PLAIN";
            label.text.style.fontWeight = 600;
            label.text.style.fontSize = FONTSIZE;
            label.text.style.textAlign = "CENTER";
            label.text.style.fontFamily = "Roboto";

            if (labelData.Direction == "Top") {
                label.position.x -= (labelWidth / 2);
                label.position.y = IMAGEBOUNDS.min.y - (labelHeight + 20);

                if (brothers.length > 0 && placement !== 0) {
                    label.position.y -= (labelSpacing * placement);
                }
            }
            if (labelData.Direction == "Bottom") {
                label.position.x -= (labelWidth / 2);
                label.position.y = IMAGEBOUNDS.max.y - (labelHeight / 2) + 45;

                if (brothers.length > 0 && placement !== 0) {
                    label.position.y += (labelSpacing * placement);
                }
            }
            if (labelData.Direction == "Right") {
                label.position.x = IMAGEBOUNDS.max.x + 15;
                label.position.y -= labelHeight / 2;

                if (brothers.length > 0 && placement !== 0) {
                    label.position.y += (labelSpacing * placement);
                }
            }
            if (labelData.Direction == "Left") {
                label.position.x = IMAGEBOUNDS.min.x - 15;
                label.position.x -= (labelWidth + 15);
                label.position.y -= labelHeight / 2;
                if (brothers.length > 0 && placement !== 0) {
                    label.position.y -= (labelSpacing * placement);
                }
            }
            // Need offset for consecutive tags per token side
            await OBR.scene.items.addItems([label]);

            // Add nameplate
            const labelBounds = await OBR.scene.items.getItemBounds([label.id]);
            const plateCommands = GetPlate(labelBounds, labelData.Direction, placement);

            const namePlate = buildPath()
                .name(labelData.Name)
                .commands(plateCommands)
                .position(label.position)
                .strokeOpacity(1)
                .strokeWidth(parseInt(stroke))
                .strokeColor(playerColor)
                .fillOpacity(labelOpacity)
                .fillColor(BGCOLOR)
                .metadata(markMeta)
                .attachedTo(image.id)
                .disableAttachmentBehavior(["ROTATION", "SCALE"])
                .locked(true)
                .build();

            const platesToAdd: Item[] = [namePlate];
            // Add sub nameplate if Counter === 1
            if (labelData.Counter === 1) {
                // Sub nameplate size and position
                const SUB_WIDTH = 100;
                const SUB_HEIGHT = labelBounds.max.y - labelBounds.min.y;
                let subPlatePos = { ...label.position };
                // Adjust position based on direction
                if (labelData.Direction === "Right" || labelData.Direction === "Top") {
                    subPlatePos.x += (labelBounds.max.x - labelBounds.min.x) + 10;
                } else if (labelData.Direction === "Left" || labelData.Direction === "Bottom") {
                    subPlatePos.x -= (SUB_WIDTH + 10);
                }
                // Build sub nameplate path commands (simple rounded rect)
                const r = 10; // corner radius
                const w = SUB_WIDTH;
                const h = SUB_HEIGHT;
                const subPlateCommands: PathCommand[] = [
                    [Command.MOVE, r, 0],
                    [Command.LINE, w - r, 0],
                    [Command.QUAD, w, 0, w, r],
                    [Command.LINE, w, h - r],
                    [Command.QUAD, w, h, w - r, h],
                    [Command.LINE, r, h],
                    [Command.QUAD, 0, h, 0, h - r],
                    [Command.LINE, 0, r],
                    [Command.QUAD, 0, 0, r, 0],
                    [Command.CLOSE]
                ];
                const subNamePlate = buildPath()
                    .name(labelData.Name + "-sub")
                    .commands(subPlateCommands)
                    .position(subPlatePos)
                    .strokeOpacity(1)
                    .strokeWidth(parseInt(stroke))
                    .strokeColor(playerColor)
                    .fillOpacity(labelOpacity)
                    .fillColor(BGCOLOR)
                    .metadata(markMeta)
                    .attachedTo(namePlate.id)
                    .disableAttachmentBehavior(["ROTATION", "SCALE"])
                    .locked(true)
                    .build();

                const minusButton = buildPath()
                    .locked(false)
                    .commands(Constants.MINUSBUTTON)
                    .scale({ x: .4, y: .4 })
                    .locked(true)
                    .name("Minus Button")
                    .metadata({ [`${Constants.EXTENSIONID}/minusId`]: namePlate.id })
                    .position({ x: subPlatePos.x + 26, y: subPlatePos.y + 27 })
                    .strokeColor(labelData.Color)
                    .strokeWidth(4)
                    .strokeOpacity(.5)
                    .disableAutoZIndex(true)
                    .zIndex(500)
                    .attachedTo(namePlate.id)
                    .layer("CONTROL")
                    .build();
                       
                const counterText = buildText()
                    .fillColor("white")
                    .plainText("1")
                    .fillOpacity(labelOpacity)
                    .strokeWidth(4)
                    .strokeColor("black")
                    .strokeOpacity(1)
                    .metadata({ [`${Constants.EXTENSIONID}/counterId`]: namePlate.id })
                    .position({ x: subPlatePos.x + 40, y: subPlatePos.y + 1})
                    .layer("CONTROL")
                    .zIndex(1000)
                    .attachedTo(namePlate.id)
                    .build();

            counterText.disableHit = true;
            counterText.type = "TEXT"; // Set Item Type
            counterText.text.type = "PLAIN";
            counterText.text.style.fontWeight = 600;
            counterText.text.style.fontSize = FONTSIZE;
            counterText.text.style.textAlign = "CENTER";
            counterText.text.style.fontFamily = "Roboto";

                const addButton = buildPath()
                    .locked(false)
                    .commands(Constants.ADDBUTTON)
                    .scale({ x: .4, y: .4 })
                    .locked(true)
                    .name("Add Button")
                    .metadata({ [`${Constants.EXTENSIONID}/addId`]: namePlate.id })
                    .position({ x: subPlatePos.x + 74, y: subPlatePos.y + 27 })
                    .strokeColor(labelData.Color)
                    .strokeWidth(4)
                    .strokeOpacity(.5)
                    .disableAutoZIndex(true)
                    .attachedTo(namePlate.id)
                    .zIndex(500)
                    .layer("CONTROL")
                    .build();

                platesToAdd.push(subNamePlate, minusButton, counterText,addButton);
            }

            await OBR.scene.items.addItems(platesToAdd);
            await OBR.scene.items.updateItems([label.id], (labels) => {
                for (let label of labels) {
                    label.attachedTo = namePlate.id;
                }
            })
        }

        function GetOppDir(direction: string): number {
            switch (direction) {
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

        /// Functions
        function GetPlate(boundingBox: BoundingBox, side: string, placement: number) {
            const plateSpacing = boundingBox.max.y - boundingBox.min.y;

            const xPos = boundingBox.min.x;
            const yPos = boundingBox.min.y;
            const minBound: Vector2 = { x: boundingBox.min.x - 10, y: boundingBox.min.y };
            const maxBound: Vector2 = { x: boundingBox.max.x + 10, y: boundingBox.min.y + plateSpacing };

            const minX = minBound.x - xPos;
            const maxX = maxBound.x - xPos;

            const minY = minBound.y - yPos;
            const maxY = maxBound.y - yPos;

            const height = Math.abs(maxY - minY);
            const radius = height / 2;
            const width = maxX - minX;
            const triangleWidth = 10;//(maxX - minX) * 0.1; // Width of the triangle (10% of the width)

            if (placement !== 0 && (side === "Top" || side === "Bottom")) {
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
            else if (side === "Top") {
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
            else if (side === "Bottom") {
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
            else if (side === "Left") {
                //Start drawing the path
                const nameplateCommands: PathCommand[] = [
                    // Move to the starting point on the left semi-circle
                    [Command.MOVE, minX + radius, minY],
                    [Command.QUAD, minX, minY, minX, minY + radius],
                    [Command.LINE, minX, maxY - radius],
                    [Command.QUAD, minX, maxY, minX + radius, maxY],
                    [Command.LINE, maxX - radius, maxY],
                    [Command.QUAD, maxX, maxY, maxX, (maxY + minY) / 2 + 5],
                    [Command.LINE, image.position.x - xPos, image.position.y - yPos],
                    [Command.LINE, maxX, (maxY + minY) / 2 - 5],
                    [Command.QUAD, maxX, minY, maxX - radius, minY],
                    [Command.LINE, minX + radius, minY],
                    // Close the path
                    [Command.CLOSE]
                ];
                return nameplateCommands;
            }
            else {
                //Start drawing the path
                const nameplateCommands: PathCommand[] = [
                    [Command.MOVE, minX + radius, minY],
                    [Command.QUAD, minX, minY, minX, (maxY + minY) / 2 - 5],
                    [Command.LINE, minX, (maxY + minY) / 2 - 5],
                    [Command.LINE, image.position.x - xPos, image.position.y - yPos],
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

        function getTextWidth(text: string, fontSize: string): number {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                throw new Error("Canvas 2D context is not supported.");
            }

            ctx.font = fontSize;
            const textMetrics = ctx.measureText(text);
            return textMetrics.width;
        }

        function getTextHeight(text: string, fontSize: string): number {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                throw new Error("Canvas 2D context is not supported.");
            }

            ctx.font = fontSize;
            const textMetrics = ctx.measureText(text);
            const height = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
            return height;
        }
    }
}