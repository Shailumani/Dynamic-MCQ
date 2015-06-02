#pragma strict
var thisButton : UI.Button;
var panelScript : writeQuestion;
var questionNo : int;
function Start () {
	thisButton=gameObject.GetComponent(UI.Button);
	panelScript = thisButton.GetComponentInParent(writeQuestion);
	questionNo = parseInt(thisButton.name);
	thisButton.onClick.AddListener(
		function(){
			panelScript.changeUI(questionNo);
		}
	);
}


function Update () {

}