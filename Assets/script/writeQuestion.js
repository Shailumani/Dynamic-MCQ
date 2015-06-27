#pragma strict
/*
 * Script to handle the scene where questions are written for creation of quiz.
 */
import System.IO;
import System.Xml;
var QUESTION_TYPE_TEXT : int = 0;
var QUESTION_TYPE_IMAGE_D : int = 1;
var QUESTION_TYPE_IMAGE_O : int = 2;
var TYPE_TEXT :  int = 0;
var TYPE_IMAGE_DESCRIPTION :  int = 1;
var TYPE_IMAGE_OPTIONS :  int = 2;
var defaultPath : String;	//Default Path set by the user
var pos: Vector3;	//position vector
var rot : Quaternion;	//rotation of dynamically created objects
var prefabButton : GameObject;	//prefab of Button which is to be created dynamically
var prefabOptionCreateText : GameObject;	//prefab of an option to be created dynamically
var prefabOptionCreateImage : GameObject;
var chooseOptionPopupPrefab : GameObject;
var switchQuestionTypePopupPrefab : GameObject;
var confirmationPopupPrefab : GameObject;
var currentQuestionPanel : GameObject;
var alertPopupPrefab : GameObject;
var imageOptionsPrefab : GameObject;
var imageDescriptionPrefab : GameObject;
var textQuestionPanelPrefab : GameObject;
var rightButton : GameObject;
var leftButton : GameObject;
var rightButtonPrefab : GameObject;
var leftButtonPrefab : GameObject;
var isRightDisplayed : boolean;
var isLeftDisplayed : boolean;
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
var newPopup : GameObject;
var newOptionCreate : GameObject;
var interfaceRect : Rect;
var mainRect : Rect;
var isMCQArray : Array;
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
var optionsTypes : Array;
var mainPanel : GameObject;
var questionPanelSize : Vector2;
var imagePaths : Array;
var imageSprites : Array;
var currentQuestionType : int;
var isPopupDisplayed : boolean;
function Start () {
	isPopupDisplayed = false;
	isRightDisplayed = true;
	isLeftDisplayed = true;
	imageSprites = new Array();
	currentQuestionPanel = GameObject.Find("TextQuestionPanel");
	mainPanel = GameObject.Find("MainPanel");
	mainRect = mainPanel.GetComponent(RectTransform).rect;
	questionPanelSize = new Vector2(mainRect.width, mainRect.height);
	interfaceRect = GameObject.Find("Interface").GetComponent(RectTransform).rect;
	optionsTypes = new Array();
	imagePaths = new Array();
	questionTypes = new Array();
	currentQuestionType = QUESTION_TYPE_TEXT;
	autoIncrement = 0;
	previousToggles = new Array();
	noOfOptions = new Array();
	var paths : Array = new Array();
	var noOfQuestionsArray = new Array();
	isMCQArray = new Array();
	readXML(Application.persistentDataPath+"/settings.xml", paths, "path");
	readXML(Application.persistentDataPath+"/temp.xml", noOfQuestionsArray, "Number");
	readXML(Application.persistentDataPath+"/temp.xml", isMCQArray, "isMCQ");
	noOfQuestions = int.Parse(noOfQuestionsArray[0]);
	defaultPath = paths[0]; 
	var i : int;
	clickedButton=1;
	questions = new Array();
	//var xMin = -Screen.width/2;
	//var xMax = Screen.width/2;
	var y = Screen.height - 20;
	var xMin = -interfaceRect.width/2;
	var xMax = interfaceRect.width/2;
	offsetButton = -1;
	changedAuto = false;
	selectedAnswers = new Array();
	options = new Array();
	GameObject.Find("Buttons").GetComponent(UI.GridLayoutGroup).cellSize = new Vector2(GameObject.Find("Buttons").GetComponent(RectTransform).rect.width/noOfQuestions-1, 30);
	//falseAnswers=new Array();
	//trueAnswers=new Array();
	for(i=0;i<noOfQuestions;i++){
		questions.push("");
		imagePaths.push("");
		imageSprites.push("");
		questionTypes.push(QUESTION_TYPE_TEXT);
		var newOptions = new Array();
		var newOptionsTypes = new Array();
		selectedAnswers.push(new Array());
		//noOfOptions.push(2);
		for(var j=0;j<2;j++){
			newOptions.push("");
			newOptionsTypes.push(TYPE_TEXT);
		}
		optionsTypes.push(newOptionsTypes);
		options.push(newOptions);
		//falseAnswers.push(false);
		//trueAnswers.push(true);
	}
	changedAuto=true;
	var buttonWidth = (xMax-xMin)/questions.length;
	for(i=0;i<questions.length;i++){
		pos = Vector3((buttonWidth/2)+i*buttonWidth,y,0);
		rot =  Quaternion.identity;
		newButton = Instantiate(prefabButton).GetComponent(UI.Button);
		newButton.gameObject.transform.SetParent(GameObject.Find("Buttons").transform);
		newButton.gameObject.transform.localScale = new Vector3(1,1,1);
		//prefabButton.GetComponent(RectTransform).sizeDelta = new Vector2(buttonWidth, 30);
		//newButton = Instantiate(prefabButton, Camera.main.ScreenToWorldPoint(pos), rot).GetComponent(UI.Button);
		//newButton.transform.parent = gameObject.transform;
		//var newRect = newButton.GetComponent(RectTransform);
		//newRect.sizeDelta = new Vector2(buttonWidth, 30);
		newButton.gameObject.name = ""+(i+1);
		newButtonText=newButton.gameObject.GetComponentInChildren(UI.Text);
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

function giveAlert(message : String){
	var alertPopup : GameObject = Instantiate(alertPopupPrefab);
	isPopupDisplayed = true;
	alertPopup.transform.SetParent(gameObject.transform);
	alertPopup.transform.position = gameObject.transform.position;
	alertPopup.transform.localScale = new Vector3(1,1,1);
	alertPopup.GetComponentInChildren(UI.Text).text = message;
	alertPopup.GetComponentInChildren(UI.Button).onClick.AddListener(
		function(){
			isPopupDisplayed = false;
			Destroy(alertPopup);
		}
	);
	return;
}
function addOption(){
	newPopup = Instantiate(chooseOptionPopupPrefab);
	isPopupDisplayed = true;
	newPopup.transform.SetParent(gameObject.transform);
	newPopup.transform.position = gameObject.transform.position;
	newPopup.transform.localScale = new Vector3(1,1,1);
	var addButton : UI.Button = GameObject.Find("Add").GetComponent(UI.Button);
	addButton.onClick.AddListener(
		function(){
			isPopupDisplayed = false;
			Invoke("onAddNow", 0.0f);
		}
	);
}

function onAddNow(){
	var newOptionTypeToggles : Component[];
	newOptionTypeToggles = newPopup.GetComponentsInChildren(UI.Toggle);
	if(newOptionTypeToggles[0].GetComponent(UI.Toggle).isOn){
		addTextOption();
	}else{
		addImageOption();
	}
	autoIncrement++;
	Destroy(newPopup);
}

function addTextOption(){
	var parent : String;
	if(parseInt(questionTypes[clickedButton-1].ToString())==QUESTION_TYPE_IMAGE_O)
		parent = "OptionsImagePanel";
	else
		parent = "OptionsTextPanel";
	newOptionCreate = Instantiate(prefabOptionCreateText);
	newOptionCreate.transform.SetParent(GameObject.Find(parent).transform);
	newOptionCreate.transform.localScale = new Vector3(1,1,1);
	previousToggles.push(newOptionCreate);
	newOptionCreate.name = "OptionCreateText";
	newOptionCreate.GetComponentInChildren(UI.Text).text = autoIncrement.ToString();
	if(int.Parse(isMCQArray[0])==0){
		newOptionCreate.AddComponent.<toggleEvent>();
	}
}

function addImageOption(){
	var parent : String;
	if(parseInt(questionTypes[clickedButton-1].ToString())==QUESTION_TYPE_IMAGE_O)
		parent = "OptionsImagePanel";
	else
		parent = "OptionsTextPanel";
	newOptionCreate = Instantiate(prefabOptionCreateImage);
	newOptionCreate.transform.SetParent(GameObject.Find(parent).transform);
	newOptionCreate.transform.localScale = new Vector3(1,1,1);
	previousToggles.push(newOptionCreate);
	newOptionCreate.name = "OptionCreateImage";
	if(int.Parse(isMCQArray[0])==0){
		newOptionCreate.AddComponent.<toggleEvent>();
	}
	newOptionCreate.GetComponentInChildren(UI.Text).text = autoIncrement.ToString();
#if UNITY_ANDROID
	var jc : AndroidJavaClass = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
	var currentActivity : AndroidJavaObject = jc.GetStatic.<AndroidJavaObject>("currentActivity");
	currentActivity.Call("selectImage", "Interface", "onBrowseForOption");
#else
	onBrowseForOption(browseForImage());
#endif
}

function onBrowseForOption(thisImagePath : String){
	var thisTexture : Texture2D = new Texture2D(100, 100);
	var www : WWW = new WWW("file:///" + thisImagePath);
	www.LoadImageIntoTexture(thisTexture);
	newOptionCreate.GetComponentsInChildren(UI.Image)[2].GetComponent(UI.Image).sprite = 
					Sprite.Create(thisTexture, new Rect(0, 0, thisTexture.width, thisTexture.height), new Vector2(0.5f, 0.0f));
}

function browseForImage(){
	var browseScript = new Browse();
	return browseScript.browseForImage();
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
	parentNode = xmlDoc.CreateElement("isMCQ");
	xmlDoc.DocumentElement.AppendChild(parentNode);
	parentNode.InnerText = isMCQArray[0].ToString();
    for(i=0;i<questions.length;i++){
		parentNode = xmlDoc.CreateElement("Set");
		xmlDoc.DocumentElement.AppendChild(parentNode);
		var questionTypeNode : XmlElement = xmlDoc.CreateElement("QType");
		parentNode.AppendChild(questionTypeNode);
		questionTypeNode.InnerText = questionTypes[i].ToString();
		var questionNode : XmlElement = xmlDoc.CreateElement("Question");
		parentNode.AppendChild(questionNode);
		if(questionTypes[i]!=QUESTION_TYPE_IMAGE_O){
			questionNode.InnerText = questions[i];
		}
		var optionSetNode : XmlElement = xmlDoc.CreateElement("OptionSet");
		parentNode.AppendChild(optionSetNode);
		if(questionTypes[i]!=QUESTION_TYPE_IMAGE_D){
			var myOptions : Array;
			var myOptionsTypes : Array;
			myOptions = new Array();
			myOptionsTypes = new Array();
			myOptions = options[i];
			myOptionsTypes = optionsTypes[i];
			for(var j=0;j<myOptions.length;j++){	
				var optionNode : XmlElement = xmlDoc.CreateElement("Option");
				optionSetNode.AppendChild(optionNode);
				var typeNode : XmlElement = xmlDoc.CreateElement("Type");
				optionNode.AppendChild(typeNode);
				var type : int = parseInt(myOptionsTypes[j].ToString());
				typeNode.InnerText = type.ToString();
				var valueNode : XmlElement = xmlDoc.CreateElement("Value");
				optionNode.AppendChild(valueNode);
				if(type==TYPE_TEXT){
					valueNode.InnerText = myOptions[j];
				}
				else{
					valueNode.InnerText = spriteToString(myOptions[j]);
				}
			}
		}
		if(questionTypes[i]!=QUESTION_TYPE_TEXT){
			var imageNode : XmlElement = xmlDoc.CreateElement("Image");
			parentNode.AppendChild(imageNode);
			imageNode.InnerText = spriteToString(imageSprites[i]);
			var drawnLineRenderers : Array;
			if(questionTypes[i]==QUESTION_TYPE_IMAGE_D)
				drawnLineRenderers = new Array(options[i]);
			else	
				drawnLineRenderers = new Array(questions[i]);
			while(drawnLineRenderers.length>0){
				var lineNode : XmlElement = xmlDoc.CreateElement("Line");
				if(questionTypes[i]==QUESTION_TYPE_IMAGE_D){
					optionSetNode.AppendChild(lineNode);
				}else{
					questionNode.AppendChild(lineNode);
				}
				var drawnPoints : Array;
				drawnPoints = drawnLineRenderers.pop();
				while(drawnPoints.length>0){
					var thisPoint : Vector2;
					thisPoint = drawnPoints.pop();
					var pointNode : XmlElement = xmlDoc.CreateElement("Point");
					lineNode.AppendChild(pointNode);
					var xNode : XmlElement = xmlDoc.CreateElement("X");
					pointNode.AppendChild(xNode);
					xNode.InnerText = thisPoint.x.ToString();
					var yNode : XmlElement = xmlDoc.CreateElement("Y");
					pointNode.AppendChild(yNode);
					yNode.InnerText = thisPoint.y.ToString();
				}
			}
		}
		var answerNode : XmlElement = xmlDoc.CreateElement("Answer");
		parentNode.AppendChild(answerNode);
		answerNode.InnerText = correctAnswers[i].ToString();
    }
  	xmlDoc.Save(defaultPath+"/"+quizNames[0]+".qz");
	Application.LoadLevel("start");
}

function spriteToString(mySprite : Sprite){
	var bytes : byte[] = mySprite.texture.EncodeToPNG();
	return System.Convert.ToBase64String(bytes);
}

function imagePathToString(myImagePath : String){
	var myTexture  = new Texture2D(100, 100);
	var www : WWW = new WWW("file:///" + myImagePath);
	www.LoadImageIntoTexture(myTexture);
	return System.Convert.ToBase64String(myTexture.EncodeToPNG());
}
function submit(){
	saveCurrentState();
	/*checkBoxes = GetComponentsInChildren(UI.Toggle);
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
	options[clickedButton-1] = newOptions;*/
	correctAnswers = new Array();
	for(var i=0;i<questions.length;i++){
		if(parseInt(questionTypes[i].ToString())!=QUESTION_TYPE_IMAGE_O){
			if(questions[i]==""){
				giveAlert("Please fill question No. "+(i+1)+"!");
				return;
			}
		}else{
			var myQuestion = new Array();
			myQuestion = questions[i];
			if(myQuestion.length==0){
				giveAlert("Please draw something in question No. "+(i+1)+"!");
				return;
			}
		}
		if(parseInt(questionTypes[i].ToString())!=QUESTION_TYPE_IMAGE_D){
			var myOptions = new Array();
			myOptions = options[i];
			for(var j=0;j<myOptions.length;j++){
				if(myOptions[j]==""){
					giveAlert("Please fill all options in question No. "+(i+1)+"!");
					return;
				}
			}
			var thisSelectedAnswers : Array = selectedAnswers[i];
			if(thisSelectedAnswers.length==0){
				giveAlert("Please select an answer for question No. "+(i+1)+"!");
				return;
			}
		}else{
			var myOption = new Array();
			myOption = options[i];
			if(myOption.length==0){
				giveAlert("Please draw something in question No. "+(i+1)+"!");
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
	clickedButton=questionNo;
	if(questionTypes[questionNo-1]!=currentQuestionType){
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
			case QUESTION_TYPE_IMAGE_D : currentQuestionPanel.GetComponent(ImageDescriptionScript).clearLineRenderers();
										 currentQuestionPanel.GetComponent(ImageDescriptionScript).reloadRenderers();
									  break;
			case QUESTION_TYPE_IMAGE_O : currentQuestionPanel.GetComponent(imageOptionsScript).clearLineRenderers();
										 currentQuestionPanel.GetComponent(imageOptionsScript).reloadRenderers();
									  break;
			default : break;
		}
	}
	populateQuestionPanel(questionNo);
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
	//questionBox.text=questions[questionNo-1];
}

function confirmation(returnFunctionName : String){
	isPopupDisplayed = true;
	var newConfirmationPopup : GameObject = Instantiate(confirmationPopupPrefab);
	newConfirmationPopup.transform.SetParent(gameObject.transform);
	newConfirmationPopup.transform.position = gameObject.transform.position;
	newConfirmationPopup.transform.localScale = new Vector3(1, 1, 1);
	newConfirmationPopup.GetComponentsInChildren(UI.Button)[0].GetComponent(UI.Button).onClick.AddListener(
		function(){
			isPopupDisplayed = false;
			Destroy(newConfirmationPopup);
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
		case QUESTION_TYPE_TEXT : currentQuestionPanel.GetComponentInChildren(UI.InputField).text = questions[questionNo-1];
								  break;
		case QUESTION_TYPE_IMAGE_D : currentQuestionPanel.GetComponent(ImageDescriptionScript).setImage(imageSprites[questionNo-1]);
									currentQuestionPanel.GetComponentInChildren(UI.InputField).text = questions[questionNo-1];
									//currentQuestionPanel.GetComponentInChildren(ImageDescriptionScript).reloadRenderers();
								  	 break;
		case QUESTION_TYPE_IMAGE_O : currentQuestionPanel.GetComponent(imageOptionsScript).setImage(imageSprites[questionNo-1]);
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
	if(parseInt(questionTypes[clickedButton-1].ToString())==QUESTION_TYPE_TEXT || 
		parseInt(questionTypes[clickedButton-1].ToString())==QUESTION_TYPE_IMAGE_O){
		var newOptionsTypes = new Array();
		checkBoxes = currentQuestionPanel.GetComponentsInChildren(UI.Toggle);
		var newOptions = new Array();
		var thisSelectedAnswers = new Array();
		for(var i = 0;i<checkBoxes.Length;i++){
			if(checkBoxes[i].gameObject.name=="OptionCreateText"){
				newOptionsTypes.push(TYPE_TEXT);
				newOptions.push(checkBoxes[i].GetComponentInChildren(UI.InputField).text);
			}else{
				newOptionsTypes.push(TYPE_IMAGE_OPTIONS);
				newOptions.push(checkBoxes[i].GetComponentsInChildren(UI.Image)[2].GetComponent(UI.Image).sprite);
			}
			if(checkBoxes[i].GetComponent(UI.Toggle).isOn){
				thisSelectedAnswers.push(i+1);
			}
		}
		selectedAnswers[clickedButton-1] = thisSelectedAnswers;
		while(newOptions.length<2){
			newOptions.push("");
			newOptionsTypes.push(TYPE_TEXT);
		}
		optionsTypes[clickedButton-1]=new Array(newOptionsTypes);
		options[clickedButton-1] = new Array(newOptions);
	}
	if(parseInt(questionTypes[clickedButton-1].ToString())==QUESTION_TYPE_TEXT || 
		parseInt(questionTypes[clickedButton-1].ToString())==QUESTION_TYPE_IMAGE_D){
		questions[clickedButton-1] = currentQuestionPanel.GetComponentInChildren(UI.InputField).text;
	}
	if(parseInt(questionTypes[clickedButton-1].ToString())==QUESTION_TYPE_IMAGE_O){
		questions[clickedButton-1] = new Array(currentQuestionPanel.GetComponent(imageOptionsScript).getLineRenderers());
	}	
	if(parseInt(questionTypes[clickedButton-1].ToString())==QUESTION_TYPE_IMAGE_D){
		options[clickedButton-1] = new Array(currentQuestionPanel.GetComponent(ImageDescriptionScript).getLineRenderers());	
	}	
}

function changeUI(questionNumber : int){
	print("changing");
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
			newOption = Instantiate(prefabOptionCreateText);
			newOption.transform.SetParent(GameObject.Find(parent).transform);
			newOption.transform.localScale = new Vector3(1,1,1);
			newOption.name = "OptionCreateText";
			newOption.GetComponentInChildren(UI.InputField).text = myOptions[i];
		}
		else{
			newOption = Instantiate(prefabOptionCreateImage);
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
function switchType(){
	if(int.Parse(questionTypes[clickedButton-1].ToString())==TYPE_TEXT){
		switchToImage();
	}else{
		switchToText(clickedButton);
		changeUI(clickedButton);
	}
}
function switchToImage(){
	newPopup = Instantiate(switchQuestionTypePopupPrefab);
	newPopup.transform.SetParent(gameObject.transform);
	newPopup.transform.position = gameObject.transform.position;
	newPopup.transform.localScale = new Vector3(1,1,1);
	var switchButton : UI.Button = newPopup.GetComponentsInChildren(UI.Button)[0].GetComponent(UI.Button);
	switchButton.onClick.AddListener(onSwitchNow);
	var cancelSwitch : UI.Button = newPopup.GetComponentsInChildren(UI.Button)[1].GetComponent(UI.Button);
	cancelSwitch.onClick.AddListener(onCancelSwitch);
}

function onCancelSwitch(){
	Destroy(newPopup);
}

function onSwitchNow(){
#if UNITY_ANDROID
	var jc : AndroidJavaClass = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
	var currentActivity : AndroidJavaObject = jc.GetStatic.<AndroidJavaObject>("currentActivity");
	currentActivity.Call("selectImage", "Interface", "completeSwitchAction");
#else
	completeSwitchAction(browseForImage());
#endif
}

function completeSwitchAction(retrievedPath : String){
	imagePaths[clickedButton-1] = retrievedPath;
	var thisTexture : Texture2D = new Texture2D(100, 100);
	var www : WWW = new WWW("file:///" + imagePaths[clickedButton-1]);
	www.LoadImageIntoTexture(thisTexture);
	imageSprites[clickedButton-1] = 
					Sprite.Create(thisTexture, new Rect(0, 0, thisTexture.width, thisTexture.height), new Vector2(0.5f, 0.0f));
	var questionTypeToggles : Component[] = newPopup.GetComponentsInChildren(UI.Toggle);
	if(questionTypeToggles[0].GetComponent(UI.Toggle).isOn){
		Destroy(newPopup);
		switchToImageDescQuestion(clickedButton);
		currentQuestionPanel.GetComponent(ImageDescriptionScript).setImage(imageSprites[clickedButton-1]);
		//if(currentQuestionType == QUESTION_TYPE_IMAGE_O)
		//	questions[clickedButton-1] = new Array();
		//else{
			questions[clickedButton-1] = "";
			options[clickedButton-1] = new Array();
		//}
	}else{
		Destroy(newPopup);
		switchToImageOptionsQuestion(clickedButton);
		currentQuestionPanel.GetComponent(imageOptionsScript).setImage(imageSprites[clickedButton-1]);
		questions[clickedButton-1] = "";
		var myOptionsTypes : Array = new Array();
		var myOptions : Array = new Array();
		for(var i=0;i<2;i++){
			myOptions.push("");
			myOptionsTypes.push(TYPE_TEXT);
		}
		options[clickedButton-1] = new Array(myOptions);
		optionsTypes[clickedButton-1] = new Array(myOptionsTypes);
		updateOptions(options[clickedButton-1]);
	}
}

function switchToImageDescQuestion(questionNo : int){
	Destroy(currentQuestionPanel);
	currentQuestionPanel = createInstance(imageDescriptionPrefab, mainPanel.gameObject, questionPanelSize);
	questionTypes[questionNo-1] = QUESTION_TYPE_IMAGE_D;
	currentQuestionType = QUESTION_TYPE_IMAGE_D;
	GameObject.Find("Switch").GetComponentInChildren(UI.Text).text = "Switch to text question";
	GameObject.Find("Add Option").GetComponentInChildren(UI.Button).interactable = false;
}
function switchToImageOptionsQuestion(questionNo : int){
	Destroy(currentQuestionPanel);
	currentQuestionPanel = createInstance(imageOptionsPrefab, mainPanel.gameObject, questionPanelSize);
	questionTypes[questionNo-1] = QUESTION_TYPE_IMAGE_O;
	currentQuestionType = QUESTION_TYPE_IMAGE_O;
	GameObject.Find("Switch").GetComponentInChildren(UI.Text).text = "Switch to text question";
	previousToggles = new Array();
	GameObject.Find("Add Option").GetComponentInChildren(UI.Button).interactable = true;
}
function switchToText(questionNo : int){
	Destroy(currentQuestionPanel);
	currentQuestionPanel = createInstance(textQuestionPanelPrefab, mainPanel.gameObject, questionPanelSize);
	questionTypes[questionNo-1] = QUESTION_TYPE_TEXT;
	currentQuestionType = QUESTION_TYPE_TEXT;
	GameObject.Find("Switch").GetComponentInChildren(UI.Text).text = "Switch to image question";
	previousToggles = new Array();
	GameObject.Find("Add Option").GetComponentInChildren(UI.Button).interactable = true;
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