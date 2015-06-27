#pragma strict
import System.IO;
import System.Xml;
var QUESTION_TYPE_TEXT : int = 0;
var QUESTION_TYPE_IMAGE_D : int = 1;
var QUESTION_TYPE_IMAGE_O : int = 2;
var TYPE_TEXT :  int = 0;
var TYPE_IMAGE_DESCRIPTION :  int = 1;
var TYPE_IMAGE_OPTIONS :  int = 2;
var currentQuestionType : int;
var defaultPath : String;
var defaultScorePath : String;
var pos: Vector3;
var rot : Quaternion;
var selectedAnswers : Array;
var isMCQArray : Array;
var prefabOptionText : GameObject;
var prefabOptionImage : GameObject;
var prefabButton : GameObject;
var rightButton : GameObject;
var leftButton : GameObject;
var confirmationPopupPrefab : GameObject;
var rightButtonPrefab : GameObject;
var leftButtonPrefab : GameObject;
var isRightDisplayed : boolean;
var isLeftDisplayed : boolean;
var autoIncrement : int;
//var optionsPanel : GameObject;
var currentQuestionPanel : GameObject;
var isCorrect : boolean[];
//var optionsScrollRect : GameObject;
var textAnswerPanelPrefab : GameObject;
var imageOptionsAnswerPrefab : GameObject;
var imageDescriptionAnswerPrefab : GameObject;
var mainPanel : GameObject;
var mainRect : Rect;
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
var optionsTypes : Array;
var newLineRenderers : Array;
var questionTypes : Array;
var previousToggles : Array;
var imageSprites : Array;
var questionPanelSize : Vector2;
var isPopupDisplayed : boolean;
function Start () {
	isPopupDisplayed = false;
	isRightDisplayed = true;
	isLeftDisplayed = true;
	newLineRenderers = new Array();
	currentQuestionType = QUESTION_TYPE_TEXT;
	currentQuestionPanel = GameObject.Find("TextAnswerPanel");
	mainPanel = GameObject.Find("MainPanel");
	mainRect = mainPanel.GetComponent(RectTransform).rect;
	questionPanelSize = new Vector2(mainRect.width, mainRect.height);
	//interfaceRect = GameObject.Find("Interface").GetComponent(RectTransform).rect;
	//var optionsLayout : UI.GridLayoutGroup = optionsPanel.GetComponent(UI.GridLayoutGroup);
	//ptionsLayout.cellSize.Set(optionsScrollRect.GetComponent(RectTransform).rect.width, 100);
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
	optionsTypes = new Array();
	questionTypes = new Array();
	imageSprites = new Array();
	isMCQArray = new Array();
	readXML(questionsFileName, isMCQArray, "isMCQ");
	readXML(questionsFileName, questionTypes, "QType");
	readXML(questionsFileName, correctAnswers, "Answer");
	readQuestionsFile(questionsFileName, questions, options, optionsTypes, imageSprites);
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
	offsetButton = -1;
	noOfCorrectAns=0;
	changedAuto = false;
	falseAnswers=new Array();
	trueAnswers=new Array();
	for(i=0;i<questions.length;i++){
		falseAnswers.push(false);
		trueAnswers.push(false);
		selectedAnswers.push(new Array());
	}
	changedAuto=true;
	var noOfQuestions = questions.length;
	isCorrect = new boolean[noOfQuestions];
	GameObject.Find("Buttons").GetComponent(UI.GridLayoutGroup).cellSize = new Vector2(GameObject.Find("Buttons").GetComponent(RectTransform).rect.width/noOfQuestions-1, 30);
	var buttonWidth = (xMax-xMin)/questions.length;
	for(i=0;i<questions.length;i++){
		isCorrect[i]=false;
		newLineRenderers.push("");
		pos = Vector3((buttonWidth/2)+i*buttonWidth,y,0);
		rot =  Quaternion.identity;
		newButton = Instantiate(prefabButton).GetComponent(UI.Button);
		newButton.gameObject.transform.SetParent(GameObject.Find("Buttons").transform);
		newButton.gameObject.transform.localScale = new Vector3(1,1,1);
		newButton.gameObject.name = ""+(i+1);
		newButtonText=newButton.gameObject.GetComponentInChildren(UI.Text);
		newButtonText.text=""+(i+1);
	}
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
	/*checkBoxes = optionsPanel.GetComponentsInChildren(UI.Toggle);
	for(var boxNo=1;boxNo<=checkBoxes.length;boxNo++){
		if(checkBoxes[boxNo-1].GetComponent(UI.Toggle).isOn){
			selectedAnswers[clickedButton-1] = boxNo;
			break;
		}
	}*/
	saveCurrentState();
	for(var i=0;i<questions.length;i++){
//		if((correctAnswers[i] && trueAnswers[i]) || (!correctAnswers[i] && falseAnswers[i])){
//			noOfCorrectAns+=1;
//		}
		if(isCorrect[i]){
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
	LevelManager.Load("result");
}
function replay(){
	LevelManager.Load("question");
}
function onQuit(){
	Application.LoadLevel("start");
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
function readQuestionsFile(filepath : String, questionsResult : Array, optionsResult : Array, optionTypesResult : Array, imageSpritesResult : Array){
	var xmlDoc : XmlDocument = new XmlDocument();
	var optionsSet : Array;
	var optionsTypeSet : Array;
	var lineRendererSet : Array;
	if(File.Exists(filepath)){
		var setNodeList : XmlNodeList;
		xmlDoc.Load(filepath);
		setNodeList = xmlDoc.GetElementsByTagName("Set");
		for(var i=0;i<setNodeList.Count;i++){
			optionsSet = new Array();
			optionsTypeSet = new Array();
			var innerXmlDoc : XmlDocument = new XmlDocument();
			innerXmlDoc.LoadXml(setNodeList.Item(i).OuterXml);
			if(parseInt(questionTypes[i].ToString())!=QUESTION_TYPE_IMAGE_O){
				questionsResult.push(innerXmlDoc.GetElementsByTagName("Question").Item(0).InnerText);
			}
			if(parseInt(questionTypes[i].ToString())!=QUESTION_TYPE_IMAGE_D){
				var y : XmlNodeList;
				y = innerXmlDoc.GetElementsByTagName("Value");
				var z : XmlNodeList;
				z = innerXmlDoc.GetElementsByTagName("Type");
				for(var j=0;j<y.Count;j++){
					optionsTypeSet.push(z.Item(j).InnerText);
					if(parseInt(z.Item(j).InnerText.ToString())==TYPE_TEXT)
						optionsSet.push(y.Item(j).InnerText);
					else
						optionsSet.push(stringToSprite(y.Item(j).InnerText));
				}
				optionsResult.push(optionsSet);
			}
			optionTypesResult.push(optionsTypeSet);
			if(parseInt(questionTypes[i].ToString())!=QUESTION_TYPE_TEXT){
				lineRendererSet = new Array();
				imageSpritesResult.push(stringToSprite(innerXmlDoc.GetElementsByTagName("Image").Item(0).InnerText));
				var lines : XmlNodeList;
				lines = innerXmlDoc.GetElementsByTagName("Line");
				for(j=0;j<lines.Count;j++){
					var lineXmlDoc : XmlDocument = new XmlDocument();
					lineXmlDoc.LoadXml(lines.Item(j).OuterXml);
					var points : XmlNodeList;
					points = lineXmlDoc.GetElementsByTagName("Point");
					var drawnPoints = new Array();
					for(var k=0;k<points.Count;k++){
						var thisPoint = new Vector2(0, 0);
						var pointXmlDoc : XmlDocument = new XmlDocument();
						pointXmlDoc.LoadXml(points.Item(k).OuterXml);
						var xCoordinate : XmlNodeList;
						xCoordinate = pointXmlDoc.GetElementsByTagName("X");
						thisPoint.x = parseFloat(xCoordinate.Item(0).InnerText);
						var yCoordinate : XmlNodeList;
						yCoordinate = pointXmlDoc.GetElementsByTagName("Y");
						thisPoint.y = parseFloat(yCoordinate.Item(0).InnerText);
						drawnPoints.push(thisPoint);
					}
					lineRendererSet.push(drawnPoints);
				}
				if(parseInt(questionTypes[i].ToString())==QUESTION_TYPE_IMAGE_D)
					optionsResult.push(lineRendererSet);
				else
					questionsResult.push(lineRendererSet);
			}
			else
				imageSpritesResult.push("");
		}
	}
}

function stringToSprite(byte64String : String){
	var bytes : byte[] = System.Convert.FromBase64String(byte64String);
 	var tex : Texture2D = new Texture2D(100,100);
 	tex.LoadImage(bytes);
 	return Sprite.Create(tex, new Rect(0, 0, tex.width, tex.height), new Vector2(0.5f, 0.0f));
}

function setQuestion(questionNo : int){
	clickedButton=questionNo;
	if(parseInt(questionTypes[questionNo-1].ToString())!=currentQuestionType){
		switch(parseInt(questionTypes[questionNo-1].ToString())){
			case QUESTION_TYPE_TEXT : switchToText(questionNo);
									  break;
			case QUESTION_TYPE_IMAGE_D : switchToImageDescQuestion(questionNo);
									  break;
			case QUESTION_TYPE_IMAGE_O : switchToImageOptionsQuestion(questionNo);
									  break;
			default : break;
		}
	}else{
		switch(parseInt(questionTypes[questionNo-1].ToString())){
			case QUESTION_TYPE_IMAGE_D : currentQuestionPanel.GetComponent(ImageDescriptionAnswerScript).clearLineRenderers();
										 currentQuestionPanel.GetComponent(ImageDescriptionAnswerScript).reloadRenderers();
									  break;
			case QUESTION_TYPE_IMAGE_O : currentQuestionPanel.GetComponent(imageOptionsAnswerScript).clearLineRenderers();
										 currentQuestionPanel.GetComponent(imageOptionsAnswerScript).reloadRenderers();
									  break;
			default : break;
		}
	}
	populateQuestionPanel(questionNo);
	//questionBox.text=questions[questionNo-1];
	if(questionNo==1 && isLeftDisplayed){
		Destroy(leftButton);
		isLeftDisplayed = false;
	}else if(isLeftDisplayed == false){
		leftButton = Instantiate(leftButtonPrefab);
		leftButton.name = "Left";
		leftButton.transform.parent = GameObject.Find("LeftArrowPanel").transform;
		leftButton.transform.position = leftButton.transform.parent.position;
		leftButton.transform.localScale = new Vector3(1,1,1);
		isLeftDisplayed = true;
		leftButton.GetComponent(UI.Button).onClick.AddListener(
			function(){
				changeUI(-1);
			}
		);
	}
	if(questionNo==questions.length && isRightDisplayed){
		Destroy(rightButton);
		isRightDisplayed = false;
	}else if(isRightDisplayed == false){
		rightButton = Instantiate(rightButtonPrefab);
		rightButton.name = "Right";
		rightButton.transform.parent = GameObject.Find("RightArrowPanel").transform;
		rightButton.transform.position = rightButton.transform.parent.position;
		rightButton.transform.localScale = new Vector3(1,1,1);
		isRightDisplayed = true;
		rightButton.GetComponent(UI.Button).onClick.AddListener(
			function(){
				changeUI(0);
			}
		);
	}
}

function confirmation(returnFunctionName : String){
	var newConfirmationPopup : GameObject = Instantiate(confirmationPopupPrefab);
	isPopupDisplayed = true;
	newConfirmationPopup.transform.SetParent(gameObject.transform);
	newConfirmationPopup.transform.position = gameObject.transform.position;
	newConfirmationPopup.transform.localScale = new Vector3(1, 1, 1);
	newConfirmationPopup.GetComponentsInChildren(UI.Button)[0].GetComponent(UI.Button).onClick.AddListener(
		function(){
			Destroy(newConfirmationPopup);
			isPopupDisplayed = false;
			Invoke(returnFunctionName, 0.0f);
		}
	);
	newConfirmationPopup.GetComponentsInChildren(UI.Button)[1].GetComponent(UI.Button).onClick.AddListener(
		function(){
			isPopupDisplayed = false;
			Destroy(newConfirmationPopup);
		}
	);
}


function populateQuestionPanel(questionNo : int){
	switch(parseInt(questionTypes[questionNo-1].ToString())){
		case QUESTION_TYPE_TEXT : currentQuestionPanel.GetComponentInChildren(UI.Text).text = "Q."+questionNo+"  "+questions[questionNo-1];
								  break;
		case QUESTION_TYPE_IMAGE_D : currentQuestionPanel.GetComponent(ImageDescriptionAnswerScript).setImage(imageSprites[questionNo-1]);
									currentQuestionPanel.GetComponentsInChildren(UI.Text)[1].GetComponent(UI.Text).text = questions[questionNo-1];
									//currentQuestionPanel.GetComponentInChildren(ImageDescriptionScript).reloadRenderers();
								  	 break;
		case QUESTION_TYPE_IMAGE_O : currentQuestionPanel.GetComponent(imageOptionsAnswerScript).setImage(imageSprites[questionNo-1]);
									 //currentQuestionPanel.GetComponentInChildren(imageOptionsScript).reloadRenderers();
									 break;
		default : print("x");break;
	}
}

function changeQuestion(changeAmount : int){
	if(clickedButton+changeAmount>questions.length || clickedButton+changeAmount<=0){
		return;
	}
	setQuestion(clickedButton+changeAmount);
	//questionBox.text=questions[clickedButton-1];
}

function saveCurrentState(){
	if(currentQuestionType!=QUESTION_TYPE_IMAGE_D){
		checkBoxes = currentQuestionPanel.GetComponentsInChildren(UI.Toggle);
		var thisSelectedAnswers = new Array();
		for(var boxNo=1;boxNo<=checkBoxes.length;boxNo++){
			if(checkBoxes[boxNo-1].GetComponent(UI.Toggle).isOn){
				thisSelectedAnswers.push(boxNo);
			}
		}
		selectedAnswers[clickedButton-1] = thisSelectedAnswers;
		if(selectedAnswers[clickedButton-1].ToString().Equals(correctAnswers[clickedButton-1].ToString())){
			isCorrect[clickedButton-1] = true;
		}else{
			isCorrect[clickedButton-1] = false;
		}
	}
	if(currentQuestionType==QUESTION_TYPE_IMAGE_D){
		newLineRenderers[clickedButton-1] = new Array(currentQuestionPanel.GetComponent(ImageDescriptionAnswerScript).getLineRenderers());	
		isCorrect[clickedButton-1] = currentQuestionPanel.GetComponent(ImageDescriptionAnswerScript).onSubmit();
	}
}

function changeUI(questionNumber : int){
	saveCurrentState();
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
}

function updateOptions(myOptions : Array){
	var parent : String;
	if(parseInt(questionTypes[clickedButton-1].ToString())==QUESTION_TYPE_IMAGE_D){
		return;
	}else if(parseInt(questionTypes[clickedButton-1].ToString())==QUESTION_TYPE_IMAGE_O)
		parent = "OptionsImagePanel";
	else
		parent = "OptionsTextPanel";
	while(previousToggles.length>0){
		Destroy(previousToggles.pop());
	}
	var myOptionsTypes : Array = optionsTypes[clickedButton-1];
	previousToggles = new Array();
	autoIncrement = 1;
	for(var i=0;i<myOptions.length;i++){
		var newOption : GameObject;
		if(parseInt(myOptionsTypes[i].ToString())==TYPE_TEXT){
			newOption = Instantiate(prefabOptionText);
			newOption.transform.SetParent(GameObject.Find(parent).transform);
			newOption.transform.localScale = new Vector3(1,1,1);
			newOption.name = "OptionCreateText";
			newOption.GetComponentsInChildren(UI.Text)[1].GetComponent(UI.Text).text = myOptions[i];
		}
		else{
			newOption = Instantiate(prefabOptionImage);
			newOption.transform.SetParent(GameObject.Find(parent).transform);
			newOption.transform.localScale = new Vector3(1,1,1);
			newOption.name = "OptionCreateImage";
			newOption.GetComponentsInChildren(UI.Image)[2].GetComponent(UI.Image).sprite = myOptions[i];
		}
		var thisSelectedAnswers : Array = selectedAnswers[clickedButton-1];
		for(var j=0;j<thisSelectedAnswers.length;j++){
			if(parseInt(thisSelectedAnswers[j].ToString())==i+1){
				newOption.GetComponentInChildren(UI.Toggle).isOn = true;
				break;
			}	
		}
		previousToggles.push(newOption);
		if(int.Parse(isMCQArray[0])==0){
			newOption.AddComponent.<toggleEvent>();
		}
		newOption.GetComponentInChildren(UI.Text).text = autoIncrement.ToString(); 
		autoIncrement++;
	}
}


/*function updateOptions(optionsSet : Array){
	checkBoxes = optionsPanel.GetComponentsInChildren(UI.Toggle);
	var diffOfToggles : int;
	var cnt = 0;
	var myOptionsTypes : Array;
	myOptionsTypes = optionsTypes[clickedButton-1];
	while(previousToggles.length>0){
		Destroy(previousToggles.pop());
	}
	diffOfToggles = optionsSet.length;
	while(diffOfToggles>0){
		var newCheckBox : GameObject;
		if(parseInt(myOptionsTypes[optionsSet.length-diffOfToggles].ToString())==TYPE_TEXT){
			newCheckBox = Instantiate(prefabOptionText);
			newCheckBox.transform.SetParent(optionsPanel.transform);
			newCheckBox.transform.localScale = new Vector3(1,1,1);
			newCheckBox.GetComponentsInChildren(UI.Text)[1].GetComponent(UI.Text).text = optionsSet[optionsSet.length-diffOfToggles];
		}
		else{
			newCheckBox = Instantiate(prefabOptionImage);
			newCheckBox.transform.SetParent(optionsPanel.transform);
			newCheckBox.transform.localScale = new Vector3(1,1,1);
			newCheckBox.GetComponentsInChildren(UI.Image)[2].GetComponent(UI.Image).sprite = optionsSet[optionsSet.length-diffOfToggles];
		}
		previousToggles.push(newCheckBox);
		newCheckBox.GetComponentsInChildren(UI.Text)[0].GetComponent(UI.Text).text = (optionsSet.length-diffOfToggles+1).ToString();
		diffOfToggles-=1;
		if(selectedAnswers[clickedButton-1]==optionsSet.length-diffOfToggles){
			newCheckBox.GetComponent(UI.Toggle).isOn = true;
		}
		newCheckBox.name = "Option"+(optionsSet.length-diffOfToggles);
	}
}*/

function switchToImageDescQuestion(questionNo : int){
	Destroy(currentQuestionPanel);
	currentQuestionPanel = createInstance(imageDescriptionAnswerPrefab, mainPanel.gameObject, questionPanelSize);
	currentQuestionType = QUESTION_TYPE_IMAGE_D;
}
function switchToImageOptionsQuestion(questionNo : int){
	Destroy(currentQuestionPanel);
	currentQuestionPanel = createInstance(imageOptionsAnswerPrefab, mainPanel.gameObject, questionPanelSize);
	currentQuestionType = QUESTION_TYPE_IMAGE_O;
	previousToggles = new Array();
}
function switchToText(questionNo : int){
	Destroy(currentQuestionPanel);
	currentQuestionPanel = createInstance(textAnswerPanelPrefab, mainPanel.gameObject, questionPanelSize);
	currentQuestionType = QUESTION_TYPE_TEXT;
	previousToggles = new Array();
}
function createInstance(prefab : GameObject, parent : GameObject, size : Vector2){
	//print(pos);
	prefab.GetComponent(RectTransform).sizeDelta = size;
	var myCurrentPanel = Instantiate(prefab);
	myCurrentPanel.transform.SetParent(parent.transform);
	myCurrentPanel.transform.localScale = new Vector3(1,1,1);
	myCurrentPanel.GetComponent(RectTransform).position = parent.transform.position;
	return myCurrentPanel;
}


/*
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
}*/