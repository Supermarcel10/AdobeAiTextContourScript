var doc = app.activeDocument;

function countLeadingWhitespace(str) {
    return str.match(/^[\s\t]*/)[0].length;
}

if (doc.selection.length === 0 || doc.selection[0].typename !== "TextFrame") {
    alert("Please select a text item first!");
} else {
    var textItem = doc.selection[0];
    var charAttr = textItem.textRange.characterAttributes;
    var leading = charAttr.leading;
    var rectLayer = doc.layers.add();
    rectLayer.name = "Text Bounding Rectangles";

    var textFrameBounds = textItem.visibleBounds;
    var lineHeight = leading;

    // Find the line with the most characters
    var maxChars = 0;
    for (var i = 0; i < textItem.lines.length; i++) {
        var line = textItem.lines[i];
        if (line.characters.length > maxChars) {
            maxChars = line.characters.length;
        }
    }

    // Calculate charWidth based on the bounds of the text box and the number of characters in the longest line
    var charWidth = (textFrameBounds[2] - textFrameBounds[0]) / maxChars;

    for (var i = 0; i < textItem.lines.length; i++) {
        var line = textItem.lines[i];
        var lineWidth = charWidth * line.characters.length;

        // Skip drawing rectangles for empty lines
        if (line.characters.length === 0) {
            continue;
        }

        var whitespaceCount = countLeadingWhitespace(line.contents);
        var top = textFrameBounds[1] - (i * lineHeight);
        var left = textFrameBounds[0] + (whitespaceCount * charWidth);
        var cornerRadius = Math.min(lineWidth, lineHeight) / 2;
        if (charWidth != 0) rectLayer.pathItems.roundedRectangle(top - (lineHeight  * .075), left, lineWidth, lineHeight * 0.8, cornerRadius, cornerRadius);
    }
}
