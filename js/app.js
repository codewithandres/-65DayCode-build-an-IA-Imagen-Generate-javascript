// Get references to the form and image gallery elements
const generateForm = document.querySelector('.generate-form');
const imagenGallery = document.querySelector('.imagen-gallery');

// Uncomment this line and replace with your actual OpenAI API key

// Flag to track whether an image is currently being generated
let isImageGenerated = false;

// Function to update the image gallery with the generated images
const UpdateImagenCard = isDataArray => {
    isDataArray.map((imgObject, index) => {
        // Get the image card element and its child elements
        const imgCard = imagenGallery.querySelectorAll('.img-card')[ index ];
        const imagElement = imgCard.querySelector('img');
        const donwloadBtn = imgCard.querySelector('.donwload-btn');

        // Convert the image data to a data URL and set it as the src of the img element
        const iaGenerate = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imagElement.src = iaGenerate;

        // Set the download link for the image when it has loaded
        imagElement.onload = () => {
            imgCard.classList.remove('loading');
            donwloadBtn.setAttribute('href', iaGenerate);
            donwloadBtn.setAttribute('download', `${new Date().getTime()}.jpg`);
        };
    });
};

// Async function to generate images using the OpenAI API
const generateImage = async (prompt, quantity) => {
    try {
        // Make a POST request to the OpenAI API with the specified prompt and quantity
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${OPENAI_API_KEY}` // Replace with your actual API key
            },
            body: JSON.stringify({
                prompt: prompt,
                n: parseInt(quantity),
                size: '512x512',
                response_format: 'b64_json'
            })
        });

        // Check if the response is successful, otherwise throw an error
        if (!response.ok) throw new Error('That image could not be generated');

        // Get the generated image data from the response
        const { data } = await response.json();

        // Update the image gallery with the generated images
        UpdateImagenCard(...data);
    } catch (error) {
        // Display an alert if an error occurs during image generation
        alert(error.message);
    } finally {
        // Reset the isImageGenerated flag
        isImageGenerated = false;
    };
};

// Event handler for form submission
const handleFromSubmitssion = event => {
    event.preventDefault();

    // Check if an image is already being generated, and return if so
    if (isImageGenerated) return;
    isImageGenerated = true;

    // Get the user input prompt and quantity from the form
    const userPromt = event.target[ 0 ].value;
    const userQuantity = event.target[ 1 ].value;

    // Create HTML markup for image cards in the loading state
    const imgMarkup = Array.from({ length: userQuantity }, () =>
        `
        <div class="img-card loading">
            <img src="img/Double Ring@1x-1.2s-200px-200px.svg" alt="">
            <a href="#" class="donwload-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path
                        d="M21 3H3C2.44772 3 2 3.44772 2 4V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V4C22 3.44772 21.5523 3 21 3ZM12 16C10.3431 16 9 14.6569 9 13H4V5H20V13H15C15 14.6569 13.6569 16 12 16ZM16 9H13V6H11V9H8L12 13.5L16 9Z">
                    </path>
                </svg>
            </a>
        </div>
        `
    ).join('');

    // Set the image gallery HTML with the loading state markup
    imagenGallery.innerHTML = imgMarkup;

    // Generate images based on the user input
    generateImage(userPromt, userQuantity);
};

// Add event listener to the form for submission
generateForm.addEventListener('submit', handleFromSubmitssion);
