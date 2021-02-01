/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author
 * Veronica Kleinschmidt, Brian Chan, Rob Budak
 */

// eslint-disable-next-line no-var
var rhit = rhit || {};
// eslint-disable-next-line max-len
rhit.supportedLocations = ["Mussallem Union", "Lakeside Hall", "Percopo Hall", "Apartments East", "Apartments West", "Blumberg Hall", "Scharpenburg Hall", "Mees Hall", "BSB Hall", "Speed Hall", "Deming Hall", "O259", "O269", "O267", "O257"];

// import { jsgraphs } from './jsgraphs.js';

/** globals */
rhit.variableName = "";

/** function and class syntax examples */
rhit.functionName = function () {
	/** function body */
};

// https://www.npmjs.com/package/js-graph-algorithms#create-directed-weighted-graph
// https://rawgit.com/chen0040/js-graph-algorithms/master/examples/example-weighted-digraph.html
const g = new jsgraphs.WeightedDiGraph(8);
console.log(g);

// taken from https://www.w3schools.com/howto/howto_js_autocomplete.asp
function autocomplete(inp, arr) {
	/* the autocomplete function takes two arguments,
	the text field element and an array of possible autocompleted values:*/
	let currentFocus;
	/* execute a function when someone writes in the text field:*/
	inp.addEventListener("input", function(e) {
		let a = this.value;
		let b = this.value;
		let i = this.value;
		const val = this.value;
		/* close any already open lists of autocompleted values*/
		closeAllLists();
		if (!val) {
			return false;
		}
		currentFocus = -1;
		/* create a DIV element that will contain the items (values):*/
		a = document.createElement("DIV");
		a.setAttribute("id", `${this.id}autocomplete-list`);
		a.setAttribute("class", "autocomplete-items");
		/* append the DIV element as a child of the autocomplete container:*/
		this.parentNode.appendChild(a);
		/* for each item in the array...*/

		let numResults = 0;
		for (i = 0; i < arr.length; i++) {
			/* check if the item starts with the same letters as the text field value:*/
			// if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
			// attempt to make search matching more general
			if (numResults == 5) {
				break;
			}

			if (arr[i].toUpperCase().indexOf(val.toUpperCase()) != -1) {
			/* create a DIV element for each matching element:*/
				b = document.createElement("DIV");

				const valueIndex = arr[i].toUpperCase().indexOf(val.toUpperCase());
				// first add everything up to index
				b.innerHTML += arr[i].slice(0, valueIndex);
				// bold everything from index up to index + length of val
				b.innerHTML += `<strong>${arr[i].slice(valueIndex, valueIndex+val.length)}</strong>`;
				// add everything from index + length of val to the end of arr[i]
				b.innerHTML += arr[i].substr(valueIndex + val.length);

				/* insert a input field that will hold the current array item's value:*/
				b.innerHTML += `<input type='hidden' value='${arr[i]}'>`;
				/* execute a function when someone clicks on the item value (DIV element):*/
				b.addEventListener("click", function(e) {
				/* insert the value for the autocomplete text field:*/
					inp.value = this.getElementsByTagName("input")[0].value;
					/* close the list of autocompleted values,
					(or any other open lists of autocompleted values:*/
					closeAllLists();
				});
				a.appendChild(b);
				numResults++;
			}
		}
	});
	/* execute a function presses a key on the keyboard:*/
	inp.addEventListener("keydown", function(e) {
		let x = document.getElementById(`${this.id}autocomplete-list`);
		if (x) x = x.getElementsByTagName("div");
		if (e.keyCode == 40) {
		/* If the arrow DOWN key is pressed,
		  increase the currentFocus variable:*/
			currentFocus++;
			/* and and make the current item more visible:*/
			addActive(x);
		} else if (e.keyCode == 38) { // up
		/* If the arrow UP key is pressed,
		decrease the currentFocus variable:*/
			currentFocus--;
			/* and and make the current item more visible:*/
			addActive(x);
		} else if (e.keyCode == 13) {
		/* If the ENTER key is pressed, prevent the form from being submitted,*/
			e.preventDefault();
			if (currentFocus > -1) {
			/* and simulate a click on the "active" item:*/
				if (x) x[currentFocus].click();
			}
		}
	});

	function addActive(x) {
	/* a function to classify an item as "active":*/
		if (!x) return false;
		/* start by removing the "active" class on all items:*/
		removeActive(x);
		if (currentFocus >= x.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = (x.length - 1);
		/* add class "autocomplete-active":*/
		x[currentFocus].classList.add("autocomplete-active");
	}

	function removeActive(x) {
	/* a function to remove the "active" class from all autocomplete items:*/
		for (let i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}

	function closeAllLists(elmnt) {
	/* close all autocomplete lists in the document,
	  except the one passed as an argument:*/
		const x = document.getElementsByClassName("autocomplete-items");
		for (let i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != inp) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}
}
rhit.ClassName = class {
	constructor() {

	}

	methodName() {

	}
};

rhit.main = function () {
	console.log("Ready");
	// TODO: arrange the following into neater classes to follow MVC conventions

	if (document.querySelector("#mainPage")) {
		autocomplete(document.querySelector("#startInput"), rhit.supportedLocations);
		autocomplete(document.querySelector("#destInput"), rhit.supportedLocations);
		document.querySelector("#submitLocation").addEventListener("click", (event) => {
			const currentStart = document.querySelector("#startInput").value;
			const currentDest = document.querySelector("#destInput").value;
			// console.log(`Planning route from ${currentStart} to ${currentDest}`);
			window.location.href = `./route.html?start=${currentStart}&dest=${currentDest}`;
		});
	}

	if (document.querySelector("#routePage")) {
		// get url parameter
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const startPoint = urlParams.get("start");
		const destPoint = urlParams.get("dest");
		document.querySelector("#directionsItem").innerHTML = `${startPoint} to ${destPoint}`;
		// TODO: long term, but pass startPoint and destPoint into
		// a magical box function that spits out the distance between them
	}
};

rhit.main();
