#pragma strict
import System.IO;
import System.Xml;
var pos: Vector3;
var rot : Quaternion;
var prefabButton : GameObject;
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
function Start () {
	var i : int;
	clickedButton=1;
	questions = new Array();
	correctAnswers = new Array();
	readXML(Application.persistentDataPath+"/questions.xml", questions, "Question");
	readXML(Application.persistentDataPath+"/questions.xml", correctAnswers, "Answer");
	for(i=0;i<correctAnswers.length;i++){
		if(correctAnswers[i]=="1"){
			correctAnswers[i] = true;
		}
		else{
			correctAnswers[i] = false;
		}
	}
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
	}
	changedAuto=true;
	var buttonWidth = (xMax-xMin)/questions.length;
	for(i=0;i<questions.length;i++){
		pos = Vector3((buttonWidth/2)+i*buttonWidth,y,0);
		rot =  Quaternion.identity;
		newButton = Instantiate(prefabButton, pos, rot).GetComponent(UI.Button);
		newButton.transform.parent = gameObject.transform;
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
	trueBox = checkBoxes[0].GetComponent(UI.Toggle);
	falseBox = checkBoxes[1].GetComponent(UI.Toggle);
	trueBox.isOn=false;
	falseBox.isOn=false;
	changedAuto=false;
	buttons = GetComponentsInChildren(UI.Button);
	buttons[1+offsetButton].GetComponent(UI.Button).colors.normalColor=Color.cyan;	
}
function Update () {

}
function submit(){
	for(var i=0;i<questions.length;i++){
		if((correctAnswers[i] && trueAnswers[i]) || (!correctAnswers[i] && falseAnswers[i])){
			noOfCorrectAns+=1;
		}
	}
	var xmlDoc : XmlDocument = new XmlDocument();
	xmlDoc.Load(Application.persistentDataPath+"/scores.xml");
	var x : XmlNodeList;
	x = xmlDoc.GetElementsByTagName("Score");
	var itemScore : XmlElement  = x.Item(x.Count-1);
	itemScore.InnerText = ""+noOfCorrectAns;
	xmlDoc.Save(Application.persistentDataPath+"/scores.xml");
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
	if(trueAnswers[clickedButton-1]){
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
	changedAuto=false;
	
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