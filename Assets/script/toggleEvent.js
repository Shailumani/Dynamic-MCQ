#pragma strict
var thisToggle : UI.Toggle;
var toggles : Component[];
function Start () {
	thisToggle = gameObject.GetComponent(UI.Toggle);
	thisToggle.onValueChanged.AddListener(
		function(){
			if(thisToggle.isOn){
				toggles = GameObject.Find("Options").GetComponentsInChildren(UI.Toggle);
				for(var i=0;i<toggles.length;i++){
					if(toggles[i].GetComponent(UI.Toggle).isOn && toggles[i].name != gameObject.name){
						toggles[i].GetComponent(UI.Toggle).isOn = false;
					}
				}
			}
		}
	);
}

function Update () {

}