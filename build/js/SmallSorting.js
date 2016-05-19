var Sorting = (function() {
	var options,
		container, //контейнер элементов подлежащих сортировке 
		elemClass, //класс елементов подлежащих сортировке
		buttonClass, //class кнопок	
		startCategory, // стартовая категория
		allElems,
		oldElems, // видимые елементов
		newElems, // елементы подлежащие визуальзиции 
		cssPropObj = {}, 
		cssPropVal,
		isChangingCategory = false, // изменение категории происходит сейчас? 
		currentCategory; // массив кнопок

	function start(options) {
		options = options || {};
		container = options.containerId ? document.getElementById(options.containerId) : document.getElementById("sortContainer");
		elemClass = options.elemClass || "sortElems";
		buttonClass = options.buttonClass || "sortBtns";
		startCategory = options.startCategory || "all";

		allElems = getCategoryElems("all");
		oldElems = getCategoryElems(startCategory);
		
		currentCategory = startCategory;

		startSorting();
	}

	function startSorting() {

		for ( var i = 0, max = allElems.length; i < max; i++) {
			allElems[i].style.display = "none";
		}

		for ( var i = 0, max = oldElems.length; i < max; i++) {
			oldElems[i].style.display = "";
		}

		if (!cssPropVal) setAnimation("default");
		document.body.addEventListener("click", clickEvnt);
	}

	function clickEvnt(e) {
		var target = e.target;
		while(target != this) {

			if (target.classList.contains(buttonClass)) break;

			target = target.parentNode;

		}

		if (!target.classList.contains(buttonClass)) return;

		if (target.getAttribute("data-category") === currentCategory) return;

		if (isChangingCategory) return;

		currentCategory = target.getAttribute("data-category");
		newElems = getCategoryElems(target.getAttribute("data-category"));

		console.log("click " + currentCategory);

		hiddenOldElems();

	}

	function hiddenOldElems() { //скрытие "старых" элементов

		for (var i = 0, max = oldElems.length; i < max; i++) {
			for (var key in cssPropObj) {
				if (cssPropObj.hasOwnProperty(key)) {
					oldElems[i].style[key] = cssPropObj[key];
				}
			}
		}

		container.addEventListener("transitionend", transHidEnd);

		isChangingCategory = true;
		//showNewElems();
	}

	function transHidEnd(e) { 
		console.log(e, cssPropVal);
		//if (e.propertyName !== cssPropVal) return;
		e.target.style.display = "none";
		console.log("hid2");

		if (e.target === oldElems[0]) {
			showNewElems();
			container.removeEventListener("transitionend", transHidEnd);
		}
	}

	function showNewElems() { //визуализация "новых" элементов
		for (var i = 0, max = newElems.length; i < max; i++) {
			newElems[i].style.display = "";
		}

		for (var i = 0, max = newElems.length; i < max; i++) {
			for (var key in cssPropObj) {
				if (cssPropObj.hasOwnProperty(key)) {
					newElems[i].style[key] = cssPropObj[key];
				}
			}
		}

		setTimeout(function(){
			for (var i = 0, max = newElems.length; i < max; i++) {
				for (var key in cssPropObj) {
					if (cssPropObj.hasOwnProperty(key)) {
						newElems[i].style[key] = "";
					}
				}
			}
		}, 10);

		container.addEventListener("transitionend", transShwEnd);

		oldElems = newElems;
	}

	function transShwEnd(e) {
		//if (e.propertyName !== cssPropVal) return;

		if (e.target === newElems[0]) {
			container.removeEventListener("transitionend", transShwEnd);
			isChangingCategory = false;
		}
	}

	function getCategoryElems(category) { //возвращает все элементы определенной категории 
		var category = category || "all",
			elems;

		if (category === "all") {
			elems = document.querySelectorAll("." + elemClass);
		}
		else {
			elems = document.querySelectorAll("." + elemClass + "." + category);
		}

		return elems;
	}

	function createAnimation(cssProp, duration, func, delay) { //установка анимации
		var elems = allElems;

		if (typeof cssProp === "string") {
			cssPropObj[cssProp] = 0;
			cssPropVal = cssProp;
		} else {
			for(key in cssProp) {
				if (cssProp.hasOwnProperty(key)) {
					cssPropObj[key] = cssProp[key];
					cssPropVal = key;
				}
			}
		}

		for(var i = 0, max = elems.length; i < max; i++) {
			elems[i].style.transitionProperty = cssProp;
			elems[i].style.transitionDuration = duration;
			elems[i].style.transitionTimingFunction = func;
			elems[i].style.transitionDelay = delay;
		}

	}

	function defaultAnimation(name) { //стандартные анимации
		if (typeof name !== "string") return;

		switch(name) {
			case "accordion": createAnimation({"opacity":0, "width": "10px"}, "1s", "linear", "0s"); break;
			default: createAnimation({"opacity":0}, "0.5s", "linear", "0s");
		}
	}

	function setAnimation(options) {
		console.log(typeof options);
		if (typeof options === "string") {
			defaultAnimation(options);
		} else if (typeof options == "object") {
			createAnimation(options);
		}
	}

	return {
		start: start,
		setAnimation: setAnimation
	};

})();