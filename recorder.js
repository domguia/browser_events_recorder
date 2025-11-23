// Array to store the structured events for the LLM
const userActions = [];

// Helper to get a unique selector or meaningful description of the element
function getElementDescriptor(element) {
    if (!element) return null;

    const descriptor = {
        tagName: element.tagName.toLowerCase(),
        id: element.id || null,
        className: element.className || null,
        innerText: element.innerText ? element.innerText.substring(0, 50) : null, // Truncate if too long
        attributes: {}
    };

    // Capture data attributes which are often useful for tracking
    if (element.dataset) {
        for (const [key, value] of Object.entries(element.dataset)) {
            descriptor.attributes[`data-${key}`] = value;
        }
    }
    
    // Capture specific attributes like placeholder, name, type, href
    ['placeholder', 'name', 'type', 'href', 'src', 'alt'].forEach(attr => {
        if (element.hasAttribute(attr)) {
            descriptor.attributes[attr] = element.getAttribute(attr);
        }
    });

    return descriptor;
}

// 1. Initialize rrweb for full session replay (if needed)
let events = [];
rrweb.record({
  emit(event) {
    // push event into the events array
    events.push(event);
  },
});

// 2. Add a global click listener to capture "Semantic" events
document.addEventListener('click', (event) => {
    const target = event.target;
    
    // We might want to find the closest interactive element if the user clicked a span inside a button
    const interactiveElement = target.closest('button, a, input, select, [role="button"]');
    const elementToLog = interactiveElement || target;

    const actionData = {
        type: 'click',
        timestamp: new Date().toISOString(),
        element: getElementDescriptor(elementToLog),
        // Context: maybe the section they are in?
        context: {
            url: window.location.href,
            path: getDomPath(elementToLog)
        }
    };

    userActions.push(actionData);
    updateLogDisplay();
}, true); // Use capture phase to ensure we catch it

// Simple DOM path generator
function getDomPath(el) {
  if (!el) return '';
  var stack = [];
  while ( el.parentNode != null ) {
    var sibCount = 0;
    var sibIndex = 0;
    for ( var i = 0; i < el.parentNode.childNodes.length; i++ ) {
      var sib = el.parentNode.childNodes[i];
      if ( sib.nodeName == el.nodeName ) {
        if ( sib === el ) {
          sibIndex = sibCount;
        }
        sibCount++;
      }
    }
    if ( el.hasAttribute('id') && el.id != '' ) {
      stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
    } else if ( sibCount > 1 ) {
      stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
    } else {
      stack.unshift(el.nodeName.toLowerCase());
    }
    el = el.parentNode;
  }
  return stack.slice(1).join(' > '); // removing html element
}

function updateLogDisplay() {
    const logContainer = document.getElementById('logs-output');
    logContainer.textContent = JSON.stringify(userActions, null, 2);
}

// Example: Also capture input changes
document.addEventListener('change', (event) => {
    const target = event.target;
    const actionData = {
        type: 'input_change',
        timestamp: new Date().toISOString(),
        element: getElementDescriptor(target),
        value: target.value, // Be careful with PII here
        context: {
            path: getDomPath(target)
        }
    };
    userActions.push(actionData);
    updateLogDisplay();
}, true);
