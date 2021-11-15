/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author
 * Veronica Kleinschmidt, Brian Chan, Rob Budak
 */

/* eslint-disable no-var */
var rhit = rhit || {};
var w3schools = w3schools || {};
var movabletype = movabletype || {};
/* eslint-enable no-var */

// eslint-disable-next-line max-len
// rhit.supportedLocations = ["Mussallem Union", "Lakeside Hall", "Percopo Hall", "Apartments East", "Apartments West", "Blumberg Hall", "Scharpenberg Hall", "Mees Hall", "BSB Hall", "Speed Hall", "Deming Hall", "O259", "O269", "O267", "O257"];

// Singletons
rhit.fbAuthManagerSingleton = null;
rhit.routeManagerSingleton = null;
rhit.homeManagerSingleton = null;
rhit.settingsManagerSingleton = null;
rhit.savedLocationsManagerSingleton = null;
rhit.mapDataSubsystemSingleton = null;
rhit.devMapManagerSingleton = null;

/** globals */
rhit.FB_COLLECTION_CONSTANTS = "Constants";
rhit.FB_COLLECTION_USERS = "Users";
rhit.FB_COLLECTION_LOCATIONS = "Locations";
rhit.FB_COLLECTION_CONNECTIONS = "Connections";
rhit.FB_COLLECTION_CACHED = "Cached";
rhit.FB_KEY_LOC_GEO = "location";
rhit.FB_KEY_LOC_NAME = "name";
rhit.FB_KEY_LOC_ALIAS = "name-aliases";
rhit.FB_KEY_LOC_SEARCHABLE = "searchable?";
rhit.FB_KEY_CON_NAME = "name";
rhit.FB_KEY_CON_PLACE1 = "place1";
rhit.FB_KEY_CON_PLACE2 = "place2";
rhit.FB_KEY_CON_STAIRCASE = "staircase?";

rhit.TILE_SERVER_ADDRESS = (() => {
	const isLocalhost = window.location.href.includes("localhost");
	if (isLocalhost) {
		return "http://localhost:8000/";
	} else {
		return "https://rosenav-tile-server.herokuapp.com/";
	}
})();

// Forcibly get new map data regardless of cache.
// Takes precedence over DEBUG_FORCE_CACHED_MAP
// Forcibly rewrites the caches, even if they aren't outdated
rhit.DEBUG_FORCE_LIVE_MAP = false;

// Forcibly use cached map data, unless DEBUG_FORCE_LIVE_MAP is true.
rhit.DEBUG_FORCE_CACHED_MAP = false;

// Forcibly ask caching server to rewrite cache and rewrite own caches
rhit.DEBUG_FORCE_REWRITE_CACHE = false;

// This might be able to be replaced with Cloud Firestore offline data access
// https://firebase.google.com/docs/firestore/manage-data/enable-offline
// rhit.KEY_STORAGE_VERSION = "local-data-version";
rhit.KEY_STORAGE_NODES = "local-data-nodes";
rhit.KEY_STORAGE_CONNECTIONS = "local-data-connections";
rhit.KEY_STORAGE_NAMES = "local-data-names";

rhit.MAX_SAVED_LOCATIONS = 5;


