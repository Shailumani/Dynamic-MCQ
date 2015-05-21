#pragma strict
var thisButton : UI.Button;
var panelScript : updateUI;
var questionNo : int;
function Start () {
	thisButton=gameObject.GetComponent(UI.Button);
	panelScript = thisButton.GetComponentInParent(updateUI);
	questionNo = parseInt(thisButton.name);
	thisButton.onClick.AddListener(
		function(){
			panelScript.changeUI(questionNo);
		}
	);
}

function Update () {

}