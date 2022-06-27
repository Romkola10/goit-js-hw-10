import './css/styles.css';
import fetchCountries from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const countryInformation = document.querySelector('.country-info');
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');

input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  clearResults();
  const inputValue = event.target.value;
  inputValue.trim();

  if (inputValue === '') {
    return;
  }

    fetchCountries(inputValue)
        .then(renderCountries)
        .catch(onFetchError)
}

    function renderCountries(countries) {
        console.log(countries);
        const countriesLength = countries.length;

       if (countriesLength > 10) {
    Notify.info('Too many matches found. Please enter a more specific name');
  } else if (countriesLength === 1) {
    const markup = countries
      .map(({ name, capital, population, flags, languages }) => {
        return `<div class="card-container"><h2 class="country"><img src="${
          flags.svg
        }" alt="country flags" width = 40px> ${name.official}</h2>
          <p class="capital"><span class="span">Capital:</span> ${capital} </p>
          <p class="population"><span class="span">Population:</span> ${population} </p>
         <p class="languages"><span class="span">Languages:</span> ${Object.values(languages)}</p></div>`;
     })
      .join('');
    countryInformation.innerHTML = markup;
  } else {
    const markupShortList = countries
      .map(({ name, flags }) => {
        return `<h2 class="country"><img src="${flags.svg}" alt="country flags" width = 40px> ${name.official}</h2>`;
      })
      .join('');

    countryList.innerHTML = markupShortList;
  }
    }

function onFetchError(error) {
     Notify.failure('Oops, there is no country with that name');
    }

function clearResults() {
  countryInformation.innerHTML = '';
  countryList.innerHTML = '';
}