// adapted from https://www.w3schools.com/howto/howto_js_autocomplete.asp
w3schools.autocomplete = function (inp, arr, callOnAcceptAutocompleteItem, suggestFavorites) {
	/* the autocomplete function takes two arguments,
	the text field element and an array of possible autocompleted values:*/
	let currentFocus;
	/* execute a function when someone writes in the text field:*/
	// inp.addEventListener("focusout", function(e) {
	// 	console.log("focus on autocomplete lost");
	// 	closeAllLists(); // close all autocomplete lists on lost focus
	// });

	inp.addEventListener("focus", function(e) {
		let a = this.value;
		let b = this.value;
		const val = this.value;
		/* close any already open lists of autocompleted values*/
		closeAllLists();
		if (!val) {
			if (rhit.fbAuthManagerSingleton.isSignedIn && suggestFavorites) {
				/* create a DIV element that will contain the items (values):*/
				const savedLocations = rhit.fbAuthManagerSingleton.savedLocations;
				a = document.createElement("DIV");
				a.setAttribute("id", `${this.id}autocomplete-list`);
				a.setAttribute("class", "autocomplete-items");
				/* append the DIV element as a child of the autocomplete container:*/
				this.parentNode.appendChild(a);
				/* for each item in the array...*/

				for (let i = 0; i < rhit.MAX_SAVED_LOCATIONS; i++) {
					const trueName = savedLocations[i];
					if (!trueName) {
						continue;
					}
					b = document.createElement("DIV");
					b.innerHTML += trueName;
					/* insert a input field that will hold the current array item's value:*/
					b.innerHTML += `<input type='hidden' value='${trueName}'>`;
					/* execute a function when someone clicks on the item value (DIV element):*/
					b.addEventListener("click", function(e) {
						/* insert the value for the autocomplete text field:*/
						inp.value = this.getElementsByTagName("input")[0].value;
						console.log("element", this.getElementsByTagName("input")[0]);
						/* close the list of autocompleted values,
							(or any other open lists of autocompleted values:*/
						closeAllLists();
						if (callOnAcceptAutocompleteItem) {
							callOnAcceptAutocompleteItem();
						}
					});
					a.appendChild(b);
				}
				return false;
			}
		}
	});


	inp.addEventListener("input", function(e) {
		let a = this.value;
		let b = this.value;
		let i = this.value;
		const val = this.value;
		/* close any already open lists of autocompleted values*/
		closeAllLists();
		if (!val) {
			if (rhit.fbAuthManagerSingleton.isSignedIn && suggestFavorites) {
				/* create a DIV element that will contain the items (values):*/
				/* create a DIV element that will contain the items (values):*/
				const savedLocations = rhit.fbAuthManagerSingleton.savedLocations;
				a = document.createElement("DIV");
				a.setAttribute("id", `${this.id}autocomplete-list`);
				a.setAttribute("class", "autocomplete-items");
				/* append the DIV element as a child of the autocomplete container:*/
				this.parentNode.appendChild(a);
				/* for each item in the array...*/

				for (let i = 0; i < rhit.MAX_SAVED_LOCATIONS; i++) {
					const trueName = savedLocations[i];
					if (!trueName) {
						continue;
					}
					b = document.createElement("DIV");
					b.innerHTML += trueName;
					/* insert a input field that will hold the current array item's value:*/
					b.innerHTML += `<input type='hidden' value='${trueName}'>`;
					/* execute a function when someone clicks on the item value (DIV element):*/
					b.addEventListener("click", function(e) {
						/* insert the value for the autocomplete text field:*/
						inp.value = this.getElementsByTagName("input")[0].value;
						console.log("element", this.getElementsByTagName("input")[0]);
						/* close the list of autocompleted values,
							(or any other open lists of autocompleted values:*/
						closeAllLists();
						if (callOnAcceptAutocompleteItem) {
							callOnAcceptAutocompleteItem();
						}
					});
					a.appendChild(b);
				}
				return false;
			}
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
		const searchResults = {};
		for (i = 0; i < arr.length; i++) {
			/* check if the item starts with the same letters as the text field value:*/
			// if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
			// attempt to make search matching more general
			if (numResults == 5) {
				break;
			}

			if (arr[i].toUpperCase().indexOf(val.toUpperCase()) != -1) {
			/* create a DIV element for each matching element:*/
				const fbId = rhit.mapDataSubsystemSingleton.getLocationFbIdFromNameOrAlias(arr[i]);
				const trueMapNode = rhit.mapDataSubsystemSingleton.getMapNodeFromFbID(fbId);
				const trueName = trueMapNode.name;
				if (searchResults[trueName]) {
					// if we've already displayed this result, skip it
					continue;
				}
				searchResults[trueName] = true; // tag as found
				b = document.createElement("DIV");

				// const valueIndex = trueName.toUpperCase().indexOf(val.toUpperCase());
				// first add everything up to index
				// b.innerHTML += trueName.slice(0, valueIndex);
				// // everything from index up to index + length of val
				// b.innerHTML += `${trueName.slice(valueIndex, valueIndex+val.length)}`;
				// // add everything from index + length of val to the end of arr[i]
				// b.innerHTML += trueName.substr(valueIndex + val.length);

				b.innerHTML += trueName;
				/* insert a input field that will hold the current array item's value:*/
				b.innerHTML += `<input type='hidden' value='${trueName}'>`;
				/* execute a function when someone clicks on the item value (DIV element):*/
				b.addEventListener("click", function(e) {
				/* insert the value for the autocomplete text field:*/
					inp.value = this.getElementsByTagName("input")[0].value;
					console.log("element", this.getElementsByTagName("input")[0]);
					/* close the list of autocompleted values,
					(or any other open lists of autocompleted values:*/
					closeAllLists();
					if (callOnAcceptAutocompleteItem) {
						callOnAcceptAutocompleteItem();
					}
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

	function closeAllLists(element) {
	/* close all autocomplete lists in the document,
	  except the one passed as an argument:*/
		const x = document.getElementsByClassName("autocomplete-items");
		for (let i = 0; i < x.length; i++) {
			if (element != x[i] && element != inp) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}
};

// adapted from https://www.movable-type.co.uk/scripts/latlong.html
// those madlads used greek symbol characters as their variable names
movabletype.haversine = function(lat1, lat2, lon1, lon2) {
	const R = 6371e3; // metres
	const phi1 = lat1 * Math.PI/180; // phi, lambda in radians
	const phi2 = lat2 * Math.PI/180;
	const deltaPhi = (lat2-lat1) * Math.PI/180;
	const deltaLambda = (lon2-lon1) * Math.PI/180;

	const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
			Math.cos(phi1) * Math.cos(phi2) *
			Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	return R * c; // in metres
};

// From https://stackoverflow.com/a/35385518/12693560
rhit.htmlToElement = function (html) {
	const template = document.createElement('template');
	html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;
	return template.content.firstChild;
};

rhit.makeIcons = function() {
	const makeIcon = (iconFileName) => {
		const iconOptions = L.Icon.Default.prototype.options;
		// iconOptions.iconUrl = "";
		const CustomIcon = L.Icon.extend({
			options: iconOptions,
		});
		const imgUrl = `/image/map/${iconFileName}.png`;
		return new CustomIcon({
			iconUrl: imgUrl,
			iconRetinaUrl: imgUrl,
			shadowUrl: `/image/map/marker-shadow.png`,
		});
	};

	return {
		green: makeIcon("green-pin"),
		blue: makeIcon("blue-pin"),
		orange: makeIcon("orange-pin"),
		red: makeIcon("red-pin"),
		small: makeIcon("small-pin"),
	};
};

// HomeController controls the home page, including displaying search autocomplete and route redirects
rhit.HomeController = class {
	constructor() {
		// https://atomiks.github.io/tippyjs/v6/getting-started/
		this._startInvalidTooltip = tippy(startInput, {content: 'Invalid start location', trigger: 'manual'});
		this._destInvalidTooltip = tippy(destInput, {content: 'Invalid destination', trigger: 'manual'});

		document.querySelector("#menuSignIn").onclick = (event) => {
			rhit.fbAuthManagerSingleton.signIn();
		};
		document.querySelector("#menuSavedSpeeds").onclick = (event) => {
			window.location.href = "./settings.html";
		};
		document.querySelector("#menuSavedLocations").onclick = (event) => {
			// window.location.href = "./saved_locations.html";
			window.location.href = "./settings.html#savedLocationsHeader";
		};
		document.querySelector("#menuClearData").onclick = (event) => {
			$('#confirmDeleteDataModal').modal('show');
		};
		document.querySelector("#confirmDeleteDataButton").onclick = (event) => {
			rhit.fbAuthManagerSingleton.clearData();
		};
		document.querySelector("#menuReportProblem").onclick = (event) => {
			$('#contactUsModal').modal('show');
		};
		document.querySelector("#menuSignOut").onclick = (event) => {
			rhit.fbAuthManagerSingleton.signOut();
		};
		if (rhit.fbAuthManagerSingleton.isSignedIn) {
			document.querySelector("#signInOutButton").onclick = (event) => {
				rhit.fbAuthManagerSingleton.signOut();
			};
		} else {
			document.querySelector("#signInOutButton").onclick = (event) => {
				rhit.fbAuthManagerSingleton.signIn();
			};
		}

		document.querySelector("#submitLocation").addEventListener("click", (event) => {
			const wasUserClick = event.isTrusted;
			// Navigates on successful validate
			// Only brings up popups if it's a user click on the button and not js-caused
			rhit.homeManagerSingleton.validateSearchEntries(wasUserClick, true);
		});

		// Run route search on press enter in dest box
		// From https://mdbootstrap.com/support/jquery/login-modal-best-way-to-have-the-enter-key-click-the-login-button/
		// These answers did not seem to work for the modal: https://stackoverflow.com/questions/29943/how-to-submit-a-form-when-the-return-key-is-pressed
		$("#destInput").on("keypress", (event) => {
			console.log(event);
			if (event.which === 13) {
				$("#submitLocation").click();
			}
		});

		const signedInStatus = document.querySelector("#signInStatusMessage");
		const signedInText = document.querySelector("#signInOutButtonText");
		const sandwichSignedOut = document.querySelector("#sandwichSignedOut");
		const sandwichSignedIn = document.querySelector("#sandwichSignedIn");
		const signedInIcon = document.querySelector("#signInOutIcon");

		const isSignedIn = rhit.fbAuthManagerSingleton.isSignedIn;

		if (isSignedIn) {
			const signedInUID = rhit.fbAuthManagerSingleton.uid;
			signedInStatus.innerHTML = `Signed in as ${signedInUID}`;
			signedInText.innerHTML = "Sign Out";
			signedInIcon.innerHTML = "logout";
			sandwichSignedIn.style.display = "block";
			sandwichSignedOut.style.display = "none";
		} else {
			signedInStatus.innerHTML = "You aren't currently signed in.";
			signedInText.innerHTML = "Sign In";
			signedInIcon.innerHTML = "login";
			sandwichSignedIn.style.display = "none";
			sandwichSignedOut.style.display = "block";
		}
	}
};

// HomeManager manages both location inputs on the home page
rhit.HomeManager = class {
	constructor() {

	}

	setupSearchBoxes(validLocationsArray, urlParams) {
		const startInput = document.querySelector("#startInput");
		const destInput = document.querySelector("#destInput");

		if (urlParams.get("start")) {
			destInput.value = urlParams.get("start");
		}

		if (urlParams.get("dest")) {
			destInput.value = urlParams.get("dest");
		}

		const goIfBothFilledOut = function() {
			$("#submitLocation").click();
		};

		w3schools.autocomplete(startInput, validLocationsArray, goIfBothFilledOut, true);
		w3schools.autocomplete(destInput, validLocationsArray, goIfBothFilledOut, true);

		this.hideSuggestionOnDataEntry(startInput);
		this.hideSuggestionOnDataEntry(destInput);

		document.querySelector("#navigateLoadingBox").style.display = "none";
		document.querySelector("#navigateSearchBoxes").style.display = "block";
	}

	getFbIdFromName(name) {
		return rhit.mapDataSubsystemSingleton.getLocationFbIdFromNameOrAlias(name);
	}

	hideSuggestionOnDataEntry(element) {
		element.addEventListener("input", () => {
			console.log("Entry detected in", element);
			document.querySelector("#navigationSuggestion").style.display = "none";
		});
	}

	validateSearchEntries(showTipperOnFail, goOnSuccess) {
		const startInput = document.querySelector("#startInput");
		const destInput = document.querySelector("#destInput");

		const startFbId = this.getFbIdFromName(startInput.value);
		const endFbId = this.getFbIdFromName(destInput.value);

		if (startFbId && endFbId) {
			if (goOnSuccess) {
				window.location.href = `./route.html?start=${startFbId}&dest=${endFbId}`;
			}
			return true;
		} else if (showTipperOnFail) {
			const startTipper = startInput._tippy;
			const destTipper = destInput._tippy;

			if (!startFbId) {
				startTipper.show();
			}
			if (!endFbId) {
				destTipper.show();
			}
		}
		return false;
	}
};

// RouteManager draws the map and manages the routing
rhit.RouteManager = class {
	constructor(startPointFbId, destPointFbId) {
		this._startPointFbId = startPointFbId;
		this._destPointFbId = destPointFbId;
		this._routeMap = null;
		this._markerLayer = L.layerGroup([]);
		this._connectionLayer = L.layerGroup([]);

		this._createMap();
	}

	validateURLParamPoints() {
		const startFbId = rhit.mapDataSubsystemSingleton.validateLocationFbId(this._startPointFbId);
		const endFbId = rhit.mapDataSubsystemSingleton.validateLocationFbId(this._destPointFbId);

		if (!startFbId || !endFbId) {
			console.error("One of the destination IDs entered was not in the supported locations list. start,end:", startFbId, endFbId);
			alert("You have followed a broken map link. Sending you back to the home page.");
			window.location.href = "/";
			return false;
		}
		return true;
	}

	setDirectionsHeading() {
		// possibly detach this from map nodes later?
		const startName = rhit.mapDataSubsystemSingleton.getMapNodeFromFbID(this._startPointFbId).name;
		const destName = rhit.mapDataSubsystemSingleton.getMapNodeFromFbID(this._destPointFbId).name;
		document.querySelector("#directionsItem").innerHTML = `${startName} to ${destName}`;
	}

	navAndDrawPath() {
		const path = rhit.mapDataSubsystemSingleton._dijkstraBetweenFbKeys(this._startPointFbId, this._destPointFbId);
		const pathDebug = [];
		if (path) {
			let pathLength = 0;
			for (let i = 0; i < path.length; ++i) {
				const e = path[i];
				// console.log(`${e.from()} => ${e.to()}: ${e.weight}`);
				pathDebug.push(`${e.from()} => ${e.to()}: ${e.weight}`);
				pathLength += e.weight;
				this.drawMapLineFromGraphVertices(e.from(), e.to(), this._connectionLayer, "red");
			}
			console.log("Path is total length", pathLength);
			this.calculateRouteTimes(pathLength);
		} else {
			console.warn("No path between nodes");
			this.displayNoPath();
		}
		console.log("Path step tracing: ", pathDebug);
	}

	calculateRouteTimes(pathLength) {
		let defaultSpeed = rhit.fbAuthManagerSingleton.defaultSpeed;
		const moveSpeeds = rhit.fbAuthManagerSingleton.moveSpeeds;
		let walkSpeed = moveSpeeds.walk;
		let runSpeed = moveSpeeds.run;
		let sprintSpeed = moveSpeeds.sprint;
		if (rhit.fbAuthManagerSingleton.isSignedIn) {
			// set the things to stuff other than the defaults if we have a logged in user
			defaultSpeed = rhit.fbAuthManagerSingleton.userDefaultSpeed;
			walkSpeed = rhit.fbAuthManagerSingleton.walkSpeed;
			runSpeed = rhit.fbAuthManagerSingleton.runSpeed;
			sprintSpeed = rhit.fbAuthManagerSingleton.sprintSpeed;
		}
		const walkTime = pathLength / walkSpeed;
		const runTime = pathLength / runSpeed;
		const sprintTime = pathLength / sprintSpeed;
		this.updateRouteTimes(defaultSpeed, this.convertToMMSS(walkTime), this.convertToMMSS(runTime), this.convertToMMSS(sprintTime));
	}

	displayNoPath() {
		const defaultSpeed = rhit.fbAuthManagerSingleton.defaultSpeed;
		this.updateRouteTimes(defaultSpeed, "No path!", "No path!", "No path!");
		window.alert("No path found between the nodes! Consider reporting this issue from the home page.");
	}

	convertToMMSS(inputSeconds) {
		let minutes = Math.floor(inputSeconds / 60);
		let seconds = Math.floor(inputSeconds % 60);
		if (minutes < 10) {
			minutes = `0${minutes}`;
		}
		if (seconds < 10) {
			seconds = `0${seconds}`;
		}
		return `${minutes}:${seconds}`;
	}

	updateRouteTimes(defaultSpeed, walkTime, runTime, sprintTime) {
		const defaultSpeedElement = document.querySelector("#defaultSpeedOutput");
		switch (defaultSpeed) {
		case 0:
			defaultSpeedElement.innerHTML = walkTime;
			break;
		case 1:
			defaultSpeedElement.innerHTML = runTime;
			break;
		case 2:
			defaultSpeedElement.innerHTML = sprintTime;
			break;
		default:
			console.error("Invalid Default Speed was selected");
			break;
		}
		// assign the rest of the speeds
		document.querySelector("#walkSpeedOutput").innerHTML = walkTime;
		document.querySelector("#runSpeedOutput").innerHTML = runTime;
		document.querySelector("#sprintSpeedOutput").innerHTML = sprintTime;
	}


	_createMap() {
		const startLat = 39.48310247510036;
		const startLong = -87.32657158931686;

		// OLD map bounds (tighter, doesn't fit all of adventure course)
		// const bottomLeftCorner = L.latLng(39.479158569243786, -87.33267219017984);

		const bottomLeftCorner = L.latLng(39.47891646288526, -87.33532970827527);
		const topRightCorner = L.latLng(39.486971582184474, -87.31458987623805);
		const bounds = L.latLngBounds(bottomLeftCorner, topRightCorner);

		// Layer setup

		/* eslint-disable max-len */
		const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: 24,
			maxNativeZoom: 19,
		});
		// I signed up for an account (budak7273) so we're allowed to use this since we follow their attribution rules
		// https://github.com/leaflet-extras/leaflet-providers#esriarcgis
		const Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
			maxZoom: 24,
			maxNativeZoom: 19,
		});
		/* eslint-enable max-len */

		const baseLayers = {
			"Map": osmLayer,
			"Aerial": Esri_WorldImagery,
		};
		const overlays = {
			"Markers": this._markerLayer,
			"Connections": this._connectionLayer,
		};

		const routeMap = L.map('navigateMap', {
			center: [startLat, startLong],
			zoom: 20,
			minZoom: 16,
			maxBounds: bounds,
			// zoomSnap: 0.25,
			zoomSnap: 0.0,
			zoomDelta: 0.1,
			doubleClickZoom: false,
			maxBoundsViscosity: 0.9,
			layers: [osmLayer, this._markerLayer, this._connectionLayer],
		}); // .setView([startLat, startLong], 13);

		L.control.layers(baseLayers, overlays).addTo(routeMap);

		// expose for debugging purposes
		window.exposedMapObj = routeMap;

		// const testMarker = L.marker([startLat, startLong], {draggable: true, autoPan: true}).addTo(routeMap)
		// 	.bindPopup('Test popup<br> Hello.')
		// 	.openPopup();

		// From https://leafletjs.com/examples/zoom-levels/example-fractional.html
		// https://leafletjs.com/examples/zoom-levels/
		/* const ZoomViewer = L.Control.extend({
			onAdd: function() {
				const container= L.DomUtil.create('div');
				const gauge = L.DomUtil.create('div');
				container.style.width = '200px';
				container.style.background = 'rgba(255,255,255,0.5)';
				container.style.textAlign = 'left';
				routeMap.on('zoomstart zoom zoomend', function(ev) {
					gauge.innerHTML = `Zoom level: ${routeMap.getZoom()}`;
				});
				container.appendChild(gauge);
				return container;
			},
		}); */
		// Debugging zoom modal (uncomment the below line to turn it on)
		// (new ZoomViewer).addTo(routeMap);

		routeMap.on('dblclick', function(event) {
			console.log(event.latlng); // logs latlng position of where you click on the map, hopefully
		});

		this._routeMap = routeMap;
	}

	spawnMarkerFromMapNode(mapNode, layer) {
		return L.marker([mapNode.lat, mapNode.lon],
			{
				/* draggable: true, */
				autoPan: true,
				icon: mapNode.searchable ? rhit.icons.blue : rhit.icons.small,
			})
			.bindPopup(`${mapNode.name}`)
			.addTo(layer);
	}

	drawMapLineFromMapNodes(node1, node2, layer, colorString) {
		if (!node1 || !node2) {
			return;
		}
		L.polyline([[node1.lat, node1.lon], [node2.lat, node2.lon]], {
			color: colorString,
			pane: "shadowPane",
		})
			.addTo(layer);
	}

	drawMapLineFromGraphVertices(vert1, vert2, layer, colorString) {
		const node1 = rhit.mapDataSubsystemSingleton.getMapNodeFromGraphVertexIndex(vert1);
		const node2 = rhit.mapDataSubsystemSingleton.getMapNodeFromGraphVertexIndex(vert2);
		this.drawMapLineFromMapNodes(node1, node2, layer, colorString);
	}

	drawMapLineFromConnection(connection, layer, colorString) {
		const place1 = rhit.mapDataSubsystemSingleton.getMapNodeFromFbID(connection.place1FbID);
		const place2 = rhit.mapDataSubsystemSingleton.getMapNodeFromFbID(connection.place2FbID);
		this.drawMapLineFromMapNodes(place1, place2, layer, colorString);
	}

	populateMap() {
		for (const mapNodeItem in rhit.mapDataSubsystemSingleton.nodeData) {
			if (Object.hasOwnProperty.call(rhit.mapDataSubsystemSingleton.nodeData, mapNodeItem)) {
				const mapNode = rhit.mapDataSubsystemSingleton.nodeData[mapNodeItem];
				this.spawnMarkerFromMapNode(mapNode, this._markerLayer);
			}
		}
		for (const connectionItem in rhit.mapDataSubsystemSingleton.connectionData) {
			if (Object.hasOwnProperty.call(rhit.mapDataSubsystemSingleton.connectionData, connectionItem)) {
				const connection = rhit.mapDataSubsystemSingleton.connectionData[connectionItem];
				this.drawMapLineFromConnection(connection, this._connectionLayer, "gray");
			}
		}
	}
};


// DevMapManager allows devs to manage nodes and paths via clicks
rhit.DevMapManager = class {
	constructor() {
		this.fbKeyMarkerMap = {};
		this.lastClickedMarkerElement = null;
		this.selectedMarkerElement = null;
		this.selectedMarkerFbKey = null;
		this._routeMap = null;

		this._markerLayer = L.layerGroup([]);
		this._connectionLayer = L.layerGroup([]);
		this._createDevMap();

		const descriptions = {
			default: "Double click to create new nodes. Uses the settings below.",
			connector: "Double click nodes to connect them with the pink 'selected' node (last double clicked OR last selected via tooltip)",
			disconnector: "Double click connection lines to delete them",
			deleter: "Double click nodes to delete them WARNING: Does NOT clean up connections, do that first, or at least before refreshing",
		};
		const updateHelp = () =>{
			this.modeIndicator.innerHTML = `Editing Mode: ${this.state} (Press CTRL to change modes)\n${descriptions[this.state]}`;
		};
		this.state = "default";
		this.modeIndicator = document.querySelector("#modeIndicator");
		updateHelp();
		this.selectedNodeAFbId = null;
		this.selectedNodeBFbId = null;
		document.addEventListener('keydown', (event) =>{
			// console.log(`triggering keypress listener with key ${event.key}`);
			switch (event.key) {
			case "Control":
				switch (this.state) {
				case "default":
					this.state = "connector";
					break;
				case "connector":
					this.state = "disconnector";
					break;
				case "disconnector":
					this.state = "deleter";
					break;
				case "deleter":
					this.state = "default";
					break;
				}
				break;
			default:
				break;
			}
			updateHelp();
		});
	}

	_createDevMap() {
		const startLat = 39.48310247510036;
		const startLong = -87.32657158931686;

		// OLD map bounds (tighter, doesn't fit all of adventure course)
		// const bottomLeftCorner = L.latLng(39.479158569243786, -87.33267219017984);

		const bottomLeftCorner = L.latLng(39.47891646288526, -87.33532970827527);
		const topRightCorner = L.latLng(39.486971582184474, -87.31458987623805);
		const bounds = L.latLngBounds(bottomLeftCorner, topRightCorner);

		// Layer setup

		/* eslint-disable max-len */
		const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: 24,
			maxNativeZoom: 19,
		});
		// I signed up for an account (budak7273) so we're allowed to use this since we follow their attribution rules
		// https://github.com/leaflet-extras/leaflet-providers#esriarcgis
		const Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
			maxZoom: 24,
			maxNativeZoom: 19,
		});
		/* eslint-enable max-len */

		const baseLayers = {
			"Map": osmLayer,
			"Aerial": Esri_WorldImagery,
		};
		const overlays = {
			"Markers": this._markerLayer,
			"Connections": this._connectionLayer,
		};

		const routeMap = L.map('navigateMap', {
			center: [startLat, startLong],
			zoom: 20,
			minZoom: 16,
			maxBounds: bounds,
			// zoomSnap: 0.25,
			zoomSnap: 0.0,
			zoomDelta: 0.1,
			doubleClickZoom: false,
			maxBoundsViscosity: 0.9,
			layers: [osmLayer, this._markerLayer, this._connectionLayer],
		}); // .setView([startLat, startLong], 13);

		L.control.layers(baseLayers, overlays).addTo(routeMap);

		// expose for debugging purposes
		window.exposedMapObj = routeMap;

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(routeMap);

		// const testMarker = L.marker([startLat, startLong], {draggable: true, autoPan: true}).addTo(routeMap)
		// 	.bindPopup('Test popup<br> Hello.')
		// 	.openPopup();


		routeMap.on('dblclick', (event) => {
			console.log(event.latlng); // logs latlon position of where you click on the map, hopefully
			if (this.state == "default") {
				this.createNodeAtPos(event.latlng.lat, event.latlng.lng);
			}
		});
		// From https://leafletjs.com/examples/zoom-levels/example-fractional.html
		// https://leafletjs.com/examples/zoom-levels/
		const ZoomViewer = L.Control.extend({
			onAdd: function() {
				const container= L.DomUtil.create('div');
				const gauge = L.DomUtil.create('div');
				container.style.width = '200px';
				container.style.background = 'rgba(255,255,255,0.5)';
				container.style.textAlign = 'left';
				routeMap.on('zoomstart zoom zoomend', function(ev) {
					gauge.innerHTML = `Zoom level: ${routeMap.getZoom()}`;
				});
				container.appendChild(gauge);
				return container;
			},
		});
		(new ZoomViewer).addTo(routeMap);

		this._routeMap = routeMap;
	}

	drawMapLineFromConnection(connection, map, colorString) {
		const place1 = rhit.mapDataSubsystemSingleton.getMapNodeFromFbID(connection.place1FbID);
		const place2 = rhit.mapDataSubsystemSingleton.getMapNodeFromFbID(connection.place2FbID);
		if (!place1 || !place2) {
			this._deleteConnection(connection.fbKey);
			return;
		}
		const connectionLine = L.polyline([[place1.lat, place1.lon], [place2.lat, place2.lon]], {
			color: colorString,
			pane: "shadowPane",
		})
			.addTo(this._connectionLayer);
		connectionLine.on('dblclick', (event) => {
			if (this.state == "disconnector") {
				// calls a connection deleter
				console.log("Deleting connection: ", connection);
				this._deleteConnectionLine(connection.fbKey, connectionLine);
			}
		});
	}

	populateDevMap() {
		// add markers to the map
		const nodeMap = rhit.mapDataSubsystemSingleton.nodeData;
		for (const nodeId in nodeMap) {
			if (Object.hasOwnProperty.call(nodeMap, nodeId)) {
				const mapNode = nodeMap[nodeId];
				this.spawnDevMarkerFromMapNode(mapNode, this._routeMap);
			}
		}
		for (const connectionItem in rhit.mapDataSubsystemSingleton.connectionData) {
			if (Object.hasOwnProperty.call(rhit.mapDataSubsystemSingleton.connectionData, connectionItem)) {
				const connection = rhit.mapDataSubsystemSingleton.connectionData[connectionItem];
				this.drawMapLineFromConnection(connection, this._connectionLayer, "red");
			}
		}
	}
	_mapNodePopupHTML(mapNode) {
		return `id:<span class="code">${mapNode.fbKey}</span>` +
			`<br/>name:${mapNode.name}`+
			`<br/>searchable?:${mapNode.searchable}`+
			// `<br/>i:${mapNode.vertexIndex}` +
			`<br/><button onclick="rhit.devMapManagerSingleton._selectMarker('${mapNode.fbKey}')">Select me</button>` +
			`<br/><button onclick="rhit.devMapManagerSingleton._connectWithSelectedMarker('${mapNode.fbKey}')">Connect me with selected</button>` +
			`<br/><button onclick="rhit.devMapManagerSingleton._deleteMarker('${mapNode.fbKey}')">Delete</button>` +
			`<br/><button onclick="rhit.devMapManagerSingleton._updateFromMarker('${mapNode.fbKey}')">Update pos</button>`;
	}

	_selectMarker(fbKey) {
		if (this.selectedMarkerElement) {
			// Revert color of old selection if it exists
			this.selectedMarkerElement.classList.toggle("marker-dev-selected-1");
		}
		if (fbKey === this.selectedMarkerFbKey) {
			// If selected the same thing, unset and return
			this.selectedMarkerElement = null;
			this.selectedMarkerFbKey = null;
			return false;
		}
		// Replace with new
		this.selectedMarkerElement = this.lastClickedMarkerElement;
		this.selectedMarkerFbKey = fbKey;
		// Color new
		this.selectedMarkerElement.classList.toggle("marker-dev-selected-1");
		console.log("Now selected:", fbKey);
		return true;
	}

	_deleteMarker(fbKey) {
		console.log("Delete", fbKey);
		const marker = this.fbKeyMarkerMap[fbKey];
		console.log("Removing Leaflet Marker", marker);
		marker.remove();
		this._deleteLocation(fbKey);
	}

	_deleteConnectionLine(fbKey, connectionLine) {
		console.log("Removing Leaflet Polyline", connectionLine);
		connectionLine.remove(); // removes the line from the map on the client side
		this._deleteConnection(fbKey); // remove from firebase side
	}

	_updateFromMarker(fbKey) {
		console.log("Update", fbKey);
		const marker = this.fbKeyMarkerMap[fbKey];
		console.log("Leaflet Marker is ", marker);
		const latlng = marker._latlng;
		rhit.mapDataSubsystemSingleton._locationsRef.doc(fbKey).update({
			location: new firebase.firestore.GeoPoint(latlng.lat, latlng.lng),
		}).then(() => {
			console.log("Successfully moved", fbKey);
		}).catch((err) => {
			console.error(err);
		});
	}

	_connectWithSelectedMarker(fbKey) {
		console.log(`Popup connect ${fbKey} with selected: ${this.selectedMarkerFbKey}`);
		// const marker = this.fbKeyMarkerMap[fbKey];
		// console.log("Marker is ", marker);
		this._connectTwoFbKeys(fbKey, this.selectedMarkerFbKey);
	}

	_connectTwoFbKeys(fbKeyPlace1, fbKeyPlace2) {
		if (fbKeyPlace1 && fbKeyPlace2) {
			const newConnectionName = "Unnamed connection";
			const place1Ref = rhit.mapDataSubsystemSingleton._locationsRef.doc(fbKeyPlace1);
			const place2Ref = rhit.mapDataSubsystemSingleton._locationsRef.doc(fbKeyPlace2);

			rhit.mapDataSubsystemSingleton._connectionsRef.add({
				[rhit.FB_KEY_CON_NAME]: newConnectionName,
				[rhit.FB_KEY_CON_PLACE1]: place1Ref,
				[rhit.FB_KEY_CON_PLACE2]: place2Ref,
				[rhit.FB_KEY_CON_STAIRCASE]: false,
			})
				.then( (docRef) => {
					console.log("Got doc ref", docRef);
					docRef.get().then((snapshot) => {
						console.log("Got snapshot", snapshot);
						const data = snapshot.data();

						const newConnection = new rhit.Connection(docRef.id, data);
						rhit.mapDataSubsystemSingleton._connections[docRef.id] = newConnection;
						this.drawMapLineFromConnection(newConnection, this._connectionLayer, "red");

						// Update map version on the server since we changed stuff
						rhit.mapDataSubsystemSingleton.bumpVersionNumber();
					});
				})
				.catch(function (error) {
					console.error("Error connecting nodes: error adding document: ", error);
				});
		} else {
			console.error(`Tried to create a connection between one or more invalid keys: ${fbKeyPlace1}, ${fbKeyPlace2}`);
		}
	}

	_deleteLocation(fbKey) {
		rhit.mapDataSubsystemSingleton._locationsRef.doc(fbKey).delete().then(() => {
			console.log("Document successfully deleted! WARNING - connections unaffected!");

			// Update map version on the server since we changed stuff
			rhit.mapDataSubsystemSingleton.bumpVersionNumber();
		}).catch((error) => {
			console.error("Error removing document: ", error);
		});
	}

	_deleteConnection(fbKey) {
		rhit.mapDataSubsystemSingleton._connectionsRef.doc(fbKey).delete().then(() => {
			console.log("Document successfully deleted!");

			// Update map version on the server since we changed stuff
			rhit.mapDataSubsystemSingleton.bumpVersionNumber();
		}).catch((error) => {
			console.error("Error removing document: ", error);
		});
	}

	spawnDevMarkerFromMapNode(mapNode, routeMap) {
		const devMarker = L.marker([mapNode.lat, mapNode.lon],
			{
				draggable: true,
				autoPan: true,
				icon: mapNode.searchable ? rhit.icons.blue : rhit.icons.small,
			}).addTo(routeMap)
			.bindPopup(this._mapNodePopupHTML(mapNode))
			.addTo(this._markerLayer);
		devMarker.on('click', (event) => {
			// Selection logic and coloring
			const htmlElement = event.originalEvent.target;
			this.lastClickedMarkerElement = htmlElement;
		});
		devMarker.on('dblclick', (event) => {
			this.nodeClickHandler(devMarker);
		});
		this.fbKeyMarkerMap[mapNode.fbKey] = devMarker;
		// console.log(devMarker);
	}

	nodeClickHandler(marker) {
		// call this and pass in the marker object whenever a marker is clicked
		// console.log("test to grab stuff from marker's popup, on click");
		console.log(`Current editing state: ${this.state}`);
		const popup = marker.getPopup();
		const testContent = popup.getContent();

		const idGrabberRegex = /id:<span class="code">(.*)<\/span>/;
		const idFromMarker = idGrabberRegex.exec(testContent)[1];
		console.log(`Grabbing ID with regex, result: ${idFromMarker}`);
		const prevMarkerId = this.selectedMarkerFbKey;
		if (!prevMarkerId && this.state != "deleter") {
			// if there was no previously selected marker
			// just select and return
			this._selectMarker(idFromMarker);
			return;
		}
		const selectedNewCondition = this._selectMarker(idFromMarker);
		// console.log(testContent);
		// const testContentJSON = JSON.parse(testContent);
		// console.log(`title:${testContentJSON.title}\n id: ${testContentJSON.id}`);

		switch (this.state) {
		case "default":
			// do nothing else in the default state
			break;
		case "connector":
			// handle create connections
			if (selectedNewCondition) {
				this._connectWithSelectedMarker(prevMarkerId);
			}
			break;
		case "disconnector":
			// delete connections gets handled by clicking on the connections themselves
			break;
		case "deleter":
			// handle node delete
			this._deleteMarker(idFromMarker);
			// remove selection from deleted node so we don't have weird behavior of making connections with deleted nodes
			this.selectedMarkerFbKey = null;
			this.selectedMarkerElement = null;
			break;
		}
	}

	createNodeAtPos(lat, long) {
		const nodeName = document.querySelector("#nodeNameInput").value;
		const nodeNumber = document.querySelector("#nodeNumber").value;
		const nodeAliasesString = document.querySelector("#nodeAliases").value;
		const nodeSearchable = document.querySelector("#nodeSearchable").checked;

		// Trim and CSV textbox input
		const nodeAliasesRaw = nodeAliasesString.split(",");
		const nodeAliases = [];
		nodeAliasesRaw.forEach((element, index) => {
			const trimmed = element.trim();
			if (trimmed.length > 0) {
				nodeAliases[index] = trimmed;
			}
		});

		let newNodeName = nodeName;
		if (parseInt(nodeNumber) >= 0) {
			newNodeName = `${nodeName}-${nodeNumber}`; // append nodeNumber to the name if it is a series
			document.querySelector("#nodeNumber").value = parseInt(nodeNumber) + 1;
		}
		console.log(`Trying to make node at lat: ${lat}, lon: ${long} with name = ${newNodeName}, and aliases: ${nodeAliases}`);

		// first create a firebase document so that we can use its ID
		rhit.mapDataSubsystemSingleton._locationsRef.add({
			[rhit.FB_KEY_LOC_GEO]: new firebase.firestore.GeoPoint(lat, long),
			[rhit.FB_KEY_LOC_NAME]: newNodeName,
			[rhit.FB_KEY_LOC_ALIAS]: nodeAliases.length > 0 ? nodeAliases : null,
			[rhit.FB_KEY_LOC_SEARCHABLE]: nodeSearchable,
		})
			.then( (docRef) => {
				// After it's confirmed that the node was created, build local stuff for it
				console.log("Got doc ref", docRef);
				docRef.get().then((snapshot) => {
					console.log("Got snapshot", snapshot);
					const data = snapshot.data();

					// Must refresh page to rebuild graph, so index -1
					const newMapNode = new rhit.MapNode(docRef.id, data, -1);
					rhit.mapDataSubsystemSingleton._fbIDToMapNode[docRef.id] = newMapNode;
					this.spawnDevMarkerFromMapNode(newMapNode, this._routeMap);

					// Update map version on the server since we changed stuff
					rhit.mapDataSubsystemSingleton.bumpVersionNumber();
				});
			})
			.catch(function (error) {
				console.error("Error adding document: ", error);
			});
	}
};

