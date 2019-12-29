/**
 * SuperEdu FE Logik
 **/

'use strict';

const APIURL = 'https://apiserver010.herokuapp.com/';
// const APIURL = 'http://localhost:3000/';

let isLoggedIn = true;
let courseData = null;

function renderFrontendDisplay() {

	$('#fewrapper')
		.empty()
		.append(elementFENavbar)
		.append('<div class="container">' + elementFEJumbotron +'</div>')
		.append(elementFECourseArea)
		.append(elementFEFooter)
		.append(elementCourseDetailsModal);
		
		loadTeasers();
}

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

async function getCourses() {
    const rawcoursedata = await asyncAPI('get', null, 'courses');
    // const filteredCourses = data.filter(item => !item.isDeleted && item.id > 0);
}

async function loadTeasers() {
    const allCourses = await asyncAPI('get', null, 'courses');
	console.log('All Courses');
	console.log(allCourses);
	
	for (let i in allCourses) {
		$('#teaser').append(`
		  <div class="col-4 mt-4">
			<div class="card h-100">
			  <a href="#" data-courseid="${allCourses[i].id}" class="teaseropen" data-toggle="modal" data-target="#CourseDetailsModal"><img class="card-img-top" src="${allCourses[i].imageurl}" alt="${allCourses[i].name}"></a>
			  <div class="card-body">
				<a href="#" data-courseid="${allCourses[i].id}" class="teaseropen" data-toggle="modal" data-target="#CourseDetailsModal"><h4 class="card-title">${allCourses[i].name}</h4></a>
				<p class="card-text">${allCourses[i].shortDescription}</p>
			  </div>
			  <div class="card-footer">
				<a href="#" data-courseid="${allCourses[i].id}" class="btn btn-primary teaseropen" data-toggle="modal" data-target="#CourseDetailsModal">Kurstermine</a>
			  </div>
			</div>
		  </div>
		`)
	}
	
	$('.teaseropen').click(function() {
		let filterID = $(this).data('courseid')
		event.preventDefault();
		displayCourseDetails(filterID);
	});

}

async function displayCourseDetails(filterID) {
	const rawCoursesData = await asyncAPI('get', null, 'courses');
	const rawEventsData = await asyncAPI('get', null, 'events');
	const rawLocationsdata = await asyncAPI('get', null, 'locations');
	const rawPersonsdata = await asyncAPI('get', null, 'persons');

	let filteredCoursesData = rawCoursesData.filter(item => item.id === filterID);
	let filteredEventsData = rawEventsData.filter(item => item.courseID === filterID);

	$('#kurstitel')
		.empty()
		.append(`
			<h2>${filteredCoursesData[0].name}</h2>
			<p>${filteredCoursesData[0].shortDescription}</p>
			<hr>		
		`);
	
	$('#kurstabelle').empty()
	
	for (let i in filteredEventsData) {

		let filteredLocationsData = rawLocationsdata.filter(item => item.id === filteredEventsData[i].locationID);
		let filteredTrainersData = rawPersonsdata.filter(item => item.id === filteredEventsData[i].trainerID);
		
		$('#kurstabelle').append(`
			<tr>
				<td>${filteredEventsData[i].name}</td>
				<td>${filteredEventsData[i].startDate}</td>
				<td>${filteredEventsData[i].endDate}</td>
				<td>${filteredLocationsData[0].name}</td>
				<td>${filteredTrainersData[0].firstName} ${filteredTrainersData[0].lastName}</td>
				<td><a href="zeitplan.html?course=${filteredCoursesData[0].id}&event=${filteredEventsData[i].id}" class="btn btn-outline-secondary btn-sm stundenplan" target="_blank">Stundenplan</a></td>
				<td><a href="#" class="btn btn-success btn-sm bestellen" data-eventid="${filteredEventsData[i].id}">Buchen</a></td>
			</tr>
		`);

	}
	
	$('#kursdetails')
		.empty()
		.append(`
			<hr>
			<h3>Kursinhalte</h3>
			<p>${filteredCoursesData[0].longDescription}</p>
			<p><img src="${filteredCoursesData[0].imageurl}" class="img-thumbnail"></p>
			<h4>Zielsetzung</h4>
			<p>${filteredCoursesData[0].goal}</p>
			<h4>Zielgruppe</h4>
			<p>${filteredCoursesData[0].targetGroup}</p>
			<h4>Voraussetzungen</h4>
			<p>${filteredCoursesData[0].requirements}</p>
		
		`);
}