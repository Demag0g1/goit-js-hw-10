import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

searchBox.addEventListener(
  'input',
  debounce(event => {
    const searchTerm = event.target.value.trim();
    cleanHtml();

    if (searchTerm !== '') {
      fetchCountries(searchTerm).then(data => {
        if (data.length > 10) {
          Notiflix.Notify.info(
            'To many matches found. Please enter a more specific name'
          );
        } else if (data.length === 0) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        } else if (data.length >= 2 && data.length <= 10) {
          renderCountryList(data);
        } else if (data.length === 1) {
          renderOneCountry(data);
        }
      });
    }
  }, DEBOUNCE_DELAY)
);
function renderCountryList(countries) {
  let markup = countries
    .map(country => {
      return `<li>
         <img src="${country.flags.svg}" alt="${country.name.official} flag" width="50" hight="30"/>
         <p>${country.name.official}</p>
       </li>`;
    })
    .join('');

  countryList.innerHTML = markup;
}

function renderOneCountry(countries) {
  const markupOne = countries
    .map(country => {
      return `<li>
<img src="${country.flags.svg}"
      alt="${country.name.official} flag" width="50">
      <h2>${country.name.official}</h2>
      <p><b>Capital: </b>${country.capital}</p>
      <p><b>Population: </b>${country.population}</p>
      <p><b>Languages: </b>${Object.values(country.languages)}</p>
         </li>`;
    })
    .join('');

  countryList.innerHTML = markupOne;
}

function cleanHtml() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}
