import OBR, { Image, Label, Metadata, buildLabel } from "@owlbear-rodeo/sdk";
import { CombineGUIDs } from "./utilities";
import { Constants } from "./constants";

export class LabelLogic
{
    static async UpdateLabel(image: Image, labelData: ILabelData, distance: string, opacity: string): Promise<void>
    {
        const comboId = CombineGUIDs(image.id, labelData.Id);
        const labelItemExists = await OBR.scene.items.getItems([comboId]);
        const backgroundColor = "#242424";
        const labelSpacing = parseInt(distance);
        const labelOpacity = (+opacity / 100);
        // Calculate offset based on DPI for images resizd in the manager
        const dpiOffset = image.grid.dpi / 150;

        let placement = 0;

        if (labelItemExists.length === 0)
        {
            const brothers = await OBR.scene.items.getItems<Label>((item: any) =>
                item.attachedTo === image.id
                && item.type === "LABEL"
                && item.style.pointerDirection === GetOppDir(labelData.Direction));

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

            const label = buildLabel().fillColor(labelData.Color).plainText(labelData.Name).fillOpacity(labelOpacity).build();
            label.id = comboId;
            label.type = "LABEL"; // Set Item Type
            label.attachedTo = image.id; // Set Token Attached To
            label.visible = image.visible ? true : false; // Set Visibility
            label.locked = true; // Set Lock, Don't want people to touch
            label.position = { x: image.position.x, y: image.position.y };
            label.metadata = markMeta;
            label.disableAttachmentBehavior = ["ROTATION", "SCALE"];

            let pointer: any; // Holder for label pointer tail
            let pointerHeight = 15;
            let pointerWidth = 15;

            if (labelData.Direction == "Top")
            {
                label.position.y -= ((image.image.height * image.scale.y / 4) / dpiOffset);
                pointer = "DOWN";
                if (brothers.length > 0 && placement !== 0)
                {
                    label.position.y -= 15;

                    label.position.y -= (labelSpacing * placement);
                }
            }
            if (labelData.Direction == "Bottom")
            {
                label.position.y += ((image.image.height * image.scale.y / 4) / dpiOffset);
                pointer = "UP";
                if (brothers.length > 0 && placement !== 0)
                {
                    label.position.y += 15;

                    label.position.y += (labelSpacing * placement);
                }
            }
            if (labelData.Direction == "Right")
            {
                label.position.x += ((image.image.width * image.scale.x / 4) / dpiOffset);
                pointer = "LEFT";
                if (brothers.length > 0 && placement !== 0)
                {
                    label.position.y += (labelSpacing * placement);
                }
            }
            if (labelData.Direction == "Left")
            {
                label.position.x -= ((image.image.width * image.scale.x / 4) / dpiOffset);
                pointer = "RIGHT";
                if (brothers.length > 0 && placement !== 0)
                {
                    label.position.y -= (labelSpacing  * placement);
                }
            }
            if (brothers.length > 0 && placement !== 0)
            {
                pointerHeight = 0;
                pointerWidth = 0;
            }
            // Need offset for consecutive tags per token side

            label.style = { backgroundColor: backgroundColor, backgroundOpacity: labelOpacity, pointerDirection: pointer, pointerWidth: pointerWidth, pointerHeight: pointerHeight, cornerRadius: 10 };

            await OBR.scene.items.addItems([label]);
        }
        else
        {
            await OBR.scene.items.deleteItems([comboId]);
        }

        function GetOppDir(direction: string): string
        {
            switch (direction)
            {
                case 'Top':
                    return 'DOWN';
                case 'Bottom':
                    return 'UP';
                case 'Right':
                    return 'LEFT';
                case 'Left':
                    return 'RIGHT';
                default:
                    throw new Error('Invalid direction');
            }
        }
    }
}