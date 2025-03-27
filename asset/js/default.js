(function($) {
    function fixIframeAspect() {
        $('iframe').each(function () {
            var aspect = $(this).attr('height') / $(this).attr('width');
            $(this).height($(this).width() * aspect);
        });
    }

    function framerateCallback(callback) {
        var waiting = false;
        callback = callback.bind(this);
        return function () {
            if (!waiting) {
                waiting = true;
                window.requestAnimationFrame(function () {
                    callback();
                    waiting = false;
                });
            }
        }
    }

    $(document).ready(function() {




        $('header nav').addClass('closed');

        $('header nav').click(function() {
            $(this).toggleClass('open').toggleClass('closed');
        });
        
		$('.media-render').each(function() {
			var a = $(this).children('a').first()
			var href = a.attr('href')
            var ifrm = prepareFrame($(this), href);
			$(this).append(ifrm);
			a.html(href);
        });
		
		
		
        var expandString = Omeka.jsTranslate('Expand');
        var collapseString = Omeka.jsTranslate('Collapse');

        $('header nav ul ul').each(function(){
          var childMenu = $(this);
          var parentItem = childMenu.parent('li');
          var toggleButton = $('<button type="button" class="child-toggle"></button>');
          toggleButton.attr('aria-label', expandString);
          parentItem.addClass('parent');
          parentItem.children('a').first().wrap('<div class="parent-link"></div>');
          parentItem.find('.parent-link').append(toggleButton);
        });
        
        $('header nav').on('click', '.child-toggle', function(e) {
          e.stopPropagation();
          var childToggle = $(this);
          var childMenu = childToggle.parents('.parent').first().find('ul').first();
          childMenu.toggleClass('open');
          if (childMenu.hasClass('open')) {
            childToggle.attr('aria-label', collapseString);
          } else {
            childToggle.attr('aria-label', expandString);
          }
        });
        
        // Maintain iframe aspect ratios
        $(window).on('load resize', framerateCallback(fixIframeAspect));
        fixIframeAspect();
    });
})(jQuery);


    function prepareFrame(e, src) {
		
		values = [".jpg", ".png", ".jpeg", ".bmp", ".JPG", ".PNG", ".JPEG", ".BMP"]
		isFound = values.some(substring=>src.includes(substring))

		if (isFound){
			var ifrm = document.createElement("img");
			ifrm.setAttribute("src", src);
			ifrm.style.width = "100%";
		}
		else{
			var ifrm = document.createElement("iframe");
			ifrm.setAttribute("src", src);
			ifrm.style.width = "100%";
			ifrm.style.height = "600px";
			ifrm.setAttribute("allowfullscreen", "");
		}
        return ifrm;
    }


function lastx(x, now, yf){
	var add = "";
	var y = 0
	for (let step = 0; step < x; step++) {
		y = now-step;
		add += "&facet[" + yf + "][" + step + "]=" + y;
	}

	var href = window.location.href.replace(/&facet\[${yf}\]\[.\]=[0-9]{4}/g,"");
	
	if (href.includes("?")){
		window.location.href = href+add;
	}
	else{
		window.location.href = href + "?" + add;
	}	
}


function cite(id){

	var itemx = document.getElementById(id);

	if (confirm(itemx.firstChild.textContent)){ 
	
	}
	
	//prompt("Copy to clipboard: Ctrl+C, Enter", item);
	//alert(item.innerHTML);
	 //if (item.style.display == "none"){item.style.display = "block";}
	// else {item.style.display = "none";}
}

function export_all(){
	var exp = "";
	$(".citation").each(function() {
	  exp += $(this).text() + "<br/><br/>";
	});
	
	var tab = window.open('about:blank', '_blank');
tab.document.write(exp); // where 'html' is a variable containing your HTML
tab.document.close();

}


function checkTitleAvailability(title, t="naslovi") {
  const xhr = new XMLHttpRequest(); // Create an XMLHttpRequest object
    const url = 'https://oai.dr.rgf.bg.ac.rs/' + t +'/';
    
    // Open a synchronous POST request
    xhr.open("POST", url, false);
    
    // Set the Content-Type header
    xhr.setRequestHeader("Content-Type", "application/json");

    // Send the request with the JSON payload
    xhr.send(JSON.stringify({ title: title.trim() }));

    // Handle the response
    if (xhr.status === 200) { // Check if the request was successful
        try {
            const result = JSON.parse(xhr.responseText); // Parse the JSON response
            console.log("Parsed JSON:", result);
            return result.available; // Return true/false based on the response
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return false; // Assume unavailable in case of a parsing error
        }
    } else {
        console.error("Request failed with status:", xhr.status);
        return false; // Assume unavailable if the request fails
    }
}


