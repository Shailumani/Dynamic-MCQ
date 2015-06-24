#pragma strict
import System.IO;
import System.Xml;

var startImageScript : quizOn;
var imageBox : UI.Image;
var questionImage : Texture2D;
var lineRenderer : LineRenderer;
var noOfCurVertices : int;
var pos : Vector3;
var imagePos : Vector2;
var imageSize : Vector2;
var isMousePressed : boolean;
//var hasUndoed : boolean;
var wasOutside : boolean;
var newObject : GameObject;
var imagePanel : GameObject;
var drawnPoints : Array;
var mainRect : Rect;
var drawnLineRenderers : Array;
var createdLineRendererObjects : Array;
var undoButton : UI.Button;
function Start () {
	drawnPoints = new Array();
	drawnLineRenderers = new Array();
	createdLineRendererObjects = new Array();
	wasOutside = false;
	mainRect = GameObject.Find("Interface").GetComponentInChildren(RectTransform).rect;
	isMousePressed = false;
	startImageScript = GameObject.Find("Interface").GetComponent(quizOn);
	//imagePanel = GameObject.Find("ImagePanel");
	imagePos = new Vector2(0, 0);
	//print(imageBox.transform.position);
	//print(mainRect.width);
	//print(mainRect.height);
//	print(Screen.width);
	//print(Screen.height);
	//print(imagePanel.transform.position);
	//print(imagePos);
	imageSize.x = imagePanel.GetComponentInChildren(RectTransform).rect.width;
	imageSize.y = imagePanel.GetComponentInChildren(RectTransform).rect.height;
	print(imageSize);
	//print(GameObject.Find("GiveDescriptionPanel").GetComponent(RectTransform).rect.width);
	imagePos.x = mainRect.width/2-(gameObject.GetComponent(RectTransform).rect.width/2-imageSize.x/2);
	imagePos.y = mainRect.height/2-(gameObject.GetComponent(RectTransform).rect.height/2-imageSize.y/2);
	//scalePosition = gameObject.transform.position.x/(gameObject.GetComponentInChildren(RectTransform).rect.width)
	imagePos.x = (imagePos.x/mainRect.width)*Screen.width;
	imagePos.y = (imagePos.y/mainRect.height)*Screen.height;
	imageSize.x = (imageSize.x/mainRect.width)*Screen.width;
	imageSize.y = (imageSize.y/mainRect.height)*Screen.height;
	reloadRenderers();
	//print(imagePos);
	//print(imageSize);
}

function setImage(imageSprite : Sprite){
	//questionImage = new Texture2D(100, 100);
	//var www = new WWW("file:///" + imagePath);
	//www.LoadImageIntoTexture(questionImage);
	imageBox = imagePanel.GetComponentInChildren(UI.Image);
	//imageBox.sprite = Sprite.Create(questionImage, new Rect(0, 0, questionImage.width, questionImage.height), new Vector2(0.5f, 0.0f));
	imageBox.sprite = imageSprite;
}

/*function onProceed(){
		//if(!hasUndoed)
		//	drawnLineRenderers.push(drawnPoints);
		while(createdLineRendererObjects.length>0){
			Destroy(createdLineRendererObjects.pop());
		}
		writeToXml();
		Destroy(gameObject);
//		GameObject.Find("MainPanel").GetComponent.<startImageQuestion>().onPresentDescriptionQuestion(drawnLineRenderers);
		GameObject.Find("MainPanel").GetComponent.<startImageQuestion>().onPresentDescriptionQuestion();
}*/


function clearLineRenderers(){
	while(createdLineRendererObjects.length>0){
		drawnLineRenderers.pop();
		Destroy(createdLineRendererObjects.pop());
	}
}

function OnDestroy(){
	clearLineRenderers();
}

function drawLineRenderers(lineRenderersArray : Array){
	for(var i=0;i<lineRenderersArray.length;i++){
		noOfCurVertices = 1;
		drawnPoints = new Array();
		var lastPoints = new Array();
		lastPoints = lineRenderersArray[i];
		newObject = new GameObject();
		newObject.layer = LayerMask.NameToLayer("draw");
		lineRenderer = newObject.AddComponent.<LineRenderer>();
		createdLineRendererObjects.push(newObject);
		lineRenderer.material = new Material (Shader.Find("Sprites/Default"));
		lineRenderer.SetColors(Color.green, Color.green);
		lineRenderer.SetWidth(0.1f, 0.1f);
		for(var j=0;j<lastPoints.length;j++){
			lineRenderer.SetVertexCount(noOfCurVertices);
			var point : Vector2;
			point = lastPoints[j];
			drawnPoints.push(point);
			var pos = new Vector3(point.x*imageSize.x+imagePos.x, point.y*imageSize.y+imagePos.y, Mathf.Abs(Camera.main.transform.position.z)+1);		
			lineRenderer.SetPosition(noOfCurVertices-1, Camera.main.ScreenToWorldPoint(pos));
			noOfCurVertices++;
		}
		drawnLineRenderers.push(drawnPoints);
	}
}

function reloadRenderers(){
	var newArray : Array = new Array(startImageScript.questions[startImageScript.clickedButton-1]);
	drawLineRenderers(newArray);
}
