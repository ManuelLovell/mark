import OBR from '@owlbear-rodeo/sdk';
import { Marked } from './marked';

await OBR.onReady(async () =>
{
    const sceneReady = await OBR.scene.isReady();
    
    if (sceneReady === false)
    {
        const startup = OBR.scene.onReadyChange(async (ready) =>
        {
            if (ready)
            {
                startup(); // Kill startup Handler
                await Marked();
            }
        });
    }
    else
    {
        await Marked();
    }
});