// SettingsController
rhit.SettingsController = class {
	constructor() {
		console.log("Settings controller created");
		this._defaultSpeed = rhit.fbAuthManagerSingleton.userDefaultSpeed;

		document.querySelector("#submitWalkSet").onclick = (event) => {
			const walkSpeed = document.querySelector("#inputWalk").value;
			if (!(walkSpeed > 0)) {
				window.alert("Input must be a number greater than 0");
				return;
			}
			if (isNaN(walkSpeed)) {
				window.alert("Input must be a valid number");
			}
			rhit.fbAuthManagerSingleton.setWalkSpeed(walkSpeed);
			this.updateView();
		};

		document.querySelector("#submitRunSet").onclick = (event) => {
			const runSpeed = document.querySelector("#inputRun").value;
			if (!(runSpeed > 0)) {
				window.alert("Input must be a number greater than 0");
				return;
			}
			if (isNaN(runSpeed)) {
				window.alert("Input must be a valid number");
			}
			rhit.fbAuthManagerSingleton.setRunSpeed(runSpeed);
			this.updateView();
		};

		document.querySelector("#submitSprintSet").onclick = (event) => {
			const sprintSpeed = document.querySelector("#inputSprint").value;
			if (!(sprintSpeed > 0)) {
				window.alert("Input must be a number greater than 0");
				return;
			}
			if (isNaN(sprintSpeed)) {
				window.alert("Input must be a valid number");
			}
			rhit.fbAuthManagerSingleton.setSprintSpeed(sprintSpeed);
			this.updateView();
		};

		$('#walkSetModal').on("show.bs.modal", (event) => {
			document.querySelector("#inputWalk").value = rhit.fbAuthManagerSingleton.walkSpeed;
			document.querySelector("#inputWalk").focus();
		});
		$('#runSetModal').on("show.bs.modal", (event) => {
			document.querySelector("#inputRun").value = rhit.fbAuthManagerSingleton.runSpeed;
			document.querySelector("#inputRun").focus();
		});
		$('#sprintSetModal').on("show.bs.modal", (event) => {
			document.querySelector("#inputSprint").value = rhit.fbAuthManagerSingleton.sprintSpeed;
			document.querySelector("#inputSprint").focus();
		});

		document.querySelector("#speedToggleWalkingRadio").onclick = (event) => {
			rhit.fbAuthManagerSingleton.setUserDefaultSpeed(0);
		};
		document.querySelector("#speedToggleRunningRadio").onclick = (event) => {
			// switch user speed to running
			rhit.fbAuthManagerSingleton.setUserDefaultSpeed(1);
		};
		document.querySelector("#speedToggleSprintingRadio").onclick = (event) => {
			// switch user speed to sprinting
			rhit.fbAuthManagerSingleton.setUserDefaultSpeed(2);
		};

		document.querySelector("#submitLocation").addEventListener("click", (event) => {
			rhit.settingsManagerSingleton.addFavoritePlace();
		});

		rhit.settingsManagerSingleton.buildCurrentSavedPlacesList();
		this.updateView();
	}

	updateView() {
		console.log("Update settings view", rhit.fbAuthManagerSingleton.walkSpeed);
		document.querySelector("#speedSetWalking").innerHTML = `${rhit.fbAuthManagerSingleton.walkSpeed} m/s`;
		document.querySelector("#speedSetRunning").innerHTML = `${rhit.fbAuthManagerSingleton.runSpeed} m/s`;
		document.querySelector("#speedSetSprinting").innerHTML = `${rhit.fbAuthManagerSingleton.sprintSpeed} m/s`;
		this._fillInSpeedFromUserDefault();
	}

	_fillInSpeedFromUserDefault() {
		const defaultSpeed = rhit.fbAuthManagerSingleton.userDefaultSpeed;
		console.log("Default speed is", defaultSpeed);

		const walkToggle = document.querySelector("#speedToggleWalking");
		const runToggle = document.querySelector("#speedToggleRunning");
		const sprintToggle = document.querySelector("#speedToggleSprinting");

		const uncheck = (elem) => {
			elem.setAttribute("checked", ""); // For IE
			elem.removeAttribute("checked"); // For other browsers
			elem.checked = false;
		};
		const check = (elem) => {
			console.log("Checking", elem);
			elem.setAttribute("checked", "checked");
			elem.checked = true;
		};
		uncheck(walkToggle);
		uncheck(runToggle);
		uncheck(sprintToggle);

		switch (defaultSpeed) {
		case 0:
			check(walkToggle);
			break;
		case 1:
			check(runToggle);
			break;
		case 2:
			check(sprintToggle);
			break;
		default:
			console.error("Unrecognized default speed");
			break;
		}
	}
};

