#pragma strict
import System.Xml;
import System.IO;
import System.Collections;

var questionImage: Texture2D ;
var names : Array;
var questions : Array;
var questionsFileNames : Array;
var questionsFileName : String;
var defaultScorePath : String;
var defaultPath : String;
var scores : Array;
var resultBox : UI.Text;
var cur_image : GameObject;
var cur_image_list : Array;
var spriterenderer : SpriteRenderer;
var box_size : int;
var margin : int;
var sw : int;
var sww : int;
var sh : int;
var credpaths :Array;
var cred_defaultpath:String;
var toggleoption :Array;
var toggle_answer:String;
var image_clipart:String;
var confirmationPopupPrefab : GameObject;
//var flag:int;
function readXML(filepath : String, result : Array, tagName : String){
    var xmlDoc : XmlDocument = new XmlDocument();
    if(File.Exists (filepath))
    { 	
    	var x : XmlNodeList;
        xmlDoc.Load( filepath );
        x = xmlDoc.GetElementsByTagName(tagName);
		for (var i=0;i<x.Count;i++)
  		{ 
  			result.push(x.Item(i).InnerText);
  		}
	}
}

function confirmation(returnFunctionName : String){
	var newConfirmationPopup : GameObject = Instantiate(confirmationPopupPrefab);
	newConfirmationPopup.transform.SetParent(gameObject.transform);
	newConfirmationPopup.transform.position = gameObject.transform.position;
	newConfirmationPopup.transform.localScale = new Vector3(1, 1, 1);
	newConfirmationPopup.GetComponentsInChildren(UI.Button)[0].GetComponent(UI.Button).onClick.AddListener(
		function(){
			Destroy(newConfirmationPopup);
			Invoke(returnFunctionName, 0.0f);
		}
	);
	newConfirmationPopup.GetComponentsInChildren(UI.Button)[1].GetComponent(UI.Button).onClick.AddListener(
		function(){
			Destroy(newConfirmationPopup);
		}
	);
}

function Start () {  
    sh = Screen.height;
	sw = Screen.width;
	sww = Screen.width;
	box_size = sh * 0.08;
	margin = sh * 0.00008;
	questions = new Array();
    questionsFileNames = new Array();
    credpaths = new Array();
    toggleoption=new Array();
	defaultScorePath = Application.persistentDataPath;
	var paths : Array = new Array();
	readXML(Application.persistentDataPath+"/temp.xml", questionsFileNames, "Name");
	readXML(Application.persistentDataPath+"/settings.xml", paths, "path");
	questionsFileName = questionsFileNames[0];
	readXML(questionsFileName, questions, "Question");
	defaultPath = paths[0]; 
	resultBox = GetComponentInChildren(UI.Text);
	
	
	names = new Array();
	scores = new Array();
	cur_image_list = new Array();
	var j:int;
	var i : int;
	readXML(defaultScorePath+"/scores.xml", names, "Name");
	readXML(defaultScorePath+"/scores.xml", scores, "Score");
	if(names.length<=3){	
		i=0;
	}
	else{
		i = names.length-4;
	}
	if(names.length>1){
		resultBox.text = "Recent Scores\n";
	}
	else{
		resultBox.text = "";
	}
	for(;i<names.length-1;i++){
			resultBox.text = resultBox.text + names[i] + " : " + scores[i] + "\n";
	}
	resultBox.text = resultBox.text + "\nCongrats! "+names[names.length-1]+",\n Your score is "+scores[scores.length-1];
    /*    readXML(Application.persistentDataPath+"/NewFile.xml", credpaths, "address");
		cred_defaultpath=credpaths[0];
	    readXML(Application.persistentDataPath+"/NewFile.xml",toggleoption, "Toggleoutput");
     	toggle_answer=toggleoption[0];
		
   	for(j=0;j<questions.length;j++)
	  {
	  if(cred_defaultpath.length!=0)
	   {
	    
	    questionImage = new Texture2D(1000, 1000);
	    var www = new WWW("file:///" + cred_defaultpath);
	    www.LoadImageIntoTexture(questionImage); 
	    cur_image = new GameObject(""+(j+1));
		cur_image_list.push(cur_image);
		spriterenderer = cur_image.AddComponent.<SpriteRenderer>();
		spriterenderer.sprite = Sprite.Create(questionImage, new Rect(0, 0, questionImage.width, questionImage.height), new Vector2(0.5f, 0.0f));
		(cur_image_list[j] as GameObject).transform.position = Camera.main.ScreenToWorldPoint(Vector3((j*(box_size))+200 , (sh - sh*0.04)-90, 0));
		(cur_image_list[j] as GameObject).transform.position.z = 0;
		(cur_image_list[j] as GameObject).transform.GetComponent.<Renderer>().material.color = Color.gray;
		 
	     }
	    
     else{
     
	    cur_image = new GameObject(""+(j+1));
		cur_image_list.push(cur_image);
		spriterenderer = cur_image.AddComponent.<SpriteRenderer>();

		spriterenderer.sprite = Resources.Load(toggle_answer, Sprite);
		cur_image.AddComponent.<Rigidbody2D>();
		cur_image.GetComponent.<Rigidbody2D>().gravityScale = 0;
		cur_image.GetComponent.<Rigidbody2D>().fixedAngle = true;
		cur_image.GetComponent.<Rigidbody2D>().mass = 0;
		cur_image.GetComponent.<Rigidbody2D>().isKinematic = true;
		cur_image.GetComponent.<Rigidbody2D>().angularDrag = 0;
		cur_image.AddComponent.<BoxCollider2D>();
		(cur_image_list[j] as GameObject).transform.position = Camera.main.ScreenToWorldPoint(Vector3((j*(box_size))+200 , (sh - sh*0.04)-70, 0));
		(cur_image_list[j] as GameObject).transform.position.z = 0;
		(cur_image_list[j] as GameObject).transform.GetComponent.<Renderer>().material.color = Color.gray;
		 
	  	                   }
	}
	 var k:int;
  k=parseInt(scores[scores.length-1].ToString());
    if(scores.length!=0)
	{   
	   	while(k != 0)   
	    {	
	     (cur_image_list[k-1] as GameObject).transform.GetComponent.<Renderer>().material.color = Color.yellow;
	      k--;
	    }
    }*/
    
   

}
function replay(){
	Application.LoadLevel("start");
}
function quit(){
	Application.Quit();
}
function Update () {
 
}