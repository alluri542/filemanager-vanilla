/**
 * FileManager class creates all the DOM elements required
 * for the FileManager and appends to specified selector
 * *** Use id as a selector 
 */

import {
	createElement,
	append,
	adjustActions
} from './dom.js';


class FileManager {
	
	constructor(selector) {
		// selector is undefined or empty
        if (!selector || selector == "") 
            throw new Error("Selector required");
        // DOM element associated with the selector is not found.
        if (null === document.querySelector(selector)) 
			throw new Error("No DOM element is associated with the selector");
			
		this.selector = document.querySelector(selector);
		this.data = null;
	}

	display(nodes) {
		this.selector.innerHTML = "";
		this.selector.appendChild(nodes);
	}

	setData(data) {
		this.data = data;
	}

	getData() {
		return this.data;
	}

	changeDir(dirName) {
		console.log(dirName);
		debugger;
		let data = JSON.parse(JSON.stringify(this.getData()));
		let path = document.querySelector(".file-explorer__nav").getAttribute("data-nav-path");
		let dirLocation = path === "home" ? dirName : path.replace("home/", "");
		let newPath = "home";

		dirLocation.split("/").forEach(dir => {
			try {
				data.files.forEach(file => {
					if (file.Name === dir) {
						newPath = newPath + "/" + dir;
						data.files = file.Children;
						throw BreakException;
					}
				});
			} catch(e) {
				console.log("Stopped loop");
			} 

		});

		// TODO: send fullpath
		this.build(data, newPath);
		
	}

	updateNav(e) {
		
		let path = e.currentTarget.dataset.linkPath;

		this.changeDir(path);
		
	}

	returnFromFolder() {
		// TODO:
	}

	validateData() {
		// TODO:
	}


	/**
	 * This method takes data json data and build file manager DOM elements
	 * @param data in the json format. Ex {headers: [], files: [], actions: []}
	 * @return DOM elements
	 */
	build(data, path) {
		debugger;

		// Validating headers, files list
		this.validateData(data);

		if (!path) {
			this.setData(data);
		}

		// Creating required elements for the grid
		let elem_main = createElement("main", {class: "file-explorer"});
		let elem_nav = this.createNavigation(path ? path : "Home");
		let elem_header = this.createHeader(data.headers);
		let elem_files = this.createFiles(data.files, data.headers);
		let elem_actions = this.createActions(data.actions);

		// Appending all elements to a main wrapper
		append(elem_main, elem_nav);
		append(elem_main, elem_header);
		append(elem_main, elem_files);
		append(elem_main, elem_actions);
		
		//Display grid in UI
		this.display(elem_main);

		//Adjusting how many rows and columns of buttons to display
		adjustActions();

	}

	
	createNavigation(path) {

		let elem_nav = createElement("nav", {class: "file-explorer__nav", "data-nav-path": path.toLowerCase()});

		if (path) {
			let links = path.split("/");
			let linkPath = "";
			links.forEach((p, i) => {
				if (linkPath.length) {
					linkPath = linkPath + "/" + p;
				} else {
					linkPath = p;
				}
				
				let elem_a = createElement("a", {html: " " + p, href:"#", "data-link-path": linkPath});
				elem_a.addEventListener("click", () => this.updateNav(event));
				append(elem_nav, elem_a);
			})
		}

		return elem_nav;
	}

	/**
	 * Creates a <header></header> element for the file explorer
	 * @returns DOM element <header class="file-explorer__header"> ... </header>
	 */
	createHeader(headers) {

		let elem_header = createElement("header", {class: "file-explorer__header"});
		let elem_ul = createElement("ul");
		let elem_li = createElement("li");
		let elem_checkbox = createElement("input", {type: "checkbox"}); // checkbox for file select

		append(elem_li, elem_checkbox)
		append(elem_ul, elem_li);
		
		headers.forEach(header => {
			append(elem_ul, createElement("li", {html: header}));
		});

		append(elem_header, elem_ul);

		return elem_header;
	}

	/**
	 * 
	 * @param files array of file objects
	 * @param headers array of header strings
	 * @returns a <section> tag with one unordered-list for each file object
	 */
	createFiles(files, headers) {
		// <section></section> wrapper for the files list
		let elem_section = createElement("section", {class: "file-explorer__files"});
    
		// Loop through each file
		files.forEach(file => {
	
			let elem_ul = createElement("ul");
			let elem_li = createElement("li");
			let elem_checkbox = createElement("input", {type: "checkbox"});
	
			// checkbox for selecting file
			append(elem_li, elem_checkbox);
			append(elem_ul, elem_li);
	
			// Loop through headers and select each file column by header order.
			// This way if the order of headers and file in files json does not mater.
			headers.slice(0, headers.length - 1).forEach(header => {
				// In most cases "Description" value is empty in the JSON. 
				// So if something is missing it will add "--" in UI
				let value = file[header] === "" ? "--" : file[header];
				let elem_li;
				debugger;

				// let elem_li = createElement("li", {html: value});
	
				if (file["Type"] === "Folder" && header === "Name") {
					
					elem_li = createElement("li");
					
					let elem_anchor = createElement("a", {href: "#", html: value});
					elem_anchor.addEventListener("click", () => this.changeDir(file["Name"]));
										
					append(elem_li, elem_anchor);
				} else {
					elem_li = createElement("li", {html: value});
				}
				
				append(elem_ul, elem_li);
			});
	
			append(elem_section, elem_ul);
		});   
	
		return elem_section;
	}

	createActions(actions) {
		
		let elem_aside = createElement("aside", {class: "file-explorer__actions"});
		let elem_aside_button_wrapper = createElement("div");
		let elem_expand_button = createElement("button", {class: "actions-button__expand", 
			html: "<i class='fas fa-chevron-circle-left'></i>"
		});
		
		elem_expand_button.addEventListener("click", () => this.toggleActions());
		
		// Loop through actions array
		actions.forEach(action => {
			let elem_button = createElement("button", {
				html: "<i class='fas fa-" + action.ImageName.toLowerCase() + "'></i>"
			});
			append(elem_aside_button_wrapper, elem_button);
		});
		
		append(elem_aside, elem_aside_button_wrapper);
		append(elem_aside, elem_expand_button);
		return elem_aside;
	}

	toggleActions() {
		console.log("Toggle");
		debugger;
		let actions = document.querySelector(".file-explorer__actions");
		actions.classList.toggle("expanded");
	}

}

export {FileManager};