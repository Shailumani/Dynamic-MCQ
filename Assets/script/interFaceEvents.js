#pragma strict
var rightButton : UI.Button;
var leftButton : UI.Button;
var trueToggle : UI.Toggle;
var falseToggle : UI.Toggle;
var panelScript : updateUI;
var buttons : Component[];
var toggles : Component[];
function Start () {
	buttons = gameObject.GetComponentsInChildren(UI.Button);
	toggles = gameObject.GetComponentsInChildren(UI.Toggle);
	rightButton = buttons[0].GetComponent(UI.Button); 
	leftButton = buttons[1].GetComponent(UI.Button);
	trueToggle = toggles[0].GetComponent(UI.Toggle);
	falseToggle = toggles[1].GetComponent(UI.Toggle);
	panelScript = GetComponentInParent(updateUI);
	trueToggle.onValueChanged.AddListener(
		function(){
			panelScript.toggleTrue();
		}
	);
	falseToggle.onValueChanged.AddListener(
		function(){
			panelScript.toggleFalse();
		}
	);
	rightButton.onClick.AddListener(
		function(){
			panelScript.changeUI(0);
		}
	);
	leftButton.onClick.AddListener(
		function(){
			panelScript.changeUI(-1);
		}
	);
}

function Update () {

}