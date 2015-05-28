#pragma strict
var nameBox : UI.InputField;
var userName : String;
function Start () {
	nameBox = GetComponentInChildren(UI.InputField);
}
function proceed(){
	if(nameBox.text==""){
		return;
	}
	userName = nameBox.text;
	var xmlDoc : XmlDocument = new XmlDocument();
	xmlDoc.Load(Application.persistentDataPath+"/scores.xml");
	var elemRoot : XmlElement = xmlDoc.DocumentElement;
	var itemAttempt : XmlElement = xmlDoc.CreateElement("Attempt");
	elemRoot.AppendChild(itemAttempt);
	var itemName : XmlElement = xmlDoc.CreateElement("Name");
	itemAttempt.AppendChild(itemName);
	var itemScore : XmlElement = xmlDoc.CreateElement("Score");
	itemAttempt.AppendChild(itemScore);
	itemName.InnerText = userName;
	itemScore.InnerText = "";
	xmlDoc.Save(Application.persistentDataPath+"/scores.xml");
	Application.LoadLevel("question");
}
function Update () {

}