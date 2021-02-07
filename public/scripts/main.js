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
/* eslint-enable no-var */

// eslint-disable-next-line max-len
rhit.supportedLocations = ["Mussallem Union", "Lakeside Hall", "Percopo Hall", "Apartments East", "Apartments West", "Blumberg Hall", "Scharpenberg Hall", "Mees Hall", "BSB Hall", "Speed Hall", "Deming Hall", "O259", "O269", "O267", "O257"];

// Singletons
rhit.fbAuthManagerSingleton = null;
rhit.routeManagerSingleton = null;
rhit.homeManagerSingleton = null;
rhit.settingsManagerSingleton = null;
rhit.mapDataSubsystemSingleton = null;
rhit.devMapManagerSingleton = null;

/** globals */
rhit.FB_COLLECTION_LOCATIONS = "Locations";
rhit.FB_COLLECTION_CONNECTIONS = "Connections";
rhit.FB_KEY_LOC_GEO = "location";
rhit.FB_KEY_LOC_NAME = "name";
rhit.FB_KEY_LOC_ALIAS = "name-aliases";

rhit.KEY_STORAGE_VERSION = "local-data-version";


// adapted from https://www.w3schools.com/howto/howto_js_autocomplete.asp
w3schools.autocomplete = function (inp, arr) {
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

// HomeController controls the home page, including displaying search autocomplete and route redirects
rhit.HomeController = class {
	constructor() {
		const startInput = document.querySelector("#startInput");
		const destInput = document.querySelector("#destInput");

		w3schools.autocomplete(startInput, rhit.supportedLocations);
		w3schools.autocomplete(destInput, rhit.supportedLocations);

		// https://atomiks.github.io/tippyjs/v6/getting-started/
		this._startInvalidTooltip = tippy(startInput, {content: 'Invalid start location', trigger: 'manual'});
		this._destInvalidTooltip = tippy(destInput, {content: 'Invalid destination', trigger: 'manual'});

		document.querySelector("#menuSignIn").onclick = (event) => {
			rhit.fbAuthManagerSingleton.signIn();
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
			const currentStart = document.querySelector("#startInput").value;
			const currentDest = document.querySelector("#destInput").value;
			console.log(`Planning route from ${currentStart} to ${currentDest}`);

			const success = rhit.homeManagerSingleton.validateSearchEntries();
			if (success) {
				window.location.href = `./route.html?start=${currentStart}&dest=${currentDest}`;
			}
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

		const isSignedIn = rhit.fbAuthManagerSingleton.isSignedIn;

		if (isSignedIn) {
			const signedInUID = rhit.fbAuthManagerSingleton.uid;
			signedInStatus.innerHTML = `Signed in as ${signedInUID}`;
			signedInText.innerHTML = "Sign Out";
			sandwichSignedIn.style.display = "block";
			sandwichSignedOut.style.display = "none";
		} else {
			signedInStatus.innerHTML = "You aren't currently signed in.";
			signedInText.innerHTML = "Sign In";
			sandwichSignedIn.style.display = "none";
			sandwichSignedOut.style.display = "block";
		}
	}

	methodName() {

	}
};

// HomeManager manages both location inputs on the home page
rhit.HomeManager = class {
	constructor() {

	}

	validateSearchEntries() {
		const startInput = document.querySelector("#startInput");
		const destInput = document.querySelector("#destInput");

		const isValidStart = rhit.supportedLocations.includes(startInput.value);
		const isValidEnd = rhit.supportedLocations.includes(destInput.value);

		if (isValidStart && isValidEnd) {
			return true;
		} else {
			const startTipper = startInput._tippy;
			const destTipper = destInput._tippy;

			if (!isValidStart) {
				startTipper.show();
			}
			if (!isValidEnd) {
				destTipper.show();
			}
			return false;
		}
	}
};

// RouteController controls the route page's html
rhit.RouteController = class {
	constructor(startPoint, destPoint) {
		this._startPoint = startPoint;
		this._destPoint = destPoint;

		document.querySelector("#directionsItem").innerHTML = `${startPoint} to ${destPoint}`;

		// rhit.routeManagerSingleton.beginListening(this.updateView.bind(this)); // TODO remove
	}

	updateView() {
		console.log("Change listener fired");
	}
};

// RouteManager draws the map and manages the routing
rhit.RouteManager = class {
	constructor(startPoint, destPoint) {
		this._startPoint = startPoint;
		this._destPoint = destPoint;

		const isValidStart = rhit.supportedLocations.includes(startPoint);
		const isValidEnd = rhit.supportedLocations.includes(destPoint);
		if (!isValidStart || !isValidEnd) {
			console.error("One of the destinations entered was not in the supported locations list");
			// TODO: notify and redirect users back to route creation page instead of proceeding with routing
		}

		this._createMap();
	}

	_createMap() {
		const startLat = 39.48310247510036;
		const startLong = -87.32657158931686;

		// OLD map bounds (tighter, doesn't fit all of adventure course)
		// const bottomLeftCorner = L.latLng(39.479158569243786, -87.33267219017984);

		const bottomLeftCorner = L.latLng(39.47891646288526, -87.33532970827527);
		const topRightCorner = L.latLng(39.486971582184474, -87.31458987623805);
		const bounds = L.latLngBounds(bottomLeftCorner, topRightCorner);

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
		}); // .setView([startLat, startLong], 13);

		// expose for debugging purposes
		window.exposedMapObj = routeMap;

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(routeMap);

		const testMarker = L.marker([startLat, startLong], {draggable: true, autoPan: true}).addTo(routeMap)
			.bindPopup('Test popup<br> Hello.')
			.openPopup();


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

		routeMap.on('dblclick', function(event) {
			console.log(event.latlng); // logs latlong position of where you click on the map, hopefully
		});
	}
};

