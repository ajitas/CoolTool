// GLOBAL VARIABLES
var valSeizure;
var selectedEvent=0;
var selectedCPR=0;
var stage_tab=0;
var back=0;

var flagNormal; 
var flagMild;
var flagMod;
var flagSev;
var flagUTA;

var flagTemp;
var displayMode=1;

var flagValidate=1;

//flags for recommendations
var flag_r2=0;
var flag_r3 =0;
var flag_r3_1 =0;
var flag_r4 =0;
var flag_r5 =0;
var flag_r6 =0;
var flag_r6_1 =0;
var flag_r7 =0;
var flag_r7_1 =0;
var flag_r8 =0;
var flag_r9 =0;
var flag_r10 =0;
var flag_r11=0;

function submitPage(elt)
  {    
  	if (flagValidate==0){
        
        if(document.getElementById("f_age").value =='')
            document.getElementById("f_age").style.borderColor='#DC143C';
        
  		return false;
  	}
    document.getElementById("r11").style.display = "list-item";

	clearNeuroTool();
	clearNeuroQues();

	// getting input data
	 var gestAge=findSelected('f_GA'); //GA
     var birthAge=document.getElementById("f_age").value; //age in hours
     //var tempSent= document.getElementById("f_events");
	 //var sentEvent= tempSent.options[tempSent.selectedIndex].value;
      var sentEvent;
      if(document.getElementById("val1").checked)
          sentEvent=1;
      else if(document.getElementById("val6").checked)
      var sentEvent=6;
     var apgar=document.getElementById("f_APGAR").value;
	 var cordPH=document.getElementById("f_cordpH").value;
	 var cordBE=Math.abs(document.getElementById("f_cordBE").value);
	 var infantPH=document.getElementById("f_infantpH").value;
	 var infantBE=Math.abs(document.getElementById("f_infantBE").value);
	 var assistVent=findSelected('f_vent');
	 var tempCpr= document.getElementById("f_cpr");
	 var cpr = tempCpr.options[tempCpr.selectedIndex].value;
	 //var cpr=selectedCPR;      


	 var cpqcc;
	 var flagAge;
	 var inelg;
	 var ansPH;
	 var ansBE;
	 flagAge=0;
	 inelg=1;


	 clearRec();
	
    //Show the child image according to the birthAge
     if(birthAge >= 6){
        jQuery("#childrawImg").attr("src", "images/clock6.png");
    } else if (birthAge >4){
        jQuery("#childrawImg").attr("src", "images/clock5.png");
    } else if (birthAge >3){
        jQuery("#childrawImg").attr("src", "images/clock4.png");
    } else if (birthAge >2){
        jQuery("#childrawImg").attr("src", "images/clock3.png");
    } else if(birthAge >1){
        jQuery("#childrawImg").attr("src", "images/clock2.png");
    } else {
        jQuery("#childrawImg").attr("src", "images/clock1.png");
    }
    
      if (document.getElementById('f_GA_NA').checked ||birthAge=='')
      {
          //ask for them
        if (document.getElementById('f_GA_NA').checked && birthAge=='')
        {
            document.getElementById('errorclsage').innerHTML = 'Please enter value between 0 to 1000';
          	('errorclsga','Please estimate the gestational age using Ballard Maturational Assessment' );
        }
        else
        {
            if (document.getElementById('f_GA_NA').checked)
            {
                checkRadioButt('errorclsga','Please estimate the gestational age using Ballard Maturational Assessment' );
            }
            else
            {
                document.getElementById("f_age").style.borderColor='#EA9579';
                document.getElementById('errorclsage').innerHTML = 'Please enter value between 0 to 1000';
            }
        }
      } // finish checking for missing GA and age
      else
      {
		elt.disabled  = 'true';
		disableFields();
		document.getElementById("report").style.display = "inline";
		document.getElementById("NeuroExam").style.display = "none";
		document.getElementById("reco").style.display="inline";
		document.getElementById("btnsubmit").disabled=true;
		document.getElementById("btnClear").disabled=false;
        document.getElementById("errorclsapgar").innerHTML = '';
        document.getElementById("errorclswbgph").innerHTML = '';
        document.getElementById("errorclswbgdef").innerHTML = '';
        document.getElementById("errorclsibgph").innerHTML = '';
        document.getElementById("errorclsibgdef").innerHTML = '';
      


	
		if (gestAge==0) 
		{
			document.getElementById("r2").style.display = "list-item";
            flag_r2 =1;
            
		}
		else
        { // start with actual logic beyond gestational and birth age

			if(birthAge>24)
				flagAge=2;
            else if(birthAge>6) // if age is between 6-24 flag it and wait for it the screening result to display recommendation
				flagAge=1; 
			else
				flagAge=0;
		
			be= Math.max(infantBE,cordBE); //get worse BE to use for screening
			ph= getWorsePh(infantPH,cordPH); //get worse PH to use for screening
			cpqcc=checkcpqcc(sentEvent, apgar, ph, be, assistVent, cpr); // dont include missing inputs
			ifunknown=checkinputs(sentEvent, apgar, infantPH, cordPH, infantBE, cordBE, assistVent, cpr); //if missing inputs


			if(cpqcc) //check if cpqcc criteria met //+ve screen
			{
				if (flagAge==1)
				{ // cpqcc qualifies but age (6hr-24hr)-- recommend late cooling
					document.getElementById("r3").style.display = "list-item"; //-ve screen, not recommened >6HOL
                    flag_r3=1;
					document.getElementById("r4").style.display = "list-item"; //caution about being a candidate if age were <6 HOL
                    flag_r4=1;
					highlightCriteriaMet(sentEvent, apgar, infantPH, infantBE, cordPH, cordBE, assistVent, cpr); //highlighed  clinical value that meet criteria

				} else if (flagAge==2){
					document.getElementById("r3").style.display = "list-item"; //-ve screen, not recommened >6HOL
                    flag_r3=1;
					document.getElementById("r3_1").style.display = "list-item"; //caustion about existing risk factors for NE, but age>24 hour
                    flag_r3_1=1;
					highlightCriteriaMet(sentEvent, apgar, infantPH, infantBE, cordPH, cordBE, assistVent, cpr); //highlighed  clinical value that meet criteria

				}

				else { //if age <6 - do the normal thing)
					document.getElementById("contact_info").style.display="inline" // to display only beyong GA check			
					document.getElementById("recoCooling").style.display = "list-item";
                    flag_r8=1;
                    flag_r9=1;
                    flag_r10=1;
                    flag_r11=1;
					document.getElementById("r8").style.display = "list-item";
                    flag_r8=1;
					document.getElementById("r9").style.display = "none";
                    flag_r9=0;
					document.getElementById("r10").style.display = "none";
                    flag_r10=0;
					// checkCordGas(cordPH, cordBE);
					// checkInfantGas(infantPH, infantBE); //check if infant or cord gas need to be obtained
					checkGas(cordPH, cordBE,infantPH, infantBE);
					highlightCriteriaMet(sentEvent, apgar, infantPH, infantBE, cordPH, cordBE, assistVent, cpr); //highlight clinical value that meet criteria
                    //if(cordPH!='' && infantPH!='')
                        performNeuroExam();

				}

			} else if (ifunknown)//check if didnt meet cpqcc but has missing inputs // screen indeterminate due to missing values
			{
				if (flagAge==1) 
				{ // if  qualifies through missing variable but age >6hr-- recommend late cooling
					document.getElementById("r3").style.display = "list-item"; //Negative Screen.Beyond 6 hours of life, cooling is NOT recommended for  routine clinical care.</span>
                    flag_r3=1;
					document.getElementById("r4").style.display = "list-item"; // caution about being a candidate if age were <6 HOL
                    flag_r4=1;
				} else if (flagAge==2){
					document.getElementById("r3").style.display = "list-item"; //-ve screen, not recommened >6HOL
                    flag_r3=1;
				}
				else 
				{ //if age <6 - do the normal thing)
					document.getElementById("contact_info").style.display="inline" // to display only beyong GA check			
					document.getElementById("r10").style.display = "none";
                    flag_r10=0;
					document.getElementById("recoCooling").style.display = "list-item";
                    flag_r8=1;
                    flag_r9=1;
                    flag_r10=1;
                    flag_r11=1;
					document.getElementById("r8").style.display = "none";
                    flag_r8=0;
					document.getElementById("r9").style.display = "block";
                    flag_r9=1;
					if (sentEvent ==1 || apgar==''|| document.getElementById("f_vent_NA").checked==1 || cpr ==1){
					document.getElementById("r10").style.display = "list-item";
                    flag_r10=1;
					}
					checkGas(cordPH, cordBE) //check if infant or cord gas need to be obtained
					
					highlightMissingEnteries(sentEvent, apgar, infantPH, infantBE, cordPH, cordBE, assistVent, cpr); //highlighed missing clinical value to prompt provider to try and get them before calling
				}
			} else 

			{ //-ve screen ~ all inputs vaialble & didnt qualify
				document.getElementById("r5").style.display = "list-item";
                flag_r5=1;
			}
		}
      }
  }//end of function
      

