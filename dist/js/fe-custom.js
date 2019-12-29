/**
 * SuperEdu FE Logik
 **/

'use strict';

const APIURL = 'https://apiserver010.herokuapp.com/';
// const APIURL = 'http://localhost:3000/';

let currentPage = 'courses';
let isLoggedIn = true;
let courseData = null;

function renderFrontendDisplay() {

    if (currentPage === 'courses') {
        $('#fewrapper')
            .empty()
            .append(elementFENavbar)
 			.append('<div class="container">' + elementFEJumbotron +'</div>')
            .append(elementFECourseArea)
            .append(elementFEFooter)
		} else if (currentPage === 'coursedetails') {
        $('#fewrapper')
		    .empty()
            .append(elementFENavbar)
            .append('<div class="container">' + '<div class="row">' + elementFEDetailsSideNav + elementFEDetailsContent + '</div>' + '</div>')
            .append(elementFEFooter)
		}
		
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
	console.log('Raw Course Data' + rawcoursedata);	
	console.log('Raw Course Data' + rawcoursedata);	
}

async function loadTeasers() {
    const allCourses = await asyncAPI('get', null, 'courses');
	console.log('All Courses');
	console.log(allCourses);
	
	for (let i in allCourses) {
		$('#teaser').append(`
		  <div class="col-4 mt-4">
			<div class="card h-100">
			  <a href="#" data-courseid="${allCourses[i].id}"><img class="card-img-top" src="${allCourses[i].imageurl}" alt="${allCourses[i].name}"></a>
			  <div class="card-body">
				<a href="#" data-courseid="${allCourses[i].id}"><h4 class="card-title">${allCourses[i].name}</h4></a>
				<p class="card-text">${allCourses[i].shortDescription}</p>
			  </div>
			  <div class="card-footer">
				<a href="#" data-courseid="${allCourses[i].id}" class="btn btn-primary">Kurstermine</a>
			  </div>
			</div>
		  </div>
		`)
	
	}

}