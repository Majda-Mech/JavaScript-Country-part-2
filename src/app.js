import axios from 'axios';

const countryInformation = document.getElementById('countryInformation');

const searchBar = document.createElement("div");
searchBar.setAttribute('style', 'border: 1px solid black;')
searchBar.innerHTML = `
                <input type="text" id="searchText"/>
                <button id='submitSearch' style="background-color: green">Submit</button>
             `;

const preventDefault = (e) => {
    e.preventDefault();
}
countryInformation.addEventListener('click', preventDefault)

countryInformation.appendChild(searchBar);

const submitSearch = document.getElementById('submitSearch');
const searchText = document.getElementById('searchText');

async function getCountries() {
    try {
        const result = await axios.get('https://restcountries.com/v2/all');
        const allData = result.data;
        let indexNumber;
        const search = (e) => {
            const names = allData.map((item) => {
                return item.name
            })
            if (names.includes(e.target.value)) {
                for (let i = 0; i < names.length; i++) {
                    if (names[i] === e.target.value) {
                        indexNumber = i;
                    }
                }
            } else {
                indexNumber = false;
            }
        }

        const flagAndTitle = document.createElement('div');
        flagAndTitle.setAttribute('style', 'display: flex; align-items: center;' +
            'justify-content: center;');

        const countryDescription = document.createElement('div');
        const printCountry = () => {

            if (indexNumber === 0 || indexNumber > 0 && indexNumber < allData.length) {

                const languages = allData[indexNumber].languages.map((item) => {
                    return item.name
                })
                for (let i = 1; i < languages.length; i++) {
                    if (i < languages.length - 1) {
                        languages[0] = languages[0] + ', ' + languages[i];
                    }
                    else if (i === languages.length - 1) {
                        languages[0] = languages[0] + ' and ' + languages[i];
                    }
                }

                const currencies = allData[indexNumber].currencies.map((item) => {
                    return item.name
                })

                for (let i = 1; i < currencies.length; i++) {
                    currencies[0] = currencies[0] + ' and ' + currencies[i];
                }

                flagAndTitle.innerHTML = `
                <img width="60" height="40" src="${allData[indexNumber].flag}"> <h1>${allData[indexNumber].name}</h1>
                `

                countryDescription.innerHTML = `<p>${allData[indexNumber].name} is located in ${allData[indexNumber].subregion} people.
            It has a population of ${allData[indexNumber].population}</p>
                <p>The capital is ${allData[indexNumber].capital} and you can pay with: ${currencies[0]}</p>
                <p>They speak the language(s): ${languages[0]}</p>
                `
                countryInformation.appendChild(flagAndTitle)
                countryInformation.appendChild(countryDescription)
                countryInformation.removeAttribute('style');
            }

            else if (indexNumber === false) {
                flagAndTitle.innerHTML = `
        <h2 id="ERROR"> This is not a country please fill in a valid value!</h2>
        `
                countryDescription.innerHTML = `
        <p> Fill in a country that exists or capitalize the first letter so we can provide you with information!</p>
        `
                countryInformation.setAttribute('style', 'background-color: red;')
                countryInformation.appendChild(flagAndTitle)
                countryInformation.appendChild(countryDescription)
            }
        }

        const dropMenu = document.getElementById('dropMenu');
        const dropdown = document.createElement('select');
        dropMenu.appendChild(dropdown);
        const options = [];
        const dropdownMenu = allData.map((item) => {
            return item.name
        })
        dropdownMenu.unshift('Choose country!')
        const dropDownFunction = (e) => {
            for (let i = 0; i < dropdownMenu.length; i++) {
                options[i] = document.createElement('option');
                options[i].textContent = dropdownMenu[i];
                dropdown.appendChild(options[i]);
            }
        }
        dropDownFunction()

        const dropDownSearchFunction = (e) => {
            searchText.value = e.target.options[e.target.selectedIndex].value
            for(let i = 0; i < allData.length; i++) {
                if (allData[i].name === searchText.value)
                    indexNumber = i
            }
        }
        dropMenu.addEventListener('click', dropDownSearchFunction);

        searchText.addEventListener("keyup", search);
        submitSearch.addEventListener('click', printCountry);

        searchText.addEventListener('keyup', function(e) {
            if (e.keyCode === 13) {
                return printCountry();
            }
        });
    }

    catch (e) {
        console.error(e);
    }
}
getCountries()
