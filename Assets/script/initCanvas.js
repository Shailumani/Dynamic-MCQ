#pragma strict
var panel : GameObject;
var homeScreen : GameObject;
var newPanel : GameObject;
var nameBox : UI.InputField;
var nameText : UI.Text;
var userName : String;
function Start () {
	nameBox = GetComponentInChildren(UI.InputField);
	nameText = nameBox.GetComponentsInChildren(UI.Text)[1].GetComponent(UI.Text);
}
function proceed(){
	if(nameText.text==""){
		return;
	}
	userName = nameText.text;
	initPanel();
}
function initPanel(){
	Destroy(homeScreen);
	var pos = Vector3(525, 136, 0);
	var rot:Quaternion = Quaternion.identity;
	newPanel = Instantiate(panel, pos, rot);
	newPanel.transform.parent = gameObject.transform;
}
function Update () {

}