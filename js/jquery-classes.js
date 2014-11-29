jQuery.fn.myAddClass = function (classTitle) {
	return this.each(function() {
		var oldClass = jQuery(this).attr("class");
		oldClass = oldClass ? oldClass : '';
		var startpos = oldClass.indexOf(classTitle);
		if (startpos >= 0)
			return;
		jQuery(this).attr("class", (oldClass+" "+classTitle).trim());
	});
};

jQuery.fn.myRemoveClass = function (classTitle) {
	return this.each(function() {
		var oldClass = jQuery(this).attr("class");
		var startpos = oldClass.indexOf(classTitle);
		if (startpos < 0)
			return;
		var endpos = startpos + classTitle.length;
		var newClass = oldClass.substring(0, startpos).trim() + " " + oldClass.substring(endpos).trim();
		if (!newClass.trim())
			jQuery(this).removeAttr("class");
		else
			jQuery(this).attr("class", newClass.trim());
	});
};

jQuery.fn.myHasClass = function (classTitle) {
	return jQuery(this).first().attr("class").indexOf(classTitle) >= 0;
};