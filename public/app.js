// ES6 version of technical test for Cöncise Group by Mark Mulrooney
"use strict";

// Object oriented starting point
let CG = {}; // My namespace
CG.pageName = ""; // Stores ID from <body> tag to identify the page we are on
CG.objects = {};

CG.base = function(){
	CG.objects.JSReady = new CG.JSReady();

	// This fix is needed for FireFox and Edge - a delay of milliseconds plus proof that the variable c used in load-instructions.js has been declared.
	setTimeout(function() {
		if (c) {
			CG.objects.main = new CG.main();
		}
		else {console.log("c used in load-instructions.js has not been declared.");}
	},150);
};


// Add JS class to HTML tag as it's faster than putting it on the BODY tag when the DOM is ready.
CG.JSReady = function(){
	let htmlElement = document.documentElement;
	// Add a js class
	htmlElement.className += ' js';
};


/**
 * On Load
*/
window.onload = function(){
	let startCG = new CG.base();
};

// General functions

CG.capitalFirst = function(target) { //Capitalise the first letter of the word
	return target.replace(/^\w/, c => c.toUpperCase());
};

CG.hasClass = function(ele,cls) {
	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
};

CG.addClass = function(ele,cls) {
	if (!CG.hasClass(ele,cls)) {ele.className += " "+cls;}
};

CG.removeClass = function(ele,cls) {
	if (CG.hasClass(ele,cls)) {
		let reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		ele.className = ele.className.replace(reg,' ');
	}
};

CG.getParentByTagName = function(node, tagname) {
	let parent;
	if (node === null || tagname === '') {return;}
	parent  = node.parentNode;
	tagname = tagname.toUpperCase();

	while (parent.tagName !== "HTML") {
		if (parent.tagName === tagname) {
			return parent;
		}
		parent = parent.parentNode;
	}
	return parent;
};

//  function to insert a HTML tag
CG.insertBefore = function(el, referenceNode) {
	referenceNode.parentNode.insertBefore(el, referenceNode);
};


