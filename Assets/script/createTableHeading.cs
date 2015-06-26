using UnityEngine;
using System.Collections;
using UnityEngine.UI;
public class createTableHeading : MonoBehaviour {
	int noOfCols = 6;
	void Start () {
		GetComponent<GridLayoutGroup>().cellSize = new Vector2((Screen.width-20-noOfCols)/noOfCols, 25);
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
