#pragma strict
import System.IO;
import System.Xml;

var startImageScript : writeQuestion;
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
	startImageScript = GameObject.Find("Interface").GetComponent(writeQuestion);
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
function Update () {
//print(imagePanel.transform.position);
	if(undoButton.interactable==false && drawnLineRenderers.length>0){
		undoButton.interactable = true;
	}
	else if(undoButton.interactable==true && drawnLineRenderers.length==0){
		undoButton.interactable = false;
	}
#if UNITY_ANDROID
	if(Input.touchCount == 1){
		if(wasOutside == true || Input.GetTouch(0).phase == TouchPhase.Began){//Line drawing has started
				if(Mathf.Abs(Input.mousePosition.x-imagePos.x)>imageSize.x/2 || 
					Mathf.Abs(Input.mousePosition.y-imagePos.y)>imageSize.y/2){
					//isMousePressed = false;	
					wasOutside = true;
				}	//Line drawing is taking place
				else{
//				if(can_draw){
//					Debug.Log("Comes here");
					noOfCurVertices = 1;
//					cur_object = new GameObject();
//					cur_object.tag = cur_question_object.component_name;
					newObject = new GameObject();
					newObject.layer = LayerMask.NameToLayer("draw");
					lineRenderer = newObject.AddComponent.<LineRenderer>();
					createdLineRendererObjects.push(newObject);
					if(wasOutside){
						drawnLineRenderers.push(drawnPoints);
						wasOutside = false;	
					}
					drawnPoints = new Array();
					lineRenderer.SetVertexCount(1);
					lineRenderer.material = new Material (Shader.Find("Sprites/Default"));
					lineRenderer.SetColors(Color.green, Color.green);
					lineRenderer.SetWidth(0.1f, 0.1f);
					lineRenderer.useWorldSpace = true;
					lineRenderer.SetVertexCount(noOfCurVertices);
					//Debug.Log(Input.mousePosition);
					pos = new Vector3(Input.mousePosition.x, Input.mousePosition.y, Mathf.Abs(Camera.main.transform.position.z)+1);
					//Debug.Log(pos);
					lineRenderer.SetPosition(0, Camera.main.ScreenToWorldPoint(pos));
					//drawnPoints.push(new Vector2((pos.x/Screen.width*mainRect.width)/imageSize.x, (pos.y/Screen.height*mainRect.height)/imageSize.y));
					drawnPoints.push(new Vector2((pos.x-imagePos.x)/imageSize.x, (pos.y-imagePos.y)/imageSize.y));
//					CheckPoint(pos);
//				}
				}
		}
		if(Input.GetTouch(0).phase==TouchPhase.Moved){
				if(Mathf.Abs(Input.mousePosition.x-imagePos.x)>imageSize.x/2 || 
					Mathf.Abs(Input.mousePosition.y-imagePos.y)>imageSize.y/2){
					wasOutside = true;
					//isMousePressed = false;	
				}	//Line drawing is taking place
				else if(drawnPoints.length>0){
					wasOutside = false;
					noOfCurVertices++;
					lineRenderer.SetVertexCount(noOfCurVertices);
					pos = new Vector3(Input.mousePosition.x, Input.mousePosition.y, Mathf.Abs(Camera.main.transform.position.z)+1);
					//Debug.Log(pos);
					lineRenderer.SetPosition(noOfCurVertices-1, Camera.main.ScreenToWorldPoint(pos));
					//drawnPoints.push(new Vector2((pos.x/Screen.width*mainRect.width)/imageSize.x, (pos.y/Screen.height*mainRect.height)/imageSize.y));
					drawnPoints.push(new Vector2((pos.x-imagePos.x)/imageSize.x, (pos.y-imagePos.y)/imageSize.y));
		//				CheckPoint(pos);
				}
		}
		if(Input.GetTouch(0).phase==TouchPhase.Ended){
			if(drawnPoints.length>0)
				drawnLineRenderers.push(drawnPoints);
			wasOutside = false;
			drawnPoints = new Array();
		}
	}
#else
	if(Input.GetMouseButtonDown(0)||wasOutside==true){
		if(Mathf.Abs(Input.mousePosition.x-imagePos.x)>imageSize.x/2 || 
			Mathf.Abs(Input.mousePosition.y-imagePos.y)>imageSize.y/2){
			//isMousePressed = false;	
		}
		else{
	//		print("reached");
			//hasUndoed = false;
			isMousePressed = true;
			noOfCurVertices = 1;
			newObject = new GameObject();
			newObject.layer = LayerMask.NameToLayer("draw");
	//		newObject.transform.SetParent(GameObject.Find("Camera").transform);
	//		newObject.transform.SetParent(GameObject.Find("ImageDescriptionPanel").transform);
	//		print(newObject.AddComponent.<CanvasRenderer>().absoluteDepth);
			lineRenderer = newObject.AddComponent.<LineRenderer>();
			createdLineRendererObjects.push(newObject);
			if(wasOutside){
				drawnLineRenderers.push(drawnPoints);
				wasOutside = false;
			}
			//if(drawnPoints.length>0){
			//	drawnLineRenderers.push(drawnPoints);
				drawnPoints = new Array();
			//}
			lineRenderer.SetVertexCount(1);
			lineRenderer.material = new Material (Shader.Find("Sprites/Default"));
			lineRenderer.SetColors(Color.green, Color.green);
			lineRenderer.SetWidth(0.1f, 0.1f);
			lineRenderer.useWorldSpace = false;
			lineRenderer.SetVertexCount(noOfCurVertices);
			//Debug.Log(Input.mousePosition);
			pos = new Vector3(Input.mousePosition.x, Input.mousePosition.y, Mathf.Abs(Camera.main.transform.position.z)+1);
			//Debug.Log(pos);
			lineRenderer.SetPosition(0, Camera.main.ScreenToWorldPoint(pos));
			//drawnPoints.push(new Vector2((pos.x/Screen.width*mainRect.width)/imageSize.x, (pos.y/Screen.height*mainRect.height)/imageSize.y));
			drawnPoints.push(new Vector2((pos.x-imagePos.x)/imageSize.x, (pos.y-imagePos.y)/imageSize.y));
		}
	}
	if(Input.GetMouseButtonUp(0)){
		if(isMousePressed)
			drawnLineRenderers.push(drawnPoints);
		isMousePressed = false;
		wasOutside = false;
	}
	if(isMousePressed){
		//print(Input.mousePosition);
		if(Mathf.Abs(Input.mousePosition.x-imagePos.x)>imageSize.x/2 || 
			Mathf.Abs(Input.mousePosition.y-imagePos.y)>imageSize.y/2){
			//isMousePressed = false;	
			wasOutside = true;
		}
		else{
			wasOutside = false;
			noOfCurVertices++;
			lineRenderer.SetVertexCount(noOfCurVertices);
			//Debug.Log(Input.mousePosition);
			pos = new Vector3(Input.mousePosition.x, Input.mousePosition.y, Mathf.Abs(Camera.main.transform.position.z)+1);
			//Debug.Log(pos);
			print(pos.x);
			print(Screen.width);
			print(mainRect.width);
			print(imageSize.x);
			lineRenderer.SetPosition((noOfCurVertices - 1), Camera.main.ScreenToWorldPoint(pos));
			//drawnPoints.push(new Vector2((pos.x/Screen.width*mainRect.width)/imageSize.x, (pos.y/Screen.height*mainRect.height)/imageSize.y));
			drawnPoints.push(new Vector2((pos.x-imagePos.x)/imageSize.x, (pos.y-imagePos.y)/imageSize.y));
		}
	}
#endif
}

