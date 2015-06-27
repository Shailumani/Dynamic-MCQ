#pragma strict
import System.IO;
import System.Xml;
var pathBox : UI.InputField;
var paths : Array;
var confirmationPopupPrefab : GameObject;
#if UNITY_ANDROID
var browseClass : AndroidJavaClass;
#endif
function Start () {
#if UNITY_ANDROID
		AndroidJNI.AttachCurrentThread();
		browseClass = new AndroidJavaClass("com.IITB_CDEEP.MCQ_FINAL.BrowseAndroid");
#endif
	paths = new Array();
	pathBox = GetComponentInChildren(UI.InputField);
	if(File.Exists(Application.persistentDataPath+"/settings.xml")){
		readXML(Application.persistentDataPath+"/settings.xml", paths, "path");
		pathBox.text = paths[0];
	}else{
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
	}
	if(!File.Exists(Application.persistentDataPath+"/NewFile.xml")){
		createNewFile();
	}
}

function createNewFile(){
	var xmlDoc = new XmlDocument();
	        var xmlDeclaration : XmlDeclaration = xmlDoc.CreateXmlDeclaration("1.0","utf-8",null);
	        var rootNode : XmlElement = xmlDoc.CreateElement("Reward");
	        xmlDoc.InsertBefore(xmlDeclaration, xmlDoc.DocumentElement); 
	        xmlDoc.AppendChild(rootNode);
        
        //var flagNode : XmlElement = xmlDoc.CreateElement("Flag");
        //xmlDoc.DocumentElement.AppendChild(flagNode);
               	    
        var PathNode : XmlElement=xmlDoc.CreateElement("address");
	    PathNode.InnerText = "";
	    rootNode.AppendChild(PathNode);
        
   	  
        var ToggleNode : XmlElement=xmlDoc.CreateElement("Toggleoutput");
	    ToggleNode.InnerText = "Star";
	    rootNode.AppendChild(ToggleNode);
        
   	     	  
        xmlDoc.Save(Application.persistentDataPath+"/NewFile.xml");
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


function onBrowse(){
#if UNITY_ANDROID
	print("Browse started");
	var jc : AndroidJavaClass = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
	var currentActivity : AndroidJavaObject = jc.GetStatic.<AndroidJavaObject>("currentActivity");
	currentActivity.Call("selectDirectory", "Panel", "setBrowsedPath");
	print("function called");
#else
	setBrowsedPath(Browse.browseForFolder());
#endif
}

function setBrowsedPath(thisPath : String){
	print("function returned");
	pathBox.text = thisPath;
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
	if(Directory.Exists(pathBox.text)){
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
			parentNode = xmlDoc.CreateElement("isMCQ");
			xmlDoc.DocumentElement.AppendChild(parentNode);
			parentNode.InnerText = "0";
			parentNode = xmlDoc.CreateElement("Name");
			xmlDoc.DocumentElement.AppendChild(parentNode);
			parentNode.InnerText = "Sample";
	        parentNode = xmlDoc.CreateElement("Set");
	        xmlDoc.DocumentElement.PrependChild(parentNode);
	        var questionNode : XmlElement = xmlDoc.CreateElement("Question");
	        parentNode.AppendChild(questionNode);
	        questionNode.InnerText = "Corruption, Poverty, Illiteracy, Inequality. Who is responsible?";
	        var questionTypeNode : XmlElement = xmlDoc.CreateElement("QType");
			parentNode.AppendChild(questionTypeNode);
			questionTypeNode.InnerText = "0";
			var optionSetNode : XmlElement = xmlDoc.CreateElement("OptionSet");
			parentNode.AppendChild(optionSetNode);
			var optionStarts = ["I am", "Politicians are", "We are", "No one is"];
		    for(i=0;i<4;i++){
		    	var optionNode : XmlElement = xmlDoc.CreateElement("Option");
	        	optionSetNode.AppendChild(optionNode);
	        	var typeNode : XmlElement = xmlDoc.CreateElement("Type");
	        	optionNode.AppendChild(typeNode);
	        	typeNode.InnerText = "0";
	        	var valueNode : XmlElement = xmlDoc.CreateElement("Value");
	        	optionNode.AppendChild(valueNode);
	        	valueNode.InnerText = optionStarts[i]+" responsible";
		    }
		    var answerNode : XmlElement = xmlDoc.CreateElement("Answer");
	        parentNode.AppendChild(answerNode);
	        answerNode.InnerText = "3";
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