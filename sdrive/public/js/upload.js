const uploadForm = document.getElementById('uploadForm');

uploadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const fileInput = document.getElementById('file');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    fetch('/api/upload', {
        method: 'POST',
        body: formData,
    }).then(res => res.json())
      .then(data => {
        if (data.status === 'error') {
            document.getElementById('uploadError').innerText = data.error;
        } else {
            document.getElementById('uploadSuccess').innerText = data.success;
        }
    });
});
