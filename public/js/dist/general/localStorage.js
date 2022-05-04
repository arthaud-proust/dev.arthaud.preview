function getSketchHistory() {
    return JSON.parse(localStorage.getItem('sketchs')||'[]');
}

function appendToSketchCode(sketchCode) {
    const sketchsHistory = getSketchHistory();
    if(!sketchsHistory.includes(sketchCode)) {
        localStorage.setItem('sketchs', JSON.stringify([
            document.getElementById('gallery').dataset.sketchCode,
            ...sketchsHistory
        ]))
    }
}