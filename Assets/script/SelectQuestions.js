#pragma strict
import System.IO;
import UnityEngine.UI;
import System.Xml;
//import System.Collections;
var quizNameInput:UI.InputField;
var quizName :String;
var nameBox: UI.InputField;
var userName : String;
var noOfQuesInput:UI.InputField;
var noOfQuestions : int;
var categories : Array;
var isMultipleCorrect : UI.Toggle;
var Science : UI.Toggle;
var Maths : UI.Toggle;
var English :UI.Toggle;
var Sports :UI.Toggle;
var GK: UI.Toggle;
var Aptitude:UI.Toggle;
var Others :UI.InputField;
var alertPopupPrefab : GameObject;
var categoriesInput : UI.Toggle[];
function Start () {
 	categoriesInput = [Science, Maths, English, Sports, GK, Aptitude];
}

function giveAlert(message : String){
	var alertPopup : GameObject = Instantiate(alertPopupPrefab);
	alertPopup.transform.SetParent(gameObject.transform);
	alertPopup.transform.position = gameObject.transform.position;
	alertPopup.transform.localScale = new Vector3(1,1,1);
	alertPopup.GetComponentInChildren(UI.Text).text = message;
	alertPopup.GetComponentInChildren(UI.Button).onClick.AddListener(
		function(){
			Destroy(alertPopup);
		}
	);
	return;
}

function proceed(){
    if(nameBox.text==""){    //checking name of author
    	giveAlert("Please enter your name!");
		return;
	}
	else{
		userName = nameBox.text;
	}
	if(quizNameInput.text==""){   //checking name of  quiz
		giveAlert("Please enter quiz name!");
		return;
	}
	else{
		quizName=quizNameInput.text;
	}
	try{
		noOfQuestions = int.Parse(noOfQuesInput.text);
		if(noOfQuestions<=0){
			giveAlert("Please enter valid no. of questions!");
			return;
		}
	}catch(E){
		giveAlert("Please enter valid no. of questions!");
		return;
	}
	categories = new Array();
	for(var i=0;i<categoriesInput.length;i++){
		if(categoriesInput[i].isOn){
			categories.push(categoriesInput[i].name);
		}
	}
	var otherCategories : String[];
	if(Others.text!=""){
		otherCategories = Others.text.Split(','[0]);
		for(i=0;i<otherCategories.length;i++){
			categories.push(otherCategories[i].Trim());
		}
	}
	if(categories.length==0){
		giveAlert("Please provide some category!");
		return;
	}
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
    parentNode = xmlDoc.CreateElement("isMCQ");
	xmlDoc.DocumentElement.AppendChild(parentNode);
	parentNode.InnerText = isMultipleCorrect.isOn ? "1" : "0";
    parentNode = xmlDoc.CreateElement("Author");
	xmlDoc.DocumentElement.AppendChild(parentNode);
	parentNode.InnerText = userName;
	parentNode = xmlDoc.CreateElement("Number");
	xmlDoc.DocumentElement.AppendChild(parentNode);
	parentNode.InnerText = ""+noOfQuestions;
	parentNode = xmlDoc.CreateElement("Name");
	xmlDoc.DocumentElement.AppendChild(parentNode);
	parentNode.InnerText = quizName;
  	xmlDoc.Save(Application.persistentDataPath+"/temp.xml");
	LevelManager.Load("createQuestion");
}
function Cancel(){
	LevelManager.Load("editList");
}
function Update () {

}