function colorBorder(inputName) {

    console.log("duuupa");
    
//   let x = document.forms["myForm"][inputName].value;
  var element = document.getElementById(inputName);

  if (isValid(inputName) == false) {
    element.classList.remove("correct");
    element.classList.add("error");
    return false;
  }else{
    element.classList.remove("error");
    element.classList.add("correct");
    return true;
  }
}

function isValid(inputName){
    return false;

}