function checkcpqcc(sentEvent, apgar, ph, be, assistVent, cpr)
 {
	 var cpqcc = 0;
	 if ((sentEvent !=1 && sentEvent !=6)|| (apgar <=6 && apgar!='')||document.getElementById('f_vent_Y').checked ||(cpr!=5 && cpr !=1)||(ph<=7&& ph!='')|| be>=10){
	 	cpqcc=1;
	 }
	return cpqcc;
}
     
function getWorsePh (infantPH, cordPH)
{
	if (infantPH!=''&&cordPH!=''){
		return Math.min(infantPH, cordPH);
	} else if (infantPH==""){
		return cordPH;
	} else{
	  	return infantPH;
	}
}
1
function checkinputs(sentEvent, apgar, infantPH, cordPH, infantBE, cordBE, assistVent, cpr){
	var ifunknown=0;
	if (sentEvent ==1 || apgar==''|| document.getElementById('f_vent_NA').checked || cpr ==1|| (infantPH==""&&cordPH==""))//||(infantBE==""&&cordBE=="") )
	{
	 	ifunknown=1;
	 }
	 return ifunknown;


}

function checkGas(cordPH, cordBE,infantPH, infantBE)
{
    if ((cordPH==""&&cordBE=="") && (infantPH==""||infantBE==""))
    {
        document.getElementById("r6_1").style.display = "list-item";
        flag_r6_1=1;
    }
    else if (cordPH==""&&cordBE=="")
    {
        document.getElementById("r6").style.display = "list-item";
        flag_r6=1;
    }
    else if(infantPH==""&&infantBE=="")
    {
        if ((cordPH<=7&& cordPH!='')|| cordBE>=10)
        {
            document.getElementById("r7_1").style.display = "list-item";
            flag_r7_1=1;
        }
        else
        {
            document.getElementById("r7").style.display = "list-item";
            flag_r7=1;
        }
    }		
    
}

/*function checkCordGas(cordPH, cordBE){


	if (cordPH==""&&cordBE=="") {
		document.getElementById("r6").style.display = "list-item";
	} 


}
function checkInfantGas(infantPH, infantBE){

	if (infantPH==""||infantBE=="") {
		document.getElementById("r7").style.display = "list-item";
	}


}
 */

function highlightMissingEnteries(sentEvent, apgar, infantPH, infantBE, cordPH, cordBE, assistVent, cpr){

				if (apgar==""){
					document.getElementById("f_APGAR").style.background='#FFFF00'; 
				}
				if (sentEvent==1){
					document.getElementById("f_events").style.background='#FFFF00';
				}
				if (cordPH==""){
					document.getElementById("f_cordpH").style.background='#FFFF00';
				}
				if (cordBE==""){
					document.getElementById("f_cordBE").style.background='#FFFF00';
				}
				if (infantPH==""){
					document.getElementById("f_infantpH").style.background='#FFFF00';
				}
				if (infantBE==""){
					document.getElementById("f_infantBE").style.background='#FFFF00';
				}
				if (cpr==1){
					document.getElementById("f_cpr").style.background='#FFFF00';
				}
				if (document.getElementById('f_vent_NA').checked){
					 document.getElementById("vent").style.background='#FFFF00';
				}
				
}

function highlightCriteriaMet(sentEvent, apgar, infantPH, infantBE, cordPH, cordBE, assistVent, cpr){
				if (apgar <=6 && apgar!=""){
					document.getElementById("f_APGAR").style.background='#FFFF00';
				}
				if (sentEvent !=1 && sentEvent !=6){
					document.getElementById("f_events").style.background='#FFFF00';
				}
				if (cordPH<=7 && cordPH!=""){
					document.getElementById("f_cordpH").style.background='#FFFF00';
				}
				if (cordBE>=10){
					document.getElementById("f_cordBE").style.background='#FFFF00';
				}
				if (infantPH<=7 && infantPH!=""){
					document.getElementById("f_infantpH").style.background='#FFFF00';
				}
				if (infantBE>=10){
					document.getElementById("f_infantBE").style.background='#FFFF00';
				}
				if (cpr!=5 && cpr !=1){
					document.getElementById("f_cpr").style.background='#FFFF00';
				}
				if (document.getElementById('f_vent_Y').checked){
					 document.getElementById("vent").style.background='#FFFF00';
				}
				
}


function findSelected(quest)
 {
	 var selValue = 9;
	 var radios = document.getElementsByName(quest);
	 for (var i = 0, length = radios.length; i < length; i++) {
    	 if (radios[i].checked) {
             selValue = radios[i].value;
             break;
    	}
	}
	return selValue;
}
  
function getMap()
 {
	 var zip=document.getElementById("f_zip").value;
	 if(zip==''){
		 alert("you have not entered a zip code")
	 }
	 else{ 
	  window.open("http://maps.google.com/maps?ll=32.794602,-117.2301672");
	 }
 }
	

function toggleMap() {
    var x = document.getElementById('gmap');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}

function callCoolingCenter()
 {
  $(function() {
	 $(".map-modal-container").show(function(){
    $(this).find("iframe").prop("src", function(){
        return $(this).data("src");
    });
	});});
 }
 
 function performNeuroExam()
 {
	changeDisplay('1');
    setTimeout(function() { document.getElementById("hour_life").focus(); }, 1);
	document.getElementById("sug1").style.display = "none";
	document.getElementById("sug2").style.display = "inline";
	document.getElementById("reco").style.display = "none";
	document.getElementById("contact_info").style.display = "none";
	document.getElementById("recoCooling").style.display = "none";
	document.getElementById("NeuroExam").style.display = "inline";
	document.getElementById("report").style.display="none";
    //document.getElementById("result").innerHTML="Unable to Assess";
 }  

function selectedOption(elt){
	var srcID=elt.id;
	if (elt.selectedIndex !=0)
	{
		if(srcID=="f_events"){
			selectedEvent=1;
		}
		else if(srcID=="f_cpr"){
			selectedCPR=1;
		}
	}
	else
	{
		if(srcID=="f_events"){
			selectedEvent=0;
		}
		else if(srcID=="f_cpr"){
			selectedCPR=0;
		}
	}
}

/*function printReport()
{
	document.getElementById("evaluate").style.display = "none";
    document.getElementById("printBtn").style.display = "none";
 	var doc = new jsPDF("l", "mm", "a4");
   
    doc.addHTML($('#NeuroExam')[0],5,5, {
      'background': '#fff',
    }, function(){
      
      doc.save('Report_Neuro_CoolingCenter.pdf');
    });

    document.getElementById("evaluate").style.display = "inline";
    document.getElementById("printBtn").style.display = "inline";
 }
*/
function printReport1()
{
    window.print();
}
 function showPopUp(){
	 $('#popup').show();
     document.getElementById("showthis").value='';
 }
 
 function hidePopUp(){
	$('#popup').hide();  
 } 

/*function generateReport()
{
 	var doc = new jsPDF("l", "mm", "a4");;
    doc.addHTML(document.getElementById('home')
    ,function() {
    doc.save('Report_CoolingCenter.pdf');
    });
	hidePopUp();   
}  */