// DevMapManager allows devs to manage nodes and paths via clicks
rhit.DevMapManager = class {
	constructor() {
		this._createMap();
	}

	_createMap() {
		const startLat = 39.48310247510036;
		const startLong = -87.32657158931686;

		// OLD map bounds (tighter, doesn't fit all of adventure course)
		// const bottomLeftCorner = L.latLng(39.479158569243786, -87.33267219017984);

		const bottomLeftCorner = L.latLng(39.47891646288526, -87.33532970827527);
		const topRightCorner = L.latLng(39.486971582184474, -87.31458987623805);
		const bounds = L.latLngBounds(bottomLeftCorner, topRightCorner);

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
		}); // .setView([startLat, startLong], 13);

		// expose for debugging purposes
		window.exposedMapObj = routeMap;

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(routeMap);

		const testMarker = L.marker([startLat, startLong], {draggable: true, autoPan: true}).addTo(routeMap)
			.bindPopup('Test popup<br> Hello.')
			.openPopup();


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

		routeMap.on('dblclick', function(event) {
			console.log(event.latlng); // logs latlong position of where you click on the map, hopefully
		});
	}
	populateMap() {
		// add markers to the map
		mapDataSubsystemSingleton._nodes;
	}
};

// FbAuthManager is responsible for managing user logins
rhit.FbAuthManager = class {
	constructor() {
		this._user = null;
		console.log("Auth manager created");
	}
	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user;
			changeListener();
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
	signOut() {
		firebase.auth().signOut().catch((error) => {
			// An error happened.
			console.error("Sign out failed!");
		});
	}
	get isSignedIn() {
		return !!this._user;
	}
	get uid() {
		return this._user.uid;
	}
};

