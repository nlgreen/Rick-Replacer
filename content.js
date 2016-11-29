
var links = document.links;

// Look at all document links and border them if they are in link list
chrome.storage.sync.get(null, function(item) {
    var linklist = item.links;
    for (var i=0; i < links.length; i++) {
        var doculink = links[i];
        if (linklist.includes(doculink.href)) {
            doculink.style.border = "5px solid red";
        }
    }
});