function back2Main(){
	document.getElementById("sug2").style.display = "none";
	document.getElementById("sug1").style.display = "inline";
	document.getElementById("reco").style.display = "inline";
	document.getElementById("NeuroExam").style.display = "none";
	document.getElementById("recoCooling").style.display = "inline";
	document.getElementById("contact_info").style.display="inline" // to display only beyong GA check
	document.getElementById("report").style.display = "inline";
}
  function closewin()
 {
	back2Main();
    /*document.getElementById("r8").style.display = "none";
    document.getElementById("r9").style.display = "none";
    document.getElementById("childdrawage").style.display="none";
    document.getElementById("r10").style.display = "none";
    document.getElementById("r6").style.display = "none";
    document.getElementById("r6_1").style.display = "none";
    document.getElementById("r7").style.display = "none";
    document.getElementById("r7_1").style.display = "none";*/
    document.getElementById("r11").style.display = "none";
	document.getElementById("neuroResult").style.display = "inline";
	if((stage_tab=='Moderate')||(stage_tab=='Severe'))
	{
		tableFlag='Moderate to Severe';

	}
	else if (stage_tab =='Unable to Assess')
	{

			tableFlag ='Incomplete Exam';

	}
	else 
	{
		tableFlag=stage_tab;
		
	}
	 var recoTable = document.getElementById("recoTable");
	 for(i=1;i<=recoTable.rows.length-1;i++)
	 {
	 	
		 if(recoTable.rows[i].cells[0].innerHTML==tableFlag)

		 {	if (tableFlag == 'Moderate to Severe' || tableFlag == 'Incomplete Exam')
			{
		 		recoTable.rows[i].cells[0].className = 'select_mod';
				recoTable.rows[i].cells[1].className = 'select_mod';
		 	} else if (tableFlag == 'Mild') 
		 	{
		 		recoTable.rows[i].cells[0].className = 'select';
				recoTable.rows[i].cells[1].className = 'select';

		 	} else {
		 		recoTable.rows[i].cells[0].className = 'select_norm';
				recoTable.rows[i].cells[1].className = 'select_norm';
		 	}
			
		 }
		 else
		 { 
		 	recoTable.rows[i].cells[0].className = '';
			recoTable.rows[i].cells[1].className = '';
		 }
	}
	
 }

function closewin1()
{
    window.history.back();
}
function chkSeizures(chk){
	var chkBoxList = document.getElementsByName(chk.name);
    var flagBothSeizureOn=0;
	valSeizure=chk.value;
	for(i=0;i<3;i++)
	{   
		if(chkBoxList[i].id!=chk.id){
			if(chkBoxList[i].checked==true){
				if((chkBoxList[i].value==0)&&(chk.value!=0)){
					chkBoxList[i].checked=false;
					document.getElementById('f_seizureBox').style.display='inline';
				}
				else if((chkBoxList[i].value!=0)&&(chk.value==0)){
					chkBoxList[i].checked=false;
					document.getElementById('f_seizureBox').style.display='none';
                    document.getElementById("f_seizureBox").value="";
                    
				}
				if((chkBoxList[i].value!=0)&&(chk.value!=0)){//if both suspected and EEG confirmed are checked
                    flagBothSeizureOn = 1;}
                
			}
            else if(chkBoxList[i].checked==false){
                if((chkBoxList[i].value==0)&&(chk.value!=0)){
                    document.getElementById('f_seizureBox').style.display='inline';
                }
                
            }
		}

	}
if((chk.value!=0)&&(chk.checked==false))//if either or both suspected & EEG confirmed were checked and now one is unchecked
{
    if(flagBothSeizureOn==1){//if both were previously checked
        valSeizure=1;}
    else //if only one was perviosuly checked
        {valSeizure=0;
        document.getElementById('f_seizureBox').style.display='none';}
}
    
    calculateSarnatStage();
 }

/*function changeDisplayNeuroAnalysis()
{
    if(document.getElementById("btnChnageView").value=="Switch to detailed view")
    {
        changeDisplay('2');
    }
    else if(document.getElementById("btnChnageView").value=="Switch to short view")
    {
        changeDisplay('1');
    }
    
}*/
function changeDisplay(mode){
	//var mode=findSelected('mode');
	
	if (mode == 0){
		switch(displayMode){
			case 1:
				displayMode=2;
                clearNeuroQues();
                sync();
				break;
			case 2:
				displayMode=1;
                clearNeuroTool();
                sync();
				break;
		}
		mode=displayMode;
		//document.getElementById("msg").style.display='none';
		//document.getElementById("result").style.display='none';
	}
	if(mode==1){// display table
        displayMode=1;
		document.getElementById("overflow").style.display="block";
		document.getElementById("neuroTable").style.display="inline-table";
        //clearNeuroTool();
		document.getElementById("neuroQues").style.display="none";
		document.getElementById("btnChnageView").value="Switch to detailed view";
		evaluateNeuroTest(1);
		if(stage_tab!=0){
			displaySarnatStage(stage_tab);
		}
	}
	else if(mode==2){//display question
        displayMode=2;
		document.getElementById("neuroTable").style.display="none";
		document.getElementById("overflow").style.display="none";
		document.getElementById("neuroQues").style.display="block";
		document.getElementById("btnChnageView").value="Switch to short view";
		changeQues(1);
		calculateAns();
		if(stage_tab!=0){
			displaySarnatStage(stage_tab);
		}
	}
}

function sync()
{
    if(displayMode==2)
    {
        var selectedCells = document.getElementsByClassName("clicked");
        for(i=0;i<selectedCells.length;i++){
            var cell = selectedCells[i];
            switch (cell.cellIndex){
                case 1:
                    switch(cell.parentElement.rowIndex){
                        case 0:document.getElementById("block1_1").checked=true;break;
                        case 2:document.getElementById("block3_1").checked=true;break;
                        case 4:document.getElementById("block7_1").checked=true;break;
                        case 6:document.getElementById("block2_1").checked=true;break;
                        case 8:document.getElementById("block4_1").checked=true;break;
                        case 10:document.getElementById("block6_1").checked=true;break;
                        case 12:document.getElementById("block5_1").checked=true;break;
                    }
                    break;
                case 2:
                    switch(cell.parentElement.rowIndex){
                        case 0:document.getElementById("block1_2").checked=true;break;
                        case 2:document.getElementById("block3_2").checked=true;break;
                        case 4:document.getElementById("block7_2").checked=true;break;
                        case 6:document.getElementById("block2_2").checked=true;break;
                        case 8:document.getElementById("block4_2").checked=true;break;
                        case 10:document.getElementById("block6_2").checked=true;break;
                        case 12:document.getElementById("block5_2").checked=true;break;
                    }
                    break;
                case 3:
                    switch(cell.parentElement.rowIndex){
                        case 0:document.getElementById("block1_3").checked=true;break;
                        case 2:document.getElementById("block3_3").checked=true;break;
                        case 4:document.getElementById("block7_3").checked=true;break;
                        case 6:document.getElementById("block2_3").checked=true;break;
                        case 8:document.getElementById("block4_3").checked=true;break;
                        case 10:document.getElementById("block6_3").checked=true;break;
                        case 12:document.getElementById("block5_3").checked=true;break;
                    }
                    break;
                case 4:
                    switch(cell.parentElement.rowIndex){
                        case 0:document.getElementById("block1_4").checked=true;break;
                        case 2:document.getElementById("block3_4").checked=true;break;
                        case 4:document.getElementById("block7_4").checked=true;break;
                        case 6:document.getElementById("block2_4").checked=true;break;
                        case 8:document.getElementById("block4_4").checked=true;break;
                        case 10:document.getElementById("block6_4").checked=true;break;
                    }
                    break;
                case 5:
                    switch(cell.parentElement.rowIndex){
                        case 0:document.getElementById("block1_5").checked=true;break;
                        case 2:document.getElementById("block3_1").checked=true;break;
                        case 4:document.getElementById("block7_5").checked=true;break;
                        case 6:document.getElementById("block2_5").checked=true;break;
                        case 8:document.getElementById("block4_5").checked=true;break;
                        case 10:document.getElementById("block6_5").checked=true;break;
                    }
                    break;
            }
        }
        
    }
    else
    {
        var block1=findSelected('block1');//LevelOfConsciousness
        var block2=findSelected('block2');//Tone
        var block3=findSelected('block3');//SpontaneousActivity
        var block4=findSelected('block4');//Suck
        var block5=findSelected('block5');//Gag
        var block6=findSelected('block6');//Moro
        var block7=findSelected('block7');//Posture
        
        if(block1==1)
            calculateResult(document.getElementsByName("loc1")[0]);
        else if(block1 ==2)
            calculateResult(document.getElementsByName("loc2")[0]);
        else if(block1 ==3)
            calculateResult(document.getElementsByName("loc3")[0]);
        else if(block1==4)
            calculateResult(document.getElementsByName("loc4")[0]);
        else if(block1==0)
            calculateResult(document.getElementsByName("loc5")[0]);
        
        if(block3==1)
            calculateResult(document.getElementsByName("sa1")[0]);
        else if(block3==2)
            calculateResult(document.getElementsByName("sa2")[0]);
        else if(block3==3)
            calculateResult(document.getElementsByName("sa3")[0]);
        else if(block3==4)
            calculateResult(document.getElementsByName("sa4")[0]);
        else if(block3==0)
            calculateResult(document.getElementsByName("sa5")[0]);
        
        if(block2 ==1)
            calculateResult(document.getElementsByName("tone1")[0]);
        else if(block2 ==2)
            calculateResult(document.getElementsByName("tone2")[0]);
        else if(block2 ==3)
            calculateResult(document.getElementsByName("tone3")[0]);
        else if(block2 ==4)
            calculateResult(document.getElementsByName("tone4")[0]);
        else if(block2 ==0)
            calculateResult(document.getElementsByName("tone5")[0]);
        
        if(block4 ==1)
            calculateResult(document.getElementsByName("suck1")[0]);
        else if(block4 ==2)
            calculateResult(document.getElementsByName("suck2")[0]);
        else if(block4 ==3)
            calculateResult(document.getElementsByName("suck3")[0]);
        else if(block4 ==4)
            calculateResult(document.getElementsByName("suck4")[0]);
        else if(block4 ==0)
            calculateResult(document.getElementsByName("suck5")[0]);
        
        if(block5 ==1)
            calculateResult(document.getElementsByName("gag1")[0]);
        else if(block4 ==3)
            calculateResult(document.getElementsByName("gag2")[0]);
        else if(block4 ==0)
            calculateResult(document.getElementsByName("gag3")[0]);
        
        if(block6 ==1)
            calculateResult(document.getElementsByName("moro1")[0]);
        else if(block6 ==2)
            calculateResult(document.getElementsByName("moro2")[0]);
        else if(block6 ==3)
            calculateResult(document.getElementsByName("moro3")[0]);
        else if(block6 ==4)
            calculateResult(document.getElementsByName("moro4")[0]);
        else if(block6 ==0)
            calculateResult(document.getElementsByName("moro5")[0]);
        
        if(block7 ==1)
            calculateResult(document.getElementsByName("pos1")[0]);
        else if(block7 ==2)
            calculateResult(document.getElementsByName("pos2")[0]);
        else if(block7 ==3)
            calculateResult(document.getElementsByName("pos3")[0]);
        else if(block7 ==4)
            calculateResult(document.getElementsByName("pos4")[0]);
        else if(block7 ==0)
            calculateResult(document.getElementsByName("pos5")[0]);
    }

}

