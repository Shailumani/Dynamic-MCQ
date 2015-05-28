#pragma strict
var thisButton : UI.Button;
var panelScript : quizOn;
var questionNo : int;
function Start () {
	thisButton=gameObject.GetComponent(UI.Button);
	panelScript = thisButton.GetComponentInParent(quizOn);
	questionNo = parseInt(thisButton.name);
	thisButton.onClick.AddListener(
		function(){
			panelScript.changeUI(questionNo);
		}
	);
}

function Update () {

}