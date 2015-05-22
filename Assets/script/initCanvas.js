#pragma strict
var panel : GameObject;
var newPanel : GameObject;
function Start () {
	pos = Vector3(525, 136, 0);
	rot = Quaternion.identity;
	newPanel = Instantiate(interFace, pos, rot);
	newPanel.transform.parent = gameObject.transform;
}

function Update () {

}