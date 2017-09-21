var avancement; 
avancement = 0 ;

min_range = 0 ;
max_range = 120 ;


var monStockage = localStorage;

function readTextFile(file, callback) {

    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
        if (rawFile.status != "200"){
            console.log("personal error " + rawFile.status)
        }
        
    }

    rawFile.send(null);

}
function checkCo() {
        
    //console.log('check here');
    Offline.check();
    // console.log(Offline);
    if( Offline.state === 'up'){
        $("#connetion").text('p');
    }
    if( Offline.state === 'down'){
        $("#connetion").text('t');
    }
    console.log(Offline.state);

}


$(document).ready(function(){


    setInterval(function(){ 
        checkCo(); 
    }, 3000);

    readTextFile('./data/question.json', function(text){

        var data = JSON.parse(text);
        monStockage.clear();
        monStockage.setItem("question_list" , text );
        
        $("#question").text(data[0].content);

        $("#rep1").text(data[0].possible_response[0]);
        $("#rep2").text(data[0].possible_response[1]);
        $("#rep3").text(data[0].possible_response[2]);
        $("#rep4").text(data[0].possible_response[3]);
        $("#rep5").text(data[0].possible_response[4]);
       
    }) ;
    
    
    readTextFile('./data/response.json', function(text){
        var data = JSON.parse(text);
        
        var i = 0;
        var object_name = "";
        //console.log(data.length);

        for (var i = 0; i < data.length ; i++) {
            object_name = "saved_response" + i.toString();
            monStockage.setItem( object_name , data[i].selected_response );
        }
        var res = data[0].selected_response.split("|");
        var len = res.length+1 ;

        for (var j = 1 ; j < len ; j++) {
            var zone = "rep"+j.toString();

            if(res[j-1] == 'true'){
                document.getElementById(zone).classList.add("active");
            } else if (res[j] == 'false'){
                document.getElementById(zone).classList.remove("active");
            }
        }
    })
    refreshAwnsers();
});
/// --------------------------------
function SetToUnvalidate() {
    document.getElementById("validate").classList.remove("btn-success");
    document.getElementById("validate").classList.add("btn-warning");
    $("#validate").text("réponse non validé");
}
/// --------------------------------
function SetToValidate() {
    document.getElementById("validate").classList.remove("btn-warning");
    document.getElementById("validate").classList.add("btn-success");
    $("#validate").text("ces réponses ont été validés");
}
/// --------------------------------
function SetA() {
    if(document.getElementById("rep1").checked == false){
        document.getElementById("rep1").checked = true;
        document.getElementById("rep1").classList.add("active");
    } else{
        document.getElementById("rep1").checked = false;
        document.getElementById("rep1").classList.remove("active");
    }
    SetToUnvalidate();
   
}
function SetB() {
    if(document.getElementById("rep2").checked == false){
        document.getElementById("rep2").checked = true;
        document.getElementById("rep2").classList.add("active");
    } else{
        document.getElementById("rep2").checked = false;
        document.getElementById("rep2").classList.remove("active");
    }
    SetToUnvalidate();

}
function SetC() {
    if(document.getElementById("rep3").checked == false){
        document.getElementById("rep3").checked = true;
        document.getElementById("rep3").classList.add("active");
    } else{
        document.getElementById("rep3").checked = false;
        document.getElementById("rep3").classList.remove("active");
    }
    SetToUnvalidate();

}
function SetD() {
    if(document.getElementById("rep4").checked == false){
        document.getElementById("rep4").checked = true;
        document.getElementById("rep4").classList.add("active");
    } else{
        document.getElementById("rep4").checked = false;
        document.getElementById("rep4").classList.remove("active");
    }
    SetToUnvalidate();

}
function SetE() {
    if(document.getElementById("rep5").checked == false){
        document.getElementById("rep5").checked = true;
        document.getElementById("rep5").classList.add("active");
    } else{
        document.getElementById("rep5").checked = false;
        document.getElementById("rep5").classList.remove("active");
    }
    SetToUnvalidate();
}
/// --------------------------------
function refreshQuestion() {

    //console.log("monStockage.question_list");
    storage_data = JSON.parse(monStockage.question_list);

    $("#question").text(storage_data[avancement].content);

    $("#rep1").text(storage_data[avancement].possible_response[0]);
    $("#rep2").text(storage_data[avancement].possible_response[1]);
    $("#rep3").text(storage_data[avancement].possible_response[2]);
    $("#rep4").text(storage_data[avancement].possible_response[3]);
    $("#rep5").text(storage_data[avancement].possible_response[4]);

    SetToValidate();
    console.log(Offline.check());
    refreshAwnsers()
}
/// --------------------------------
function refreshAwnsers() {

    //console.log("monStockage.question_list");
    var responseText ="saved_response"+ avancement.toString() ;
    storage_data = monStockage[responseText];

    var res = storage_data.split("|");

    len = res.length + 1;

    for (var k = 1 ; k < len ; k++){
        element = "rep" + k.toString();
        if(res[k-1] =="true"){
                document.getElementById(element).checked = true;
                document.getElementById(element).classList.add("active");
        }else if (res[k-1] =="false"){
                document.getElementById(element).checked = false;
                document.getElementById(element).classList.remove("active");
        };
    }
}
/// --------------------------------
function nextQuestion() {

    if (avancement < max_range){

        avancement = avancement +1;

        refreshQuestion();

    }
}
/// --------------------------------
function previousQuestion() {

    if (avancement > min_range){

        avancement = avancement - 1;

        refreshQuestion();

    }  
}
/// --------------------------------
function validateQuestion() {

    var answers_to_send = "";

    for (var k = 1 ; k < 6 ; k++){
        element = "rep" + k.toString();
        
        if(document.getElementById(element).checked == true){
            answers_to_send = answers_to_send+'true';  
        }else if (document.getElementById(element).checked == false){
            answers_to_send = answers_to_send+'false';   
        };
        if( k != 5 ) {
            answers_to_send = answers_to_send+'|';
        }
        
    }
    storage_data = monStockage['saved_response0']
    console.log('in bdd : ' + storage_data);
    var responseText ="saved_response"+ avancement.toString() ;
    monStockage.setItem(responseText , answers_to_send );
    console.log('in form : ' + answers_to_send);
    storage_data = monStockage['saved_response0']
    console.log('in bdd(after) : ' + storage_data); 
    refreshQuestion();
}


