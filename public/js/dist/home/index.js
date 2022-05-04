
const codeInput = document.getElementById('code')
codeInput.addEventListener('keyup', function() {
    codeInput.classList.toggle('notempty', codeInput.value!=="");
    // codeInput.value = codeInput.value.toUpperCase().replace(/[^ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789-]/gm, '')
})

const sketchsHistory = getSketchHistory();
if(sketchsHistory.length>0) {
    document.getElementById('historySection').classList.remove('hidden');
    sketchsHistory.forEach(sketchCode => {
        axios.get(`/exists/${sketchCode}`).then(r=>{
            if(r.data.exists) {
                const el = document.createElement('div');
                el.appendChild(document.createTextNode(sketchCode));
                el.classList.innerText = sketchCode;
                el.classList.add("text-xl", "cursor-pointer", "bg-gray-900", "rounded-lg", "px-5", "py-3", "text-white", "m-1");
                el.addEventListener('click', function() {
                    document.location = `/${sketchCode}`;
                })
                document.getElementById('history').append(el);
            }
        })
    });
}
