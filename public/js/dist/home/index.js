const codeInput = document.getElementById('code')
codeInput.addEventListener('keyup', function() {
    codeInput.classList.toggle('notempty', codeInput.value!=="");
    // codeInput.value = codeInput.value.toUpperCase().replace(/[^ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789-]/gm, '')
})