// General page function
CG.main = function(){
	// Get ToDO element by ID
	let _objTodo = document.getElementById("todo");
	if (_objTodo) {
		_objTodo.style.backgroundColor = "lightgreen";
	}
	else {
		console.log("Could not find #todo. Not a good start. Bailing out!");
		return false;
	}

	// Get ToDo list
	let _objTodoList = document.querySelectorAll("div#todo-list > ol");

	if (_objTodoList) {
		_objTodoList[0].setAttribute("class","");
		_objTodo.addEventListener('click', function(){
			let currentClass = _objTodoList[0].getAttribute("class");
			//console.log(`currentClass = ${currentClass} ` );
			if (currentClass === "" || currentClass === "toAppear") {
				_objTodoList[0].setAttribute("class","toHide");
			}
			else {_objTodoList[0].setAttribute("class","toAppear");}
		},false);
	}

	// to hold the data that comes from the JSON file
	let data;

	// Add list of names from JSON data
	const createStaffList = function(staffList) {
		// Pick up the designated UL 
		let _objMembersList = document.getElementById("membersList");

		// array to hold the different teams
		let teamTerms = [];

		// function to handle clicking on a staff name and the expansion to show their details
		let staffExpansionHandler = function(){
			let _currentStaffClicked = this;
			_currentStaffClicked.childNodes.forEach(function(item){
				if (item.nodeName === "UL") {
					// toggle classAction between toHide and toAppear
					let classAction = CG.hasClass(item,"toHide") ? "toAppear" : "toHide";
					item.setAttribute("class", classAction);
				}
			});
		};
		
		// go through the staff data and create a sub list of LIs for each staff member
		for (const key in staffList) {
			if (staffList.hasOwnProperty(key)) {
				let _person = document.createElement("li");
				_person.setAttribute("data-id",staffList[key].id);
				_person.setAttribute("title","Click to show/hide more details.");
				if (staffList[key].team) {_person.setAttribute("data-team-term",staffList[key].team);}
				//_person.innerHTML = `<strong>${staffList[key].name}</strong> - <em>${staffList[key].job}</em>`;
				_person.innerHTML = `<strong>${staffList[key].name}</strong> - <em>${staffList[key].username}</em>`;

				_person.addEventListener('click',staffExpansionHandler,false);

				_objMembersList.append(_person);
			}
		}

		//  Collate team terms
		let teamTermGenerator = function() {
			let temp = [], teamList = [];
			for (const key in staffList) {
				if (staffList[key].team) {
					// Split a string into an array of substrings:
					temp = staffList[key].team.split(" ");
					// push however many array elements are in temp into teamList
					teamList.push(...temp);
				}
			}
			return teamList;
		};
		teamTerms = teamTermGenerator();

		// Remove duplicates from teamTerms array using Set
		teamTerms = [...new Set(teamTerms)];

		// Recursive function to make lists within lists
		let subSubListCreator = function(target, subSubObj, recursionLevel){
			recursionLevel += 1; // increment recursionLevel
			// create the sublist
			let _newSubListHolder = document.createElement("ul");

			target.append(_newSubListHolder);
			Object.keys(subSubObj).forEach(function(key){
				let _newSubListKey = document.createElement("li");
				
				// Capitalise the first letter of the key
				let keyCapped = CG.capitalFirst(key);

				// if an object and recursionLevel is not too high, recurse again
				if (typeof subSubObj[key] === "object" && recursionLevel < 4) {
					_newSubListKey.innerHTML = `<strong>${keyCapped}</strong> `;
					_newSubListHolder.append(_newSubListKey);
					subSubListCreator(_newSubListKey, subSubObj[key], recursionLevel);
				}
				else {
					_newSubListKey.innerHTML = `<strong>${keyCapped}</strong> - <em>${subSubObj[key]}</em>`;
					_newSubListHolder.append(_newSubListKey);
				}
			});
		};


		// Go through the list of people and create a staff details sublist for each
		if (_objMembersList.childNodes.length > 0) {
			_objMembersList.childNodes.forEach(function(item){
				// Check if item is an LI node
				if (item.nodeName === "LI") {
					// pick up the data-id value of the item 
					let _whichID = item.getAttribute("data-id");
					// generate an ID name
					let _newIDname = "staffNum" + _whichID;

					// create the sublist
					let _newListHolder = document.createElement("ul");
					_newListHolder.setAttribute("id",_newIDname);
					_newListHolder.setAttribute("class","toHide");
					item.append(_newListHolder);
					Object.keys(staffList[_whichID-1]).forEach(function(key){
						let _newListKey = document.createElement("li");
						
						// Capitalise the first letter of the key
						let keyCapped = CG.capitalFirst(key);

						// is it a string or an object?
						if (typeof staffList[_whichID-1][key] === "object") {
							_newListKey.innerHTML = `<strong>${keyCapped}</strong> `;
							_newListHolder.append(_newListKey);
							subSubListCreator(_newListKey, staffList[_whichID-1][key], 1);
						}
						else {
							_newListKey.innerHTML = `<strong>${keyCapped}</strong> - <em>${staffList[_whichID-1][key]}</em>`;
							_newListHolder.append(_newListKey);
						}
					});
				}
			});
		}


	// Code to create and handle the form ////////////////////////////////////////////////////////////

		// function to react to a change in the team drop down menu
		let teamSelectorHandler = function() {
			// save the new choice
			let dropDownSelection = this.value;

			let _entireTeam = _objMembersList.children;
			for (let i = 0; i < _entireTeam.length; i = i + 1) {
				_entireTeam[i].setAttribute("class","");
				let currentTeam = _entireTeam[i].getAttribute("data-team-term");
				// clear the previous filter
				if (dropDownSelection === "clear") {
					_entireTeam[i].setAttribute("class","toAppear");
				}
				// half hide those people who do not have a team attribute
				else if (!currentTeam) {_entireTeam[i].setAttribute("class","toHalfHide");}
				else {
					let searchSuccess = currentTeam.search(dropDownSelection);
					// for a team choice that is not matched with a person, half hide that person
					if (searchSuccess === -1) {
						_entireTeam[i].setAttribute("class",'toHalfHide');
					}
				}
			}
		};


		// Create a search input field
		let _staffSearch = document.createElement("input");

		// Create a clear search button 
		let _searchClearButton = document.createElement("button");

		// Function to handle the search submits
		let submitHandler = function() {
			let searchTerm = _staffSearch.value;

			_objMembersList.childNodes.forEach(function(item){
				
				if (item.nodeName === "LI") {

					// remove possible previous highlighting
					CG.removeClass(item,"toHighlight");

					// convert innerText to a string
					let textToBeSearched = item.innerText.toString();
					
					// convert textToBeSearched to lower case
					textToBeSearched = textToBeSearched.toLowerCase();
					
					// convert search term to lowercase and then do search
					let searchResult = textToBeSearched.search(searchTerm.toLowerCase());
					if (searchResult >= 0) {
						CG.addClass(item,"toHighlight");
					}
				}
			});
		};

		// function to clear items highlighted after a search clear
		let clearSearchHandler = function() {
			// clear out the search input field
			_staffSearch.value = "";
			_objMembersList.childNodes.forEach(function(item){
				if (item.nodeName === "LI") {
					CG.removeClass(item,"toHighlight");
				}
			});
		};

		// Create a form to hold form elements
		let _staffForm = document.createElement("form");
		_staffForm.setAttribute("id","staffForm");
		CG.insertBefore(_staffForm, _objMembersList);

		// Create a label for the drop down list of teamTerms
		let _dropDownLabel = document.createElement("label");
		_dropDownLabel.setAttribute("for","teamSelector");
		_dropDownLabel.innerHTML = "Use the drop down menu to filter the staff list by teams";
		_staffForm.append(_dropDownLabel);

		// Create a drop down list from teamTerms
		let _dropDown = document.createElement("select");
		_dropDown.setAttribute("id","teamSelector");
		_dropDown.innerHTML += `<option value="clear">Select a team</option>`;
		teamTerms.forEach(function(item){
			_dropDown.innerHTML += `<option value="${item}">${item}</option>`;
		});
		_dropDown.addEventListener('change', teamSelectorHandler, false);
		_staffForm.append(_dropDown);

		// Create a label for the search field
		let _staffSearchLabel = document.createElement("label");
		_staffSearchLabel.setAttribute("for","staffSearch");
		_staffSearchLabel.innerHTML = "Type search terms here";
		_staffForm.append(_staffSearchLabel);

		// Use the search input field
		_staffSearch = document.createElement("input");
		_staffSearch.setAttribute("id","staffSearch");
		_staffForm.append(_staffSearch);

		// Create a submit/search button
		let _submitButton = document.createElement("button");
		_submitButton.setAttribute("type","button");
		_submitButton.innerHTML = "Search";
		_submitButton.addEventListener('click', submitHandler, false);
		_staffForm.append(_submitButton);


		// pick up the form!! Not just the submit button because in this way the pattern attribute on the input will work, add event handler to handle the submits
		let _form = document.getElementById("staffForm");
		if (_form) {
			_form.addEventListener('submit', (e) => {
				e.preventDefault();
				submitHandler();
			}, false);
		}

		// Create a search clear button
		_searchClearButton.setAttribute("type","button");
		_searchClearButton.innerHTML = "Clear search";
		_searchClearButton.addEventListener('click', clearSearchHandler, false);
		_staffForm.append(_searchClearButton);
	};

	// get data from a JSON file
	async function getData(url){
		const response = await fetch(url);
		data = await response.json();
		//if (data && data.department) {
			//createStaffList(data.department);
		if (data) {
			createStaffList(data);
		}
		//else {console.log("Missing 'data' or 'data.department' from JSON file");}
		else {console.log("Missing 'data' from JSON file");}
	}
	//getData("../mock-backend/db.json");
	getData("../mock-backend/users.json");
};
// end of CG.main = function