#pragma strict
var nameBox : UI.InputField;
var userName : String;
var defaultPath : String;
var defaultScorePath : String;
function Start () {
	defaultScorePath = Application.persistentDataPath;
	var paths : Array = new Array();
	readXML(Application.persistentDataPath+"/settings.xml", paths, "path");
	if(paths.length==0){
		Application.LoadLevel("settings");
	}else{
		defaultPath = paths[0];
	} 
	nameBox = GetComponentInChildren(UI.InputField);
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
	Application.LoadLevel("question");
}
function settings(){
	Application.LoadLevel("settings");
}
function Update () {

}