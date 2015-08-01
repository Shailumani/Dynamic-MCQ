#pragma strict
import System.IO;
import System.Xml;

var attemptButton : UI.Button;
var textComponents : Component[];
var names : Array;
var categories : Array;
var authors : Array;
var isMultipleCorrect : UI.Toggle;
function Start () {
	isMultipleCorrect = gameObject.GetComponentInChildren(UI.Toggle);
	textComponents = GetComponentsInChildren(UI.Text);
	names = new Array();
	readXML(gameObject.name, names, "Name");
	categories = new Array();
	readXML(gameObject.name, categories, "Category");
	var noOfQuesArray = new Array();
	readXML(gameObject.name, noOfQuesArray, "Number");
	authors = new Array();
	readXML(gameObject.name, authors, "Author");
	textComponents[0].GetComponent(UI.Text).text = names[0];
	textComponents[1].GetComponent(UI.Text).text="";
	for(var i=0;i<categories.length;i++){
		textComponents[1].GetComponent(UI.Text).text += categories[i];
		if(i!=categories.length-1){
			textComponents[1].GetComponent(UI.Text).text += ", ";
		}
	}
	textComponents[2].GetComponent(UI.Text).text = noOfQuesArray[0];
	textComponents[3].GetComponent(UI.Text).text = authors[0];
	var isMCQArray = new Array();
	readXML(gameObject.name, isMCQArray, "isMCQ");
	if(parseInt(isMCQArray[0].ToString())==1)
		isMultipleCorrect.isOn = true;
	attemptButton = gameObject.GetComponentsInChildren(UI.Button)[0].GetComponent(UI.Button);
	attemptButton.onClick.AddListener(
		function(){
		  	var xmlDoc : XmlDocument;
			xmlDoc = new XmlDocument();
			var parentNode : XmlElement;
		    var xmlDeclaration : XmlDeclaration = xmlDoc.CreateXmlDeclaration("1.0","utf-8",null);
		    var rootNode : XmlElement = xmlDoc.CreateElement("Temp");
		    xmlDoc.InsertBefore(xmlDeclaration, xmlDoc.DocumentElement); 
		    xmlDoc.AppendChild(rootNode);
		    for(i=0;i<categories.length;i++){
				parentNode = xmlDoc.CreateElement("Category");
				xmlDoc.DocumentElement.AppendChild(parentNode);
				parentNode.InnerText = categories[i];
		    }
		    parentNode = xmlDoc.CreateElement("isBeingEdited");
		    xmlDoc.DocumentElement.AppendChild(parentNode);
		    parentNode.InnerText = "1";
		    parentNode = xmlDoc.CreateElement("Path");
		    xmlDoc.DocumentElement.AppendChild(parentNode);
		    parentNode.InnerText = gameObject.name;
		    parentNode = xmlDoc.CreateElement("isMCQ");
			xmlDoc.DocumentElement.AppendChild(parentNode);
			parentNode.InnerText = isMultipleCorrect.isOn ? "1" : "0";
		    parentNode = xmlDoc.CreateElement("Author");
			xmlDoc.DocumentElement.AppendChild(parentNode);
			parentNode.InnerText = authors[0].ToString();
			parentNode = xmlDoc.CreateElement("Number");
			xmlDoc.DocumentElement.AppendChild(parentNode);
			parentNode.InnerText = noOfQuesArray[0].ToString();
			parentNode = xmlDoc.CreateElement("Name");
			xmlDoc.DocumentElement.AppendChild(parentNode);
			parentNode.InnerText = names[0];
		  	xmlDoc.Save(Application.persistentDataPath+"/temp.xml");
			LevelManager.Load("createQuestion");
		}
	);	
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
function Update () {

}