function calculateAns(){
	var block1=findSelected('block1');
	var block2=findSelected('block2');
	var block3=findSelected('block3');
	var block4=findSelected('block4');
	var block5=findSelected('block5');
	var block6=findSelected('block6');
	var block7=findSelected('block7');
	flagTemp=0
	
	if((block1==4)||(block2==4)||(block3==4)||(block4==4)||(block6==4)||(block7==4)){
		displaySarnatStage('Severe');
		flagTemp=4;
	}
    else if((block1==3)||(block2==3)||(block3==3)||(block4==3)||(block5==3)||(block6==3)||(block7==3)){
		displaySarnatStage('Moderate');
		flagTemp=3;

	}
	else if((block1==2)||(block2==2)||(block3==2)||(block4==2)||(block6==2)||(block7==2)){
		displaySarnatStage('Mild');
		flagTemp=2;

	}
	else if((block1==1)||(block2==1)||(block3==1)||(block4==1)||(block5==1)||(block6==1)||(block7==1)){
		displaySarnatStage('Normal');
		flagTemp=1;

	} 

	if (((block1==0)||(block2==0)||(block3==0)||(block4==0)||(block5==0)||(block6==0)||(block7==0))&&flagTemp<3){
		displaySarnatStage('Unable to Assess');
		flagTemp=0;

	}

	evaluateNeuroTest(2);	
}


function displaySarnatStage(stage){
	document.getElementById("msg").style.display='inline';
	document.getElementById("result").style.display='inline';
	document.getElementById("result").innerHTML=stage;
	stageFlag=stage;		
}
function hideSarnatStage(){
	document.getElementById("msg").style.display='none';
	document.getElementById("result").style.display='none';
	stageFlag=0;		
}


function changeQues(num){
	var id;
	var spanId;
	for(i=1;i<=5;i++){
		id='quesBlock'+i;
		spanId='span'+i;
		if(i==num){
			document.getElementById(id).style.display="block";
			document.getElementById(spanId).className="scroll1";
		}
		else{
			document.getElementById(id).style.display="none";
			document.getElementById(spanId).className="scrollDis1";
		}
	}
}
function clearRec(){

	document.getElementById("f_age").style.borderColor='#ECF1F7';
	document.getElementById("GA").style.background='#ECF1F7';

	document.getElementById("f_APGAR").style.background='#FFFFFF';
	document.getElementById("f_events").style.background='#FFFFFF';
	document.getElementById("f_cordpH").style.background='#FFFFFF';
	document.getElementById("f_cordBE").style.background='#FFFFFF';
	document.getElementById("f_infantpH").style.background='#FFFFFF';
	document.getElementById("f_infantBE").style.background='#FFFFFF';
	document.getElementById("f_cpr").style.background='#FFFFFF';
	document.getElementById("vent").style.background='#ECF1F7';


	//document.getElementById("r1").style.display = "none";	
	document.getElementById("r2").style.display = "none";
    flag_r2=0;
	document.getElementById("r3").style.display = "none";
    flag_r3=0;
	document.getElementById("r3_1").style.display ="none";
    flag_r3_1=0;
	document.getElementById("r4").style.display = "none";
    flag_r4=0;
	document.getElementById("r5").style.display = "none";
    flag_r5=0;
	document.getElementById("r6").style.display = "none";
    flag_r6=0;
	document.getElementById("r6_1").style.display = "none";
    flag_r6_1=0;
	document.getElementById("r7").style.display = "none";
    flag_r7=0;
	document.getElementById("r7_1").style.display = "none";
    flag_r7_1=0;

	document.getElementById("recoCooling").style.display = "none";
    flag_r8=0;
    flag_r9=0;
    flag_r10=0;
    flag_r11=0;
	document.getElementById("contact_info").style.display="none";

}

