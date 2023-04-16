const previewMultiple = (event) => {
	// select imgPreview div where imgs will be displayed:
	const imgPreview = document.querySelector("#img-preview");
	// clear previous images:
	imgPreview.innerHTML = "";
	for (i = 0; i < event.target.files.length; i++) {
		const urls = URL.createObjectURL(event.target.files[i]);
		const fileName = event.target.files[i].name;
		imgPreview.innerHTML += `<figure class="figure col-sm-6 col-lg-3 align-self-end">
<img class="img-thumbnail" src="${urls}"><figcaption class="figure-caption">${fileName}</figcaption></figure>
`;
	}
};

const imageUpload = document.getElementById("formFile");
imageUpload.addEventListener("change", previewMultiple);
