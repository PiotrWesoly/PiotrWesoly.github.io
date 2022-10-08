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
    let input = document.getElementById(inputName);

    if(inputName == 'fmial')
    {
        return input.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
    }
    else if(inputName == 'lpost')
    {
        return input.match();
    }
    return false;

}