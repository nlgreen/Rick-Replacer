
// Grab new link information and update database
function saveOptions(){

	var newlink = document.getElementById('newlink').value;
	var newlinkname = document.getElementById('newlinkname').value;
	if (!newlink || !newlinkname) {
		renderStatus("Invalid Link or Link Name");
	}
	else {
		// update chrome storage info
		updateLinkInfo(newlink,newlinkname);

		renderStatus("New Link Set: " + newlinkname);

		// reset input text
		document.getElementById('newlink').value = '';
		document.getElementById('newlinkname').value = '';
	}

}

// Because accessing storage assumes that corresponding entries in the database
// (based on index) belong to the same link set, we always set in tandem
function updateLinkInfo(newlink,newlinkname) {
	updateLink(newlink);
	updateLinkName(newlinkname);
}

// Get the link list, add a new link, re-store the link list
function updateLink(newlink) {
	chrome.storage.sync.get(null, function(item) {
		var linklist = item.links;
		linklist.push(newlink);
		chrome.storage.sync.set({'links':linklist});
	});
}

// Get the link name list, add a new link name, re-store
function updateLinkName(newlinkname) {
	chrome.storage.sync.get(null, function(item) {
		var linknamelist = item.linknames;
		linknamelist.push(newlinkname);
		chrome.storage.sync.set({'linknames':linknamelist}, renderLinks);
	});
}

// Reset all links
function resetOptions(){
	chrome.storage.sync.set({'links':[]});
	chrome.storage.sync.set({'linknames':[]}, renderLinks);
	chrome.storage.sync.set({'linkcolors':[]});
	renderStatus("Links reset");
}


// Erase all listed link names and re-add them
function renderLinks() {
	var ul = document.getElementById("linklist");
	if (ul) {
    	while (ul.firstChild) {
      		ul.removeChild(ul.firstChild);
    	}
  	}

	chrome.storage.sync.get(null, function(item) {
		var linknamelist = item.linknames;
		for (var i = 0; i < linknamelist.length; i++) {
			var li = document.createElement("li");
			var text = document.createTextNode(linknamelist[i]);
			li.title = item.links[i];
			li.appendChild(text);
			ul.appendChild(li);
		}
	})
}

// Set status text
function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

// On load, set the status and the link list
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('newlinkname').value = 'Rick Roll';


	chrome.storage.sync.get(null, function(item) {
		if (item.links == []) {
			resetOptions();
			renderStatus("No links found");
		}
		else {
			renderLinks();
			renderStatus("Currently Blocking:");
		}
	});
});


document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('reset').addEventListener('click', resetOptions);