/*function changePanel(num,event){
	for(i=0;i<event.parentElement.childElementCount;i++){
		if(event!=event.parentElement.children[i]){
			event.parentElement.children[i].className="";
		}
	}
	
	switch(num){
		case 1:
			document.getElementById("home").style.display = "block";
			document.getElementById("homeHeader").style.display = "block";
			//document.getElementById("desc_home").style.display = "block";			
			//document.getElementById("desc_tool").style.display = "none";			
			document.getElementById("home").className= "";	
			document.getElementById("NeuroExam").className = "exam";
			document.getElementById("NeuroExam").style.display = "none";
			document.getElementById("x").style.display = "inline";
			document.getElementById("evaluate").style.display = "inline";
			document.getElementById("resPro").style.display = "none";
			document.getElementById("resParent").style.display = "none";
			document.getElementById("Disclaimer").style.display = "none";
			//document.getElementById("algo").style.display = "none";
			
			break;
		case 2:
			// $("#NeuroExam").clone().appendTo("#exam");
			document.getElementById("desc_home").style.display = "none";			
			document.getElementById("desc_tool").style.display = "block";			
			document.getElementById("home").style.display = "block";
			document.getElementById("NeuroExam").style.display = "block";
			document.getElementById("x").style.display = "none";
			document.getElementById("evaluate").style.display = "none";
			document.getElementById("home").className= "Main-Div";	
			document.getElementById("NeuroExam").className = "exam Inner-Div";	
			document.getElementById("resPro").style.display = "none";
			document.getElementById("resParent").style.display = "none";
			document.getElementById("Disclaimer").style.display = "none";
			document.getElementById("algo").style.display = "none";

			break;
		case 3:
			document.getElementById("desc_home").style.display = "none";	
			document.getElementById("desc_tool").style.display = "none";						
			document.getElementById("home").style.display = "none";	
			document.getElementById("algo").style.display = "block";
			document.getElementById("resPro").style.display = "none";
			document.getElementById("resParent").style.display = "none";
			document.getElementById("Disclaimer").style.display = "none";
			break;
		case 4:
			//document.getElementById("desc_home").style.display = "none";	
			//document.getElementById("desc_tool").style.display = "none";						
			document.getElementById("home").style.display = "none"
			document.getElementById("homeHeader").style.display = "none";
			//document.getElementById("algo").style.display = "none";
			document.getElementById("resPro").style.display = "block";
			document.getElementById("resParent").style.display = "none";
			document.getElementById("Disclaimer").style.display = "none";
			break;
		case 5:
			//document.getElementById("desc_home").style.display = "none";	
			//document.getElementById("desc_tool").style.display = "none";
			document.getElementById("home").style.display = "none";	
			document.getElementById("homeHeader").style.display = "none";
			//document.getElementById("algo").style.display = "none";
			document.getElementById("resPro").style.display = "none";
			document.getElementById("resParent").style.display = "block";
			document.getElementById("Disclaimer").style.display = "none";
			break;
		case 6:
			//document.getElementById("desc_home").style.display = "none";	
			//document.getElementById("desc_tool").style.display = "none";
			document.getElementById("home").style.display = "none";
			document.getElementById("homeHeader").style.display = "none";
			//document.getElementById("algo").style.display = "none";
			document.getElementById("resPro").style.display = "none";
			document.getElementById("resParent").style.display = "none";
			document.getElementById("Disclaimer").style.display = "block";
			break;

	}
}
 */

 function calculateResult(elt)
 {
	var index;
	for (var i = 1; i < elt.parentNode.cells.length; i++) 
	{
		if (elt.parentNode.cells[i].className == "clicked") 
		{
			elt.parentNode.cells[i].className = 'active';
			index=i;
		}		
	}
	if(index!=elt.cellIndex)
	{
		elt.className = "clicked";
	}
	evaluateNeuroTest(1);
  }
  
function evaluateNeuroTest(mode){
	 var neuroTable = document.getElementById("neuroTable");
	 var numOfCol;
	 var cellInd;
	 
	flagNormal=0; 
	flagMild=0;
	flagMod=0;
	flagSev=0;
	flagUTA=0;
	var mildCount=0;
	var normCount=0;
	var len;

	 //var mode=findSelected('mode');

	if (mode==1){
	 	var selectedCells = document.getElementsByClassName("clicked");
		for(i=0;i<selectedCells.length;i++){
			var cell = selectedCells[i];
			switch (cell.cellIndex){
				case 1:
					flagNormal=1;
					break;
				case 2:
					if(cell.colSpan==1){
						flagMild=1;
					}
					else{
						flagMod=1;
					}
					break;
				case 3:
					if(cell.parentElement.rowIndex == 12){
						flagUTA=1;
					}
					else{
					flagMod=1;
					}
					break;
				case 4:
					flagSev=1;
					break;
				case 5:
					flagUTA=1;
					break;
			}			
		}
		if((selectedCells.length!=7)&&(flagMod==0)&&(flagSev==0)){
			flagUTA=1;
			flagMild=0;
			flagNormal=0;
		}
	} 
	else{
		if (flagTemp==4) {
			flagSev=1;
		} else if (flagTemp==3){
			flagMod=1;
		} else if (flagTemp==2){
			flagMild=1;
		} else if (flagTemp==1){
			flagNormal=1;
		} else if (flagTemp==0){
			flagUTA=1;
		}

	}
	calculateSarnatStage();

 }
 function calculateSarnatStage(){
	 var noneFlag=0;
	 if(flagSev==1){
		 stage_tab = 'Severe';		 
	 }
	 else if((flagMod==1)||(valSeizure>0)){
		 stage_tab = 'Moderate';
	 }
	 else if(flagMild==1){
	     if(flagUTA==1)
	        stage_tab= 'Unable to Assess';
	     else
		    stage_tab = 'Mild';
	 }
	 else if(flagNormal==1){
	     if(flagUTA==1)
	        stage_tab= 'Unable to Assess';
	     else
		    stage_tab = 'Normal';
	 }
	 else if(flagUTA==1){
		 stage_tab = 'Unable to Assess';
		 
	 }
	 else{
		 noneFlag=1;
	 }
	 
	if(noneFlag==1)
	{
		//hideSarnatStage();

	}
	else
	{
		displaySarnatStage(stage_tab);	
	}
 }
 
 function clearNeuroTool(){
	var neuroTable = document.getElementById("neuroTable");
	var recoTable = document.getElementById("recoTable");
	//var chkSeizures = document.getElementsByName("f_seizure")
	//document.getElementById("f_seizureBox").style.display='none';
    document.getElementById("result").innerHTML="Unable to Assess";
	/*for(i=0;i<3;i++){
		chkSeizures[i].checked=false;
	}*/
	var numOfCol;
	
	for(i=0;i<=recoTable.rows.length-1;i++){
		for(j=0;j<2;j++){
			recoTable.rows[i].cells[j].className = '';
		}
	}
	
	for(i=0;i<=neuroTable.rows.length-1;i++)
	 {		
		numOfCol = neuroTable.rows[i].cells.length-1;
		 for(j=1;j<=numOfCol;j++) 
		 {
				neuroTable.rows[i].cells[j].className = 'active';
		 }
	 }
	 //hideSarnatStage();
 }
 
 function clearNeuroQues(){
	var qBlock = [];
	qBlock.push(document.getElementsByName("block1"));
	qBlock.push(document.getElementsByName("block2"));
	qBlock.push(document.getElementsByName("block3"));
	qBlock.push(document.getElementsByName("block4"));
	qBlock.push(document.getElementsByName("block5"));
     qBlock.push(document.getElementsByName("block6"));
     qBlock.push(document.getElementsByName("block7"));
    document.getElementById("result").innerHTML="Unable to Assess";
	for(var i=0;i<qBlock.length;i++){
		var numOfOptions = qBlock[i].length;
		for(j=0;j<numOfOptions;j++){
			if(qBlock[i][j].value==0){
				qBlock[i][j].checked=true;
			}
		}
	}
 }
 
 function clearInput()
 {
	 document.getElementById("btnsubmit").disabled  = false;
	 document.getElementById("NeuroExam").style.display='none';
	 document.getElementById("reco").style.display='inline';
	 document.getElementById("sug1").style.display='inline';
	 document.getElementById("sug2").style.display='none';
     var chkSeizures = document.getElementsByName("f_seizure")
     document.getElementById("f_seizureBox").style.display='none';
     document.getElementById("f_seizureBox").value="";
     document.getElementById("hour_life").value="";
     document.getElementById("min_life").value="";
     for(i=0;i<3;i++){
      chkSeizures[i].checked=false;
      }
     flagNormal=0;
     flagMild=0;
     flagMod=0;
     flagSev=0;
     flagUTA=1;
     valSeizure=0;
     
     document.getElementById("result").innerHTML="Unable to Assess";
     
	 clearRec();
     flag_r2=0;
     flag_r3 =0;
     flag_r3_1 =0;
     flag_r4 =0;
     flag_r5 =0;
     flag_r6 =0;
     flag_r6_1 =0;
     flag_r7 =0;
     flag_r7_1 =0;
     flag_r8 =0;
     flag_r9 =0;
     flag_r10 =0;
     flag_r11=0;
	 enableFields();
	 clearNeuroTool();
	 document.getElementById("neuroResult").style.display = "none";
 }
 
 function disableFields(){
	 document.getElementById('f_GA_NA').disabled =true;
	 document.getElementById('f_GA_N').disabled =true;
	 document.getElementById('f_GA_Y').disabled =true;
     document.getElementById("f_age").disabled =true;
     $("#f_events :input").attr("disabled", true);
	 document.getElementById("f_APGAR").disabled =true;
	 document.getElementById("f_cordpH").disabled =true;
	 document.getElementById("f_cordBE").disabled =true;
	 document.getElementById("f_infantpH").disabled =true;
	 document.getElementById("f_infantBE").disabled =true;
	 document.getElementById('f_vent_NA').disabled =true;
	 document.getElementById('f_vent_N').disabled =true;
	 document.getElementById('f_vent_Y').disabled =true;
	 document.getElementById("f_cpr").disabled =true;
	 


	document.getElementById("f_APGAR").style.background='#EBEBE4';
	document.getElementById("f_events").style.background='#EBEBE4';
	document.getElementById("f_cordpH").style.background='#EBEBE4';
	document.getElementById("f_cordBE").style.background='#EBEBE4';
	document.getElementById("f_infantpH").style.background='#EBEBE4';
	document.getElementById("f_infantBE").style.background='#EBEBE4';
	document.getElementById("f_cpr").style.background='#EBEBE4';
	// document.getElementById("vent").style.background='#ECF1F7';

	
 }

 function enableFields(){
	 document.getElementById('f_GA_NA').disabled =false;
	 document.getElementById('f_GA_Y').disabled =false;
	 document.getElementById('f_GA_N').disabled =false;
     document.getElementById("f_age").disabled =false;
     $("#f_events :input").attr("disabled", false);
	 document.getElementById("f_APGAR").disabled =false;
	 document.getElementById("f_cordpH").disabled =false;
	 document.getElementById("f_cordBE").disabled =false;
	 document.getElementById("f_infantpH").disabled =false;
	 document.getElementById("f_infantBE").disabled =false;
	 document.getElementById('f_vent_NA').disabled =false;
	 document.getElementById('f_vent_N').disabled =false;
	 document.getElementById('f_vent_Y').disabled =false;
	 document.getElementById("f_cpr").disabled =false;
	 document.getElementById("btnClear").disabled=true;

	 
 }
 
 
  function isNumberKey(evt){
  	// if (e.which == 46 && this.value.indexOf(".") != -1)
    var charCode = (evt.which) ? evt.which : event.keyCode
    // if (charCode > 31 && (charCode < 48 || charCode > 57)) 
    //     return false;
    if ((charCode < 45 || charCode > 57)|| charCode==47) {// add condition for (if decimal and second occurance of decimal) ||(evt.which == 46 && this.value.indexof(".") != -1)
    	if (charCode!=8)
    	return false;
	}
    return true;
}

 function handleChange(input, id, minno, maxno, msg, req, nodec, chkabs) {

 	var start= 'Valid';
 	var fil='';
 	var x = input.value;

 	if (chkabs==1) {
 		fil=' ';

 		if (isNumeric(x)){
 			x= Math.abs(input.value);
 		}
 		
 	}

 	if (nodec==1){
 		fil=' integer';
 	}
 	if (req==1){
 		start = 'Please enter';
 	}

 	if ( (!isNumeric(x) && x!='')||(x > maxno )|| (x < minno && x !='') || (x =='' && req==1)||(x =='' && req==0) || (x%1>0 && nodec==1)){
        if(msg !=  ''){
            msg = "<strong>"+msg + "</strong><br>";
        } 
        
        document.getElementById(id).innerHTML = msg + start+ fil+' value between '+minno+' to '+ maxno;
        
        if(req==1)
        {
            flagValidate=0;
            return false;
        }
        else
        {
            flagValidate=1;
            return true;
        }
    }
    else
    {
        document.getElementById(id).innerHTML = '';
        flagValidate=1;
        return true;
    } 
  }