rhit.SettingsManager = class {
	constructor() {
		this._validLocationsArray = null;
		console.log("Constructed SettingsManager");
	}

	setupSearchBoxes(validLocationsArray) {
		const placeInput = document.querySelector("#placeInput");
		this._validLocationsArray = validLocationsArray;
		// console.log("Valid locations for search:", validLocationsArray);

		w3schools.autocomplete(placeInput, validLocationsArray, false, false);

		document.querySelector("#favoritePlacesLoadingBox").style.display = "none";
		document.querySelector("#favoritePlacesSearchBox").style.display = "block";
	}

	addFavoritePlace() {
		const inputter = document.querySelector("#placeInput");
		const placeToAddName = inputter.value;
		const placeToAddFbID = rhit.mapDataSubsystemSingleton.getLocationFbIdFromNameOrAlias(placeToAddName);
		console.log("Add favorite place", placeToAddName);
		console.log("id ", placeToAddFbID);
		if (placeToAddFbID) {
			const savedLocations = Object.values(rhit.fbAuthManagerSingleton.savedLocations);
			console.log("Current favorite places", savedLocations);

			if (savedLocations.length > rhit.MAX_SAVED_LOCATIONS) {
				window.alert(`Maximum saved locations is ${rhit.MAX_SAVED_LOCATIONS}`);
				return false;
			} else if (savedLocations.includes(placeToAddName)) {
				return false;
			}

			savedLocations.push(placeToAddName);
			rhit.fbAuthManagerSingleton.setSavedLocations(Object.assign({}, savedLocations));
			inputter.value = "";
			this.buildCurrentSavedPlacesList();
			return true;
		} else {
			window.alert(`Invalid location`);
		}
		return false;
	}

	_createFavoritePlaceElement(locationName, locationFbId) {
		return rhit.htmlToElement(
			`<div class="favoritePlaceLising row">
				<span aria-hidden="true"
					id="deleteSaved${locationFbId}"
					onclick="rhit.settingsManagerSingleton.clickedDeletePlace('${locationName}')">
					&times;</span>
				<p class="">${locationName}</p>
			</div>`);
	}

	clickedDeletePlace(placeName) {
		console.log(placeName);
		const savedLocations = Object.values(rhit.fbAuthManagerSingleton.savedLocations);
		console.log("Current favorite places", savedLocations);
		const index = savedLocations.indexOf(placeName);
		console.log(index);
		if (index >= 0) {
			savedLocations.splice(index, 1);
		}
		console.log(savedLocations);
		rhit.fbAuthManagerSingleton.setSavedLocations(Object.assign({}, savedLocations));
		this.buildCurrentSavedPlacesList();
	}

	buildCurrentSavedPlacesList() {
		console.log("Build places list");
		const savedLocations = Object.values(rhit.fbAuthManagerSingleton.savedLocations);
		console.log("Current favorite places", savedLocations);
		const savedListElem = document.querySelector("#savedLocationsList");
		savedListElem.innerHTML = "";
		savedLocations.forEach((element) => {
			const fbid = rhit.mapDataSubsystemSingleton.getLocationFbIdFromNameOrAlias(element) || "ERROR";
			const newItem = this._createFavoritePlaceElement(element, fbid);
			savedListElem.appendChild(newItem);
		});
	}
};

