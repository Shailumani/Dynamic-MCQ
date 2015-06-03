using UnityEngine;
using System.Collections;
using UnityEngine.UI;
public class createTableHeading : MonoBehaviour {
	int noOfCols = 5;
	// Use this for initialization
	void Start () {
		GetComponent<GridLayoutGroup>().cellSize = new Vector2((Screen.width-noOfCols)/noOfCols, GetComponent<RectTransform>().rect.height);
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