function handleFocusOut(id)
{
    document.getElementById(id).innerHTML = '';
}

 function handleOnFocus(input, id, minno, maxno, msg, req, nodec, chkabs) {

 	var start= 'Valid';
 	var fil='';
 	var x = input.value;

 	if (chkabs==1) {
 		fil=' absolute';

 		if (isNumeric(x)){
 			x= Math.abs(input.value);
 		}
 		
 	}

 	if (nodec==1){
 		fil=' integer';
 	}
 	if (req==1){
 		start = 'Please enter';
 	}
    if(msg !=  ''){
        msg = "<strong>"+msg + "</strong><br>";
    }

 	//if ( (!isNumeric(x) && x!='')||(x > maxno )|| (x < minno && x !='') || (x =='' && req==1) || (x%1>0 && nodec==1)){

    if(x==''){    
        document.getElementById(id).innerHTML = msg + start+ fil+' value between '+minno+' to '+ maxno;
    }

  }

function checkRadioButt(errCls,msg){
	document.getElementById(errCls).innerHTML = msg;
}

function selectEvent(evt){
	if (evt.selectedOptions.length > 1)
	{
		for(i=0;i<evt.selectedOptions.length;i++)
		{
			if((evt.selectedOptions[i].index == 0)||(evt.selectedOptions[i].index == 8))
			{
				evt[0].selected=false;
				evt[8].selected=false;
			}
		}
	}
}