// // SavedLocationsController
// rhit.SavedLocationsController = class {
// 	constructor() {
// 		console.log("SavedLocations controller created");
// 	}

// 	updateView() {
// 		console.log("Update SavedLocations view");
// 		// document.querySelector("#speedSetWalking").value = rhit.fbAuthManagerSingleton.walkSpeed;
// 		// document.querySelector("#speedSetRunning").value = rhit.fbAuthManagerSingleton.runSpeed;
// 		// document.querySelector("#speedSetSprinting").value = rhit.fbAuthManagerSingleton.sprintSpeed;
// 	}
// };

// rhit.SavedLocationsManager = class {
// 	constructor() {
// 		console.log("SavedLocations manager created");
// 	}
// };


// FbAuthManager is responsible for managing user logins
rhit.FbAuthManager = class {
	constructor() {
		this._user = null;
		this._mapUser = null; // this is the class that holds all the actual user data for our use
		// parallel to the rhit.Connection or rhit.MapNode class
		this._ref = firebase.firestore();
		this._speedConstantsRef = this._ref.collection(rhit.FB_COLLECTION_CONSTANTS).doc("DefaultUserSettings");
		this._usersRef = this._ref.collection(rhit.FB_COLLECTION_USERS);
		this.defaultSpeed = null;
		this.moveSpeeds = null;
		this._setDefaultSpeedsFromFb();
		console.log("Auth manager created");
	}

	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged(async (user) => {
			this._user = user;
			if (this.isSignedIn) {
				await this._getMapUserDataFromFb(this.uid);
			} else {
				this._user = null;
				this._mapUser = null;
			}
			if (changeListener) {
				changeListener();
			}
		});
	}

	signIn() {
		// Please note this needs to be the result of a user interaction
		// (like a button click) otherwise it will get blocked as a popup
		Rosefire.signIn("6179a69f-160f-4cad-87e8-a62cb4debf40", (err, rfUser) => {
			if (err) {
				console.log("Rosefire error!", err);
				return;
			}
			console.log("Rosefire success!", rfUser);

			firebase.auth().signInWithCustomToken(rfUser.token)
				.then((user) => {
				// Signed in

				// Better to use onAuthStateChanged because it catches any sign in method/instance
				})
				.catch((error) => {
				// Handle Errors here.
					const errorCode = error.code;
					const errorMessage = error.message;
					if (errorCode === 'auth/invalid-custom-token') {
						alert('The token you provided is not valid.');
					} else {
						console.log(`Custom auth`, errorCode, errorMessage);
					}
				});
		});
	}

	clearData() {
		if (this.isSignedIn) {
			this._usersRef.doc(this.uid).delete().then(() => {
				console.log(`User data successfully deleted for user ${this.uid}`);
			}).catch((error) => {
				console.error("Error removing user data: ", error);
			});
		}
		localStorage.clear(); // Also wipe cached map data
	}

	signOut() {
		firebase.auth().signOut().catch((error) => {
			// An error happened.
			console.error("Sign out failed!");
		});
	}

	async _setDefaultSpeedsFromFb() {
		return await this._speedConstantsRef.get().then((doc) => {
			if (doc.exists) {
				console.log("Assigning default speed:", doc.data().defaultSpeed);
				this.defaultSpeed = doc.data().defaultSpeed;
				console.log("Assigning move speeds:", doc.data().moveSpeeds);
				this.moveSpeeds = doc.data().moveSpeeds;
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		}).catch((error) => {
			console.log("Error getting document:", error);
		});
	}

	async _getMapUserDataFromFb(uid) {
		return await this._usersRef.doc(uid).get().then((doc) => {
			if (doc.exists) {
				const defaultSpeed = doc.data().defaultSpeed;
				const moveSpeeds = doc.data().moveSpeeds;
				const savedLocations = doc.data().savedLocations;
				console.log(`Grabbing user ${uid} from firebase with defaultSpeed = ${defaultSpeed}, 
				moveSpeeds = ${moveSpeeds}, savedLocations = ${savedLocations}`);
				this._mapUser = new rhit.MapUser(uid, defaultSpeed, moveSpeeds, savedLocations);
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
				// create a new user instead using the defaults
				this._addNewUserToFb(uid);
			}
		}).catch((error) => {
			console.log("Error getting document:", error);
		});
	}

	async _addNewUserToFb(uid) {
		return await this._usersRef.doc(uid).set({
			defaultSpeed: this.defaultSpeed,
			moveSpeeds: this.moveSpeeds,
			savedLocations: {},
		});
	}

	async _saveMapUserDataToFb(uid) {
		return await this._usersRef.doc(uid).set({
			defaultSpeed: this._mapUser.defaultSpeed,
			moveSpeeds: this._mapUser.moveSpeeds,
			savedLocations: this._mapUser.savedLocations,
		});
	}

	get isSignedIn() {
		return !!this._user;
	}

	get uid() {
		return this._user.uid;
	}

	setUserDefaultSpeed(newSpeed) {
		console.log("Setting default speed to ", newSpeed);
		if (!this.isSignedIn) {
			window.alert("You must be signed in to do that!");
			return;
		}
		if (newSpeed != 0 && newSpeed != 1 && newSpeed !=2) {
			window.alert(`${newSpeed} is not a valid default speed setting.`);
		}
		this._mapUser.defaultSpeed = newSpeed;
		this._saveMapUserDataToFb(this.uid);
	}

	setWalkSpeed(newWalkSpeed) {
		this._mapUser.moveSpeeds.walk = newWalkSpeed;
		this._saveMapUserDataToFb(this.uid);
	}

	setRunSpeed(newRunSpeed) {
		this._mapUser.moveSpeeds.run = newRunSpeed;
		this._saveMapUserDataToFb(this.uid);
	}

	setSprintSpeed(newSprintSpeed) {
		this._mapUser.moveSpeeds.sprint = newSprintSpeed;
		this._saveMapUserDataToFb(this.uid);
	}

	setSavedLocations(newLocationsArray) {
		this._mapUser.savedLocations = newLocationsArray;
		this._saveMapUserDataToFb(this.uid);
	}

	get userDefaultSpeed() {
		return this._mapUser ? this._mapUser.defaultSpeed : this.defaultSpeed;
	}

	get walkSpeed() {
		return this._mapUser ? this._mapUser.moveSpeeds.walk : this.moveSpeeds.walk;
	}

	get runSpeed() {
		return this._mapUser ? this._mapUser.moveSpeeds.run : this.moveSpeeds.run;
	}

	get sprintSpeed() {
		return this._mapUser ? this._mapUser.moveSpeeds.sprint : this.moveSpeeds.sprint;
	}

	get savedLocations() {
		return this._mapUser ? this._mapUser.savedLocations : {};
	}
};

