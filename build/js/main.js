
import degradation from "../../../js-modules/degradation.js";
import avatar_grid from "./avatar-grid.js";

//main function
function main(){


  var compat = degradation(document.getElementById("oow-main"));


  //browser degradation
  if(compat.browser()){
    //run app...
    avatar_grid(document.getElementById("main-grid"));
  }


} //close main()


document.addEventListener("DOMContentLoaded", main);
