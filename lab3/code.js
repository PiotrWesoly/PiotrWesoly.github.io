let element;
let elementId;
let elementList;
let elementIndex;
let dropIndex;

  document.addEventListener("dragstart", ({target}) => {
      if (target.className == "element") 
      {
		  element = target;
	  } 
      else if (target.className == "input") 
      {
		  element = target.parentNode;
	  }else
      {
        return;
      }

      elementId = element.id;
      elementList = element.parentNode.children;

      for(let i = 0; i < elementList.length; i++) 
      {
      	if(elementList[i] === element)
        {
          elementIndex = i;
        }
      }
  });

  document.addEventListener("dragover", (event) => {
      event.preventDefault();
  });

  document.addEventListener("drop", ({target}) => {
   let draggedElement;

   if(target.className == "element" || target.className == "input")
   {
        if(target.className == "element") 
        {
            draggedElement = target;
        } 
        else if (target.className == "input") 
        {
            draggedElement = target.parentNode;
        } 
        else 
        {
            return;
        }
        
        if(draggedElement.id !== elementId) 
        {
            element.remove(element);
            for(let i = 0; i < elementList.length; i++) {
                if(elementList[i] === draggedElement)
                {
                dropIndex = i;
                }
            }
            if(elementIndex > dropIndex) 
            {
                draggedElement.before(element);
                return;
            } 
            draggedElement.after(element);
            }
    }

     if(target.className == "cell") {
        let parsedId = parseId(target.id);

        console.log(parsedId);
        let yCoordinate = parsedId[0];
        console.log(array);
        while (yCoordinate + 1 < height) {
            yCoordinate++;
            console.log(yCoordinate);
            if (array[yCoordinate][parsedId[1]] == true) {
                let cell = document.getElementById((yCoordinate - 1) + "_" + parsedId[1]);
                cell.style.background = color;
                array[yCoordinate - 1][parsedId[1]] = true;
                return;
            }
        }
        let cell = document.getElementById(height - 1 + "_" + parsedId[1]);
        cell.style.background = color;
        array[height - 1][parsedId[1]] = true;
        } 
  });

let color;

function setRandomColor() {
    console.log("DUPA");
	color = getRandomColor();
	document.getElementById('box').style.background = color;
  }

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let width = 8;
let height = 4;

function init(event)
{
    let platform = document.getElementById('platform');
	array = new Array(height);

    console.log("INIT");

	for (var i = 0; i < height; i++) {
        array[i] = new Array(width);
        let newTr = document.createElement("tr");
        platform.appendChild(newTr);
        for (var j = 0; j < width; j++) {
            array[i][j] = false;
            let newTd = document.createElement("td");
            newTd.id = i + "_" + j;
            newTd.className = "cell";
            // newTd.textContent="CELL"+i+"-"+j;
            newTr.appendChild(newTd);
        }
    }
}

function parseId(id) {
	let parsedId = id.split("_");
	parsedId[0] = parseInt(parsedId[0]);
	parsedId[1] = parseInt(parsedId[1]);
	return parsedId;
  }