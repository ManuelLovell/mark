import OBR, { Image, Text, Metadata, buildText } from "@owlbear-rodeo/sdk";
import { CombineGUIDs } from "./utilities";
import { Constants } from "./constants";

export class LabelLogic
{
    static async UpdateLabel(image: Image, labelData: ILabelData, font: string, opacity: string): Promise<void>
    {
        const comboId = CombineGUIDs(image.id, labelData.Id);
        //const backgroundColor = "#242424";
        const fontSize = parseInt(font);
        const labelSpacing = fontSize > 48 ? 36 + (fontSize / 3) : 36;
        const labelOpacity = (+opacity / 100);
        // Calculate offset based on DPI for images resizd in the manager
        const dpiOffset = image.grid.dpi / 150;
        const fontFam = fontSize + "px Roboto";
        const labelLength = getTextWidth(labelData.Name, fontFam);
        const labelHeight = getTextHeight(labelData.Name, fontFam);

        let placement = 0;

        const brothers = await OBR.scene.items.getItems<Text>((item: any) =>
            item.attachedTo === image.id
            && item.type === "TEXT"
            && item.text.style.fontWeight === GetOppDir(labelData.Direction));

        const labelItemExists = brothers.find(item => item.text.plainText === labelData.Name);

        if (!labelItemExists)
        {
            if (brothers.length > 0)
            {
                for (let index = 0; index < brothers.length + 1; index++)
                {
                    const spot = brothers.find((brother) =>
                    {
                        const meta = brother.metadata[`${Constants.EXTENSIONID}/place`] as any;
                        const num = meta.placement as number;
                        return num === index;
                    });

                    if (!spot)
                    {
                        placement = index;
                        break;
                    }
                }
            }

            let markMeta: Metadata = {};
            markMeta[`${Constants.EXTENSIONID}/place`] = { placement };

            const label = buildText().fillColor(labelData.Color).plainText(labelData.Name).fillOpacity(labelOpacity).strokeWidth(1.75).strokeColor("black").strokeOpacity(1).build();
            label.id = comboId;
            label.type = "TEXT"; // Set Item Type
            label.attachedTo = image.id; // Set Token Attached To
            label.visible = image.visible ? true : false; // Set Visibility
            label.locked = true; // Set Lock, Don't want people to touch
            label.position = { x: image.position.x, y: image.position.y };
            label.metadata = markMeta;
            label.disableAttachmentBehavior = ["ROTATION", "SCALE"];
            label.text.style.fontWeight = GetOppDir(labelData.Direction);
            label.text.type = "PLAIN";
            label.text.style.fontSize = fontSize;
            label.text.style.textAlign = "CENTER";

            if (labelData.Direction == "Top")
            {
                label.position.y -= ((image.image.height * image.scale.y / 4) / dpiOffset) + (image.image.height / 4);
                if (brothers.length > 0 && placement !== 0)
                {
                    label.position.y -= (labelSpacing * placement);
                }
            }
            if (labelData.Direction == "Bottom")
            {
                label.position.y -= ((image.image.height * image.scale.y / 4) / dpiOffset) - (image.image.height / 4);
                label.position.x -= labelLength;
                if (brothers.length > 0 && placement !== 0)
                {
                    label.position.y += (labelSpacing * placement);
                }
            }
            if (labelData.Direction == "Right")
            {
                label.position.x += ((image.image.width * image.scale.x / 4) / dpiOffset);
                label.position.y -= labelHeight / 2;
                if (brothers.length > 0 && placement !== 0)
                {
                    label.position.y += (labelSpacing * placement);
                }
            }
            if (labelData.Direction == "Left")
            {
                label.position.x -= ((image.image.width * image.scale.x / 4) / dpiOffset);
                label.position.x -= labelLength;
                label.position.y -= labelHeight / 2;
                if (brothers.length > 0 && placement !== 0)
                {
                    label.position.y -= (labelSpacing * placement);
                }
            }
            // Need offset for consecutive tags per token side
            await OBR.scene.items.addItems([label]);
        }
        else
        {
            await OBR.scene.items.deleteItems([labelItemExists.id]);
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