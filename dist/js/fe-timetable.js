'use strict';

moment.locale('de-at');

const APIURL = 'https://apiserver010.herokuapp.com/';
const searchParams = new URLSearchParams(window.location.search)

const courseID = searchParams.get('course')
const eventID = searchParams.get('event')

async function asyncAPI(method, data, table, id) {
	const newID = (!id) ? '' : id;
	const url = `${APIURL}${table}/${newID}`;

	const response = await axios({
		method, 
		url,
		data,
		timeout: 10000
	})

	return response.data;
}

displayTimetable(courseID, eventID);

async function displayTimetable(courseID, eventID) {
	const rawCourseData = await asyncAPI('get', null, 'courses');
	const rawEventsData = await asyncAPI('get', null, 'events');
	const rawLocationsData = await asyncAPI('get', null, 'locations');
	const rawPersonsData = await asyncAPI('get', null, 'persons');
	const rawTimetableData = await asyncAPI('get', null, 'timetables');

	let filteredTimetable = rawTimetableData.filter(item => item.eventID == eventID);
	let filteredCoursesData = rawCourseData.filter(item => item.id == courseID);
	let filteredEventsData = rawEventsData.filter(item => item.courseID == courseID);
	let filteredLocations = rawLocationsData.filter(item => item.id == filteredEventsData[0].locationID);

	$('#fewrapper')
		.empty()
		.append(`
			<h2>${filteredCoursesData[0].name}</h2>
			<p>${filteredCoursesData[0].shortDescription}</p>
			<h4>Veranstaltungsort</h4>
			<p><strong>${filteredLocations[0].name}</strong> - <em>${filteredLocations[0].shortDescription}</em><br/>
			${filteredLocations[0].street}, ${filteredLocations[0].zipCode} ${filteredLocations[0].city}.</p>
		`);

	$('#zeitplantabelle').empty();
	
	for (let i in filteredTimetable) {
		let filteredTrainer = rawPersonsData.filter(item => item.id == filteredTimetable[i].trainerID);
		let timetableDateMoment = moment(filteredTimetable[i].date).format('LL');
		$('#zeitplantabelle').append(`<tr><td>${filteredEventsData[0].name}</td><td>${timetableDateMoment}</td><td>${filteredTimetable[i].from}</td><td>${filteredTimetable[0].to}</td><td>${filteredTrainer[0].firstName} ${filteredTrainer[0].lastName}</td><td>${filteredTimetable[0].room}</td></tr>`);
	}

}