function openPdfForProtocol()
    {
        var url = document.getElementById('protocols').value;
        if(url != 'none') {
            window.open(url,'_blank');
        }
    }

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function fillPrintReport(){
    var gest_age;
    if(findSelected('f_GA')==1)
        gest_age = '>= 35 Weeks';
    else
        gest_age = '< 35 Weeks';
	var age= document.getElementById("f_age").value;
    

    var sentEvent='';
    $('#f_events input:checkbox:checked').each(function() {
                                               if(sentEvent!='')
                                                    sentEvent = sentEvent + '; ';
                                               sentEvent = sentEvent + $("label[for='" + this.id + "']").text();
                                        });
    
 
    var apgar = document.getElementById("f_APGAR").value;
    if(apgar=='')
        apgar = 'NA';
    
    var cordPH=document.getElementById("f_cordpH").value;
    if(cordPH=='')
        cordPH = 'NA';
    var cordBE=document.getElementById("f_cordBE").value;
    if((cordBE!='')&&(cordPH!=''))
        cordPH = cordPH + '; ' + cordBE;

    var infantPH=document.getElementById("f_infantpH").value;
    if(infantPH=='')
        infantPH = 'NA';
    var infantBE=document.getElementById("f_infantBE").value;
    if((infantBE!='')&&(infantPH!=''))
        infantPH = infantPH + '; ' + infantBE;

    var tempCpr= document.getElementById("f_cpr");
    var cpr = tempCpr.options[tempCpr.selectedIndex].title;
    
    var assistVentVal=findSelected('f_vent');
    var assistVent;
    if(assistVentVal ==0)
        assistVent='No';
    else if (assistVentVal==1)
        assistVent='Yes';
    else
        assistVent = 'Unknown';
    
    var recom='';
    if(flag_r8==1)
        recom = recom + '|' + document.getElementById("r8").textContent;
    if(flag_r9==1)
        recom = recom + '|' + document.getElementById("r9").textContent;
    if(flag_r2==1)
        recom = recom + '|' + document.getElementById("r2").textContent;
    if(flag_r3==1)
        recom = recom + '|' + document.getElementById("r3").textContent;
    if(flag_r3_1==1)
        recom = recom + '|' + document.getElementById("r3_1").textContent;
    if(flag_r4==1)
        recom = recom + '|' + document.getElementById("r4").textContent;
    if(flag_r5==1)
        recom = recom + '|' + document.getElementById("r5").textContent;
    if(flag_r6==1)
        recom = recom + '|' + document.getElementById("r6").textContent;
    if(flag_r6_1==1)
        recom = recom + '|' + document.getElementById("r6_1").textContent;
    if(flag_r7==1)
        recom = recom + '|' + document.getElementById("r7").textContent;
    if(flag_r7_1==1)
        recom = recom + '|' + document.getElementById("r7_1").textContent;
    if(flag_r10==1)
        recom = recom + '|' + document.getElementById("r10").textContent;
    if(flag_r11==1)
        recom = recom + '|' + 'Perform neurologic assessment after resuscitation.';

    var HourLife = document.getElementById("hour_life").value;;
    var MinLife = document.getElementById("min_life").value;;
    if(HourLife=='')
        HourLife =0;
    if(MinLife=='')
        MinLife =0;
    var TimeLife = HourLife + ' Hr  '+MinLife + ' Min';
    
    var seizures= '';
    var seizureFlagOn=0;
    if(document.getElementById("f_seizure_1").checked==true)
        seizures='No known Episode';
    else
    {
        if(document.getElementById("f_seizure_2").checked==true)
        {
            seizures = 'EEG Confirmed';
            seizureFlagOn =1;
        }
        if(document.getElementById("f_seizure_3").checked==true)
        {
            if(seizureFlagOn==1)
                seizures = seizures + '; ';
            seizures  = seizures + 'Suspected/Clinical';
        }
        if(seizureFlagOn==1)
        {
            var seizureDetail = document.getElementById("f_seizureBox").value;
            if(seizureDetail!='')
                seizures =seizures + ';  Details: ' + document.getElementById("f_seizureBox").value;
        }
    }
    if(seizures=='')
        seizures='No known Episode';

    var LevelOfConsciousness = 'Cannot Assess';
    var SpontaneousActivity ='Cannot Assess';
    var Posture = 'Cannot Assess';
    var Tone = 'Cannot Assess';
    var Suck = 'Cannot Assess';
    var Moro = 'Cannot Assess';
    var Gag = 'Cannot Assess';
    if(displayMode==1)
    {
        var selectedCells = document.getElementsByClassName("clicked");
        for(i=0;i<selectedCells.length;i++){
            var cell = selectedCells[i];
            switch (cell.cellIndex){
                case 1:
                    switch(cell.parentElement.rowIndex){
                        case 0:LevelOfConsciousness = 'Normal';break;
                        case 2:SpontaneousActivity = 'Normal';break;
                        case 4:Posture = 'Normal';break;
                        case 6:Tone = 'Normal';break;
                        case 8:Suck = 'Normal';break;
                        case 10:Moro = 'Normal';break;
                        case 12:Gag = 'Normal';break;
                    }
                    break;
                case 2:
                    switch(cell.parentElement.rowIndex){
                        case 0:LevelOfConsciousness = 'Irritable/Hyperalert';break;
                        case 2:SpontaneousActivity = 'Jittery/Increased';break;
                        case 4:Posture = 'SlightFlexion/Extension';break;
                        case 6:Tone = 'Normal/Increased';break;
                        case 8:Suck = 'Uncoordinated';break;
                        case 10:Moro = 'Exagrated';break;
                        case 12:Gag = 'Absent';break;
                    }
                    break;
                case 3:
                    switch(cell.parentElement.rowIndex){
                        case 0:LevelOfConsciousness = 'Lethargic/Obtunded';break;
                        case 2:SpontaneousActivity = 'Decreased';break;
                        case 4:Posture = 'Distal Flexion/Complete Extension';break;
                        case 6:Tone = 'Hypotonic';break;
                        case 8:Suck = 'Weak';break;
                        case 10:Moro = 'Incomplete';break;
                        case 12:Gag = 'Cannot Assess';break;
                    }
                    break;
                case 4:
                    switch(cell.parentElement.rowIndex){
                        case 0:LevelOfConsciousness = 'Stupor/Unresponsive';break;
                        case 2:SpontaneousActivity = 'No Activity';break;
                        case 4:Posture = 'Decerebrate';break;
                        case 6:Tone = 'Flaccid';break;
                        case 8:Suck = 'Absent';break;
                        case 10:Moro = 'Absent';break;
                    }
                    break;
                case 5:
                    switch(cell.parentElement.rowIndex){
                        case 0:LevelOfConsciousness = 'Cannot Assess';break;
                        case 2:SpontaneousActivity = 'Cannot Assess';break;
                        case 4:Posture = 'Cannot Assess';break;
                        case 6:Tone = 'Cannot Assess';break;
                        case 8:Suck = 'Cannot Assess';break;
                        case 10:Moro = 'Cannot Assess';break;
                    }
                    break;
            }
        }
        
    }
    else
    {
        var block1=findSelected('block1');
        var block2=findSelected('block2');
        var block3=findSelected('block3');
        var block4=findSelected('block4');
        var block5=findSelected('block5');
        var block6=findSelected('block6');
        var block7=findSelected('block7');
        
        if(block1==1)
            LevelOfConsciousness='Normal - opens eyes and moves with repeated tactile stimulation; appropriately wakes and falls back to sleep';
        else if(block1 ==2)
            LevelOfConsciousness = 'Mild - Irritable, hyperalert and/or agitated, maintains awake state, may have high pitched cry';
        else if(block1 ==3)
            LevelOfConsciousness = 'Moderate - Reduced eye opening and movements to tactile stimulation';
        else if(block1==4)
            LevelOfConsciousness = 'Severe - Baby is unresponsive on only responds to painful stimuli, responses are stereotyped';
        
        if(block2==1)
            Tone='Normal - flexed posture of arms and legs that is not fixed';
        else if(block2==2)
            Tone='Mild - mild excess fisting, high tone in the legs (hypertonia)';
        else if(block2==3)
            Tone='Moderate - frog-legged and/or excess head lag (hypotonia)';
        else if(block2==4)
            Tone='Severe - flaccid (ie extreme hypotonia)';
        
        if(block3 ==1)
            SpontaneousActivity='Normal - spontaneous movements';
        else if(block3 ==2)
            SpontaneousActivity='Mild - excess movements, jittery, agitated';
        else if(block3 ==3)
            SpontaneousActivity='Moderate - decreased spontaneous movements, may respond to pain/touch';
        else if(block3 ==4)
            SpontaneousActivity='Severe - no spontaneous movements';
        
        if(block4 ==1)
            Suck ='Strong Coordinated suck';
        else if(block4 ==2)
            Suck ='Uncoordinated';
        else if(block4 ==3)
            Suck ='Weak, uncoordinated or infant bites instead of sucking';
        else if(block4 ==4)
            Suck ='Absent';
        
        if(block5 ==1)
            Gag ='Normal';
        else if(block4 ==3)
            Gag ='Absent';
        
        if(block6 ==1)
            Moro='Normal';
        else if(block6 ==2)
            Moro='Exaggerated';
        else if(block6 ==3)
            Moro='Incomplete';
        else if(block6 ==4)
            Moro='Absent';
        
        if(block7 ==1)
            Posture='Normal';
        else if(block7 ==2)
            Posture='Mild - Slight flexion/extension';
        else if(block7 ==3)
            Posture='Moderate - Distal Flexion/Complete Extension';
        else if(block7 ==4)
            Posture='Severe -Decerebrate';
    }

    
    var NeuroAssessment;
    if(stage_tab == 'Normal')
        NeuroAssessment = 'Normal:Screens negative at this time. Symptoms may change. Continue to monitor as per CPQCC guidelines.';
    else if(stage_tab == 'Mild')
        NeuroAssessment = 'Mild:Call cooling center to discuss case.Provide care as per the management guidelines for potential candidates';
    else if((stage_tab == 'Moderate')||(stage_tab == 'Severe'))
        NeuroAssessment = 'Moderate to Severe: Call cooling center to discuss the need for transfer and cooling.Provide care as per the management guidelines for potential candidates';
    else
        NeuroAssessment = 'Incomplete Exam:Call cooling center to discuss case immediately.';

    
    var comments = document.getElementById("showthis").value;
    
    var url = 'print.html?gest_age=' + encodeURIComponent(gest_age) + '&age=' + encodeURIComponent(age) +'&sentEvent=' + encodeURIComponent(sentEvent) + '&apgar='+ encodeURIComponent(apgar) + '&cordPH=' + encodeURIComponent(cordPH) + '&infantPH=' + encodeURIComponent(infantPH) + '&cpr=' + encodeURIComponent(cpr) + '&assistVent=' + encodeURIComponent(assistVent) +'&TimeLife=' + encodeURIComponent(TimeLife) + '&seizures=' + encodeURIComponent(seizures) + '&LevelOfConsciousness=' + encodeURIComponent(LevelOfConsciousness) + '&SpontaneousActivity=' + encodeURIComponent(SpontaneousActivity) + '&Posture=' + encodeURIComponent(Posture) + '&Tone=' + encodeURIComponent(Tone) + '&Suck=' + encodeURIComponent(Suck) + '&Moro=' + encodeURIComponent(Moro) + '&Gag=' + encodeURIComponent(Gag) + '&NeuroRes='+ encodeURIComponent(NeuroAssessment) + '&comments=' + encodeURIComponent(comments) + '&recom=' + encodeURIComponent(recom);

    window.open(url);
}

