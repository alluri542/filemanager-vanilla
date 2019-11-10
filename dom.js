/**
 * This file contains utility methods for dom manipulations
 */


export const createElement = (node, options) => {
    let elem = document.createElement(node);
    if (options && "object" === typeof options) {
        for (const prop in options) {
            if ("html" === prop) {
                elem.innerHTML = options[prop];
            } else {
                elem.setAttribute(prop, options[prop])
            }
        }
    }

    return elem;
}

/**
 * 
 * @param headers as a list of titles
 * @returns header DOM element
 */
export const createHeader = headers => {

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

export const append = (parentNode, childNode) => {
    parentNode.appendChild(childNode);
}


// Updates styling for actions section
export const adjustActions = () => {
    let actions = document.querySelector(".file-explorer__actions");
    let div = document.querySelector(".file-explorer__actions div");
    let height = actions.offsetHeight - 70;
    let availableRows = Math.floor(height / 65);
    div.style["grid-template"] = "repeat(" + availableRows + ", 65px)/repeat(auto-fill, 65px)";

}

/**
 * events
 */

window.addEventListener("resize", adjustActions);
