import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const BASE_URL = 'https://restcountries.com/v3.1/name/';

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('#country-list');

searchBox.addEventListener(
  'input',
  debounce(event => {
    const searchTerm = event.target.value.trim();

    if (searchTerm === '') {
      countryList.innerHTML = '';
      return;
    }

    fetchCountries(searchTerm)
      .then(countries => {
        if (countries.length < 1) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          return;
        }

        if (countries.length >= 2 && countries.length <= 10) {
          countryList.innerHTML = countries
            .map(
              country =>
                `<div>
                   <img src="${country.flags.svg}" alt="${country.name.official} flag" width="50" />
                   <span>${country.name.official}</span>
                 </div>`
            )
            .join('');
          return;
        }

        if (countries.length === 1) {
          const [country] = countries;
          countryList.innerHTML = `<div>
                                     <h2>${country.name.official}</h2>
                                     <p>Capital: ${country.capital}</p>
                                     <p>Population: ${country.population}</p>
                                     <img src="${country.flags.svg}"
                                     alt="${
                                       country.name.official
                                     } flag" width="200" />
                                     <h3>Languages:</h3>
                                     <ul>${country.languages
                                       .map(
                                         language => `<li>${language.name}</li>`
                                       )
                                       .join('')}</ul>
                                   </div>`;
          return;
        }

        Notiflix.Notify.failure('No matches found');
      })
      .catch(error => {
        Notiflix.Notify.failure(error.message);
      });
  }, DEBOUNCE_DELAY)
);

function fetchCountries(name) {
  return new Promise((resolve, reject) => {
    fetch(
      `${BASE_URL}/${name}?fields=name;capital;population;flags.svg;languages`
    )
      .then(response => {
        if (response.ok) {
          resolve(response.json());
        } else {
          reject('Error fetching countries');
        }
      })
      .catch(error => reject(error));
  });
}
