#pragma strict
import System.IO;
import System.Xml;
#if UNITY_EDITOR
import UnityEditor;
#endif
var paths : Array;
var path :String;
var categories : Array;
var pathBoxcredential : UI.InputField;
var credentials:String[];
var CategoriesInput : String[];
var toggles : Component[];
var image_name:String;
var credpath: String;
function onBrowse(){
#if UNITY_ANDROID
	var jc : AndroidJavaClass = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
	var currentActivity : AndroidJavaObject = jc.GetStatic.<AndroidJavaObject>("currentActivity");
	currentActivity.Call("selectImage", "Panel", "completeBrowse");
#else
	var browseScript = new Browse();
	completeBrowse(browseScript.browseForImage());
#endif
          
		
       	


 }
 
function completeBrowse(thisPath : String){

	pathBoxcredential.text = thisPath; 
 
 }

function Start () {
    CategoriesInput = ["Cartoon","Softy","Key","Strawberry","Star"];
 	pathBoxcredential =  GameObject.Find("Path").GetComponent(UI.InputField);
 	//pathBoxcredential.text=Application.persistentDataPath;
	toggles = GameObject.Find("CategoryInput").GetComponentsInChildren(UI.Toggle);
	var pathSaved : Array = new Array();
	var credentialSaved : Array = new Array();
	readXML(Application.persistentDataPath+"/NewFile.xml", pathSaved, "address");
	readXML(Application.persistentDataPath+"/NewFile.xml", credentialSaved, "Toggleoutput");
	if(pathSaved.length>0){
		if (!File.Exists(pathBoxcredential.text)){
			pathBoxcredential.text = pathSaved[0].ToString();
		}
	}
	if (!File.Exists(pathBoxcredential.text)){
		for(var i=0;i<5;i++){
			if(CategoriesInput[i].Equals(credentialSaved[0].ToString())){
				toggles[i].GetComponent(UI.Toggle).isOn = true;
			}
		}
	}
	
  }

function save(){
		if(!File.Exists(pathBoxcredential.text)){
			if(toggles[0].GetComponent(UI.Toggle).isOn){
			 	image_name=CategoriesInput[0];	
					
			}
			else if (toggles[1].GetComponent(UI.Toggle).isOn){
			 	image_name=CategoriesInput[1];	  
			}
			else if (toggles[2].GetComponent(UI.Toggle).isOn){
			 	image_name=CategoriesInput[2];	  			
			}
			else if (toggles[3].GetComponent(UI.Toggle).isOn){
			   	image_name=CategoriesInput[3];	
			}
			else if (toggles[3].GetComponent(UI.Toggle).isOn){
			    image_name=CategoriesInput[4];	
		    }else{
		    	return;
		    }
		}
		var xmlDoc = new XmlDocument();
	        var xmlDeclaration : XmlDeclaration = xmlDoc.CreateXmlDeclaration("1.0","utf-8",null);
	        var rootNode : XmlElement = xmlDoc.CreateElement("Reward");
	        xmlDoc.InsertBefore(xmlDeclaration, xmlDoc.DocumentElement); 
	        xmlDoc.AppendChild(rootNode);
        
        //var flagNode : XmlElement = xmlDoc.CreateElement("Flag");
        //xmlDoc.DocumentElement.AppendChild(flagNode);
               	    
        var PathNode : XmlElement=xmlDoc.CreateElement("address");
	    PathNode.InnerText = pathBoxcredential.text;
	    rootNode.AppendChild(PathNode);
        
   	  
        var ToggleNode : XmlElement=xmlDoc.CreateElement("Toggleoutput");
	    ToggleNode.InnerText = image_name;
	    rootNode.AppendChild(ToggleNode);
        
   	    
   	     	  
        xmlDoc.Save(Application.persistentDataPath+"/NewFile.xml");
   	   
		
   	   	Application.LoadLevel("start");
}

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

function cancel(){
	Application.LoadLevel("start");
}


function Update () {

}