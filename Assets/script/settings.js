#pragma strict
import System.IO;
import System.Xml;
var pathBox : UI.InputField;
var paths : Array;
function Start () {
	paths = new Array();
	pathBox = GetComponentInChildren(UI.InputField);
	readXML(Application.persistentDataPath+"/settings.xml", paths, "path");
	if(paths.length == 0){
		var xmlDoc : XmlDocument = new XmlDocument();
        var xmlDeclaration : XmlDeclaration = xmlDoc.CreateXmlDeclaration("1.0","utf-8",null);
        var rootNode : XmlElement = xmlDoc.CreateElement("Settings");
        xmlDoc.InsertBefore(xmlDeclaration, xmlDoc.DocumentElement); 
        xmlDoc.AppendChild(rootNode);
        var parentNode : XmlElement = xmlDoc.CreateElement("path");
        xmlDoc.DocumentElement.PrependChild(parentNode);
        parentNode.InnerText = Application.persistentDataPath;
        xmlDoc.Save(Application.persistentDataPath+"/settings.xml");
        pathBox.text = Application.persistentDataPath;
	}else{
		pathBox.text = paths[0];
	}
	
}
function reset(){
	pathBox.text = Application.persistentDataPath;
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
function save(){
	if(pathBox.text.Length>0){
		var xmlDoc : XmlDocument;
		if(!File.Exists(pathBox.text+"/questions.qz")){
			xmlDoc = new XmlDocument();
	        var xmlDeclaration : XmlDeclaration = xmlDoc.CreateXmlDeclaration("1.0","utf-8",null);
	        var rootNode : XmlElement = xmlDoc.CreateElement("MCQ");
	        xmlDoc.InsertBefore(xmlDeclaration, xmlDoc.DocumentElement); 
	        xmlDoc.AppendChild(rootNode);
	        var parentNode : XmlElement;
		    for(var i=0;i<1;i++){
				parentNode = xmlDoc.CreateElement("Category");
				xmlDoc.DocumentElement.AppendChild(parentNode);
				parentNode.InnerText = "Sample";
		    }
		    parentNode = xmlDoc.CreateElement("Author");
			xmlDoc.DocumentElement.AppendChild(parentNode);
			parentNode.InnerText = "Automatic";
			parentNode = xmlDoc.CreateElement("Number");
			xmlDoc.DocumentElement.AppendChild(parentNode);
			parentNode.InnerText = ""+1;
			parentNode = xmlDoc.CreateElement("Name");
			xmlDoc.DocumentElement.AppendChild(parentNode);
			parentNode.InnerText = "Sample";
	        parentNode = xmlDoc.CreateElement("Set");
	        xmlDoc.DocumentElement.PrependChild(parentNode);
	        var questionNode : XmlElement = xmlDoc.CreateElement("Question");
	        parentNode.AppendChild(questionNode);
	        questionNode.InnerText = "This is a sample question";
		    for(i=0;i<4;i++){
		    	var optionNode : XmlElement = xmlDoc.CreateElement("Option");
	        	parentNode.AppendChild(optionNode);
	        	var typeNode : XmlElement = xmlDoc.CreateElement("Type");
	        	optionNode.AppendChild(typeNode);
	        	typeNode.InnerText = "0";
	        	var valueNode : XmlElement = xmlDoc.CreateElement("Value");
	        	optionNode.AppendChild(valueNode);
	        	valueNode.InnerText = "This is option no. "+(i+1);
		    }
		    var answerNode : XmlElement = xmlDoc.CreateElement("Answer");
	        parentNode.AppendChild(answerNode);
	        answerNode.InnerText = "2";
	      	xmlDoc.Save(pathBox.text+"/questions.qz");
		}
		xmlDoc = new XmlDocument();
		xmlDoc.Load(Application.persistentDataPath+"/settings.xml");
		var x : XmlNodeList;
		x = xmlDoc.GetElementsByTagName("path");
		var itemPath : XmlElement  = x.Item(x.Count-1);
		itemPath.InnerText = pathBox.text;
		xmlDoc.Save(Application.persistentDataPath+"/settings.xml");
		Application.LoadLevel("start");
	}
}
function cancel(){
	Application.LoadLevel("start");
}
function Update () {

}