rhit.MapUser = class {
	constructor (uid, defaultSpeed, moveSpeeds, savedLocations) {
		this.uid = uid;
		this.defaultSpeed = defaultSpeed;
		this.moveSpeeds = moveSpeeds;
		this.savedLocations = savedLocations;
	}
};

// MapDataSubsystem stores the nodes and connections for the map
rhit.MapDataSubsystem = class {
	constructor(shouldBuildGraph, shouldBuildNames, callbackWhenDone) {
		// this._cachedDataVersion = parseInt(localStorage.getItem(rhit.KEY_STORAGE_VERSION)) || -1; // Version is stored or blank

		// An object used as a map. The keys are firebase ID strings, the values are the MapNodes they correspond to.
		this._fbIDToMapNode = {};
		// An array used as a map. The index is the index of the vertex in the graph, the stored value is the firebase ID string.
		this._graphIndexToFbID = [];
		// An object used as a map. The keys are firebase ID strings, the values are the Connection objects they correspond to.
		this._connections = {};
		// Object used as a map of all location names and aliases mapped to their firebase ID string
		this._namesAndAliasToFbId = {};

		this.navGraph = null;

		this._ref = firebase.firestore();
		this._locationsRef = this._ref.collection(rhit.FB_COLLECTION_LOCATIONS);
		this._connectionsRef = this._ref.collection(rhit.FB_COLLECTION_CONNECTIONS);
		this._cachesRef = this._ref.collection(rhit.FB_COLLECTION_CACHED);
		this._unsubscribe = null;

		// TODO make use of this later. Some screens don't need to build map (settings?) if names are cached already
		this._shouldBuildMapNodes = true;
		this._shouldBuildGraph = shouldBuildGraph;
		this._shouldBuildNames = shouldBuildNames;

		this._prepareData(callbackWhenDone);
	}

	async _prepareData(finalCallback) {
		try {
			// console.log(`LOCAL map data version is ${this._cachedDataVersion}`);
			const liveDataVersion = await this.getMapLiveVersionNumber();
			const fbCachedDataVersion = await this.getMapFbCachedVersionNumber();
			console.log(`🔥 LIVE map data version is ${liveDataVersion} (${new Date(liveDataVersion).toString()})`);
			console.log(`💾 FbCached map data version is ${fbCachedDataVersion}`);

			// Any change to the map increases the liveDataVersion timestamp
			// Increases in the liveDataVersion mean that ALL caches are invalid,
			// but each cached item needs to keep track of if it has been updated or not
			// individually, since different parts of the data load at different times.

			const fbCacheNeedsRefreshing = liveDataVersion > fbCachedDataVersion || rhit.DEBUG_FORCE_REWRITE_CACHE;
			if (fbCacheNeedsRefreshing) {
				console.log("📝 Firebase cache of map data needs updating, contacting the server and using LIVE DATA this time");
				fetch(`${rhit.TILE_SERVER_ADDRESS}regen-fb-caches`, {
					method: "GET",
					mode: "cors",
				}).then((response) => {
					return response.json();
				}).then((data) => {
					console.log("Got back from caching server:", data);
				});
			} else {
				console.log("✅ Firebase cache does not need updating, using it instead of live if needed");
			}

			// Decide to load either cached or fresh data
			// given an item's cached version timestamp
			const shouldUseLiveFor = (cachedVersion) => {
				return rhit.DEBUG_FORCE_LIVE_MAP ||
					rhit.DEBUG_FORCE_REWRITE_CACHE ||
					fbCacheNeedsRefreshing ||
					(liveDataVersion > cachedVersion &&
						!rhit.DEBUG_FORCE_CACHED_MAP);
			};

			const shouldUseFbCachedFor = (cachedVersion) => {
				return !fbCacheNeedsRefreshing &&
					!rhit.DEBUG_FORCE_REWRITE_ALL_CACHES &&
					(fbCachedDataVersion > cachedVersion);
			};

			const mapNodeCachedVersion = this._getCachedDataItem_Version(rhit.KEY_STORAGE_NODES);
			const shouldUseFbCachedForMapNodes = shouldUseFbCachedFor(mapNodeCachedVersion);
			const shouldUseLiveForMapNodes = shouldUseLiveFor(mapNodeCachedVersion);
			if (this._shouldBuildMapNodes) {
				if (shouldUseFbCachedForMapNodes) {
					console.log("💾 Using *Firebase cached* for MapNodes");
					await this._buildNodeDataFromFbCache();
				} else if (shouldUseLiveForMapNodes) {
					console.log("🔥 Using *live Firebase* for MapNodes");
					await this._buildNodeDataFromFb();
				} else {
					console.log("📦 Using *local storage* for MapNodes");
					await this._buildNodeDataFromCache();
				}
			}

			const connectionsCachedVersion = this._getCachedDataItem_Version(rhit.KEY_STORAGE_CONNECTIONS);
			const shouldUseFbCachedForConnections = shouldUseFbCachedFor(connectionsCachedVersion);
			const shouldUseLiveForConnections = shouldUseLiveFor(connectionsCachedVersion);
			if (this._shouldBuildGraph) {
				if (shouldUseFbCachedForConnections) {
					console.log("💾 Using *Firebase cached* for Connections");
					await this._buildConnectionDataFromFbCache();
				} else if (shouldUseLiveForConnections) {
					console.log("🔥 Using *Firebase live* for Connections");
					await this._buildConnectionDataFromFb();
				} else {
					console.log("📦 Using *local storage* for Connections");
					await this._buildConnectionDataFromCache();
				}
				await this._constructGraph(this._connections);
			}

			const namesCachedVersion = this._getCachedDataItem_Version(rhit.KEY_STORAGE_NAMES);
			const shouldUseLiveForNames = shouldUseLiveFor(namesCachedVersion);
			if (this._shouldBuildNames) {
				if (shouldUseLiveForNames) {
					console.log("   Using *MapNodes* for Names");
					await this._buildNamesFromMapNodes();
				} else {
					console.log("📦 Using *local storage* for Names");
					await this._buildNamesFromCache();
				}
			}

			// Update the caches as needed for each item
			const isUsingLiveMap = {
				nodes: shouldUseLiveForMapNodes,
				connections: shouldUseLiveForConnections,
				names: shouldUseLiveForNames,
			};
			await this._writeUpdatedCachedMapData(liveDataVersion, isUsingLiveMap);

			console.log("Calling final MapDataSubsystem callback...");
			await finalCallback();
		} catch (error) {
			console.error("MapDataSubsystem failed while prepping data:", error);
		}
	}

	get numNodes() {
		return this._graphIndexToFbID.length;
	}

	get nodeData() {
		if (this._fbIDToMapNode == {}) {
			console.error("Tried to access map nodes before they were loaded; returning null instead");
		}
		return this._fbIDToMapNode;
	}

	get connectionData() {
		if (this._connections == {}) {
			console.error("Tried to access map connections before they were loaded; returning {} instead");
		}
		return this._connections;
	}

	get namesToFbId() {
		if (this._namesAndAliasToFbId == {}) {
			console.error("Tried to access names before they were loaded; returning {} instead");
		}
		return this._namesAndAliasToFbId;
	}

	getFbIDFromGraphVertexIndex(index) {
		return this._graphIndexToFbID[index];
	}

	getMapNodeFromGraphVertexIndex(index) {
		const fbID = this.getFbIDFromGraphVertexIndex(index);
		return this._fbIDToMapNode[fbID];
	}

	getMapNodeFromFbID(fbID) {
		return this._fbIDToMapNode[fbID];
	}

	getGraphVertexIndexFromFbID(fbID) {
		return this._fbIDToMapNode[fbID].vertexIndex;
	}

	getMapNodeDistanceMeters(node1, node2) {
		return movabletype.haversine(node1.lat, node2.lat, node1.lon, node2.lon);
	}

	getLocationFbIdFromNameOrAlias(locationNameOrAlias) {
		// console.log("Validating name", locationNameOrAlias);
		return this.namesToFbId[locationNameOrAlias];
	}

	validateLocationFbId(locationFbId) {
		// console.log("Validating fbid", locationFbId);
		return Object.values(this.namesToFbId).includes(locationFbId);
	}

	async _getFbVersionEntry(versionDocName, fieldName) {
		const liveMapVersionRef = this._ref.collection(rhit.FB_COLLECTION_CONSTANTS).doc(versionDocName);
		return await liveMapVersionRef.get().then((doc) => {
			if (doc.exists) {
				const data = doc.data();
				if (data[fieldName]) {
					return data[fieldName].toDate();
				} else {
					throw new Error(`No such field in Versions document - ${fieldName}`);
				}
			} else {
				throw new Error("No such document - Versions");
			}
		});
	}

	async getMapLiveVersionNumber() {
		return await this._getFbVersionEntry("Versions", "map");
	}

	async getMapFbCachedVersionNumber() {
		return await this._getFbVersionEntry("CacheVersions", "fbCachedNodes");
	}

	async _getJsonFromFirebaseCache(cacheDocumentName) {
		const fbCacheRef = this._cachesRef.doc(cacheDocumentName);
		return await fbCacheRef.get().then((doc) => {
			if (doc.exists) {
				return JSON.parse(doc.data().dataJson);
			} else {
				throw new Error(`${cacheDocumentName} cache document not present`);
			}
		});
	}

	bumpVersionNumber() {
		// https://firebase.google.com/docs/database/web/read-and-write?authuser=0#update_specific_fields
		const liveMapVersionRef = this._ref.collection("Constants").doc("Versions");
		const now = new Date();
		return liveMapVersionRef.update({
			"map": now,
		}).then(() => {
			console.log("🔼 Bumped map version to ", now);
		}).catch((error) => {
			console.error("Failed to update version document:", error);
		});
	}

	// Builds this._fbIDToMapNode from firebase cached copy of data
	async _buildNodeDataFromFbCache() {
		this._fbIDToMapNode = await this._getJsonFromFirebaseCache("nodes");

		// Also set up _graphIndexToFbID
		for (const key in this._fbIDToMapNode) {
			if (Object.hasOwnProperty.call(this._fbIDToMapNode, key)) {
				this._graphIndexToFbID.push(key);
			}
		}
		console.log("this._graphIndexToFbId is now", this._graphIndexToFbID);
	}

	// Builds this._fbIDToMapNode and this._graphIndexToFbID from Firebase-fetched data
	async _buildNodeDataFromFb() {
		await this._locationsRef.get().then((querySnapshot) => {
			console.log("Num nodes:", querySnapshot.size);
			let index = 0;
			querySnapshot.forEach((doc) => {
				// doc.data() is never undefined for query doc snapshots
				// console.log(doc.id, " => ", doc.data());
				const thisNode = new rhit.MapNode(doc.id, doc.data(), index);
				this._fbIDToMapNode[doc.id] = thisNode;
				this._graphIndexToFbID.push(doc.id);
				index++;
			});
		});
	}

	// Builds this._fbIDToMapNode and this._graphIndexToFbID from cached data
	async _buildNodeDataFromCache() {
		const cached_fbIDToMapNode = this._getCachedDataItem_Data(rhit.KEY_STORAGE_NODES);
		window.cached_fbIDToMapNode = cached_fbIDToMapNode;

		// Setup _fbIDToMapNode from cache
		this._fbIDToMapNode = cached_fbIDToMapNode;

		// Also set up _graphIndexToFbID
		for (const key in cached_fbIDToMapNode) {
			if (Object.hasOwnProperty.call(cached_fbIDToMapNode, key)) {
				this._graphIndexToFbID.push(key);
			}
		}
	}

	// Builds this._connections from firebase cached copy of data
	async _buildConnectionDataFromFbCache() {
		this._connections = await this._getJsonFromFirebaseCache("connections");
	}

	// Builds this._connections from Firebase-fetched data
	async _buildConnectionDataFromFb() {
		await this._connectionsRef.get().then((querySnapshot) => {
			console.log("Num connections:", querySnapshot.size);
			const connectionData = {};
			querySnapshot.forEach((doc) => {
				// doc.data() is never undefined for query doc snapshots
				// console.log(doc.id, " => ", doc.data());
				const thisConnection = new rhit.Connection(doc.id, doc.data());
				connectionData[doc.id] = thisConnection;

				// Debug
				// window[doc.id] = thisConnection;
			});
			this._connections = connectionData;
		});
	}

	// Builds this._connections from cached data
	async _buildConnectionDataFromCache() {
		const cached_connections = this._getCachedDataItem_Data(rhit.KEY_STORAGE_CONNECTIONS);
		window.cached_connections = cached_connections;
		this._connections = cached_connections;
	}

	_constructGraph(connectionData) {
		// https://www.npmjs.com/package/js-graph-algorithms#create-directed-weighted-graph
		// https://rawgit.com/chen0040/js-graph-algorithms/master/examples/example-weighted-digraph.html
		this.navGraph = new jsgraphs.WeightedDiGraph(this.numNodes);

		for (const key in connectionData) {
			// Special safety check, see https://eslint.org/docs/rules/guard-for-in
			if (Object.hasOwnProperty.call(connectionData, key)) {
				const connect = connectionData[key];

				// get relevant map nodes from the firebase reference data
				const startMapNode = this.getMapNodeFromFbID(connect.place1FbID);
				const endMapNode = this.getMapNodeFromFbID(connect.place2FbID);
				if (!startMapNode || !endMapNode) {
					console.log("Couldn't find nodes, aborting internal graph creation");
					continue;
				}
				const distanceMeters = this.getMapNodeDistanceMeters(startMapNode, endMapNode);

				// if it's a staircase, it's worth extra distance
				const adjustedDistance = connect.staircase ? distanceMeters * STAIRCASE_DISTANCE_MULT : distanceMeters;

				const startVertIndex = startMapNode.vertexIndex;
				const endVertIndex = endMapNode.vertexIndex;
				// console.log(`Edge from ${startMapNode.vertexIndex} to ${endMapNode.vertexIndex}`);
				// add the graph edge
				this.navGraph.addEdge(new jsgraphs.Edge(startVertIndex, endVertIndex, adjustedDistance));

				// Digraph, so add the flipped edge
				this.navGraph.addEdge(new jsgraphs.Edge(endVertIndex, startVertIndex, adjustedDistance));

				// label the nodes with their names.
				// probably a better place for this, but the graph doesn't exist until now.
				// note that this overwrites names a bunch of times (replace this later probably)
				this.navGraph.node(startVertIndex).label = startMapNode.name;
				this.navGraph.node(endVertIndex).label = endMapNode.name;
			}
		}

		// this.navGraph = graph;
		// console.log(g);

		// Debug
		window.graph = this.navGraph;
	}

	_dijkstraBetweenFbKeys(fbKeyStart, fbKeyEnd) {
		const vertexIndexStart = this.getGraphVertexIndexFromFbID(fbKeyStart);
		const vertexIndexEnd = this.getGraphVertexIndexFromFbID(fbKeyEnd);
		console.log(`Dijkstra from ${vertexIndexStart} to ${vertexIndexEnd}`);


		const dijkstra = new jsgraphs.Dijkstra(this.navGraph, vertexIndexStart);
		// console.log("Nav graph vertexes", this.navGraph.V);
		// console.log(this.navGraph);
		// console.log(dijkstra);
		return dijkstra.hasPathTo(vertexIndexEnd) ? dijkstra.pathTo(vertexIndexEnd) : false;
	}

	// Kept as separate objects so you don't have to load the whole thing just to check the version
	_writeCachedDataItem(keyString, data, versionEpochTime) {
		localStorage.setItem(`${keyString}_DATA`, data);
		localStorage.setItem(`${keyString}_VERSION`, versionEpochTime);
	}
	_getCachedDataItem_Data(keyString) {
		return JSON.parse(localStorage.getItem(`${keyString}_DATA`));
	}
	_getCachedDataItem_Version(keyString) {
		return localStorage.getItem(`${keyString}_VERSION`);
	}

	_writeUpdatedCachedMapData(liveDataVersion, isUsingLiveMap) {
		// Only (re-)write the data that was loaded to avoid overwriting with bad data
		if (this._shouldBuildMapNodes && isUsingLiveMap.nodes) {
			console.info("📝 Updating cached MapNodes", this._fbIDToMapNode);
			this._writeCachedDataItem(rhit.KEY_STORAGE_NODES, JSON.stringify(this._fbIDToMapNode), liveDataVersion);
		}
		if (this._shouldBuildGraph && isUsingLiveMap.connections) {
			console.info("📝 Updating cached Connections");
			this._writeCachedDataItem(rhit.KEY_STORAGE_CONNECTIONS, JSON.stringify(this._connections), liveDataVersion);
		}
		if (this._shouldBuildNames && isUsingLiveMap.names) {
			console.info("📝 Updating cached Names");
			this._writeCachedDataItem(rhit.KEY_STORAGE_NAMES, JSON.stringify(this._namesAndAliasToFbId), liveDataVersion);
		}
	}

	_buildNamesFromMapNodes() {
		const mapNodeValidNameToFbId = {};

		// For every map node...
		for (const fbId in this._fbIDToMapNode) {
			if (Object.hasOwnProperty.call(this._fbIDToMapNode, fbId)) {
				const mapNode = this._fbIDToMapNode[fbId];
				// Make an array with its alias names and its name
				const nodeNames = [...mapNode.aliasList, mapNode.name];
				nodeNames.forEach((possibleName) => {
					// Check if 1. the node is meant to be searchable 2. it's non-null 3. non-empty
					if (mapNode.searchable && possibleName && possibleName.trim().length > 0) {
						// Skip and warn if the name was already added by something else
						if (mapNodeValidNameToFbId[possibleName]) {
							console.warn(`MapNode ${fbId} tried to add name ${possibleName},` +
								` but it was already defined by map node ${mapNodeValidNameToFbId[possibleName]}`);
						} else {
							// Add the name mapping
							mapNodeValidNameToFbId[possibleName] = fbId;
						}
					}
				});
			}
		}
		this._namesAndAliasToFbId = mapNodeValidNameToFbId;

		// console.log(mapNodeValidNameToFbId);
	}

	_buildNamesFromCache() {
		// throw new Error("Unimplemented: Names data building from local storage");
		console.warn("Unimplemented: Names data building from local storage. Using from map nodes instead");
		this._buildNamesFromMapNodes();
	}
};

