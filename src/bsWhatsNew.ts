import OBR from "@owlbear-rodeo/sdk";
import { Constants } from "./constants";
import '/src/WHATSNEW_style.css'


const whatsnew = document.querySelector<HTMLDivElement>('#clash-whatsnew')!;
const footer = document.querySelector<HTMLElement>('#clash-whatsnew-notes')!;

whatsnew.innerHTML = `
  <div id="newsContainer">
    <h1>Marked! 1/8</h1>
    Getting some uniformity between things.
    </br>
    The positioning on labels has been adjusted. It was a lot of guesswork before, and now it relies on the same positioning that Clash uses for HP bars/numbers.
    </br>
    Also took advantage of the ContextMenu embed for the menu, which will result in a few less clicks to get your labels up.  Slimmed it down to only 2 columns though, as it's not a large menu and I didn't want to bloat the screen.
    </br>
    If the ability to use the old display labels ever comes back (I had to do away with them because they didn't scale with the viewport), I'll go back to those also. Or.. if that ever becomes an absolute no, I may just customize some borders for it. We'll see.
    </br>
    Enjoy!
    </br>
    </br>
  </div>
`;

OBR.onReady(async () =>
{
    footer.innerHTML = `
    <a href="https://www.patreon.com/battlesystem" target="_blank">Patreon!</a>
    <a href="https://discord.gg/ANZKDmWzr6" target="_blank">Join the OBR Discord!</a>
    <div class="close"><img style="height:40px; width:40px;" src="/close-button.svg"</div>`;

    const closebutton = document.querySelector<HTMLElement>('.close')!;
    closebutton!.onclick = async () =>
    {
        await OBR.modal.close(Constants.EXTENSIONWHATSNEW);
    };
});
