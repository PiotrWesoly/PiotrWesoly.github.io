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