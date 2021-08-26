
const codeInput = document.getElementById('code')
codeInput.addEventListener('keyup', function() {
    codeInput.value = codeInput.value.toUpperCase().replace(/[^ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789-]/gm, '')
})