// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();
  
	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
  }
  
  // 5 TODO: maak updateSun functie
  let updateSun = (percentage) => {
	const percentagebot = percentage > 50 ? 100 - percentage : percentage * 2;
	document.querySelector('.js-sun').style.left = `${percentage}%`;
	document.querySelector('.js-sun').style.bottom = `${percentagebot}%`;
  };
  
  // 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
  let placeSunAndStartMoving = (totalMinutes, sunrise) => {
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	// Bepaal het aantal minuten dat de zon al op is
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
	console.log(totalMinutes);
	let gedaanMinuten = (Date.now() / 1000 - sunrise) / 60;
	console.log(gedaanMinuten);
	let resterendeMinuten = totalMinutes - gedaanMinuten;
	console.log(resterendeMinuten);
	//const MinNogZon = totalMinutes - resterendeMinuten;
	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	let percentage = (gedaanMinuten / totalMinutes) * 100;
	updateSun(percentage);
	if (resterendeMinuten < 0) {
	  document.querySelector('.js-sun').setAttribute('data-time', ``);
	  document.querySelector('.js-time-left').innerHTML = `0`;
	  document.querySelector('.js-html').classList.add('is-night');
	  document.querySelector('.js-sun').classList.remove('is-day');
	} else {
	  document.querySelector('.js-html').classList.remove('is-night');
	  document.querySelector('.js-sun').classList.add('is-day');
	  // Vergeet niet om het resterende aantal minuten in te vullen.
	  let resterendeUren = Math.round(resterendeMinuten / 60);
	  console.log(resterendeUren);
	  let restingMinutes = Math.round(resterendeMinuten % 60);
	  console.log(restingMinutes);
	  document.querySelector(
		'.js-time-left'
	  ).innerHTML = `${resterendeUren} uur en ${restingMinutes}`;
	  // Nu maken we een functie die de zon elke minuut zal updaten
	  // let voorlopigeTijd = Date.now() / 1000;
	  document
		.querySelector('.js-sun')
		.setAttribute(
		  'data-time',
		  `${_parseMillisecondsIntoReadableTime(Date.now() / 1000)}`
		);
	}
	// We voegen ook de 'is-loaded' class toe aan de body-tag.
  
	window.setInterval(function () {
	  placeSunAndStartMoving(totalMinutes, sunrise);
	}, 60000);
  
	// Bekijk of de zon niet nog onder of reeds onder is
	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
  };
  
  // 3 Met de data van de API kunnen we de app opvullen
  let showResult = (queryResponse) => {
	// We gaan eerst een paar onderdelen opvullen
	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	document.querySelector('.js-location').innerHTML =
	  queryResponse.name + ', ' + queryResponse.country;
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	console.log(queryResponse);
  
	document.querySelector('.js-sunrise').innerHTML =
	  _parseMillisecondsIntoReadableTime(queryResponse.sunrise);
	document.querySelector('.js-sunset').innerHTML =
	  _parseMillisecondsIntoReadableTime(queryResponse.sunset);
	console.log(
	  _parseMillisecondsIntoReadableTime(queryResponse.sunrise),
	  _parseMillisecondsIntoReadableTime(queryResponse.sunset),
	  _parseMillisecondsIntoReadableTime(Date.now() / 1000)
	);
	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
	const totalMinutes = (queryResponse.sunset - queryResponse.sunrise) / 60;
	placeSunAndStartMoving(totalMinutes, queryResponse.sunrise);
  };
  
  const getData = (endpoint) => {
	return fetch(endpoint)
	  .then((r) => r.json())
	  .catch((e) => console.error(e));
  };
  // 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
  let getAPI = async (lat, lon) => {
	// Eerst bouwen we onze url op
	const link = `http://api.openweathermap.org/data/2.5/forecast?lat=50.8027841&lon=3.2097454&appid=3e5dfa833a588d95f0eaf68df504a8ab&units=metric&lang=nl&cnt=1`;
	// Met de fetch API proberen we de data op te halen.
	const { city } = await getData(link);
	// Als dat gelukt is, gaan we naar onze showResult functie.
	console.log(city);
	showResult(city);
  };
  
  document.addEventListener('DOMContentLoaded', function () {
	// 1 We will query the API with longitude and latitude.
	getAPI(50.903042, 3.45537);
  });
  