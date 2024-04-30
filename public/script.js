const unitbutton = document.getElementById('unit-button')
const unitInput = document.getElementById('unitInput')
const wind = document.getElementById('wind')
const searchbar = document.getElementById('input')
const currentUnit = localStorage.getItem('weatherUnit') || 'metric';
const feels = document.getElementById("feels-like")

document.getElementById('input').addEventListener('input', async function () {
    if (this.value[this.value.length -1] === ',' && this.value[this.value.length -2] != ',') {
        const searchText = this.value;
        if (searchText.length > 2) {
            try {
                const config = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ data: this.value }),
                }
                const response = await fetch('/suggestions', config)
                const responseBody = await response.json()
                const suggestions = responseBody.results
                displaySuggestions(suggestions)

            } catch (error) {
                console.error('Error:', error.message);
            }
        }
    }else{
        const parent = document.getElementById("suggestions")
        while(parent.firstChild){
            parent.removeChild(parent.firstChild)
        }
    }
})

const displaySuggestions = (suggestions) => {
    const parent = document.getElementById("suggestions")
    suggestions.forEach(element => {
        const child = document.createElement('button');
        child.textContent = element;
        child.className = 'search-bar-child';
        child.type = "submit";
        child.addEventListener("click", function (){
            console.log("CLICK", this.textContent)
            searchbar.value = child.textContent
            console.log("INPUT", searchbar.value)
        })
        parent.appendChild(child);

    });
}

unitbutton.textContent = currentUnit === 'metric' ? 'C°' : 'F°';
unitInput.value = currentUnit === 'metric' ? 'metric' : 'imperial';
feels.textContent += currentUnit === 'metric' ? 'C°' : 'F°';
wind.textContent = currentUnit === 'metric' ?
    wind.textContent + "m/s" :
    wind.textContent + "mph";

unitbutton.addEventListener('click', function () {
    const newUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
    localStorage.setItem('weatherUnit', newUnit);
    console.log(feels.textContent)
    unitInput.value = newUnit === 'metric' ? 'metric' : 'imperial';
    console.log(unitInput.value)
});