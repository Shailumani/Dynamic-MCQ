#pragma strict
import System.IO;
import System.Xml;
var defaultPath : String;
var pos: Vector3;
var rot : Quaternion;
var prefabButton : GameObject;
var newButtonText : UI.Text;
var newButton : UI.Button;
var questions : Array;
var questionBox : UI.InputField;
var textComponents : Component[];
var buttons : Component[];
var checkBoxes : Component[];
var clickedButton:int;
var trueBox : UI.Toggle;
var falseBox : UI.Toggle;
var lastButton: UI.Button;
var offsetButton : int;
var falseAnswers : Array;
var trueAnswers : Array;
var correctAnswers : Array;
var changedAuto : boolean;
var noOfQuestions : int;
function Start () {
	var paths : Array = new Array();
	var noOfQuestionsArray = new Array();
	readXML(Application.persistentDataPath+"/settings.xml", paths, "path");
	readXML(Application.persistentDataPath+"/temp.xml", noOfQuestionsArray, "Number");
	noOfQuestions = int.Parse(noOfQuestionsArray[0]);
	defaultPath = paths[0]; 
	var i : int;
	clickedButton=1;
	questions = new Array();
	var xMin = -Screen.width/2;
	var xMax = Screen.width/2;
	var y = Screen.height - 20;
	offsetButton = 3;
	changedAuto = false;
	falseAnswers=new Array();
	trueAnswers=new Array();
	for(i=0;i<noOfQuestions;i++){
		questions.push("");
		falseAnswers.push(false);
		trueAnswers.push(true);
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
	questionBox=GetComponentInChildren(UI.InputField);
	checkBoxes = GetComponentsInChildren(UI.Toggle);
	trueBox = checkBoxes[0].GetComponent(UI.Toggle);
	falseBox = checkBoxes[1].GetComponent(UI.Toggle);
	trueBox.isOn=true;
	falseBox.isOn=false;
	changedAuto=false;
	buttons = GetComponentsInChildren(UI.Button);
	buttons[1+offsetButton].GetComponent(UI.Button).colors.normalColor=Color.cyan;	
}
function Update () {

}
function createFile(){
	var categories = new Array();
	var authors = new Array();
	var quizNames = new Array();
	readXML(Application.persistentDataPath+"/temp.xml", categories, "Category");
	readXML(Application.persistentDataPath+"/temp.xml", authors, "Author");
	readXML(Application.persistentDataPath+"/temp.xml", quizNames, "Name");
	var xmlDoc : XmlDocument;
	xmlDoc = new XmlDocument();
    var xmlDeclaration : XmlDeclaration = xmlDoc.CreateXmlDeclaration("1.0","utf-8",null);
    var rootNode : XmlElement = xmlDoc.CreateElement("MCQ");
    xmlDoc.InsertBefore(xmlDeclaration, xmlDoc.DocumentElement); 
    xmlDoc.AppendChild(rootNode);
    var parentNode : XmlElement;
    for(var i=0;i<categories.length;i++){
		parentNode = xmlDoc.CreateElement("Category");
		xmlDoc.DocumentElement.AppendChild(parentNode);
		parentNode.InnerText = categories[i];
    }
    parentNode = xmlDoc.CreateElement("Author");
	xmlDoc.DocumentElement.AppendChild(parentNode);
	parentNode.InnerText = authors[0];
	parentNode = xmlDoc.CreateElement("Number");
	xmlDoc.DocumentElement.AppendChild(parentNode);
	parentNode.InnerText = ""+noOfQuestions;
	parentNode = xmlDoc.CreateElement("Name");
	xmlDoc.DocumentElement.AppendChild(parentNode);
	parentNode.InnerText = quizNames[0];
    for(i=0;i<questions.length;i++){
		parentNode = xmlDoc.CreateElement("Set");
		xmlDoc.DocumentElement.AppendChild(parentNode);
		var questionNode : XmlElement = xmlDoc.CreateElement("Question");
		parentNode.AppendChild(questionNode);
		questionNode.InnerText = questions[i];
		var answerNode : XmlElement = xmlDoc.CreateElement("Answer");
		parentNode.AppendChild(answerNode);
		answerNode.InnerText = correctAnswers[i] ? "1" : "0";
    }
  	xmlDoc.Save(defaultPath+"/"+quizNames[0]+".xml");
	Application.LoadLevel("start");
}
function submit(){
	correctAnswers = new Array();
	for(var i=0;i<questions.length;i++){
		if(questions[i]==""){
			return;
		}
		if(trueAnswers[i]){
			correctAnswers.push(true);
		}
		else{
			correctAnswers.push(false);
		}
	}
	createFile();
}
function onCancel(){
	Application.LoadLevel("start");
}
function onBack(){
	Application.LoadLevel("createQuiz");
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
	questionBox.text=questions[questionNo-1];
	clickedButton=questionNo;
}
function changeQuestion(changeAmount : int){
	if(clickedButton+changeAmount>questions.length || clickedButton+changeAmount<=0){
		return;
	}
	clickedButton+=changeAmount;
	questionBox.text=questions[clickedButton-1];
}
function changeUI(questionNumber : int){
	changedAuto=true;
	questions[clickedButton-1] = questionBox.text;
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
	else{
		falseBox.isOn=true;
		trueBox.isOn=false;
	}
	changedAuto=false;
	
}
function toggleTrue(){
	if(changedAuto){
		return;
	}
	trueAnswers[clickedButton-1]=(!trueAnswers[clickedButton-1]);
	changedAuto=true;
	falseBox.isOn=!trueBox.isOn;
	falseAnswers[clickedButton-1]=falseBox.isOn;
	changedAuto=false;
}
function toggleFalse(){
	if(changedAuto){
		return;
	}
	changedAuto=true;
	falseAnswers[clickedButton-1]=(!falseAnswers[clickedButton-1]);
	trueBox.isOn=!falseBox.isOn;
	trueAnswers[clickedButton-1]=trueBox.isOn;
	changedAuto=false;
}