// May need to convert these two classes into plain JS objects instead of classes so they can be serialized
// Or maybe use these as wrapper classes that the serializable JS object gets turned into?
// Maybe make factories to produce them given cached/fb data


// MapNode stores information for its particular location
rhit.MapNode = class {
	constructor (fbKey, fbLocationDocumentData, vertexIndex) {
		this.fbKey = fbKey;
		this.aliasList = fbLocationDocumentData[rhit.FB_KEY_LOC_ALIAS] || [];
		this.vertexIndex = vertexIndex;

		const geopoint = fbLocationDocumentData[rhit.FB_KEY_LOC_GEO];
		this.lat = geopoint.latitude;
		this.lon = geopoint.longitude;

		// if a node has a name, then set its searchability based on the data.
		// otherwise, give it a placeholder name and never let it be searchable
		this.name = fbLocationDocumentData[rhit.FB_KEY_LOC_NAME];
		if (this.name) {
			this.searchable = fbLocationDocumentData[rhit.FB_KEY_LOC_SEARCHABLE] || false;
		} else {
			this.name = `Unnamed node ${fbKey}`;
			this.searchable = false;
		}
	}

	// Since we directly stringify these, they can't have methods.
	// validAlias(name) {
	// 	return (name === this.name) || this.aliasList.includes(name);
	// }
};

