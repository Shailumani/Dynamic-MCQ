#pragma strict
import System.Xml;
import System.IO;
var names : Array;
var defaultScorePath : String;
var defaultPath : String;
var scores : Array;
var resultBox : UI.Text;
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
function Start () {
	defaultScorePath = Application.persistentDataPath;
	var paths : Array = new Array();
	readXML(Application.persistentDataPath+"/settings.xml", paths, "path");
	defaultPath = paths[0]; 
	resultBox = GetComponentInChildren(UI.Text);
	names = new Array();
	scores = new Array();
	var i : int;
	readXML(defaultScorePath+"/scores.xml", names, "Name");
	readXML(defaultScorePath+"/scores.xml", scores, "Score");
	if(names.length<=3){
		i=0;
	}
	else{
		i = names.length-4;
	}
	if(names.length>1){
		resultBox.text = "Recent Scores\n\n";
	}
	else{
		resultBox.text = "";
	}
	for(;i<names.length-1;i++){
			resultBox.text = resultBox.text + names[i] + " : " + scores[i] + "\n";
	}
	resultBox.text = resultBox.text + "\nHi! "+names[names.length-1]+", Your score is "+scores[scores.length-1];
}
function replay(){
	Application.LoadLevel("start");
}
function quit(){
	Application.Quit();
}
function Update () {

}