// MapDataSubsystem stores the nodes and connections for the map
rhit.MapDataSubsystem = class {
	constructor() {
		this._dataVersion = parseInt(localStorage.getItem(rhit.KEY_STORAGE_VERSION)) || -1; // Version is stored or blank
		this._nodes = {};
		this._numNodes = 0;
		this._connections = {};
		this._namesList = [];

		// https://www.npmjs.com/package/js-graph-algorithms#create-directed-weighted-graph
		// https://rawgit.com/chen0040/js-graph-algorithms/master/examples/example-weighted-digraph.html
		// const g = new jsgraphs.WeightedDiGraph(8);
		// console.log(g);
		this.navGraph = null;

		this._documentSnapshots = [];
		this._ref = firebase.firestore();
		this._locationsRef = this._ref.collection(rhit.FB_COLLECTION_LOCATIONS);
		this._connectionsRef = this._ref.collection(rhit.FB_COLLECTION_CONNECTIONS);
		this._unsubscribe = null;

		this._fetchMapDataIfNeededAndBuildGraph();
	}

	_fetchMapDataIfNeededAndBuildGraph() {
		console.log(`Local map data version is ${this._dataVersion}`);

		const liveMapVersionRef = this._ref.collection("Constants").doc("Versions");

		liveMapVersionRef.get().then((doc) => {
			if (doc.exists) {
				// console.log(doc.data());

				if (doc.data().map.seconds > this._dataVersion) {
					console.log("Map data being fetched from Firebase");

					this._locationsRef.get().then((querySnapshot) => {
						console.log(querySnapshot.size);
						this._numNodes = querySnapshot.size;

						querySnapshot.forEach((doc) => {
							// doc.data() is never undefined for query doc snapshots
							// console.log(doc.id, " => ", doc.data());
							const thisNode = new rhit.MapNode(doc.id, doc.data());
							this._nodes[doc.id] = thisNode;
							window[doc.id] = thisNode;
						});
					});

					// TODO update local version on successful fetch
				} else {
					console.log("Map data reused from local storage");
				}
			} else {
				console.error("No such document!");
			}
		}).catch((error) => {
			console.error("error getting version: ", error);
		});
	}

	_constructGraph() {

	}

	get locationNames() {
		return this._namesList;
	}
};

// MapNode stores information for its particular location
rhit.MapNode = class {
	constructor (fbKey, fbLocation) {
		this.fbKey = fbKey;
		this.geopoint = fbLocation[rhit.FB_KEY_LOC_GEO];
		this.name = fbLocation[rhit.FB_KEY_LOC_NAME] || `Unnamed node ${fbKey}`;
		this.aliasList = fbLocation[rhit.FB_KEY_LOC_ALIAS] || [];
	}

	validAlias(name) {
		return (name === this.name) || this.aliasList.includes(name);
	}

	get lat() {
		return this.geopoint.df;
	}

	get long() {
		return this.geopoint.wf;
	}
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
		rhit.mapDataSubsystemSingleton = new rhit.MapDataSubsystem();
		rhit.homeManagerSingleton = new this.HomeManager();
		new rhit.HomeController();
	} else if (document.querySelector("#routePage")) {
		console.log("You are on the Route page.");

		// get url parameter
		const startPoint = urlParams.get("start");
		const destPoint = urlParams.get("dest");

		// Needs map data for navigation
		rhit.mapDataSubsystemSingleton = new rhit.MapDataSubsystem();
		rhit.routeManagerSingleton = new rhit.RouteManager(startPoint, destPoint);
		new rhit.RouteController(startPoint, destPoint);
	} else if (document.querySelector("#settingsPage")) {
		console.log("You are on the Settings page.");

		rhit.settingsManagerSingleton = new rhit.SettingsManager();
		new rhit.SettingsController();
	} else if (document.querySelector("#devPage")) {
		// do dev page stuff
		const authorizedUsers = {chanb: true, budakrc: true, kleinsv: true};

		if (!(rhit.fbAuthManagerSingleton.isSignedIn && authorizedUsers[rhit.fbAuthManagerSingleton.uid])) {
			window.alert("INVALID USER DETECTED");
			window.location.href = "/";
		}
		rhit.mapDataSubsystemSingleton = new rhit.MapDataSubsystem();
		rhit.devMapManagerSingleton = new rhit.DevMapManager();
	}
};

rhit.main = function () {
	rhit.fbAuthManagerSingleton = new rhit.FbAuthManager();
	rhit.fbAuthManagerSingleton.beginListening(() => {
		console.log("isSignedIn = ", rhit.fbAuthManagerSingleton.isSignedIn);

		// Check for redirects
		// rhit.checkForRedirects();

		// Init page
		rhit.initializePage();
	});

	console.log("Ready");
};

rhit.main();