function onUndo(){
	print(drawnLineRenderers.length);
	//if(createdLineRendererObjects.length==drawnLineRenderers.length)
		drawnLineRenderers.pop();
	print(drawnLineRenderers.length);
	Destroy(createdLineRendererObjects.pop());
	//hasUndoed = true;
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
function writeToXml(){
	var xmlDoc : XmlDocument;
	xmlDoc = new XmlDocument();
	var xmlDeclaration : XmlDeclaration = xmlDoc.CreateXmlDeclaration("1.0","utf-8",null);
    var rootNode : XmlElement = xmlDoc.CreateElement("MCQ");
    xmlDoc.InsertBefore(xmlDeclaration, xmlDoc.DocumentElement); 
    xmlDoc.AppendChild(rootNode);
    var parentNode : XmlElement;
	parentNode = xmlDoc.CreateElement("Question");
	xmlDoc.DocumentElement.AppendChild(parentNode);
	var answerNode : XmlElement = xmlDoc.CreateElement("Answer");
	parentNode.AppendChild(answerNode);
	while(drawnLineRenderers.length>0){
		var lineNode : XmlElement = xmlDoc.CreateElement("Line");
		answerNode.AppendChild(lineNode);
		drawnPoints = new Array();
		drawnPoints = drawnLineRenderers.pop();
		while(drawnPoints.length>0){
			var thisPoint : Vector2;
			thisPoint = drawnPoints.pop();
			var pointNode : XmlElement = xmlDoc.CreateElement("Point");
			lineNode.AppendChild(pointNode);
			var xNode : XmlElement = xmlDoc.CreateElement("X");
			pointNode.AppendChild(xNode);
			xNode.InnerText = thisPoint.x.ToString();
			var yNode : XmlElement = xmlDoc.CreateElement("Y");
			pointNode.AppendChild(yNode);
			yNode.InnerText = thisPoint.y.ToString();
		}
	}
	xmlDoc.Save(Application.persistentDataPath+"/Question.qz");
	//xmlDoc.Save(Application.persistentDataPath+"/check.qz");
}

function clearLineRenderers(){
	while(createdLineRendererObjects.length>0){
		drawnLineRenderers.pop();
		Destroy(createdLineRendererObjects.pop());
	}
}

function OnDestroy(){
	clearLineRenderers();
}

function getLineRenderers(){
	if(drawnLineRenderers!=null)
		return drawnLineRenderers;
	else
		return new Array();
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
		while(lastPoints.length>0){
			lineRenderer.SetVertexCount(noOfCurVertices);
			var point : Vector2;
			point = lastPoints.pop();
			drawnPoints.push(point);
			var pos = new Vector3(point.x*imageSize.x+imagePos.x, point.y*imageSize.y+imagePos.y, Mathf.Abs(Camera.main.transform.position.z)+1);		
			lineRenderer.SetPosition(noOfCurVertices-1, Camera.main.ScreenToWorldPoint(pos));
			noOfCurVertices++;
		}
		drawnLineRenderers.push(drawnPoints);
	}
}

function reloadRenderers(){
	var newArray : Array = new Array(startImageScript.options[startImageScript.clickedButton-1]);
	drawLineRenderers(newArray);
}