#pragma strict
import System.IO;
import System.Xml;
var defaultPath : String;
var defaultScorePath : String;
var pos: Vector3;
var rot : Quaternion;
var selectedAnswers : Array;
var prefabOption : GameObject;
var prefabButton : GameObject;
var optionsPanel : GameObject;
var optionsScrollRect : GameObject;
var newButtonText : UI.Text;
var newButton : UI.Button;
var questions : Array;
var questionBox : UI.Text;
var textComponents : Component[];
var buttons : Component[];
var checkBoxes : Component[];
var clickedButton:int;
var noOfCorrectAns:int;
var trueBox : UI.Toggle;
var falseBox : UI.Toggle;
var lastButton: UI.Button;
var offsetButton : int;
var falseAnswers : Array;
var trueAnswers : Array;
var correctAnswers : Array;
var changedAuto : boolean;
var questionsFileNames : Array;
var questionsFileName : String;
var options : Array;
var previousToggles : Array;
function Start () {
	var optionsLayout : UI.GridLayoutGroup = optionsPanel.GetComponent(UI.GridLayoutGroup);
	optionsLayout.cellSize.Set(optionsScrollRect.GetComponent(RectTransform).rect.width, 100);
	previousToggles = new Array();
	defaultScorePath = Application.persistentDataPath;
	var paths : Array = new Array();
	questionsFileNames = new Array();
	readXML(Application.persistentDataPath+"/temp.xml", questionsFileNames, "Name");
	readXML(Application.persistentDataPath+"/settings.xml", paths, "path");
	questionsFileName = questionsFileNames[0];
	defaultPath = paths[0]; 
	var i : int;
	clickedButton=1;
	questions = new Array();
	correctAnswers = new Array();
	selectedAnswers = new Array();
	options = new Array();
	readXML(questionsFileName, questions, "Question");
	readOptions(questionsFileName, options);
	readXML(questionsFileName, correctAnswers, "Answer");
	/*for(i=0;i<correctAnswers.length;i++){
		if(correctAnswers[i]=="1"){
			correctAnswers[i] = true;
		}
		else{
			correctAnswers[i] = false;
		}
	}*/
	var xMin = -Screen.width/2;
	var xMax = Screen.width/2;
	var y = Screen.height - 20;
	offsetButton = 3;
	noOfCorrectAns=0;
	changedAuto = false;
	falseAnswers=new Array();
	trueAnswers=new Array();
	for(i=0;i<questions.length;i++){
		falseAnswers.push(false);
		trueAnswers.push(false);
		selectedAnswers.push(0);
	}
	changedAuto=true;
	var buttonWidth = (xMax-xMin)/questions.length;
	for(i=0;i<questions.length;i++){
		pos = Vector3((buttonWidth/2)+i*buttonWidth,y,0);
		rot =  Quaternion.identity;
		newButton = Instantiate(prefabButton, pos, rot).GetComponent(UI.Button);
		newButton.transform.SetParent(transform);
		var newRect = newButton.GetComponent(RectTransform);
		newRect.sizeDelta = new Vector2(buttonWidth, 30);
		newButton.name = ""+(i+1);
		newButtonText=newButton.GetComponentInChildren(UI.Text);
		newButtonText.text=""+(i+1);
	}
	questionBox=GetComponentInChildren(UI.Text);
	if(questions.length>0){
		questionBox.text="Q"+clickedButton+" : "+questions[clickedButton-1];
	}
	checkBoxes = GetComponentsInChildren(UI.Toggle);
	//trueBox = checkBoxes[0].GetComponent(UI.Toggle);
	//falseBox = checkBoxes[1].GetComponent(UI.Toggle);
	//trueBox.isOn=false;
	//falseBox.isOn=false;
	changedAuto=false;
	buttons = GetComponentsInChildren(UI.Button);
	buttons[1+offsetButton].GetComponent(UI.Button).colors.normalColor=Color.cyan;
	changeUI(1);	
}
function Update () {

}
function submit(){
	checkBoxes = optionsPanel.GetComponentsInChildren(UI.Toggle);
	for(var boxNo=1;boxNo<=checkBoxes.length;boxNo++){
		if(checkBoxes[boxNo-1].GetComponent(UI.Toggle).isOn){
			selectedAnswers[clickedButton-1] = boxNo;
			break;
		}
	}
	
	for(var i=0;i<questions.length;i++){
//		if((correctAnswers[i] && trueAnswers[i]) || (!correctAnswers[i] && falseAnswers[i])){
//			noOfCorrectAns+=1;
//		}
		if(correctAnswers[i]==selectedAnswers[i].ToString()){
			noOfCorrectAns+=1;
		}
	}
	var xmlDoc : XmlDocument = new XmlDocument();
	xmlDoc.Load(defaultScorePath+"/scores.xml");
	var x : XmlNodeList;
	x = xmlDoc.GetElementsByTagName("Score");
	var itemScore : XmlElement  = x.Item(x.Count-1);
	itemScore.InnerText = ""+noOfCorrectAns;
	xmlDoc.Save(defaultScorePath+"/scores.xml");
	Application.LoadLevel("result");
}
function replay(){
	Application.LoadLevel("question");
}
function readXML(filepath : String, result : Array, tagName : String){
    var xmlDoc : XmlDocument = new XmlDocument();
    if(File.Exists (filepath))
    { 	
    	var x : XmlNodeList;
        xmlDoc.Load( filepath );
        x = xmlDoc.GetElementsByTagName(tagName);
		for (var i=0;i<x.Count;i++)
  		{ 
  			result.push(x.Item(i).InnerText);
  		}
	}
}
function readOptions(filepath : String, result : Array){
	var xmlDoc : XmlDocument = new XmlDocument();
	var optionsSet : Array;
	if(File.Exists(filepath)){
		var x : XmlNodeList;
		xmlDoc.Load(filepath);
		x = xmlDoc.GetElementsByTagName("Set");
		for(var i=0;i<x.Count;i++){
			var innerXmlDoc : XmlDocument = new XmlDocument();
			innerXmlDoc.LoadXml(x.Item(i).OuterXml);
			var y : XmlNodeList;
			y = innerXmlDoc.GetElementsByTagName("Option");
			optionsSet = new Array();
			for(var j=0;j<y.Count;j++){
				optionsSet.push(y.Item(j).InnerText);
			}
			result.push(optionsSet);
		}
	}
}
function setQuestion(questionNo : int){
	questionBox.text="Q"+questionNo+" : "+questions[questionNo-1];
	clickedButton=questionNo;
}
function changeQuestion(changeAmount : int){
	if(clickedButton+changeAmount>questions.length || clickedButton+changeAmount<=0){
		return;
	}
	clickedButton+=changeAmount;
	questionBox.text="Q"+clickedButton+" : "+questions[clickedButton-1];
}
function changeUI(questionNumber : int){
	changedAuto=true;
	checkBoxes = optionsPanel.GetComponentsInChildren(UI.Toggle);
	for(var boxNo=1;boxNo<=checkBoxes.length;boxNo++){
		if(checkBoxes[boxNo-1].GetComponent(UI.Toggle).isOn){
			selectedAnswers[clickedButton-1] = boxNo;
			break;
		}
	}
	lastButton=buttons[offsetButton + clickedButton].GetComponent(UI.Button);
	lastButton.colors.normalColor=Color.grey;
	if(questionNumber>=1){
		setQuestion(questionNumber);
	}
	else{
		var changeAmount;
		if(questionNumber==0){
			changeAmount=1;
		}
		else{
			changeAmount=-1;
		}
		changeQuestion(changeAmount);
	}
	buttons[clickedButton+offsetButton].GetComponent(UI.Button).colors.normalColor=Color.cyan;
	buttons[clickedButton+offsetButton].GetComponent(UI.Button).colors.highlightedColor=Color.cyan;
	updateOptions(options[clickedButton-1]);
/*	if(trueAnswers[clickedButton-1]){
		trueBox.isOn=true;
		falseBox.isOn=false;
	}
	else if(falseAnswers[clickedButton-1]){
		falseBox.isOn=true;
		trueBox.isOn=false;
	}
	else{
		trueBox.isOn=false;
		falseBox.isOn=false;
	}
*/
	changedAuto=false;	
}
function updateOptions(optionsSet : Array){
	checkBoxes = optionsPanel.GetComponentsInChildren(UI.Toggle);
	var diffOfToggles : int;
	var cnt = 0;
	while(previousToggles.length>0){
		Destroy(previousToggles.pop());
	}
	diffOfToggles = optionsSet.length;
	while(diffOfToggles>0){
		var newCheckBox : GameObject;
		//prefabOption.GetComponent(RectTransform).sizeDelta = new Vector2(400, 100);
		newCheckBox = Instantiate(prefabOption);
		newCheckBox.transform.SetParent(optionsPanel.transform);
		
		newCheckBox.transform.localScale = new Vector3(1,1,1);
		previousToggles.push(newCheckBox);
		newCheckBox.GetComponentsInChildren(UI.Text)[0].GetComponent(UI.Text).text = optionsSet[optionsSet.length-diffOfToggles];
		diffOfToggles-=1;
		if(selectedAnswers[clickedButton-1]==optionsSet.length-diffOfToggles){
			newCheckBox.GetComponent(UI.Toggle).isOn = true;
		}
		newCheckBox.name = "Option"+(optionsSet.length-diffOfToggles);
	}
}
function toggleTrue(){
	if(changedAuto){
		return;
	}
	trueAnswers[clickedButton-1]=(!trueAnswers[clickedButton-1]);
	changedAuto=true;
	if(falseBox.isOn){
		falseBox.isOn=false;
		falseAnswers[clickedButton-1]=false;
	}
	changedAuto=false;
}
function toggleFalse(){
	if(changedAuto){
		return;
	}
	changedAuto=true;
	falseAnswers[clickedButton-1]=(!falseAnswers[clickedButton-1]);
	if(trueBox.isOn){
		trueBox.isOn=false;
		trueAnswers[clickedButton-1]=false;
	}
	changedAuto=false;
}