rhit.Connection = class {
	constructor (fbKey, fbConnectionDocumentData) {
		this.fbKey = fbKey;
		this.place1FbID = fbConnectionDocumentData[rhit.FB_KEY_CON_PLACE1].id;
		this.place2FbID = fbConnectionDocumentData[rhit.FB_KEY_CON_PLACE2].id;
		this.staircase = fbConnectionDocumentData[rhit.FB_KEY_CON_STAIRCASE];
	}

	// Since we directly stringify these, they can't have methods.
};

rhit.initializePage = function () {
	const urlParams = new URLSearchParams(window.location.search);

	if (document.querySelector("#loginPage")) {
		// console.log("You are on the Login page.");
		// // Auth singleton already made at the top
		// new rhit.LoginPageController();
	} else if (document.querySelector("#mainPage")) {
		console.log("You are on the Main Home page.");
		// Needs map data for place search
		rhit.mapDataSubsystemSingleton = new rhit.MapDataSubsystem(false, true, () => {
			console.log("Home page map system callback");
			const validPlaces = Object.keys(rhit.mapDataSubsystemSingleton.namesToFbId);
			rhit.homeManagerSingleton.setupSearchBoxes(validPlaces, urlParams);
		});
		rhit.homeManagerSingleton = new this.HomeManager();
		new rhit.HomeController();
	} else if (document.querySelector("#routePage")) {
		console.log("You are on the Route page.");
		rhit.icons = rhit.makeIcons();

		// get url parameter
		const startPoint = urlParams.get("start");
		const destPoint = urlParams.get("dest");

		// Needs map data for navigation
		rhit.mapDataSubsystemSingleton = new rhit.MapDataSubsystem(true, true, () => {
			console.log("Map data system done loading callback");
			// This will be called after routeManagerSingleton exists
			rhit.routeManagerSingleton.validateURLParamPoints();
			rhit.routeManagerSingleton.populateMap();
			rhit.routeManagerSingleton.setDirectionsHeading();
			rhit.routeManagerSingleton.navAndDrawPath();
		});
		rhit.routeManagerSingleton = new rhit.RouteManager(startPoint, destPoint);
	} else if (document.querySelector("#settingsPage")) {
		if (!rhit.fbAuthManagerSingleton.isSignedIn) {
			window.alert("You aren't signed in!");
			window.location.href = "/";
		}
		console.log("You are on the Settings page.");
		// Needs map data for place search for saved places
		rhit.mapDataSubsystemSingleton = new rhit.MapDataSubsystem(false, true, () => {
			console.log("Settings page map system callback");
			const validPlaces = Object.keys(rhit.mapDataSubsystemSingleton.namesToFbId);
			rhit.settingsManagerSingleton.setupSearchBoxes(validPlaces);
		});
		rhit.settingsManagerSingleton = new rhit.SettingsManager();
		new rhit.SettingsController();
	// } else if (document.querySelector("#savedLocationsPage")) {
	// 	if (!rhit.fbAuthManagerSingleton.isSignedIn) {
	// 		window.alert("You aren't signed in!");
	// 		window.location.href = "/";
	// 	}
	// 	console.log("You are on the savedLocations page.");
	// 	rhit.savedLocationsManagerSingleton = new rhit.SavedLocationsManager();
	// 	new rhit.SavedLocationsController();
	} else if (document.querySelector("#devPage")) {
		// do dev page stuff

		// always use the live map instead of cached
		rhit.DEBUG_FORCE_LIVE_MAP = true;

		const authorizedUsers = {chanb: true, budakrc: true, kleinsv: true, yoder1: true};
		rhit.icons = rhit.makeIcons();

		if (!(rhit.fbAuthManagerSingleton.isSignedIn && authorizedUsers[rhit.fbAuthManagerSingleton.uid])) {
			window.alert("INVALID USER DETECTED");
			window.location.href = "/";
		}
		rhit.mapDataSubsystemSingleton = new rhit.MapDataSubsystem(true, true, () => {
			console.log("Dev Map data system done loading callback");
			rhit.devMapManagerSingleton.populateDevMap();
		});
		rhit.devMapManagerSingleton = new rhit.DevMapManager();
	}
};

rhit.main = function () {
	rhit.fbAuthManagerSingleton = new rhit.FbAuthManager();
	rhit.fbAuthManagerSingleton.beginListening(() => {
		console.log("isSignedIn = ", rhit.fbAuthManagerSingleton.isSignedIn);

		console.log("Using tile/caching server address", this.TILE_SERVER_ADDRESS);

		// Init page
		rhit.initializePage();
	});
};

rhit.main();
