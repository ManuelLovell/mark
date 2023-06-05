import OBR, { Item, Label, buildLabel } from "@owlbear-rodeo/sdk";
import { Constants } from "./constants";

export class LabelLogic
{
    /**Creates/Updates the Label that says GO on the current turn unit; Utilizes OBR.ADDITEMS or OBR.UPDATEITEMS */
    static async UpdateLabel(iii: IItemImage, labelData: ILabelData): Promise<void>
    {
        // Need filter to find the label for THIS image with THIS label
        const labelItemExists = await OBR.scene.items.getItems();

        // Keep calls separate to minimize the amount of calls - Only one ADD or one UPDATE.
        if (labelItemExists.length == 0)
        {
            const label = buildLabel().fillColor(labelData.Color).plainText(labelData.Name).build();
            label.type = "LABEL"; // Set Item Type
            label.attachedTo = iii.id; // Set Token Attached To
            label.visible = iii.visible ? true : false; // Set Visibility
            label.locked = true; // Set Lock, Don't want people to touch
            label.position = { x: iii.xpos, y: iii.ypos };
            let pointer: any; // Holder for label pointer tail
            if (labelData.Direction == "Top")
            {
                label.position.y - 200; pointer = "DOWN";
            }
            if (labelData.Direction == "Bottom")
            {
                label.position.y + 200; pointer = "UP";
            }
            if (labelData.Direction == "Right")
            {
                label.position.x + 200; pointer = "LEFT";
            }
            if (labelData.Direction == "Left")
            {
                label.position.x - 200; pointer = "RIGHT";
            }
            // Need offset for consecutive tags per token side
            label.style = { backgroundColor: "#A73335", backgroundOpacity: .5, pointerDirection: pointer, pointerWidth: 15, pointerHeight: 15, cornerRadius: 10 };

            await OBR.scene.items.addItems([label]);
        }
        else
        {
            await OBR.scene.items.updateItems(
                (item: Item) => item.id == Constants.LABEL,
                (items: Label[]) =>
                {
                    for (let label of items)
                    {
                        const table = <HTMLTableElement>document.getElementById("initiative-list");
                        if (table.rows?.length > 1)
                        {
                            for (var i = 0, row; row = table.rows[i]; i++) 
                            {
                                if (row.className == "turnOutline")
                                {

                                    label.position = { x: iii.xpos, y: iii.ypos - 100 };
                                    label.visible = iii.visible ? true : false;
                                    label.text.plainText = label.visible ? labelText : labelText + "\r\n(Hidden)";
                                    label.attachedTo = iii.id;
                                    label.locked = true;
                                }
                            }
                            if (!iii.visible)
                            {
                                label.visible = false;
                            }
                        }
                    }
                }
            );
        }
    }
}