function getdoi(){
	
	var doi = document.getElementById("doiinp").value;

	var myHeaders = new Headers();
	
	myHeaders.append("Accept", "application/json");
	
	if(doi.includes("doi.org/")){
		doi = doi.split("doi.org/")[1];
	}
	
	fetch("https://dx.doi.org/"+doi, {
		headers: myHeaders
	}).then(function (response) {
		return response.text();
	}).then(function (json) {
		
		//ovde ishod
		var obj = JSON.parse(json);
		
		var a = {
			doi:doi,
			publisher: "",
			issue: "",
			type: "",
			year: "",
			title: "",
			volume: "",
			journal: "",
			language: "",
			url: "",
			subtitle: "",
			issn: "",
			subject: "",
			author: "",
			isbn: "",
			pagestart: "",
			pageend: ""
		}
		
		var mapa = {
			doi: "doi",
			publisher: "publisher",
			issue: "issue",
			type: "",
			year: "issued",
			title: "title",
			volume: "volume",
			journal: "source",
			language: "language",
			url: "uri",
			subtitle: "",
			issn: "issn",
			subject: "subject",
			author: "creator",
			isbn: "isbn",
			pagestart: "pageStart",
			pageend: "pageEnd"
		}
		
		
		try{
			if (Array.isArray(obj.publisher)){
				a.publisher = obj.publisher[0];
			}
			else{
				a.publisher = obj.publisher;
			}
			

		}catch(error) {}
				
		try{
			a.issue = obj.issue;
		}catch(error) {}
								
		try{
			if (Array.isArray(obj.type)){
				a.type = obj.type[0];
			}
			else{
				a.type = obj.type;
			}
		}catch(error) {}
		
		try{
			a.year = obj.created["date-parts"][0][0];
		}catch(error) {}
		
		var page = obj.page;
		
		if (typeof page != "undefined")
		if(page.includes("-")){
			a.pagestart = obj.page.split("-")[0];
			a.pageend = obj.page.split("-")[1];
		}
		
		try{
			if (Array.isArray(obj.subtitle)){
				a.subtitle = obj.subtitle[0];
			}
			else{
				a.subtitle = obj.subtitle;
			}
		}catch(error) {}
		
		try{
			if (Array.isArray(obj.title)){
				a.title = obj.title[0];
			}
			else{
				a.title = obj.title;
			}
			if (typeof a.subtitle != "undefined"){
				if (a.subtitle!=""){
					a.title = a.title + " - " + a.subtitle;
				}
			}

		}catch(error) {}
		
		try{
			a.volume = obj.volume;
		}catch(error) {}
		
		try{
			if (Array.isArray(obj["container-title"])){
				a.journal = obj["container-title"][0];
			}
			else{
				a.journal = obj["container-title"];
			}
		}catch(error) {}
	
		try{
			if (Array.isArray(obj.language)){
				a.language = obj.language[0];
			}
			else{
				a.language = obj.language;
			}
			
			if(a.language == "sr"||a.language == "rs"){
				a.language = "српски";
			}
			
			else if(a.language == "en"){
				a.language = "енглески";
			}
			
			else if(a.language == "de"){
				a.language = "немачки";
			}
			
			else if(a.language == "ru"){
				a.language = "руски";
			}
			
			else if(a.language == "it"){
				a.language = "италијански";
			}
			
			else if(a.language == "es"){
				a.language = "шпански";
			}
			
		}catch(error) {}

		try{
			a.url = obj.URL;
		}catch(error) {}

		try{
			a.url = obj.link[0].URL;
		}catch(error) {}

		
		try{
			if (Array.isArray(obj.ISSN)){
				a.issn = obj.ISSN[0];
			}
			else{
				a.issn = obj.ISSN;
			}
		}catch(error) {}

		try{
			if (Array.isArray(obj.ISBN)){
				a.isbn = obj.ISBN[0];
			}
			else{
				a.isbn = obj.ISBN;
			}
		}catch(error) {}

		try{
			a.subject = obj.subject.toString();
		}catch(error) {}
		
		try{
			obj.author.forEach(aut);
			a.author = a.author.slice(0, -2);					

		}catch(error) {}

		function aut(item){
			a.author = a.author + item.given + " " + item.family + ", ";
		}
		
		
		for (var key in a) {
			console.log("key " + key + " has value " + a[key]);
			if (typeof a[key] == "undefined"){
				a[key] = "";
			}
			var x = document.getElementsByClassName(mapa[key]);
			var i;
			for (i = 0; i < x.length; i++) {
				x[i].value = a[key];
			}
		}
				
		console.log(json);
	});
}