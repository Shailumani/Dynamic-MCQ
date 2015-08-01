#pragma strict
import System.Xml;
import System.IO;
var defaultPath : String;
var row : GameObject;
var newRow : GameObject;
var loadingPanel : GameObject;
function Start () {
	var paths : Array = new Array();
	readXML(Application.persistentDataPath+"/settings.xml", paths, "path");
	defaultPath = paths[0];
	if(!Directory.Exists(defaultPath)){
		Application.LoadLevel("settings");
	}
	var info = new DirectoryInfo(defaultPath);
 	var fileInfo = info.GetFiles("*.qz");
 	for (file in fileInfo){
 		newRow = Instantiate(row);
 		newRow.transform.SetParent(transform);
 		newRow.name = file.FullName;
 	}
 	Destroy(loadingPanel);
}
function onBack(){
	Application.LoadLevel("start");
}
function onCreate(){
	LevelManager.Load("createQuiz");
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