function fillPrintNeuroReport()
{
   var seizures='';
    var HourLife = document.getElementById("hour_life").value;;
    var MinLife = document.getElementById("min_life").value;;
    if(HourLife=='')
        HourLife =0;
    if(MinLife=='')
        MinLife =0;
    var TimeLife = HourLife + ' Hr   '+MinLife + ' Min';
    
    var seizureFlagOn=0;
        if(document.getElementById("f_seizure_1").checked==true)
            seizures='No known Episode';
        else
        {
            if(document.getElementById("f_seizure_2").checked==true)
            {
                seizures = 'EEG Confirmed';
                seizureFlagOn =1;
            }
            if(document.getElementById("f_seizure_3").checked==true)
            {
                if(seizureFlagOn==1)
                    seizures = seizures + '; ';
                seizures  = seizures + 'Suspected/Clinical';
                seizureFlagOn =1;
            }
            if(seizureFlagOn==1)
            {
                var seizureDetail = document.getElementById("f_seizureBox").value;
                if(seizureDetail!='')
                    seizures =seizures + ';  Details: ' + document.getElementById("f_seizureBox").value;
            }
        }
    if(seizures=='')
        seizures='No known Episode';
    
    
    var LevelOfConsciousness = 'Cannot Assess';
    var SpontaneousActivity ='Cannot Assess';
    var Posture = 'Cannot Assess';
    var Tone = 'Cannot Assess';
    var Suck = 'Cannot Assess';
    var Moro = 'Cannot Assess';
    var Gag = 'Cannot Assess';
    //if((displayMode==1)&&(document.getElementById("btnChnageView").value=="Switch to detailed view"))
    if(displayMode==1)
    {
        var selectedCells = document.getElementsByClassName("clicked");
        for(i=0;i<selectedCells.length;i++){
            var cell = selectedCells[i];
            switch (cell.cellIndex){
                case 1:
                    switch(cell.parentElement.rowIndex){
                        case 0:LevelOfConsciousness = 'Normal';break;
                        case 2:SpontaneousActivity = 'Normal';break;
                        case 4:Posture = 'Normal';break;
                        case 6:Tone = 'Normal';break;
                        case 8:Suck = 'Normal';break;
                        case 10:Moro = 'Normal';break;
                        case 12:Gag = 'Normal';break;
                    }
                    break;
                case 2:
                    switch(cell.parentElement.rowIndex){
                        case 0:LevelOfConsciousness = 'Irritable/Hyperalert';break;
                        case 2:SpontaneousActivity = 'Jittery/Increased';break;
                        case 4:Posture = 'SlightFlexion/Extension';break;
                        case 6:Tone = 'Normal/Increased';break;
                        case 8:Suck = 'Uncoordinated';break;
                        case 10:Moro = 'Exagrated';break;
                        case 12:Gag = 'Absent';break;
                    }
                    break;
                case 3:
                    switch(cell.parentElement.rowIndex){
                        case 0:LevelOfConsciousness = 'Lethargic/Obtunded';break;
                        case 2:SpontaneousActivity = 'Decreased';break;
                        case 4:Posture = 'Distal Flexion/Complete Extension';break;
                        case 6:Tone = 'Hypotonic';break;
                        case 8:Suck = 'Weak';break;
                        case 10:Moro = 'Incomplete';break;
                        case 12:Gag = 'Cannot Assess';break;
                    }
                    break;
                case 4:
                    switch(cell.parentElement.rowIndex){
                        case 0:LevelOfConsciousness = 'Stupor/Unresponsive';break;
                        case 2:SpontaneousActivity = 'No Activity';break;
                        case 4:Posture = 'Decerebrate';break;
                        case 6:Tone = 'Flaccid';break;
                        case 8:Suck = 'Absent';break;
                        case 10:Moro = 'Absent';break;
                    }
                    break;
                case 5:
                    switch(cell.parentElement.rowIndex){
                        case 0:LevelOfConsciousness = 'Cannot Assess';break;
                        case 2:SpontaneousActivity = 'Cannot Assess';break;
                        case 4:Posture = 'Cannot Assess';break;
                        case 6:Tone = 'Cannot Assess';break;
                        case 8:Suck = 'Cannot Assess';break;
                        case 10:Moro = 'Cannot Assess';break;
                    }
                    break;
            }
        }
        
    }
    else
    {
        var block1=findSelected('block1');//LevelOfConsciousness
        var block2=findSelected('block2');//Tone
        var block3=findSelected('block3');//SpontaneousActivity
        var block4=findSelected('block4');//Suck
        var block5=findSelected('block5');//Gag
        var block6=findSelected('block6');//Moro
        var block7=findSelected('block7');//Posture

        if(block1==1)
            LevelOfConsciousness='Normal - opens eyes and moves with repeated tactile stimulation; appropriately wakes and falls back to sleep';
        else if(block1 ==2)
            LevelOfConsciousness = 'Mild - Irritable, hyperalert and/or agitated, maintains awake state, may have high pitched cry';
        else if(block1 ==3)
            LevelOfConsciousness = 'Moderate - Reduced eye opening and movements to tactile stimulation';
        else if(block1==4)
            LevelOfConsciousness = 'Severe - Baby is unresponsive on only responds to painful stimuli, responses are stereotyped';
        
        if(block2==1)
            Tone='Normal - flexed posture of arms and legs that is not fixed';
        else if(block2==2)
            Tone='Mild - mild excess fisting, high tone in the legs (hypertonia)';
        else if(block2==3)
            Tone='Moderate - frog-legged and/or excess head lag (hypotonia)';
        else if(block2==4)
            Tone='Severe - flaccid (ie extreme hypotonia)';
        
        if(block3 ==1)
            SpontaneousActivity='Normal - spontaneous movements';
        else if(block3 ==2)
            SpontaneousActivity='Mild - excess movements, jittery, agitated';
        else if(block3 ==3)
            SpontaneousActivity='Moderate - decreased spontaneous movements, may respond to pain/touch';
        else if(block3 ==4)
            SpontaneousActivity='Severe - no spontaneous movements';
            
        if(block4 ==1)
            Suck ='Strong Coordinated suck';
        else if(block4 ==2)
            Suck ='Uncoordinated';
        else if(block4 ==3)
            Suck ='Weak, uncoordinated or infant bites instead of sucking';
        else if(block4 ==4)
            Suck ='Absent';
            
        if(block5 ==1)
            Gag ='Normal';
        else if(block4 ==3)
            Gag ='Absent';
            
        if(block6 ==1)
            Moro='Normal';
        else if(block6 ==2)
            Moro='Exaggerated';
        else if(block6 ==3)
            Moro='Incomplete';
        else if(block6 ==4)
            Moro='Absent';
            
        if(block7 ==1)
            Posture='Normal';
        else if(block7 ==2)
            Posture='Mild - Slight flexion/extension';
        else if(block7 ==3)
            Posture='Moderate - Distal Flexion/Complete Extension';
        else if(block7 ==4)
            Posture='Severe - Decerebrate';
    }
    
    var NeuroAssessment;
    if(stage_tab == 'Normal')
        NeuroAssessment = 'Normal:Screens negative at this time. Symptoms may change. Continue to monitor as per CPQCC guidelines.';
    else if(stage_tab == 'Mild')
        NeuroAssessment = 'Mild:Call cooling center to discuss case.Provide care as per the management guidelines for potential candidates';
    else if((stage_tab == 'Moderate')||(stage_tab == 'Severe'))
        NeuroAssessment = 'Moderate to Severe: Call cooling center to discuss the need for transfer and cooling.Provide care as per the management guidelines for potential candidates';
    else
        NeuroAssessment = 'Incomplete Exam:Call cooling center to discuss case immediately.';

    
        var url = 'printNeuroEval.html?seizures=' + encodeURIComponent(seizures) + '&TimeLife=' + encodeURIComponent(TimeLife) +  '&LevelOfConsciousness=' + encodeURIComponent(LevelOfConsciousness) + '&SpontaneousActivity=' + encodeURIComponent(SpontaneousActivity) + '&Posture=' + encodeURIComponent(Posture) + '&Tone=' + encodeURIComponent(Tone) + '&Suck=' + encodeURIComponent(Suck) + '&Moro=' + encodeURIComponent(Moro) + '&Gag=' + encodeURIComponent(Gag) + '&NeuroRes='+ encodeURIComponent(NeuroAssessment);
    window.open(url);


}