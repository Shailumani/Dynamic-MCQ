#pragma strict
var nameBox : UI.InputField;
var userName : String;
var defaultPath : String;
var defaultScorePath : String;
var alertPopupPrefab : GameObject;
var confirmationPopupPrefab : GameObject;
function Start () {
	defaultScorePath = Application.persistentDataPath;
	var paths : Array = new Array();
	readXML(Application.persistentDataPath+"/settings.xml", paths, "path");
	if(paths.length==0){
		Application.LoadLevel("settings");
	}else{
		defaultPath = paths[0];
		if(!Directory.Exists(defaultPath)){
			Application.LoadLevel("settings");
		}
	} 
	nameBox = GetComponentInChildren(UI.InputField);
	var xmlDoc : XmlDocument = new XmlDocument();
    if(File.Exists (Application.persistentDataPath+"/scores.xml"))
    { 	
    	var x : XmlNodeList;
        xmlDoc.Load(Application.persistentDataPath+"/scores.xml");
        x = xmlDoc.GetElementsByTagName("Name");
		if(x.Count>0)
  			nameBox.text = x.Item(x.Count-1).InnerText;
	}
}

function confirmation(returnFunctionName : String){
	var newConfirmationPopup : GameObject = Instantiate(confirmationPopupPrefab);
	newConfirmationPopup.transform.SetParent(gameObject.transform);
	newConfirmationPopup.transform.position = gameObject.transform.position;
	newConfirmationPopup.transform.localScale = new Vector3(1, 1, 1);
	newConfirmationPopup.GetComponentsInChildren(UI.Button)[0].GetComponent(UI.Button).onClick.AddListener(
		function(){
			Destroy(newConfirmationPopup);
			Invoke(returnFunctionName, 0.0f);
		}
	);
	newConfirmationPopup.GetComponentsInChildren(UI.Button)[1].GetComponent(UI.Button).onClick.AddListener(
		function(){
			Destroy(newConfirmationPopup);
		}
	);
}


function quit(){
	Application.Quit();
}
function createQuiz(){
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
function proceed(){
	if(nameBox.text==""){
		var newPopup : GameObject = Instantiate(alertPopupPrefab);
		newPopup.transform.SetParent(gameObject.transform);
		newPopup.transform.position = gameObject.transform.position;
		newPopup.transform.localScale = new Vector3(1,1,1);
		newPopup.GetComponentInChildren(UI.Text).text = "Please enter your name!";
		return;
	}
	userName = nameBox.text;
	var xmlDoc : XmlDocument = new XmlDocument();
	if(!File.Exists(defaultScorePath+"/scores.xml")){
		var xmlDeclaration : XmlDeclaration = xmlDoc.CreateXmlDeclaration("1.0","utf-8",null);
        var rootNode : XmlElement = xmlDoc.CreateElement("Results");
        xmlDoc.InsertBefore(xmlDeclaration, xmlDoc.DocumentElement); 
        xmlDoc.AppendChild(rootNode);
	}
	else{
		xmlDoc.Load(defaultScorePath+"/scores.xml");
	}
	var elemRoot : XmlElement = xmlDoc.DocumentElement;
	var itemAttempt : XmlElement = xmlDoc.CreateElement("Attempt");
	elemRoot.AppendChild(itemAttempt);
	var itemName : XmlElement = xmlDoc.CreateElement("Name");
	itemAttempt.AppendChild(itemName);
	var itemScore : XmlElement = xmlDoc.CreateElement("Score");
	itemAttempt.AppendChild(itemScore);
	itemName.InnerText = userName;
	itemScore.InnerText = "";
	xmlDoc.Save(defaultScorePath+"/scores.xml");
	//Application.LoadLevel("question");
	LevelManager.Load("list");
}
function settings(){
	Application.LoadLevel("settings");
}
function Update () {

}