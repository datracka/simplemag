<?php
/*

Perform this generation like page caching. The styles are generated on page load
and cached. This cache can be invalidated based on timestamps.

## Global stylesheet
{{element-name}} == '.x-alert'
1. Get all registered elements
2. For each element, parse the style template
3. Write to a global (site wide) style


## Page stylesheet
{{element-name}} == '.x-alert.c134'

1. Get a list of all elements on the page
2. Sort discovered elements into groups of the same type
3. For each element
	1. Parse the style template into an array of "rules"
	2. For each rule
			1. get a list of keys (data points)
			2. Iterate over all elements in the group.
			3. Group into matches where the required keys are identical
			4. Discard match groups identical to global settings.
			5. With matches, generate a new combined selector and write the rule
	3. Add the rule list to the master stylesheet

## Preview Render
{{element-name}} == '.x-alert.c134'

Render the data, and place in a dedicated <style id="style-c134"></style> element.

*/
?>

/* Rule 1 */
{{element}}.custom-class {
	color: {{data-point}};
}

/* Rule 2 */
{{element}}.custom-class {
	background-color: {{data-point}};
}

