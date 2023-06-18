import OBR, { Image } from "@owlbear-rodeo/sdk";
import { LabelLogic } from "./label-logic";
import { Constants } from "./constants";
import './style.css'


OBR.onReady(async () =>
{
    document.documentElement.style.borderColor = "#A73335"
    document.documentElement.style.borderStyle = "solid";
    document.documentElement.style.borderWidth = "2px";
    document.documentElement.style.borderRadius = "16px";
    document.documentElement.style.height = "100%";
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const idParam = urlParams.get('targetid')!;

    const metadata = await OBR.room.getMetadata();
    const meta = metadata[`${Constants.EXTENSIONID}/metadata_marks`] as any;
    const saveData = meta?.saveData as ISaveData;

    if (saveData.Labels.length === 0)
    {
        document.querySelector("#label-list1")!.innerHTML = `
        <div>
        No labels found.
        </div>`;
    }
    else
    {
        const list1 = document.querySelector<HTMLDivElement>('#label-list1')!;
        const list2 = document.querySelector<HTMLDivElement>('#label-list2')!;
        const list3 = document.querySelector<HTMLDivElement>('#label-list3')!;
        const categoryOne = document.createElement('button');
        categoryOne.className = "categoryButton";
        categoryOne.onclick = () => ShowCategory("#1");
        const categoryTwo = document.createElement('button');
        categoryTwo.className = "categoryButton";
        categoryTwo.onclick = () => ShowCategory("#2");
        const categoryThree = document.createElement('button');
        categoryThree.className = "categoryButton";
        categoryThree.onclick = () => ShowCategory("#3");
        const footerContainer = document.querySelector<HTMLDivElement>('.footer')!;
        footerContainer.appendChild(categoryOne);
        footerContainer.appendChild(categoryTwo);
        footerContainer.appendChild(categoryThree);

        saveData.Groups.forEach((group) =>
        {
            switch (group.Num)
            {
                case '#1':
                    categoryOne.innerText = group.Name;
                    break;
                case '#2':
                    categoryTwo.innerText = group.Name;
                    break;
                case '#3':
                    categoryThree.innerText = group.Name;
                    break;
                default:
                    throw new Error('Invalid Group');
            }
        });

        saveData.Labels.forEach((label) =>
        {
            if (label.Active)
            {
                const toggleButton = <HTMLButtonElement>document.createElement('button');
                toggleButton.id = `toggle-${label.Id}`;
                toggleButton.className = 'group1';
                toggleButton.value = label.Name;
                toggleButton.title = label.Name;
                toggleButton.textContent = label.Name;
                
                if (label.Group === "#1")
                {
                    list1.appendChild(toggleButton);
                }                
                else if (label.Group === "#2")
                {
                    list2.appendChild(toggleButton);
                }                
                else
                {
                    list3.appendChild(toggleButton);
                }
            }
        });

        const toggleButtons = document.querySelectorAll('.group1');
        toggleButtons.forEach(btn =>
        {
            btn.addEventListener('click', async (e: Event) => await ToggleLabel((e.currentTarget as Element).id));
        });
        
        ShowCategory("#1");

        function ShowCategory(num: string):void
        {
            if (num === "#1")
            {
                list1.style.display = "";
                list2.style.display = "none";
                list3.style.display = "none";
            }                
            else if (num === "#2")
            {
                list1.style.display = "none";
                list2.style.display = "";
                list3.style.display = "none";
            }                
            else
            {
                list1.style.display = "none";
                list2.style.display = "none";
                list3.style.display = "";
            }
        }
    }

    async function ToggleLabel(id: string)
    {
        const cleanedId = id.substring(7);
        const label = saveData.Labels.find(label => label.Id === cleanedId);
        const target = await OBR.scene.items.getItems([idParam]) as Image[];
        await LabelLogic.UpdateLabel(target[0], label!);
        console.log("Labeled");
    }
});
