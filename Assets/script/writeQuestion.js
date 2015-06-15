#pragma strict
/*
 * Script to handle the scene where questions are written for creation of quiz.
 */
import System.IO;
import System.Xml;
var TYPE_TEXT :  int = 0;
var TYPE_IMAGE_DESCRIPTION :  int = 1;
var TYPE_IMAGE_OPTIONS :  int = 2;
var defaultPath : String;	//Default Path set by the user
var pos: Vector3;	//position vector
var rot : Quaternion;	//rotation of dynamically created objects
var prefabButton : GameObject;	//prefab of Button which is to be created dynamically
var prefabOptionCreate : GameObject;	//prefab of an option to be created dynamically
var newButtonText : UI.Text;	//text field of a dynamically created button
var newButton : UI.Button;	//the dynamically created button
var questions : Array;	//the array where all questions provided by author will be stored
var questionBox : UI.InputField;	//the inputField where user enters the questions
var textComponents : Component[];	//Array to store all the text components
var buttons : Component[];	//Array to store all the buttons
var checkBoxes : Component[];	//Array to store all the checkboxes
var optionTexts : Component[];	//Array to store the options
var clickedButton:int;
var selectedAnswers : Array;
var previousToggles : Array;
var options : Array;
var questionTypes : Array;
//var trueBox : UI.Toggle;
//var falseBox : UI.Toggle;
var lastButton: UI.Button;
var offsetButton : int;
//var falseAnswers : Array;
//var trueAnswers : Array;
var autoIncrement : int;
var correctAnswers : Array;
var changedAuto : boolean;
var noOfQuestions : int;
var noOfOptions : Array;
function Start () {
	questionTypes = new Array();
	autoIncrement = 0;
	previousToggles = new Array();
	noOfOptions = new Array();
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
	offsetButton = 5;
	changedAuto = false;
	selectedAnswers = new Array();
	options = new Array();
	//falseAnswers=new Array();
	//trueAnswers=new Array();
	for(i=0;i<noOfQuestions;i++){
		questions.push("");
		var newOptions = new Array();
		selectedAnswers.push(0);
		//noOfOptions.push(2);
		for(var j=0;j<2;j++){
			newOptions.push("");
		}
		options.push(newOptions);
		questionTypes.push(TYPE_TEXT);
		//falseAnswers.push(false);
		//trueAnswers.push(true);
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
	//trueBox = checkBoxes[0].GetComponent(UI.Toggle);
	//falseBox = checkBoxes[1].GetComponent(UI.Toggle);
	//trueBox.isOn=true;
	//falseBox.isOn=false;
	changedAuto=false;
	buttons = GetComponentsInChildren(UI.Button);
	buttons[1+offsetButton].GetComponent(UI.Button).colors.normalColor=Color.cyan;
	changeUI(1);	
}
function Update () {

}

function addOption(){
	var newOptionCreate : GameObject;
	newOptionCreate = Instantiate(prefabOptionCreate);
	newOptionCreate.transform.SetParent(GameObject.Find("Options").transform);
	newOptionCreate.transform.localScale = new Vector3(1,1,1);
	previousToggles.push(newOptionCreate);
	newOptionCreate.name = "OptionCreate"+autoIncrement;
	newOptionCreate.GetComponentInChildren(UI.Text).text = autoIncrement.ToString();
	autoIncrement++;
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
		var myOptions : Array;
		myOptions = new Array();
		myOptions = options[i];
		for(var j=0;j<myOptions.length;j++){	
			var optionNode : XmlElement = xmlDoc.CreateElement("Option");
			parentNode.AppendChild(optionNode);
			optionNode.InnerText = myOptions[j];
		}
		var answerNode : XmlElement = xmlDoc.CreateElement("Answer");
		parentNode.AppendChild(answerNode);
		answerNode.InnerText = correctAnswers[i].ToString();
    }
  	xmlDoc.Save(defaultPath+"/"+quizNames[0]+".qz");
	Application.LoadLevel("start");
}
function submit(){
	checkBoxes = GetComponentsInChildren(UI.Toggle);
	//print(checkBoxes.Length);
	//print(clickedButton-1);
	optionTexts = GameObject.Find("Options").GetComponentsInChildren(UI.InputField);
	var newOptions = new Array();
	//noOfOptions[clickedButton-1] = checkBoxes.Length;
	selectedAnswers[clickedButton - 1] = 0;
	for(var i = 0;i<checkBoxes.Length;i++){
		newOptions.push(optionTexts[i].GetComponent(UI.InputField).text);
		if(checkBoxes[i].GetComponent(UI.Toggle).isOn){
			selectedAnswers[clickedButton-1] = i+1;
		}
	}
	while(newOptions.length<2){
		newOptions.push("");
	}
	options[clickedButton-1] = newOptions;
	correctAnswers = new Array();
	for(i=0;i<questions.length;i++){
		if(questions[i]==""){
			return;
		}
		if(int.Parse(selectedAnswers[i].ToString())==0){
			return;
		}
		var myOptions = new Array();
		myOptions = options[i];
		for(var j=0;j<myOptions.length;j++){
			if(myOptions[j]==""){
				return;
			}
		}
		/*if(trueAnswers[i]){
			correctAnswers.push(true);
		}
		else{
			correctAnswers.push(false);
		}*/
		correctAnswers.push(selectedAnswers[i]);
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
	checkBoxes = GetComponentsInChildren(UI.Toggle);
	//print(checkBoxes.Length);
	//print(clickedButton-1);
	optionTexts = GameObject.Find("Options").GetComponentsInChildren(UI.InputField);
	var newOptions = new Array();
	selectedAnswers[clickedButton - 1] = 0;
	//noOfOptions[clickedButton-1] = checkBoxes.Length;
	for(var i = 0;i<checkBoxes.Length;i++){
		newOptions.push(optionTexts[i].GetComponent(UI.InputField).text);
		if(checkBoxes[i].GetComponent(UI.Toggle).isOn){
			selectedAnswers[clickedButton-1] = i+1;
		}
	}
	while(newOptions.length<2){
		newOptions.push("");
	}
	options[clickedButton-1] = newOptions;
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
	updateOptions(options[clickedButton-1]);
/*	if(trueAnswers[clickedButton-1]){
		trueBox.isOn=true;
		falseBox.isOn=false;
	}
	else{
		falseBox.isOn=true;
		trueBox.isOn=false;
	}
	changedAuto=false;*/	
}

function updateOptions(myOptions : Array){
	while(previousToggles.length>0){
		Destroy(previousToggles.pop());
	}
	previousToggles = new Array();
	autoIncrement = 1;
	for(var i=0;i<myOptions.length;i++){
		var newOption : GameObject;
		newOption = Instantiate(prefabOptionCreate);
		newOption.transform.SetParent(GameObject.Find("Options").transform);
		newOption.transform.localScale = new Vector3(1,1,1);
		newOption.name = "OptionCreate"+autoIncrement;
		if(selectedAnswers[clickedButton-1]==(i+1)){
			newOption.GetComponentInChildren(UI.Toggle).isOn = true;
		}
		previousToggles.push(newOption);
		newOption.GetComponentInChildren(UI.InputField).text = myOptions[i];
		newOption.GetComponentInChildren(UI.Text).text = autoIncrement.ToString(); 
		autoIncrement++;
	}
}
function switchType(){
	if(int.Parse(questionTypes[clickedButton-1].ToString())==TYPE_TEXT){
		GameObject.Find("Switch").GetComponentInChildren(UI.Text).text = "Switch to text question";
		switchToImage();
	}else{
		GameObject.Find("Switch").GetComponentInChildren(UI.Text).text = "Switch to image question";
		questionTypes[clickedButton-1] = TYPE_TEXT;
	}
}
function switchToImage(){
	questionTypes[clickedButton-1] = TYPE_IMAGE_DESCRIPTION;
}
/*function toggleTrue(){
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
}*/