import OBR, { isImage } from "@owlbear-rodeo/sdk";
import { Constants } from "./constants";
import { isValidHexColor } from "./utilities";
import { LabelLogic } from "./label-logic";

export function InitiateListeners()
{
    OBR.broadcast.onMessage(Constants.MARKCONNECT, async (data) =>
    {
        if (Array.isArray(data.data))
        {
            const transmitDataPack = data.data as ITransmitData[];
            if (transmitDataPack.length > 0)
            {
                // Find the room data to see what we can use
                const metadata = await OBR.room.getMetadata();
                const sceneTokens = await OBR.scene.items.getItems(x => isImage(x));
                const meta = metadata[`${Constants.EXTENSIONID}/metadata_marks`] as any;
                const saveData = meta?.saveData as ISaveData;

                // If for some reason the settings aren't established, set the defaults
                let currentDistance = saveData.Distance ?? "36";
                let currentOpacity = saveData.Opacity ?? "85";

                for (const transmitData of transmitDataPack)
                {
                    // Create our base label
                    const currentLabel: ILabelData =
                    {
                        Active: 1,
                        Direction: transmitData.Direction ?? "Top",
                        Color: isValidHexColor(transmitData.Color) ? transmitData.Color! : "#FFFFFF",
                        Group: "#1",
                        Name: transmitData.LabelName,
                        Id: `TID-${transmitData.LabelName}`
                    };

                    // Try to find the existing one if it's there
                    const existingLabel = saveData.Labels.find(label => label.Name === transmitData.LabelName);
                    if (existingLabel)
                    {
                        currentLabel.Direction = existingLabel.Direction;
                        currentLabel.Color = existingLabel.Color;
                        currentLabel.Id = existingLabel.Id;
                    }

                    const targetToken = sceneTokens.find(x => x.id === transmitData.TokenId);
                    if (targetToken)
                        await LabelLogic.UpdateLabel(targetToken, currentLabel, currentDistance, currentOpacity, transmitData.Show);
                }
            }
        }
    });
}