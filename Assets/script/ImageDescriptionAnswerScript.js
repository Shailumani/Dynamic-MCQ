#pragma strict
var startImageScript : quizOn;
var imageBox : UI.Image;
var questionImage : Texture2D;
var lineRenderer : LineRenderer;
var noOfCurVertices : int;
var pos : Vector3;
var imagePos : Vector2;
var imageSize : Vector2;
var isMousePressed : boolean;
var wasOutside : boolean;
var newObject : GameObject;
var imagePanel : GameObject;
var drawnPoints : Array;
var mainRect : Rect;
var drawnLineRenderers : Array;
var createdLineRendererObjects : Array;
var createdOldLineRendererObjects : Array;
var point : Vector2;
var noOfCollidersHit : int;
var correctPoints : int;
var incorrectPoints : int;
var totalColliders : int;
var undoButton : UI.Button;
var lastPoint : Vector3;
var thisPoint : Vector3;
var hideDraw : LayerMask;
var showDraw : LayerMask;
function Start () {
	noOfCollidersHit = 0;
	correctPoints = 0;
	incorrectPoints = 0;
	totalColliders = 0;
	startImageScript = GameObject.Find("Interface").GetComponent(quizOn);
	drawnLineRenderers = new Array();
	//readLineRenderers(Application.persistentDataPath+"/Question.qz", drawnLineRenderers);
	//print(drawnLineRenderers.length);
	createdLineRendererObjects = new Array();
	createdOldLineRendererObjects = new Array();
	wasOutside = false;
	mainRect = GameObject.Find("Interface").GetComponentInChildren(RectTransform).rect;
	isMousePressed = false;
	//questionImage = new Texture2D(1000, 1000);
	//var www = new WWW("file:///" + startImageScript.path);
	//www.LoadImageIntoTexture(questionImage);
	imageBox = imagePanel.GetComponentInChildren(UI.Image);
	//imageBox.sprite = Sprite.Create(questionImage, new Rect(0, 0, questionImage.width, questionImage.height), new Vector2(0.5f, 0.0f));
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
	//print(imageSize);
	//print(GameObject.Find("ImageDescriptionPanel").GetComponent(RectTransform).rect.width);
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

function drawOldLineRenderers(lineRenderersArray : Array){
	totalColliders=0;
	for(var i=0;i<lineRenderersArray.length;i++){
		noOfCurVertices = 1;
		drawnPoints = new Array();
		lastPoint = new Vector3(0, 0, 0);
		drawnPoints = lineRenderersArray[i];
		newObject = new GameObject();
		newObject.layer = LayerMask.NameToLayer("previous");
		lineRenderer = newObject.AddComponent.<LineRenderer>();
		lineRenderer.material = new Material (Shader.Find("Sprites/Default"));
		lineRenderer.SetColors(Color.green, Color.green);
		lineRenderer.SetWidth(0.1f, 0.1f);
		createdOldLineRendererObjects.push(newObject);
		for(var j=0;j<drawnPoints.length;j++){
			lineRenderer.SetVertexCount(noOfCurVertices);
			//print(drawnPoints.pop());
			point = drawnPoints[j];
			//pos = new Vector3((point.x*imageSize.x)/mainRect.width*Screen.width, (point.y*imageSize.y)/mainRect.height*Screen.height, Mathf.Abs(Camera.main.transform.position.z)+1);
					//Debug.Log(pos);
			pos = new Vector3(point.x*imageSize.x+imagePos.x, point.y*imageSize.y+imagePos.y, Mathf.Abs(Camera.main.transform.position.z)+1);		
			thisPoint = Camera.main.ScreenToWorldPoint(pos);
			lineRenderer.SetPosition(noOfCurVertices-1, thisPoint);
			if(Vector3.Distance(lastPoint, new Vector3(0, 0, 0))>0 && Vector3.Distance(lastPoint, thisPoint)>0){
				addColliderToLine(lastPoint, thisPoint);
			}
			noOfCurVertices++;
			lastPoint = thisPoint;
		}
		//newObject.SetActive(false);
		//newObject.SetActive(true);
	}
}

function addColliderToLine(startPos : Vector3, endPos : Vector3)
{
	var col : BoxCollider = new GameObject("Collider").AddComponent.<BoxCollider>();
	col.gameObject.layer = LayerMask.NameToLayer("previous");
	col.transform.parent = newObject.transform; // Collider is added as child object of line
	var lineLength : float = Vector3.Distance (startPos, endPos); // length of line
	col.size = new Vector3 (lineLength, 0.2f, 1f); // size of collider is set where X is length of line, Y is width of line, Z will be set as per requirement
	var midPoint : Vector3 = (startPos + endPos)/2;
	col.transform.position = midPoint; // setting position of collider object
	// Following lines calculate the angle between startPos and endPos
	var angle : float = 90;
	if(startPos.x != endPos.x){
		angle = ((startPos.y - endPos.y) / (startPos.x - endPos.x));
		/*if((startPos.yendPos.x) || (endPos.ystartPos.x))
		{
			angle*=-1;
		}*/
		angle = Mathf.Rad2Deg * Mathf.Atan (angle);
	}
	col.transform.Rotate (0, 0, angle);
	totalColliders++;
}
function readLineRenderers(filepath : String, result : Array){
	var xmlDoc : XmlDocument = new XmlDocument();
	if(File.Exists(filepath)){
		var lines : XmlNodeList;
		xmlDoc.Load(filepath);
		lines = xmlDoc.GetElementsByTagName("Line");
		for(var i=0;i<lines.Count;i++){
			var lineXmlDoc : XmlDocument = new XmlDocument();
			lineXmlDoc.LoadXml(lines.Item(i).OuterXml);
			var points : XmlNodeList;
			points = lineXmlDoc.GetElementsByTagName("Point");
			drawnPoints = new Array();
			for(var j=0;j<points.Count;j++){
				var thisPoint = new Vector2(0, 0);
				var pointXmlDoc : XmlDocument = new XmlDocument();
				pointXmlDoc.LoadXml(points.Item(j).OuterXml);
				var x : XmlNodeList;
				x = pointXmlDoc.GetElementsByTagName("X");
				thisPoint.x = parseFloat(x.Item(0).InnerText);
				var y : XmlNodeList;
				y = pointXmlDoc.GetElementsByTagName("Y");
				thisPoint.y = parseFloat(y.Item(0).InnerText);
				drawnPoints.push(thisPoint);
			}
			result.push(drawnPoints);
		}
	}
}
function Update () {
//print(imagePanel.transform.position);
	if(startImageScript.isPopupDisplayed){
		if(Camera.main.cullingMask != hideDraw)
			Camera.main.cullingMask = hideDraw;
		return;
	}else if(Camera.main.cullingMask != showDraw){
		Camera.main.cullingMask = showDraw;
	}
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
	drawnLineRenderers.pop();
	Destroy(createdLineRendererObjects.pop());
}

function onSubmit(){
	correctPoints=0;
	incorrectPoints=0;
	noOfCollidersHit=0;
	for(var i=0;i<drawnLineRenderers.length;i++){
		drawnPoints = drawnLineRenderers[i];
		//print(drawnPoints.length);
		for(var j=0;j<drawnPoints.length;j++){
			var thisPoint : Vector2 = drawnPoints[j];
			checkPoint(new Vector3(thisPoint.x*imageSize.x+imagePos.x, thisPoint.y*imageSize.y+imagePos.y, Mathf.Abs(Camera.main.transform.position.z)+1));
		}
	}
	if(correctPoints+incorrectPoints>0)
		var fractionOfCorrectPoints : float = (100*correctPoints)/(correctPoints+incorrectPoints);
	else
		return false;
	var fractionOfCollidersHit : float = (100*noOfCollidersHit)/totalColliders;
	if(fractionOfCorrectPoints>60 && fractionOfCollidersHit>60){
		print("Correct");
		return true;
	}
	else{
		print("Incorrect");
		return false;
	}
}

function checkPoint(point : Vector3){
	point = Camera.main.ScreenToWorldPoint(point);
	var upOrigin = new Vector3(point.x, point.y+0.2f, point.z);
	var downOrigin = new Vector3(point.x, point.y-0.2f, point.z);
	var objectHit : GameObject;
	var hitDown = Physics.RaycastAll(upOrigin, 
								-Vector3.up, 
								0.1f, 
								1 << LayerMask.NameToLayer("previous"));
	var hitUp = Physics.RaycastAll(downOrigin, 
								Vector3.up, 
								0.1f, 
								1 << LayerMask.NameToLayer("previous"));
	if(hitUp.Length>0 || hitDown.Length>0){
		for(var i = 0;i<hitUp.Length;i++){
			objectHit = GameObject.Find(hitUp[i].collider.gameObject.name);
			if(!objectHit.name.Equals("hit")){
				objectHit.name = "hit";
				noOfCollidersHit++;
			}
		}
		for(i = 0;i<hitDown.Length;i++){
			objectHit = GameObject.Find(hitDown[i].collider.gameObject.name);
			if(!objectHit.name.Equals("hit")){
				objectHit.name = "hit";
				noOfCollidersHit++;
			}
		}
		correctPoints++;
	}
	else{
		incorrectPoints++;
	}
}

function clearLineRenderers(){
	while(createdOldLineRendererObjects.length>0){
		Destroy(createdOldLineRendererObjects.pop());
	}
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
	print(lineRenderersArray);
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

function setImage(imageSprite : Sprite){
	//questionImage = new Texture2D(100, 100);
	//var www = new WWW("file:///" + imagePath);
	//www.LoadImageIntoTexture(questionImage);
	imageBox = imagePanel.GetComponentInChildren(UI.Image);
	//imageBox.sprite = Sprite.Create(questionImage, new Rect(0, 0, questionImage.width, questionImage.height), new Vector2(0.5f, 0.0f));
	imageBox.sprite = imageSprite;
}

function reloadRenderers(){
	var newArray : Array = new Array(startImageScript.options[startImageScript.clickedButton-1]);
	drawOldLineRenderers(newArray);
	newArray = new Array(startImageScript.newLineRenderers[startImageScript.clickedButton-1]);
	drawLineRenderers(newArray);
}
