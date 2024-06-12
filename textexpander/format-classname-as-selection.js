(function (className) {
    let truncatedClassName = className.replace(/__.*/, '')
    return `document.querySelector('[class*="${truncatedClassName}"]')`
K})(TextExpander.pasteboardText)
